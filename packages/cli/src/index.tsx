// This is the entry point of the whole app — the very first file that runs
// It boots up a terminal UI (like a React app, but instead of a browser it renders inside your terminal)
// Under the hood: App() → Virtual React Tree → Reconciler → OpenTUI Renderer → ANSI codes → your terminal screen

import { createCliRenderer } from "@opentui/core"; // the engine for terminal rendering
import { createRoot } from "@opentui/react";
import {createMemoryRouter, RouterProvider} from "react-router";
import { RootLayout } from "./layouts/root-layout";
import { Home } from "./screens/home";
import { NewSession } from "./screens/new-session";
import { Session } from "./screens/session";

const router = createMemoryRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {index: true,element: <Home/>},
      {path: "sessions/new",element: <NewSession/>},
      {path: "sessions/:id",element: <Session />}
    ]
  }
]);


// This is the root component — everything else lives inside it
// Architecture: we wrap the app in providers (keyboard, dialog, toast) so any child component
// can trigger notifications, dialogs, or handle keyboard focus without prop drilling
function App() {
  return <RouterProvider router={router} />
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