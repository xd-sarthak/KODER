/**
 * Status Bar Widget 
 * A small widget placed right below the input text area.
 * It displays diagnostic/configuration metadata such as the active AI model version.
 */

import { TextAttributes } from "@opentui/core";

/**
 * StatusBar renders the horizontal tray showcasing Koder status/configuration details.
 * 
 * @returns {JSX.Element} The flex row box with metadata details.
 */
export function StatusBar() {
    return (
        <box flexDirection="row" gap={1}>
            <text fg="#A78BFA">Build</text>
            <text attributes={TextAttributes.DIM} fg="gray">›</text>
            <text>opus-4.6</text>
        </box>
    )
}