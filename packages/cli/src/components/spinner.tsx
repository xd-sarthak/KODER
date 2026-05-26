// This file is a simple visual loading indicator!
// It uses a spinning moon animation so the user knows the app is busy thinking or loading.

import "opentui-spinner/react";
import { useTheme } from "../providers/theme";

// This renders a spinning loader wheel on the screen.
// Under the hood, it styles a spinner from the opentui-spinner library using the theme's main color.
export function Spinner() {
  const { colors } = useTheme();

  return <spinner name="moon" color={colors.primary} />;
};