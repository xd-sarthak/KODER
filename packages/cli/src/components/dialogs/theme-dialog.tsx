// This file is the color theme changer dialog!
// It lets users search through all our awesome color palettes, preview them live
// as they scroll, and confirm their favorite theme or cancel to restore their original style.

import { useCallback, useEffect, useRef } from "react";
import { useDialog } from "../../providers/dialogs";
import { useTheme } from "../../providers/theme";
import { DialogSearchList } from "../dialog-search-list";
import { THEMES } from "../../theme";
import type { Theme } from "../../theme";

// This component renders the theme selector popup inside the dialog box.
// It sets up temporary states so you can preview colors before committing to them.
export const ThemeDialogContent = () => {
  const dialog = useDialog();
  const { setTheme, currentTheme } = useTheme();
  const originalThemeRef = useRef(currentTheme);
  const confirmedRef = useRef(false);

  // This cleans up when the dialog closes. If you didn't hit Enter to confirm a theme,
  // it resets the application colors back to what you had before.
  useEffect(() => {
    return () => {
      if (!confirmedRef.current) {
        setTheme(originalThemeRef.current);
      }
    };
  }, [setTheme]);

  // This runs when you select a theme by pressing Enter or clicking it.
  // It commits the choice, persists it in config, and closes the dialog.
  const handleSelect = useCallback(
    (theme: Theme) => {
      confirmedRef.current = true;
      setTheme(theme);
      dialog.close();
    },
    [setTheme, dialog],
  );

  // This runs as you hover or arrow key down the theme list.
  // It gives you a real-time preview of the color palette without saving it permanently.
  const handleHighlight = useCallback(
    (theme: Theme) => {
      setTheme(theme);
    },
    [setTheme],
  );

  return (
    <DialogSearchList
      items={THEMES}
      onSelect={handleSelect}
      onHighlight={handleHighlight}
      filterFn={(t, query) => t.name.toLowerCase().includes(query.toLowerCase())}
      renderItem={(theme, isSelected) => (
        <text selectable={false} fg={isSelected ? "black" : "white"}>
          {theme.name === originalThemeRef.current.name
            ? "\u0020\u2022\u0020"
            : "\u0020\u0020\u0020"}
          {theme.name}
        </text>
      )}
      getKey={(t) => t.name}
      placeholder="Search themes"
      emptyText="No matching themes"
    />
  );
};