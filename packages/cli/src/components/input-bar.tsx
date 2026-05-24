/**
 * InputBar Component 💬
 * This is the primary interactive area of the application where users type their questions
 * or command triggers (like "/"). It wires up the text editor block, coordinates key handlers,
 * and launches the auto-complete command menu.
 */

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

type Props = {
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

/**
 * TEXTAREA_KEY_BINDINGS defines the default shortcut rules for our input area.
 * Pressing Enter alone submits the text, while Shift+Enter inserts a new line.
 */
export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  { name: "return", action: "submit" },
  { name: "enter", action: "submit" },
  { name: "return", shift: true, action: "newline" },
  { name: "enter", shift: true, action: "newline" },
];

/**
 * InputBar handles typing, keyboard shortcut capture, and command menu display.
 * 
 * @param {Props} props - Component properties.
 * @param {function} props.onSubmit - Callback function triggered when a text query is submitted.
 * @param {boolean} [props.disabled=false] - If true, disables user typing and command activations.
 * @returns {JSX.Element} The styled input area component with command list and status bar.
 */
export function InputBar({ onSubmit, disabled = false }: Props) {
  const textareaRef = useRef<TextareaRenderable>(null);
  const onSubmitRef = useRef<() => void>(() => { });
  const renderer = useRenderer();
  const toast = useToast();
  const { isTopLayer, setResponder } = useKeyboardLayer();


  const {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  } = useCommandMenu();

  /**
   * Tracks text typing in real-time to decide if the user started writing a command (like "/").
   */
  const handleTextareaContentChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    handleContentChange(textarea.plainText);
  }, []);

  /**
   * Runs the action associated with a chosen command, or inserts the command's shortcut text.
   * 
   * @param {Command | undefined} command - The command selected from the menu.
   */
  const handleCommand = useCallback((command: Command | undefined) => {
    const textarea = textareaRef.current;
    if (!textarea || !command) return;

    textarea.setText("");

    if (command.action) {
      command.action({
        exit: () => renderer.destroy(),
        toast,
      });
    } else {
      textarea.insertText(command.value + " ");
    }
  }, [renderer, toast]);

  /**
   * Executes a command given its index in the filtered command list.
   * 
   * @param {number} index - Position of the command in the menu list.
   */
  const handleCommandExecute = useCallback(
    (index: number) => {
      const command = resolveCommand(index);
      handleCommand(command);
    },
    [resolveCommand, handleCommand],
  );


  // Wire up textarea submit handler once so it always reads the latest state.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.onSubmit = () => {
      onSubmitRef.current();
    };
  }, [])

  /**
   * Triggers the onSubmit callback with the typed text, then clears the input area.
   */
  const handleSubmit = useCallback(() => {
    if (disabled) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.plainText.trim();
    if (text.length === 0) return;

    onSubmit(text);
    textarea.setText("");
  }, [disabled, onSubmit]);


  onSubmitRef.current = () => {
    if (disabled) return;

    if (showCommandMenu) {
      const command = resolveCommand(selectedIndex);
      handleCommand(command);
      return;
    }

    handleSubmit();
  }


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
        borderColor="#A78BFA"
        width="100%"
      >
        <box
          position="relative"
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor="#1A1A24"
          width="100%"
          gap={1}
        >
          {showCommandMenu && (
            <box
              position="absolute"
              bottom="100%"
              left={0}
              width="100%"
              backgroundColor="#1A1A24"
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