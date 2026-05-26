// This file is the welcoming home screen of Koder!
// It displays the beautiful ASCII retro header and provides the prompt input box where
// users start their journey.

import { useCallback } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/header";
import { InputBar } from "../components/input-bar";

// This component renders the main dashboard/home screen view.
// It centers the ASCII title logo and provides the chat input bar to kick off a session.
export function Home() {
  const navigate = useNavigate();

  // This runs when you submit a prompt from the home screen.
  // It redirects you to the new session page and passes your prompt along in the state.
  const handleSubmit = useCallback(
    (text: string) => {
      navigate("/sessions/new", { state: { message: text } });
    },
    [navigate],
  );

  return (
    <box
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={2}
      position="relative"
      width="100%"
      height="100%"
    >
      <Header />
      <box width="100%" maxWidth={78} paddingX={2}>
        <InputBar onSubmit={handleSubmit} />
      </box>
    </box>
  );
};