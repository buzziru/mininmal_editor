import { describe, expect, it } from "vitest";

import { TagService } from "./TagService";

describe("TagService", () => {
  const service = new TagService();

  it("extracts basic tags in document order", () => {
    expect(service.extractTags("Notes about #research and #daily-note.")).toEqual([
      { name: "research" },
      { name: "daily-note" },
    ]);
  });

  it("returns each tag only once", () => {
    expect(service.extractTags("#project #project #project_2026")).toEqual([
      { name: "project" },
      { name: "project_2026" },
    ]);
  });

  it("does not treat headings, fragments, or language names as tags", () => {
    const content = ["# Heading", "Use C# today.", "Visit example.com/#section."].join("\n");

    expect(service.extractTags(content)).toEqual([]);
  });

  it("ignores tags inside fenced code blocks", () => {
    const content = ["#actual", "```", "#not-a-tag", "```"].join("\n");

    expect(service.extractTags(content)).toEqual([{ name: "actual" }]);
  });
});
