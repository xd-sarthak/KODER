// This is the brain of the command menu — a custom React hook that manages all the state
// It tracks: is the menu open? what did you type? which command is highlighted?
// It also handles arrow key navigation and scrolling through the command list

import { useRef, useState, useMemo, type RefObject } from 'react';
import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { filterCommands } from "./filter-commands";
import type { Command } from "./types";
import { useKeyboardLayer } from "../../providers/keyboard-layer";

// Quick React refresher:
// useState -> keeps a value across re-renders, changing it triggers a re-render
// useRef -> mutable value that does NOT trigger re-renders
// useMemo -> caches a computed value so we skip recalculating every render

// Return type — everything the InputBar needs from this hook
type UseCommandMenuReturn = {
    showCommandMenu: boolean;
    commandQuery: string;
    selectedIndex: number;
    scrollRef: RefObject<ScrollBoxRenderable | null>;
    handleContentChange: (text: string) => void;
    resolveCommand: (index: number) => Command | undefined;
    setSelectedIndex: (index: number) => void;
}

// The main hook — call from InputBar to get command menu state and handlers
export function useCommandMenu(): UseCommandMenuReturn {
    const [textValue, setTextValue] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showCommandMenu, setShowCommandMenu] = useState(false);
    const scrollRef = useRef<ScrollBoxRenderable>(null);
    const { push, pop, isTopLayer } = useKeyboardLayer();

    // Strip the "/" prefix to get just the search query
    const commandQuery = showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

    // Recalculate filtered commands only when the query changes
    const filteredCommands = useMemo(() => {
        return filterCommands(commandQuery);
    }, [commandQuery]);


    const close = () => {
        setShowCommandMenu(false);
        pop("command");
    }

    // Called every time input text changes
    // Resets selection, scrolls to top, and opens/closes menu based on "/" prefix
    const handleContentChange = (text: string) => {
        setTextValue(text);
        setSelectedIndex(0);

        const scrollBox = scrollRef.current;
        if (scrollBox) {
            scrollBox.scrollTo(0);
        }

        const prefix = text.startsWith("/") ? text.slice(1) : null;
        if (prefix !== null && !prefix.includes(" ")) {
            setShowCommandMenu(true);
            push("command", () => {
                close();
                return true;
            })
        } else {
            close();
        }
    };

    // Resolves a command by index, closes the menu, returns the command
    const resolveCommand = (index: number): Command | undefined => {
        const command = filteredCommands[index];
        if (command) {
            close();
        }
        return command;
    };

    // Arrow key navigation with scroll tracking
    useKeyboard((key) => {
        if (!showCommandMenu || !isTopLayer("command")) return;

        if (key.name === "escape") {
            key.preventDefault();
            close();
        } else if (key.name === "up") {
            key.preventDefault();
            setSelectedIndex((i: number) => {
                const nextIndex = Math.max(i - 1, 0);
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