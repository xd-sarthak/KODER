// This file handles starting a new coding session!
// It takes the prompt passed from the home screen, initializes the UI shell,
// and shows a loading state with sample message layouts.

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { SessionShell } from "../components/session-shell";
import { ErrorMessage, UserMessage, BotMessage } from "../components/messages";

// This component displays the startup screen of a new chat session.
// It displays a shell layout containing the initial prompt and mock bot/error responses.
export function NewSession() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { message?: string } | null;

  useEffect(() => {
    if (!state?.message) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.message) return null;

  return (
    <SessionShell onSubmit={() => {}} inputDisabled loading>
      <UserMessage message={state.message} />
      <BotMessage 
        content="This is a sample bot response to demonstrate the message layout." 
        model="opus-4-6"
      />
      <ErrorMessage message="This is a sample error message." />
    </SessionShell>
  );
};