import type { Tag } from "../models/Tag";

const TAG_PATTERN = /(^|[\s([{])#([A-Za-z0-9][A-Za-z0-9_-]*)\b/g;

export class TagService {
  extractTags(content: string): Tag[] {
    const tags: Tag[] = [];
    const seenTags = new Set<string>();
    let isInsideCodeFence = false;

    for (const line of content.split(/\r?\n/)) {
      if (/^\s*(```|~~~)/.test(line)) {
        isInsideCodeFence = !isInsideCodeFence;
        continue;
      }

      if (isInsideCodeFence) {
        continue;
      }

      for (const match of line.matchAll(TAG_PATTERN)) {
        const name = match[2];

        if (!name || seenTags.has(name)) {
          continue;
        }

        seenTags.add(name);
        tags.push({ name });
      }
    }

    return tags;
  }
}
