// This file filters the command list based on what you've typed after "/"
// It's a simple helper — if you type "/ex", it narrows down to commands starting with "ex" (like "exit")

import type { Command } from "./types";
import { COMMANDS } from "./commands";

// Takes whatever you typed after "/" and finds matching commands
// If you haven't typed anything yet, it returns all commands
// The matching is case-insensitive so "/EXIT" and "/exit" both work
export function filterCommands(query: string): Command[] {
    if (query.length === 0) {
        return COMMANDS;
    }

    return COMMANDS.filter(cmd => cmd.name.toLowerCase().startsWith(query.toLowerCase()));
}