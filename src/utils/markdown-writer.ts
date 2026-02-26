import type { BookMetadata } from '../scripts/types/hardcover';

export function generateBookMarkdown(
  metadata: BookMetadata | Record<string, any>,
  reviewContent: string
): string {
  // Build frontmatter object, excluding undefined and null values
  const frontmatter: Record<string, any> = {};

  for (const [key, value] of Object.entries(metadata)) {
    // Skip undefined and null values
    if (value === undefined || value === null) {
      continue;
    }
    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) {
      continue;
    }
    // Include everything else
    frontmatter[key] = value;
  }

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
