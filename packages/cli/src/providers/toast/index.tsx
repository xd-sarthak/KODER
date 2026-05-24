// This file handles toast notifications — those little popup messages that appear briefly
// (like "Signed out" or "Loading sessions...") and then auto-dismiss after a few seconds
// Architecture: uses React Context so any component can show a toast by calling toast.show()
// The toast renders as an absolute-positioned box in the top-right corner of the terminal

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

// Hook to trigger toasts from anywhere — just call toast.show({ message: "..." })
// Throws if used outside of ToastProvider (safety net)
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

// The provider — tracks the current toast and manages its auto-dismiss timer
// Only one toast shows at a time — showing a new one replaces the old one
export function ToastProvider({children}: ToastProviderProps) {
    const [currentToast,setCurrentToast] = useState<ToastOptions | null>(null);
    const timeoutHandleRef = useRef<NodeJS.Timeout | null>(null);

    // Cancel any existing auto-dismiss timer so we don't accidentally close the wrong toast
    const clearCurrentTimeout = useCallback(() => {
        if(timeoutHandleRef.current) {
            clearTimeout(timeoutHandleRef.current);
            timeoutHandleRef.current = null;
        }
    },[]);

    // Show a new toast — sets defaults for variant and duration, then starts the dismiss timer
    // .unref() on the timeout means it won't keep the Node.js process alive if the app is shutting down
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

// The actual toast UI — a small box positioned in the top-right corner
// It reads terminal dimensions to size itself properly and picks a border color based on variant
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
