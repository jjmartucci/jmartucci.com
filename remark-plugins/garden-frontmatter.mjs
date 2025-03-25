import fs from 'fs';

export function gardenFrontMatterPlugin() {

    // All remark and rehype plugins return a separate function
    return (tree, file) => {

        // Get the file path and stats
        const filePath = file.history[0];
        const stats = fs.statSync(filePath);

        // Get creation and modification dates
        const createdDate = stats.birthtime.toISOString();
        const modifiedDate = stats.mtime.toISOString();

        console.log(createdDate, modifiedDate);
        // Append new fields to the frontmatter
        file.data.astro.frontmatter.createdDate = createdDate;
        file.data.astro.frontmatter.modifiedDate = modifiedDate;

    };
}