/**
 * Entry point
 * This file boots up our Terminal User Interface (TUI).
 * Instead of rendering to a web browser's DOM, it sets up OpenTUI
 * to draw our beautiful UI components directly inside the terminal window.
 */

import { createCliRenderer } from "@opentui/core"; // the engnine for terminal rendering
import { createRoot } from "@opentui/react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";
import { ToastProvider } from "./providers/toast";
import { KeyboardLayerProvider } from "./providers/keyboard-layer";
import { DialogProvider } from "./providers/dialogs";

// box - a basic container component, can be used for layout and styling
// width and height can be set to "100%" to fill available space, or to a fixed number of columns/rows

/**
 * App is the root React component for our terminal app.
 * It wraps everything in keyboard and notification (toast) providers,
 * and sets up a centered dark-themed box layout containing the Header and InputBar.
 * 
 * @returns {JSX.Element} The core UI tree for our terminal workspace.
 */
function App() {
  return (
    <KeyboardLayerProvider>
      <DialogProvider>
    <ToastProvider>
    <box
      alignItems="center"
      justifyContent="center"
      backgroundColor="#0D0D12"
      width="100%"
      height="100%"
      gap={2}
    >
      <Header/>
      <box width="100%" maxWidth={100} paddingX = {2}>
        <InputBar onSubmit={() => {}}/>
      </box>
    </box>
    </ToastProvider>
      </DialogProvider>
    </KeyboardLayerProvider>
  );

}

// event loop and renderer setup - this is where we create the renderer and mount our app

const renderer = await createCliRenderer({
  targetFps: 60,
  exitOnCtrlC: false,
});
createRoot(renderer).render(<App />);

/*

App()
↓
Virtual React Tree
↓
React Reconciler
↓
OpenTUI Renderer
↓
ANSI Terminal Commands
↓
Visible Terminal UI

*/