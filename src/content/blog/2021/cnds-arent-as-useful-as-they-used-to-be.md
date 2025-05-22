---
title: "CDNs Aren’t as Useful as They Used to Be"
published: 2021-02-18T16:42:41.582Z
description: When I was learning to be a web developer it was beaten into my head that if you were building a site and loading 3rd party scripts on it (e.g. jQuery, Bootstrap), you should load them from a CDN because if a user on your site had been to another site that used jQuery (likely) and they used the same version of jQuery (somewhat likely), and that other site also used the same CDN for jQuery (i.e. `https://code.jquery.com/`, which was pretty likely given we didn’t have as many widely available CDNs back then), then the browser would pull the version of jQuery you were requesting from the cache instead of downloading it again. Everyone wins! Except the first site to request jQuery that a user hit with an empty cache.
draft: false
slug: cnds-arent-as-useful-as-they-used-to-be
---

When I was learning to be a web developer it was beaten into my head that if you were building a site and loading 3rd party scripts on it (e.g. jQuery, Bootstrap), you should load them from a CDN because if a user on your site had been to another site that used jQuery (likely) and they used the same version of jQuery (somewhat likely), and that other site also used the same CDN for jQuery (i.e. `https://code.jquery.com/`, which was pretty likely given we didn’t have as many widely available CDNs back then), then the browser would pull the version of jQuery you were requesting from the cache instead of downloading it again. Everyone wins! Except the first site to request jQuery that a user hit with an empty cache.

I’d gone on assuming that was functionally true but I needed it less and less as the sites I built started using npm packages and bundling everything at build time instead of requesting resources at run time. I thought it was true somewhat recently, when I decided we could load Google fonts from Google instead of bundling them because “if the user has it in the cache…”. But [today I learned it’s not true at all](https://www.stefanjudis.com/notes/say-goodbye-to-resource-caching-across-sites-and-domains/):

> If your sites request the global jQuery, modules from unpkg.com, font files from Google fonts or GA's (Google Analytics) analytics.js, users will redownload the resources no matter if they downloaded and cached them for other sites already.

> What does this change mean for you? If your sites live on modern hosting that provides a CDN and supports HTTP/2, you can drop the third-parties and should ship all resources yourself. Relying on a third-party provides little value in 2020.

 In fact it hasn’t been true in Safari for a long time (since 2013), but as of October 2020 it doesn’t work in Chrome either. It maybe never _really_ worked like we dreamed it did, [comments on Hacker News](https://news.ycombinator.com/item?id=24894135) imply actual cache hits were very low. I chose to believe there was a golden age of a long lived minor version of jQuery that got heavily pulled from cache hits, but maybe I chose to believe that just so this little nugget in my brain wasn’t useless all along.