import { createCliRenderer } from "@opentui/core"; // the engnine for terminal rendering
import { createRoot } from "@opentui/react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";

// box - a basic container component, can be used for layout and styling
// width and height can be set to "100%" to fill available space, or to a fixed number of columns/rows
function App() {
  return (
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