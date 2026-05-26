// This file handles browsing and displaying an ongoing coding session!
// It connects the active session metadata and chat logs to the session UI shell.

import { SessionShell } from "../components/session-shell";

// This component displays a completed or ongoing conversation session.
// It loads historical logs and puts them inside the scrollable chat shell.
export function Session() {
  return <SessionShell onSubmit={() => {}} inputDisabled loading />;
};