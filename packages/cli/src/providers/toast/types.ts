/**
 * Toast Type Definitions 🍞
 * This file defines the shapes of data (contracts) that our notification system uses.
 * It ensures we always supply a valid message, duration, and styling variant to our toast popups.
 */

/**
 * ToastVariant defines the three style modes for our notifications:
 * - "success" (typically green, for positive updates)
 * - "error" (typically red, for problems)
 * - "info" (typically blue, for neutral help messages)
 */
export type ToastVariant = "success" | "error" | "info";

/**
 * ToastOptions is the structural contract describing a notification pop-up.
 * It contains the message text, optional styling variant, and custom screen duration.
 */
export type ToastOptions = {
    message: string;
    variant?: ToastVariant;
    duration?: number; // Duration in milliseconds
};

/**
 * DEFAULT_TOAST_DURATION sets the default alert lifespan to 3000 milliseconds (3 seconds)
 * if no custom duration is specified.
 */
export const DEFAULT_TOAST_DURATION = 3000; // Default duration of 3 seconds