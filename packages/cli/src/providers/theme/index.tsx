// This file is the theme provider! It initializes the color theme when the app boots up,
// monitors any theme changes made by the user, and saves their preference to their home directory
// so that the next time they run Koder, it starts up in their favorite style.
// Architecture decision: preferences are saved as a local JSON file in a ~/.koder folder.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { ThemeColors, Theme } from "../../theme";
import { DEFAULT_THEME, THEMES } from "../../theme";

const CONFIG_DIR = join(homedir(), ".koder");
const THEME_PREFERENCES_PATH = join(CONFIG_DIR, "preferences.json");

type ThemePreferences = {
    themeName: string;
};

// This helper function reads the theme configuration from disk when the app starts.
// It loads preferences from ~/.koder/preferences.json, and returns the saved theme (or Nightfox if none is saved).
function getInitialTheme(): Theme {
    try {
        const preferences = JSON.parse(
            readFileSync(THEME_PREFERENCES_PATH, "utf8"),
        ) as Partial<ThemePreferences>;
        const savedTheme = THEMES.find((theme) => theme.name === preferences.themeName);
        return savedTheme ?? DEFAULT_THEME;
    } catch {
        return DEFAULT_THEME;
    }
}

// This helper function saves the user's color theme choice to disk.
// It writes the theme name into ~/.koder/preferences.json so it is remembered.
function persistTheme(theme: Theme) {
    try {
        mkdirSync(CONFIG_DIR, { recursive: true });
        writeFileSync(
            THEME_PREFERENCES_PATH,
            JSON.stringify({ themeName: theme.name } satisfies ThemePreferences, null, 2),
            "utf8",
        );
    } catch {
        // Ignore preference write failures so theme switching still works for this session.
    }
};

type ThemeContextValue = {
    colors: ThemeColors;
    currentTheme: Theme;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// This hook lets any component in the application read the current colors or switch themes.
// It returns the theme colors, active theme object, and the setTheme function, throwing if called outside the provider.
export function useTheme(): ThemeContextValue {
    const value = useContext(ThemeContext);
    if (!value) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return value;
}

type ThemeProviderProps = {
    children: ReactNode;
};

// This context provider component manages the current theme state.
// It wraps the entire app so all layout and text components can render matching colors.
export function ThemeProvider({ children }: ThemeProviderProps) {
    const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme);

    const setTheme = useCallback((theme: Theme) => {
        setCurrentTheme(theme);
        persistTheme(theme);
    }, []);

    return (
        <ThemeContext.Provider
            value={{ colors: currentTheme.colors, currentTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};