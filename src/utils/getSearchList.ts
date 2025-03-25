import {getAllGardenContent} from "@utils/getAllGardenContent.ts";

export const getSearchList = async () => {
    const gardenContent = await getAllGardenContent()

    return gardenContent.content.map(c => ({title: c.data.title, slug: c.slug, description: c.data.description, tags: c.data.tags, collection: c.collection}))
}