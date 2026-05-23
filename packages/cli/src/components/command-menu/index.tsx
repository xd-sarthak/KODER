import type {RefObject} from "react";
import { TextAttributes, type ScrollBoxRenderable } from "@opentui/core";
import { filterCommands } from "./filter-commands";
import { COMMANDS } from "./commands";

const MAX_VISIBLE_COMMANDS = 8;

// gotta align all command names in a fixed width column
// start at same horizontal position, and pad with spaces to the right
// adjusts width to accommodate longest command name, up to a max width

const COMMAND_COL_WIDTH = Math.max(...COMMANDS.map(cmd => cmd.name.length)) + 4; // add some padding


type CommandMenuProps = {
    query: string;
    selectedIndex: number;
    scrollRef: RefObject<ScrollBoxRenderable | null>;
    onSelect: (index: number) => void;
    onExecute: (index: number) => void;
}

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