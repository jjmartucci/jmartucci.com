---
draft: false
title: Adding search to a static site
published: 2022-01-10T12:59:06-05:00
description: Using Lunr to add search to this site.
slug: adding-search-to-a-static-site
---
This blog post is [based off this tweet reply][1]. Because I read it and thought “oh, I already did write about this!” then tried searching for it on the site and couldn’t find it by clicking around, so I searched in the files for the site on my computer and couldn’t find it, then searched across my entire computer and found a long blog post about using [Lunr][2] to search gifs that I never finished[^1].

So, here’s a finished version in a similar vein: let’s add search functionality to this site using Lunr. We need to build an index for Lunr at build time, which means we need some piece of code that will be triggered to begin looking for items to add. I did this by creating a new [Search page (/search)][3]. I copied the logic from my index page and removed some logic that isn’t relevant, but the code here gets all of the markdown files in my content folder and then loops through them. In this case we want to build a “[document][4]” structure for Lunr to be able to search through:
```js
export async function getStaticProps({ ...ctx }) {
  //get posts & context from folder
  const posts = ((context) => {
    const keys = context.keys();
    const values = keys.map(context);
    const data = keys.map((key, index) => {
      const value = values[index];
      // Parse yaml metadata & markdownbody in document
      const document = matter(value.default);
      document.data.date = singleDateFormat(document.data.date);
      if (document.data.finished) {
        document.data.finished = singleDateFormat(document.data.finished);
      }

      return {
        title: document.data.title || "",
        body: document.content || "",
        slug: key.replace(".md", "").substring(1),
      };
    });

    return data;
  })(require.context("../content", true, /\.\/.*\.md$/));

  return {
    props: {
      searchData: posts,
    },
  };
}
```

In the actual Search page component itself, we build the Lunr index from the `searchData` prop:

```js
 const lunrIndex = lunr(function () {
  this.ref("title");
  this.field("title");
  this.field("body");
  this.field("slug");

  props.searchData.forEach(function (doc) {
    this.add(doc);
  }, this);
});
```

After this we wire up the Search page to have a text input that,  on change, searches the Lunr index. This is the code for the entire page[^2]:

```js
function Search(props) {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState();
  var lunrIndex = lunr(function () {
    this.ref("title");
    this.field("title");
    this.field("body");
    this.field("slug");

    props.searchData.forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  const searchLunr = (e) => {
    setSearchString(e.target.value);
    setSearchResults(lunrIndex.search(e.target.value));
  };

  const searchResultsList = () => {
    if (!searchResults || !searchResults.length) {
      return null;
    }
    return searchResults.map((result) => {
      const slug = props.searchData.find(
        (data) => data.title === result.ref
      ).slug;
      return (
        <li key={slug}>
          <p>{result.ref}</p>
          <Link href={`/${slug}`}>{slug}</Link>
        </li>
      );
    });
  };

  return (
    <Layout>
      <ReadingContent>
        <h1>Search</h1>
        <input type="text" value={searchString} onChange={searchLunr} />
        <h2>Results</h2>
        <ul>{searchResultsList()}</ul>
      </ReadingContent>
    </Layout>
  );
}
```

So that’s cool, and it works, but one thing I noticed here is that this Lunr search runs against the full text of the content, but once you click through, if the post is long it’s not immediately obvious where the term you were searching for appears. Let’s do something about that, at least for blog content.

First, let’s append a query parameter to the link we get from our search results, like this:
```js
<Link href={`/${slug}?searchterm=${searchString}`}>{slug}</Link>
```

This blog is built with Next so for me getting that query parameter on any given page looks something like:
```js
import { useRouter } from "next/router";

// inside the component
const { query } = useRouter();
const searchTerm = query.searchterm;
```

All of the post content is written in Markdown, so we can pass the post body to a function that looks for the search term in the string and replaces it, like this: 
```js
const wrapSearchTerm = (string) => {
    if (searchTerm) {
      const regex = new RegExp(`${searchTerm}`, "g");
      return string.replace(
        regex,
        `<span class="searchTerm">${searchTerm}</span>`
      );
    }
    return string;
  };
```

One thing I realized was doing it this way breaks links that might have the search term in it, because the searching is happening on the unprocessed Markdown. Running it post processing would be better, but to be lazy, let’s just search for the word with a reasonable set of boundaries to ignore, like this:
```js
const regex = new RegExp(`${searchTerm}(?![-_])`, "g");`
```

which eliminates most slugified versions of the word. It’s still case sensitive but the 80/20 among its users (me) says it’s good enough to ship.

[^1]:	For good reason, the original post was about recreating Giphy using Lunr and lambda functions. Those parts were fine, but I think I lost the thread trying to make a Slackbot to tie them together.

[^2]:	This is React with some wrapping components like Layout and ReadingContent that only handle styling.

[1]:	https://twitter.com/jayroh/status/1479568755478999055
[2]:	https://lunrjs.com
[3]:	https://www.builtwith.coffee/search
[4]:	https://lunrjs.com/guides/core_concepts.html#documents