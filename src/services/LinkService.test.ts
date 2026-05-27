import { describe, expect, it } from "vitest";

import type { DocumentMetadata } from "../models/Document";
import { LinkService } from "./LinkService";

describe("LinkService", () => {
  const service = new LinkService();

  it("parses basic internal document links", () => {
    expect(
      service.parseDocumentLinks("Read [[Research Notes]] and [[ideas/startup]].", "notes.md"),
    ).toEqual([
      { sourcePath: "notes.md", targetName: "Research Notes" },
      { sourcePath: "notes.md", targetName: "ideas/startup" },
    ]);
  });

  it("ignores empty internal link targets", () => {
    expect(service.parseDocumentLinks("[[   ]]", "notes.md")).toEqual([]);
  });

  it("resolves links by title, path, or path without extension", () => {
    const documents: DocumentMetadata[] = [
      { path: "research.md", title: "Research" },
      { path: "ideas/startup.md", title: "Startup" },
    ];

    expect(service.resolveDocumentLink("Research", documents)?.path).toBe("research.md");
    expect(service.resolveDocumentLink("ideas/startup", documents)?.path).toBe(
      "ideas/startup.md",
    );
    expect(service.resolveDocumentLink("ideas/startup.md", documents)?.path).toBe(
      "ideas/startup.md",
    );
  });

  it("renders internal links as preview links with resolution state", () => {
    const documents: DocumentMetadata[] = [{ path: "research.md", title: "Research" }];

    expect(service.renderInternalLinks("[[Research]] and [[Missing]]", documents)).toBe(
      "[Research](#internal-link/resolved/Research) and [Missing](#internal-link/missing/Missing)",
    );
  });
});
