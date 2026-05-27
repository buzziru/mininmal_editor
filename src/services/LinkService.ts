import type { DocumentMetadata } from "../models/Document";
import type { DocumentLink } from "../models/DocumentLink";

const INTERNAL_LINK_PATTERN = /\[\[([^\]\r\n]+?)\]\]/g;

export class LinkService {
  parseDocumentLinks(content: string, sourcePath: string): DocumentLink[] {
    const links: DocumentLink[] = [];

    for (const match of content.matchAll(INTERNAL_LINK_PATTERN)) {
      const targetName = match[1]?.trim();

      if (targetName) {
        links.push({ sourcePath, targetName });
      }
    }

    return links;
  }

  resolveDocumentLink(
    targetName: string,
    documents: DocumentMetadata[],
  ): DocumentMetadata | undefined {
    const normalizedTarget = normalizeLinkTarget(targetName);

    return documents.find((document) => {
      const title = normalizeLinkTarget(document.title);
      const path = normalizeLinkTarget(document.path);
      const pathWithoutExtension = normalizeLinkTarget(removeMarkdownExtension(document.path));

      return (
        title === normalizedTarget ||
        path === normalizedTarget ||
        pathWithoutExtension === normalizedTarget
      );
    });
  }

  renderInternalLinks(content: string, documents: DocumentMetadata[]): string {
    return content.replace(INTERNAL_LINK_PATTERN, (rawLink, rawTarget) => {
      const targetName = rawTarget.trim();

      if (!targetName) {
        return rawLink;
      }

      const resolvedDocument = this.resolveDocumentLink(targetName, documents);
      const status = resolvedDocument ? "resolved" : "missing";
      const hrefTarget = encodeURIComponent(targetName);

      return `[${targetName}](#internal-link/${status}/${hrefTarget})`;
    });
  }
}

function normalizeLinkTarget(value: string): string {
  return removeMarkdownExtension(value.trim()).replaceAll("\\", "/").toLowerCase();
}

function removeMarkdownExtension(value: string): string {
  return value.toLowerCase().endsWith(".md") ? value.slice(0, -3) : value;
}
