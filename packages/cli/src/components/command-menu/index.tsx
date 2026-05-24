// This file renders the dropdown menu that appears when you type "/" in the input bar
// It shows a filtered list of available commands (like /exit, /theme, /new) and
// highlights whichever one you've got selected so you can pick it with Enter or click

import type {RefObject} from "react";
import { TextAttributes, type ScrollBoxRenderable } from "@opentui/core";
import { filterCommands } from "./filter-commands";
import { COMMANDS } from "./commands";


// Only show 8 commands at a time — if there are more, you scroll through them
const MAX_VISIBLE_COMMANDS = 8;

// Figure out how wide the command name column should be
// We look at the longest command name and add some padding so everything lines up nicely
const COMMAND_COL_WIDTH = Math.max(...COMMANDS.map(cmd => cmd.name.length)) + 4;


type CommandMenuProps = {
    query: string;
    selectedIndex: number;
    scrollRef: RefObject<ScrollBoxRenderable | null>;
    onSelect: (index: number) => void;
    onExecute: (index: number) => void;
}

// Renders the actual command list popup
// Takes the search query to filter commands and highlights the selected one
// If nothing matches what you typed, shows "No commands found"
export function CommandMenu({ 
    query, 
    selectedIndex, 
    scrollRef, 
    onSelect, 
    onExecute }: CommandMenuProps) {
    const filteredCommands = filterCommands(query);
    const visibleHeight = Math.min(filteredCommands.length, MAX_VISIBLE_COMMANDS)

    if (filteredCommands.length === 0) {
        return (
            <box padding={1}>
                <text attributes={TextAttributes.DIM}>
                    No commands found
                </text>
            </box>
        )
    }

    return (
        <scrollbox>
            {filteredCommands.map((cmd,i) => {
                const isSelected = i === selectedIndex;

                return (
                    <box
                        key={cmd.name}
                        flexDirection="row"
                        paddingX={1}
                        height={1}
                        overflow="hidden"
                        backgroundColor={isSelected ? "#A78BFA " : undefined}
                        onMouseMove={() => onSelect(i)}
                        onMouseDown={() => onExecute(i)}
                    >
                        <box width={COMMAND_COL_WIDTH} flexShrink={0}>
                            <text selectable={false} fg={isSelected ? "black" : "white"}>
                                /{cmd.name}
                            </text>
                        </box>
                        <box flexGrow={1} flexShrink={1} overflow="hidden"> 
                            <text selectable={false} fg={isSelected ? "black" : "gray"}>
                                {cmd.description}
                            </text>
                        </box>
                    </box>
                )
            })}
        </scrollbox>
    )

}