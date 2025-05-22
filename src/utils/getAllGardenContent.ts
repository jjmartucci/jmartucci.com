import {getCollection} from "astro:content";

export const getAllGardenContent = async () => {
    const books = (await getCollection("books"))
    const posts = (await getCollection("blog"))
    const garden = (await getCollection("garden"))
    const all =[...books, ...posts, ...garden];
        all.filter((post) => {
            return process.env.NODE_ENV === "production" ? !post.data.draft : true;
        })
        .sort((a,b) => new Date(b.data.modified) - new Date(a.data.modified))

    const allTags =  getTags(all)
    return {
        content: all,
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

