import { useRef, useState, useMemo, type RefObject } from 'react';
import type { ScrollBoxRenderable} from "@opentui/core";
import {useKeyboard} from "@opentui/react";
import {filterCommands} from "./filter-commands";
import type { Command } from "./types";

// useState -> persistent reactive state
//          -> value survives renders
//          -> changing state triggers re-render

// useRef -> mutable container
//        -> should not trigger re-render when changed

// useMemo -> cached derived computations
// RefObject  -> type contract

// manages the state and logic for a command menu in a text editor.
type UseCommandMenuReturn = {
    showCommandMenu: boolean;
    commandQuery: string;
    selectedIndex: number;
    scrollRef: RefObject<ScrollBoxRenderable | null>;
    handleContentChange: (text: string) => void;
    resolveCommand: (index: number) => Command | undefined;
    setSelectedIndex: (index: number) => void;
}


export function useCommandMenu() : UseCommandMenuReturn {
  const [textValue, setTextValue] = useState(""); // the current text input value
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  const commandQuery = showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

  const filteredCommands = useMemo(() => {
    return filterCommands(commandQuery);
  }, [commandQuery]);

  const handleContentChange = (text: string) => {
    setTextValue(text);
    setSelectedIndex(0);

    // jump back to the top of the list when query changes
    const scrollBox = scrollRef.current;
    if (scrollBox) {
      scrollBox.scrollTo(0);
    }

    const prefix = text.startsWith("/") ? text.slice(1) : null;
    if (prefix !== null && !prefix.includes(" ")) {
      setShowCommandMenu(true);
    } else {
      setShowCommandMenu(false);
    }
  };

  // resolve the command based on the current selected index
    const resolveCommand = (index: number): Command | undefined => {
        const command = filteredCommands[index];
        if (command) {
            setShowCommandMenu(false);
        }
        return command;
    };

    // arrow keys navigation
    useKeyboard((key) => {
        if(!showCommandMenu) return;

        if(key.name === "escape"){
            key.preventDefault();
            setShowCommandMenu(false);
        } else if (key.name === "up") {
            key.preventDefault();
            setSelectedIndex((i: number) => {
                const nextIndex = Math.max(i - 1, 0);
                //keep the highlighted item in view
                const sb = scrollRef.current;
                if(sb && nextIndex < sb.scrollTop){
                    sb.scrollTo(nextIndex);
                }
                return nextIndex;
            });
        } else if (key.name === "down") {
            key.preventDefault();
            setSelectedIndex((i: number) => {
                if(filteredCommands.length === 0) return 0;
                const nextIndex = Math.min(i + 1, filteredCommands.length - 1);
                //keep the highlighted item in view
                const sb = scrollRef.current;
                if(sb){
                    const viewportHeight = sb.viewport.height;
                    const visibleEnd = sb.scrollTop + viewportHeight - 1;
                    if(nextIndex > visibleEnd){
                    sb.scrollTo(nextIndex - viewportHeight + 1);
                    }
                }
                return nextIndex;
            });
        }
    });

    return {
        showCommandMenu,
        commandQuery,
        selectedIndex,
        scrollRef,
        handleContentChange,
        resolveCommand,
        setSelectedIndex
    }
}