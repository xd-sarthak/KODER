/**
 * Command Filtering Helper 🔍
 * A pure utility function to search through our command catalog.
 * It filters the command list depending on what the user types after the "/" symbol.
 */

import type { Command } from "./types";
import { COMMANDS } from "./commands";

/**
 * filterCommands takes a query string and returns commands starting with that query.
 * It is case-insensitive, so typing "/EXIT" or "/exit" matches the same exit command!
 * 
 * @param {string} query - The search text (excluding the leading slash).
 * @returns {Command[]} The matching commands array.
 */
export function filterCommands(query: string): Command[] {
    if (query.length === 0) {
        return COMMANDS;
    }

    return COMMANDS.filter(cmd => cmd.name.toLowerCase().startsWith(query.toLowerCase()));
}