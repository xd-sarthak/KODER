/**
 * Command Menu State Hook 🧭
 * This custom hook handles all the reactive states, key listening, and layout
 * adjustments for showing, filtering, and navigating through our slash-command autocompletions.
 */

import { useRef, useState, useMemo, type RefObject } from 'react';
import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { filterCommands } from "./filter-commands";
import type { Command } from "./types";
import { useKeyboardLayer } from "../../providers/keyboard-layer";

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

/**
 * useCommandMenu encapsulates text state, selection index state, and custom scrolling behaviors.
 * It registers key bindings via OpenTUI to let users navigate and trigger commands with Arrow keys.
 * 
 * @returns {UseCommandMenuReturn} React state variables and interaction handlers.
 */
export function useCommandMenu(): UseCommandMenuReturn {
    const [textValue, setTextValue] = useState(""); // the current text input value
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showCommandMenu, setShowCommandMenu] = useState(false);
    const scrollRef = useRef<ScrollBoxRenderable>(null);
    const { push, pop, isTopLayer } = useKeyboardLayer();

    // Extract everything after "/" to use as the search filter query.
    const commandQuery = showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

    // Recalculates the list of matching commands whenever the query string changes.
    const filteredCommands = useMemo(() => {
        return filterCommands(commandQuery);
    }, [commandQuery]);

    /**
     * Resets the highlighted selection, scrolls back to top, and determines if the command menu
     * needs to open or close based on whether the typed text starts with a "/".
     * 
     * @param {string} text - The current raw value of the input bar.
     */
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
            push("command", () => {
                setShowCommandMenu(false);
                pop("command");
                return true;
            })
        } else {
            setShowCommandMenu(false);
            pop("command");
        }
    };

    /**
     * Confirms the selected command, automatically closing the menu and stripping focus.
     * 
     * @param {number} index - Index of the command being resolved.
     * @returns {Command | undefined} The command metadata or undefined if out-of-bounds.
     */
    const resolveCommand = (index: number): Command | undefined => {
        const command = filteredCommands[index];
        if (command) {
            setShowCommandMenu(false);
            pop("command");
        }
        return command;
    };

    // arrow keys navigation
    useKeyboard((key) => {
        if (!showCommandMenu || !isTopLayer("command")) return;

        if (key.name === "escape") {
            key.preventDefault();
            setShowCommandMenu(false);
            pop("command");
        } else if (key.name === "up") {
            key.preventDefault();
            setSelectedIndex((i: number) => {
                const nextIndex = Math.max(i - 1, 0);
                //keep the highlighted item in view
                const sb = scrollRef.current;
                if (sb && nextIndex < sb.scrollTop) {
                    sb.scrollTo(nextIndex);
                }
                return nextIndex;
            });
        } else if (key.name === "down") {
            key.preventDefault();
            setSelectedIndex((i: number) => {
                if (filteredCommands.length === 0) return 0;
                const nextIndex = Math.min(i + 1, filteredCommands.length - 1);
                //keep the highlighted item in view
                const sb = scrollRef.current;
                if (sb) {
                    const viewportHeight = sb.viewport.height;
                    const visibleEnd = sb.scrollTop + viewportHeight - 1;
                    if (nextIndex > visibleEnd) {
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