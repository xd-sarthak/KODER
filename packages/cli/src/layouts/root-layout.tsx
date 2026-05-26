// This file is the foundation of our entire application!
// It sets up all the essential provider contexts (like theme, keyboard layers,
// dialogs, and toast popups) so they are available to every single component.
// Architecture decision: nested providers are ordered so keyboard and dialog layers can correctly interact.

import { Outlet } from "react-router";
import { ToastProvider } from "../providers/toast";
import { DialogProvider } from "../providers/dialogs";
import { KeyboardLayerProvider } from "../providers/keyboard-layer";
import { ThemeProvider } from "../providers/theme";
import { ThemedRoot } from "./themed-root";

// This is the root layout component. It wraps the entire app in our custom context providers
// and renders whichever screen is currently active via React Router's <Outlet />.
export function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <KeyboardLayerProvider>
          <DialogProvider>
            <ThemedRoot>
              <Outlet />
            </ThemedRoot>
          </DialogProvider>
        </KeyboardLayerProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};