import type { RehypePlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";
import type { Element } from "hast";

interface Options {
    domain: string;
}

export const externalLink: RehypePlugin = (options?: Options) => {
    const siteDomain = options?.domain ?? "";

    return (tree) => {
        visit(tree, (node) => {
            if (node.type != "element") {
                return;
            }

            const element = node as Element;

            if (!isAnchor(element)) {
                return;
            }

            const url = getUrl(element);

            console.log(url)

            if(isLocalReference(url)) {

                // maybe not the best solution, fixes links to "blog" at least.
                if(url.includes("../")) {
                    element.properties["href"] = url.replace("..", "").replace(".md", "");
                }
                else {
                    element.properties["href"] = url.replace(".md", "");
                }
            }

            /*
            if (isExternal(url, siteDomain)) {
                element.properties!["target"] = "_blank";
            }
            */
        });
    };
};

const isAnchor = (element: Element) => element.tagName == "a" && element.properties && "href" in element.properties;

const getUrl = (element: Element) => {
    if (!element.properties) {
        return "";
    }

    const url = element.properties["href"];

    if (!url) {
        return "";
    }

    return url.toString();
};

const isExternal = (url: string, domain: string) => {
    return url.startsWith("http") && !url.includes(domain);
};

const isLocalReference = (url: string) => {
    const last = url.split(".").pop();
    if(last === "md") {
        return true;
    }
    return false;
}