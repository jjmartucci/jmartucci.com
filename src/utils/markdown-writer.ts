import type { BookMetadata } from '../scripts/types/hardcover';

export function generateBookMarkdown(
  metadata: BookMetadata,
  reviewContent: string
): string {
  // Build frontmatter object, excluding undefined values
  const frontmatter: Record<string, any> = {};

  if (metadata.title) frontmatter.title = metadata.title;
  if (metadata.author) frontmatter.author = metadata.author;
  if (metadata.link) frontmatter.link = metadata.link;
  if (metadata.image) frontmatter.image = metadata.image;
  if (metadata.tags && metadata.tags.length > 0) frontmatter.tags = metadata.tags;
  if (metadata.rating !== undefined) frontmatter.rating = metadata.rating;
  if (metadata.dateRead) frontmatter.dateRead = metadata.dateRead;
  if (metadata.reviewedAt) frontmatter.reviewedAt = metadata.reviewedAt;
  frontmatter.draft = metadata.draft;

  // Convert to YAML frontmatter
  const yamlLines: string[] = [];

  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      yamlLines.push(`${key}:`);
      for (const item of value) {
        // Only write string items, skip arrays, objects, null, undefined, empty strings
        if (typeof item === 'string' && item.trim().length > 0) {
          yamlLines.push(`  - ${item}`);
        }
      }
    } else if (typeof value === 'string') {
      // Always quote string values to prevent YAML misinterpretation
      yamlLines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
    } else if (typeof value === 'boolean') {
      yamlLines.push(`${key}: ${value}`);
    } else if (typeof value === 'number') {
      yamlLines.push(`${key}: ${value}`);
    } else {
      yamlLines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }

  const yamlFrontmatter = yamlLines.join('\n');
  const body = reviewContent.trim();

  return `---\n${yamlFrontmatter}\n---\n\n${body}`;
}
