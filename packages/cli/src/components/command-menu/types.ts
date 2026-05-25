// This file defines the TypeScript types for the command menu system
// It's where we describe what a "command" looks like and what tools a command gets when it runs

import type { DialogContextValue } from "../../providers/dialogs";
import type { ToastContextValue } from "../../providers/toast";

// CommandContext is the bag of tools passed to every command's action function
// It gives commands the ability to show toasts, open dialogs, or quit the app
export type CommandContext = {
    exit: () => void;
    toast: ToastContextValue;
    dialog: DialogContextValue;
}

// Command is the shape of a single slash command
// name = what you type (like "exit"), description = what shows in the menu
// value = the text that gets inserted if there's no custom action
// action = optional function that runs when you pick this command
export type Command = {
    name: string;
    description: string;
    value: string;
    action?: (ctx: CommandContext) => void | Promise<void>;
}