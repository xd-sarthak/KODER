// This file is the little info bar that sits below the text input
// It shows metadata like which AI model you're currently using
// Right now it's hardcoded to "opus-4.6" but will eventually be dynamic

import { TextAttributes } from "@opentui/core";
import { useTheme } from "../providers/theme";

// Renders a horizontal row: "Build › opus-4.6"
// The dimmed "›" separator is just a visual divider between the label and value
export function StatusBar() {
    const {colors} = useTheme();
    
    return (
        <box flexDirection="row" gap={1}>
            <text fg={colors.primary}>Build</text>
            <text attributes={TextAttributes.DIM} fg={colors.dimSeparator}>›</text>
            <text>opus-4.6</text>
        </box>
    )
}