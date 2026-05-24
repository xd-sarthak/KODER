// This is the entry point of the whole app — the very first file that runs
// It boots up a terminal UI (like a React app, but instead of a browser it renders inside your terminal)
// Under the hood: App() → Virtual React Tree → Reconciler → OpenTUI Renderer → ANSI codes → your terminal screen

import { createCliRenderer } from "@opentui/core"; // the engine for terminal rendering
import { createRoot } from "@opentui/react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";
import { ToastProvider } from "./providers/toast";
import { KeyboardLayerProvider } from "./providers/keyboard-layer";
import { DialogProvider } from "./providers/dialogs";

// This is the root component — everything else lives inside it
// Architecture: we wrap the app in providers (keyboard, dialog, toast) so any child component
// can trigger notifications, dialogs, or handle keyboard focus without prop drilling
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

// Create the renderer at 60fps and mount the app — this is like ReactDOM.render() but for terminals
// exitOnCtrlC is false because we handle Ctrl+C ourselves in the keyboard layer provider

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