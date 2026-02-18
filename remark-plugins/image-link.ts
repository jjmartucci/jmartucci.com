import type { RehypePlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";
import type { Element, ElementContent } from "hast";

/**
 * Rehype plugin that wraps images in anchor tags that open the full image in a new tab
 */
export const imageLink: RehypePlugin = () => {
    return (tree) => {
        visit(tree, "element", (node, index, parent) => {
            const element = node as Element;

            if (element.tagName !== "img" || !element.properties?.src) {
                return;
            }

            // Skip if already wrapped in an anchor
            if (parent && (parent as Element).tagName === "a") {
                return;
            }

            const src = element.properties.src.toString();

            // Create anchor wrapper
            const anchor: Element = {
                type: "element",
                tagName: "a",
                properties: {
                    href: src,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "image-link",
                },
                children: [element as ElementContent],
            };

            // Replace the img with the anchor-wrapped img
            if (parent && typeof index === "number") {
                (parent as Element).children[index] = anchor;
            }
        });
    };
};
