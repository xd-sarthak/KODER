/**
 * Keyboard Layer Provider ⌨️
 * In a Terminal UI, only one element should respond to keystrokes at a time.
 * This provider creates a "focus stack". When a new interactive component (like the command menu)
 * is opened, it's pushed to the top of the stack, capturing key events first!
 */

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

/**
 * KeyboardLayerProvider wraps the React tree to establish the focused layer stack
 * and sets up a global keyboard handler (e.g. for Ctrl+C exit handling).
 * 
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - Child components to render under this provider.
 * @returns {JSX.Element} The context provider rendering child components.
 */
export function KeyboardLayerProvider({ children }: { children: React.ReactNode }) {
    const [stack, setStack] = useState<string[]>(["base"]);
    const stackRef = useRef(stack);
    stackRef.current = stack;

    const responders = useRef<Map<string, Responder>>(new Map());
    const renderer = useRenderer();

    /**
     * Pushes a new active layer onto the focus stack.
     * If a custom responder callback is provided, it is registered for that layer.
     * 
     * @param {string} id - Unique identifier of the layer.
     * @param {Responder} [responder] - Optional function to call for intercepting keys.
     */
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

    /**
     * Removes a layer from the focus stack when that component is closed.
     * 
     * @param {string} id - Unique identifier of the layer to remove.
     */
    const pop = useCallback((id: string) => {
        responders.current.delete(id);
        setStack((prev) => prev.filter((layer) => layer !== id));
    }, []);

    /**
     * Checks if a layer is currently at the top of the focus stack, meaning it has keyboard priority.
     * 
     * @param {string} id - The layer identifier to check.
     * @returns {boolean} True if the layer is on top, otherwise false.
     */
    const isTopLayer = useCallback(
        (id: string) => {
            return stack.length === 0 || stack[stack.length - 1] === id;
        },
        [stack],
    );

    /**
     * Registers or clears the key intercept handler for a specific layer.
     * 
     * @param {string} id - The layer identifier.
     * @param {Responder | null} responder - The callback function to handle key actions, or null to clear.
     */
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


    // ctrl+c hadnler
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

/**
 * Custom hook providing easy access to the focus layer stack APIs.
 * 
 * @returns {KeyboardLayerContextValue} The stack management functions: push, pop, isTopLayer, and setResponder.
 */
export function useKeyboardLayer() {
  const context = useContext(KeyboardLayerContext);
  if (!context) {
    throw new Error("useKeyboardLayer must be used within a KeyboardLayerProvider");
  }
  return context;
}
