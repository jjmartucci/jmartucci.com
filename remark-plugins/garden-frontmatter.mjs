import fs from 'fs';

export function gardenFrontMatterPlugin() {

    // All remark and rehype plugins return a separate function
    return (tree, file) => {

        // Get the file path and stats
        const filePath = file.history[0];
        const stats = fs.statSync(filePath);

        // Get creation and modification dates
        const publishedDate = stats.birthtime.toISOString();
        const updatedDate = stats.mtime.toISOString();

        // Append new fields to the frontmatter
        file.data.astro.frontmatter.publishedDate = publishedDate;
        file.data.astro.frontmatter.updatedDate = updatedDate;

    };
}