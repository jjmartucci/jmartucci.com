import {getCollection} from "astro:content";

export const getAllGardenContent = async () => {
    const blog = (await getCollection("blog"))
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
        .filter((post) => !post.data.draft)
    const posts = (await getCollection("garden"))
    const books = (await getCollection("books"))
    const links = (await getCollection("links"))

    const allTags =  getTags([...books, ...blog, ...links, ...posts])
    return {
        content: [...posts, ...blog, ...links, ...books],
        tags: allTags
    }
}

export const getTags = (posts: Array<any>) => {
    return [...new Set(posts.map((post) => post.data.tags).flat().filter(tag => !!tag))]
}