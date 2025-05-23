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
        tags: Object.keys(allTags).map(key => ([key, allTags[key]])).sort()
    }
}

export const getTags = (posts: Array<any>) => {
    if(!posts) {
        return []
    }
    const tags: { [index: string]: number } = {}
    posts.forEach(post => {
        post.data.tags?.forEach((tag: string) => {
            if(tags[tag]) {
                tags[tag]++;
            } else {
                tags[tag] = 1;
            }
        })

    })
    return tags
}

export const filterGardenByTag = async (tag: string) => {
    const posts = (await getCollection("garden")).filter(post => post.data.tags.includes(tag))
    return posts;
}

