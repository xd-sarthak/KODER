// This file solves a tricky problem: in a terminal UI, only ONE thing should handle keyboard input at a time
// For example, when a dialog is open, it should capture Escape — not the input bar behind it
// Architecture: we use a "focus stack" — new UI layers (command menu, dialog) push onto the stack,
// and only the top layer gets to respond to keyboard events. When it closes, the layer below takes over.
// This is also where we handle Ctrl+C — it walks the stack top-down, giving each layer a chance
// to handle the exit (e.g. clear text first), and only quits the app if nobody handles it

import React, { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useRef
} from "react";
import { useKeyboard, useRenderer } from "@opentui/react";

type Responder = () => boolean;

type KeyboardLayerContextValue = {
  push: (id: string, responder?: Responder) => void;
  pop: (id: string) => void;
  isTopLayer: (id: string) => boolean;
  setResponder: (id: string, responder: Responder | null) => void;
};

const KeyboardLayerContext = createContext<KeyboardLayerContextValue | null>(null);

// The provider — wraps the entire app and manages the keyboard focus stack
// Starts with a "base" layer (the input bar) and lets other components push on top
export function KeyboardLayerProvider({ children }: { children: React.ReactNode }) {
    const [stack, setStack] = useState<string[]>(["base"]);
    const stackRef = useRef(stack);
    stackRef.current = stack;

    const responders = useRef<Map<string, Responder>>(new Map());
    const renderer = useRenderer();

    // Push a new layer onto the stack (e.g. "command" when command menu opens)
    // Optionally register a responder function that handles Ctrl+C for this layer
    const push = useCallback((id: string, responder?: Responder) => {
        if (responder) {
            responders.current.set(id, responder);
        }

        setStack((prev) => {
            if (prev.includes(id)) {
                return prev;
            }

            return [...prev, id];
        });
    }, []);

    // Remove a layer when its component closes (e.g. command menu dismissed)
    const pop = useCallback((id: string) => {
        responders.current.delete(id);
        setStack((prev) => prev.filter((layer) => layer !== id));
    }, []);

    // Check if a layer is currently on top — only the top layer should respond to keys
    const isTopLayer = useCallback(
        (id: string) => {
            return stack.length === 0 || stack[stack.length - 1] === id;
        },
        [stack],
    );

    // Register or clear a Ctrl+C handler for a specific layer
    // The input bar uses this to clear text on first Ctrl+C instead of quitting
    const setResponder = useCallback((
        id: string,
        responder: Responder | null
    ) => {
        if (responder) {
            responders.current.set(id, responder);
        } else {
            responders.current.delete(id);
        }
    }, []);


    // Global Ctrl+C handler — walks the stack from top to bottom
    // Each layer's responder gets a chance to handle it (return true = handled)
    // If nobody handles it, we kill the app
    useKeyboard((key) => {
        if (!key.ctrl || key.name !== "c") return;

        const currentStack = stackRef.current;
        for (let i = currentStack.length - 1; i >= 0; i--) {
            const layerId = currentStack[i]!;
            const responder = responders.current.get(layerId);
            if (responder && responder()) {
                return;
            }
        };

        // No responder handled it — exit
        renderer.destroy();
    });

    return (
        <KeyboardLayerContext.Provider
            value={{ push, pop, isTopLayer, setResponder }}
        >
            {children}
        </KeyboardLayerContext.Provider>
    );

};

// Hook to access the keyboard layer stack from any component
// Gives you push, pop, isTopLayer, and setResponder
export function useKeyboardLayer() {
  const context = useContext(KeyboardLayerContext);
  if (!context) {
    throw new Error("useKeyboardLayer must be used within a KeyboardLayerProvider");
  }
  return context;
}
