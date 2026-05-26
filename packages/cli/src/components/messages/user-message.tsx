// This file renders messages sent by the user!
// It takes your text prompt and styles it nicely inside the scrollable chat feed.

import { useTheme } from "../../providers/theme";

type Props = {
  message: string;
};

// This component displays the user's message in the chat feed.
// It accepts the text message and draws a box with a colored left border.
export function UserMessage({ message }: Props) {
  const { colors } = useTheme();

  return (
    <box width="100%" alignItems="center">
      <box
        border={["left"]}
        borderColor={colors.primary}
        width="100%"
      >
        <box
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor={colors.surface}
          width="100%"
        >
          <text>{message}</text>
        </box>
      </box>
    </box>
  );
};