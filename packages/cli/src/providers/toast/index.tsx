/**
 * Toast Provider 🍞
 * This provider creates and displays temporary overlay alerts (toasts) in the CLI.
 * It exposes a context so any component down in the tree can pop up a notice
 * in the top right corner of the terminal window (e.g. "Signed out", "Loading...").
 */

import {
    createContext,
    useContext,
    useRef,
    useState,
    useCallback
} from "react";
import type {ReactNode} from "react";
import {useTerminalDimensions} from "@opentui/react"
import type {ToastOptions,ToastVariant} from "./types";
import {DEFAULT_TOAST_DURATION} from "./types";

export type ToastContextValue = {
    show: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Custom React hook to trigger new notifications from any sub-component.
 * 
 * @returns {ToastContextValue} Object containing the `show` method.
 */
export function useToast(): ToastContextValue {
    const value = useContext(ToastContext);
    if (!value) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return value;
}


type ToastProviderProps = {
    children: ReactNode;
};

/**
 * ToastProvider coordinates notifications state, resets timers automatically,
 * and renders both child components and the floating alert container.
 * 
 * @param {ToastProviderProps} props - Component properties.
 * @param {ReactNode} props.children - Child components to render.
 * @returns {JSX.Element} The ToastContext.Provider along with the Toast element.
 */
export function ToastProvider({children}: ToastProviderProps) {
    const [currentToast,setCurrentToast] = useState<ToastOptions | null>(null);
    const timeoutHandleRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Clears any active auto-dismiss timer to prevent closing the wrong alert.
     */
    const clearCurrentTimeout = useCallback(() => {
        if(timeoutHandleRef.current) {
            clearTimeout(timeoutHandleRef.current);
            timeoutHandleRef.current = null;
        }
    },[]);

    /**
     * Triggers a new notification toast, automatically choosing defaults for
     * variant styles and duration before resetting the auto-dismiss timer.
     * 
     * @param {ToastOptions} options - Toast message, variant ("success", "error", "info"), and duration.
     */
    const show = useCallback((options: ToastOptions) => {
        const duration = options.duration ?? DEFAULT_TOAST_DURATION;
        clearCurrentTimeout();
        setCurrentToast({
            variant: options.variant ?? "info",
            ...options,
            duration
        });

        timeoutHandleRef.current = setTimeout(() => {
            setCurrentToast(null);
        }, duration).unref();
    },[clearCurrentTimeout]);

    const value: ToastContextValue = {
        show
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast currentToast={currentToast} />
        </ToastContext.Provider>
    );
}

type ToastProps = {
    currentToast: ToastOptions | null;
};

/**
 * Toast is the actual UI widget rendered at the top-right of the terminal.
 * It measures the terminal dimensions dynamically and wraps word elements safely.
 * 
 * @param {ToastProps} props - Component properties.
 * @param {ToastOptions | null} props.currentToast - Currently active notification details or null.
 * @returns {JSX.Element | null} The box rendering the notification text, or null.
 */
function Toast({currentToast}: ToastProps) {
    const {width} = useTerminalDimensions();

    if(!currentToast) return null;

    const variantStyles: Record<ToastVariant, string> = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500"
    };

    const borderColor = currentToast.variant ? variantStyles[currentToast.variant] : variantStyles.info;
    
  return (
    <box
      position="absolute"
      justifyContent="center"
      alignItems="flex-start"
      top={2}
      right={2}
      width={Math.max(1, Math.min(60, width - 6))}
      paddingLeft={2}
      paddingRight={2}
      paddingTop={1}
      paddingBottom={1}
      backgroundColor="bgBlack"
      borderColor={borderColor}
      border={["left", "right"]}
    >
      <box flexDirection="column" gap={1} width="100%">
        <text fg="#E1E1E1" wrapMode="word" width="100%">
          {currentToast.message}
        </text>
      </box>
    </box>
  );
}
