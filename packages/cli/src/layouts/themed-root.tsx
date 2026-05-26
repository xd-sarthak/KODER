// This file is the background canvas of our terminal screen!
// It reads the active theme and paints the whole screen's background color so everything looks cohesive.

import { useTheme } from "../providers/theme";
import { Header } from "../components/header";
import { InputBar } from "../components/input-bar";
import type { ReactNode } from "react";

type Props = {
    children : ReactNode
}

// This component wraps the active screen in a full-screen box.
// It sets the container background color to the active theme's background so the app colors match.
export function ThemedRoot({children} : Props) {
  const { colors } = useTheme();

  return (
    <box
        backgroundColor={colors.background}
        width="100%"
        height="100%"
        flexGrow={1}
    >
        {children}
    </box>
  )
}