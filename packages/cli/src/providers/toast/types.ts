// This file defines the types for the toast notification system
// It's the contract for what you can pass to toast.show()

// Three flavors of toast: green for success, red for errors, blue for general info
export type ToastVariant = "success" | "error" | "info";

// The options you pass when showing a toast
// Only message is required — variant defaults to "info" and duration defaults to 3 seconds
export type ToastOptions = {
    message: string;
    variant?: ToastVariant;
    duration?: number; // Duration in milliseconds
};

// If you don't specify how long the toast should stay, it disappears after 3 seconds
export const DEFAULT_TOAST_DURATION = 3000;