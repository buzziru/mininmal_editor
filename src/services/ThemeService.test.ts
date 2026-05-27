import { describe, expect, it, vi } from "vitest";

import { ThemeService } from "./ThemeService";

describe("ThemeService", () => {
  it("uses light theme when no stored theme exists", () => {
    const storage = createThemeStorage();
    const service = new ThemeService(storage);

    expect(service.getInitialTheme()).toBe("light");
  });

  it("uses a valid stored theme", () => {
    const storage = createThemeStorage({ storedTheme: "dark" });
    const service = new ThemeService(storage);

    expect(service.getInitialTheme()).toBe("dark");
  });

  it("ignores invalid stored themes", () => {
    const storage = createThemeStorage({ storedTheme: "custom" });
    const service = new ThemeService(storage);

    expect(service.getInitialTheme()).toBe("light");
  });

  it("toggles between light and dark themes", () => {
    const service = new ThemeService();

    expect(service.getNextTheme("light")).toBe("dark");
    expect(service.getNextTheme("dark")).toBe("light");
  });

  it("saves the selected theme", () => {
    const storage = createThemeStorage();
    const service = new ThemeService(storage);

    service.saveTheme("dark");

    expect(storage.setItem).toHaveBeenCalledWith("markdown-editor-theme", "dark");
  });
});

function createThemeStorage(options: { storedTheme?: string } = {}) {
  return {
    getItem: vi.fn(() => options.storedTheme ?? null),
    setItem: vi.fn(),
  };
}
