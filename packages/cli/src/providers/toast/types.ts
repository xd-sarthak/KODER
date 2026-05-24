export type ToastVariant = "success" | "error" | "info";

// contract for toast data
export type ToastOptions = {
    message: string;
    variant?: ToastVariant;
    duration?: number; // Duration in milliseconds
};

export const DEFAULT_TOAST_DURATION = 3000; // Default duration of 3 seconds