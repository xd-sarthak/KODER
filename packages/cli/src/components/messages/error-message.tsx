// This file displays error messages in the chat feed!
// If something goes wrong (like a lost connection or API failure), this component shows the error clearly.

import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";

type Props = {
  message: string;
};

// This component displays an error block in the chat.
// It accepts the error message text and renders it with a warning border.
export function ErrorMessage({ message }: Props) {
  const { colors } = useTheme();

  return (
    <box width="100%" alignItems="center">
      <box
        border={["left"]}
        borderColor={colors.error}
        width="100%"
      >
        <box
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor={colors.surface}
          width="100%"
        >
          <text attributes={TextAttributes.DIM}>{message}</text>
        </box>
      </box>
    </box>
  );
};