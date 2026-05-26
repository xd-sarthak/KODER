import { useTheme } from "../providers/theme";
import { Header } from "../components/header";
import { InputBar } from "../components/input-bar";
import type { ReactNode } from "react";

type Props = {
    children : ReactNode
}

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