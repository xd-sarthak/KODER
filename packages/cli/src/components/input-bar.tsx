// This is the main input area where you type your prompts or slash commands
// It handles text input, keyboard shortcuts, and opens the command menu when you type "/"
// Think of it as the "chat box" of the terminal agent

import { CommandMenu } from "./command-menu";
import { StatusBar } from "./status-bar";
import type { KeyBinding } from "@opentui/core";
import { useRef, useCallback, useEffect } from "react";
import type { TextareaRenderable } from "@opentui/core";
import type { Command } from "./command-menu/types";
import { useCommandMenu } from "./command-menu/use-command-menu";
import { useRenderer } from "@opentui/react";
import { useToast } from "../providers/toast";
import { useKeyboardLayer } from "../providers/keyboard-layer";
import { useDialog } from "../providers/dialogs";
import { useTheme } from "../providers/theme";

type Props = {
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

// Keyboard shortcut config: Enter submits your message, Shift+Enter makes a new line
// This is the same pattern you see in chat apps like Slack or Discord
export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  { name: "return", action: "submit" },
  { name: "enter", action: "submit" },
  { name: "return", shift: true, action: "newline" },
  { name: "enter", shift: true, action: "newline" },
];

// The actual input bar component — takes an onSubmit callback and optional disabled flag
export function InputBar({ onSubmit, disabled = false }: Props) {
  const textareaRef = useRef<TextareaRenderable>(null);
  const onSubmitRef = useRef<() => void>(() => { });
  const renderer = useRenderer();
  const toast = useToast();
  const dialog = useDialog();
  const { isTopLayer, setResponder } = useKeyboardLayer();
  const {colors} = useTheme();


  const {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  } = useCommandMenu();

  // Every time you type something, check if the text starts with "/"
  // If it does, the command menu will pop up to autocomplete your command
  const handleTextareaContentChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    handleContentChange(textarea.plainText);
  }, []);

  // When you pick a command from the menu, this runs its action (like opening a dialog)
  // If the command doesn't have a custom action, it just inserts the command text into the input
  const handleCommand = useCallback((command: Command | undefined) => {
    const textarea = textareaRef.current;
    if (!textarea || !command) return;

    textarea.setText("");

    if (command.action) {
      command.action({
        exit: () => renderer.destroy(),
        toast,
        dialog,
      });
    } else {
      textarea.insertText(command.value + " ");
    }
  }, [renderer, toast]);

  // Looks up a command by its index in the filtered list and runs it
  const handleCommandExecute = useCallback(
    (index: number) => {
      const command = resolveCommand(index);
      handleCommand(command);
    },
    [resolveCommand, handleCommand],
  );


  // Wire up the textarea's submit handler once on mount
  // We use a ref so it always calls the latest version of our submit logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.onSubmit = () => {
      onSubmitRef.current();
    };
  }, [])

  // Grabs the typed text, sends it to the parent via onSubmit, then clears the input
  const handleSubmit = useCallback(() => {
    if (disabled) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.plainText.trim();
    if (text.length === 0) return;

    onSubmit(text);
    textarea.setText("");
  }, [disabled, onSubmit]);


  // This decides what happens when you press Enter:
  // If the command menu is open → execute the selected command
  // Otherwise → submit the text as a normal message
  onSubmitRef.current = () => {
    if (disabled) return;

    if (showCommandMenu) {
      const command = resolveCommand(selectedIndex);
      handleCommand(command);
      return;
    }

    handleSubmit();
  }


  // Register this input bar as an escape responder on the "base" keyboard layer
  // When you press Ctrl+C and there's text in the box, it clears the text first
  // Only if the box is already empty does Ctrl+C actually quit the app
  useEffect(() => {
    setResponder("base", () => {
      if (disabled) return false;

      const textarea = textareaRef.current;
      if (textarea && textarea.plainText.length > 0) {
        textarea.setText("");
        return true;
      }

      return false;
    });

    return () => setResponder("base", null);
  }, [disabled, setResponder]);


  return (
    <box width="100%" alignItems="center">
      <box
        border={["left"]}
        borderColor={colors.primary}
        width="100%"
      >
        <box
          position="relative"
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor={colors.surface}
          width="100%"
          gap={1}
        >
          {showCommandMenu && (
            <box
              position="absolute"
              bottom="100%"
              left={0}
              width="100%"
              backgroundColor={colors.surface}
              zIndex={10}
            >
              <CommandMenu
                query={commandQuery}
                selectedIndex={selectedIndex}
                scrollRef={scrollRef}
                onSelect={setSelectedIndex}
                onExecute={handleCommandExecute}
              />
            </box>
          )}
          <textarea
            ref={textareaRef}
            focused={!disabled && (isTopLayer("base") || isTopLayer("command"))}
            keyBindings={TEXTAREA_KEY_BINDINGS}
            onContentChange={handleTextareaContentChange}
            placeholder={`Ask me anything`}
          />
          <StatusBar />
        </box>
      </box>
    </box>
  )
}