/**
 * Command Menu Types 📋
 * Type interfaces mapping the exact shape of autocomplete commands and the runtime execution context
 * passed to their handlers (like notifications or app termination).
 */

import type { DialogContextValue } from "../../providers/dialogs";
import type { ToastContextValue } from "../../providers/toast";

/**
 * CommandContext provides the system actions and providers to a running command.
 * It lets a command trigger popup toasts or shut down the application cleanly.
 */
export type CommandContext = {
    exit: () => void;
    toast: ToastContextValue;
    dialog: DialogContextValue;
}

/**
 * Command represents a single executable command inside Koder's command menu.
 * - name: the shortcut string (e.g. "exit")
 * - description: a short description of what it does
 * - value: the text inserted if chosen
 * - action: an optional custom callback that runs when the command is confirmed
 */
export type Command = {
    name: string;
    description: string;
    value: string;
    action?: (ctx: CommandContext) => void | Promise<void>;
}