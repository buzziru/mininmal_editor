import type { Theme } from "../models/Theme";

const THEME_STORAGE_KEY = "markdown-editor-theme";

type ThemeStorage = Pick<Storage, "getItem" | "setItem">;

export class ThemeService {
  constructor(private readonly storage?: ThemeStorage) {}

  getInitialTheme(): Theme {
    const storedTheme = this.storage?.getItem(THEME_STORAGE_KEY);

    return isTheme(storedTheme) ? storedTheme : "light";
  }

  getNextTheme(theme: Theme): Theme {
    return theme === "light" ? "dark" : "light";
  }

  saveTheme(theme: Theme): void {
    this.storage?.setItem(THEME_STORAGE_KEY, theme);
  }
}

function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}
