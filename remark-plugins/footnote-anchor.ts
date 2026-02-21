import type { RehypePlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";
import type { Element } from "hast";

/**
 * Rehype plugin that adds CSS anchor positioning to footnotes.
 * Adds anchor-name to <sup> elements containing footnote refs,
 * and position-anchor to corresponding footnote <li> elements.
 */
export const footnoteAnchor: RehypePlugin = () => {
    return (tree) => {
        visit(tree, "element", (node) => {
            const element = node as Element;

            // Add anchor-name to <sup> elements containing a footnote ref link
            if (element.tagName === "sup") {
                const link = element.children.find(
                (child): child is Element =>
                        child.type === "element" &&
                        child.tagName === "a" &&
                        child.properties?.dataFootnoteRef !== undefined
                );

                if (link && typeof link.properties?.id === "string") {
                    const match = link.properties.id.match(/fnref-(.+)$/);
                    if (match) {
                        const anchorName = `--fn-${match[1]}`;
                        element.properties = element.properties || {};
                        element.properties.style = `anchor-name: ${anchorName}`;
                    }
                }
            }

            // Position footnote <li> elements at the bottom of their corresponding <sup>
            if (
                element.tagName === "li" &&
                typeof element.properties?.id === "string" &&
                element.properties.id.startsWith("user-content-fn-")
            ) {
                const match = element.properties.id.match(/fn-(.+)$/);
                if (match) {
                    const anchorName = `--fn-${match[1]}`;
                    element.properties.style = `top: anchor(${anchorName} bottom)`;
                }
            }
        });
    };
};
