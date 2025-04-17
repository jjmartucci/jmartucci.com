import {getCollection} from "astro:content";

export const getAllGardenContent = async () => {
    const content = (await getCollection("garden"))
        .filter((post) => {
            return !(process.env.node === "production" && post.data.tags.includes("draft"));
        })
        .sort((a,b) => new Date(b.data.created) - new Date(a.data.created))

    const allTags =  getTags(content)

    return {
        content,
        tags: allTags
    }
}

export const getTags = (posts: Array<any>) => {
    if(!posts) {
        return []
    }
    return [...new Set(posts.map((post) => post.data.tags).flat().filter(tag => !!tag))]
}

export const filterGardenByTag = async (tag: string) => {
    const posts = (await getCollection("garden")).filter(post => post.data.tags.includes(tag))
    return posts;
}

export const migrateBlogPosts = async () => {
    const oldBlog = (await getCollection("blog"))
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
        .filter((post) => !post.data.draft)
        .filter((post) => post.data.homepage != false)

    return oldBlog.map(post => {
        const converted = {
            ...post,
            data: {
                ...post.data,
                created: post.data.pubDate,
                image: post.data.heroImage
            }
        }
        return converted;
    })
}