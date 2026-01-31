---
title: Stream
description: Logging all my data in one place.
published: 2026-01-30
---
 I wanted a simple thing: one place to show all of the media I consume. For me that’s reading books, watching movies/tv, noting favorite songs, and video games. I wanted a way to see this locally _and_ here on the blog, with some level of ease for automating collection, which meant looking at third party services to store the data, then pulling from them to save the data in Markdown.

I didn’t want to spend a lot of time on this, so I offloaded ~~some~~ ~~most~~ all of the work to [Claude Code](https://claude.com/product/claude-code ) and some other AI tools. I thought the “how” of making the page might be of interest to others, so here it is!

## Research
The first thing I recognized was I needed to use services which did two things:
1. Automated the process of connecting media to some central database of information. I don’t want to manually enter information for everything I read, watch, play, I want someone else to make a nice easy UI for that part of the process.
2. … but that service also needed to have an API to make retrieving information from them to store as Markdown simple.


For #2 I considered a hierarchy of usefulness when evaluating services:
1. Best would be an actual published and documented API.
2. An RSS feed that has all of the important information I needed.
3. A public page that can be scraped for data.
4. A way to export all of my data (ideally automated).

## Services
Here’s a rundown of where I landed on the services that provided the UI for collecting data. A few I was already using, some I had to find new services to fit the criteria noted above.

### Books
I had previously done a mix of saving books I read as Markdown manually and using [Hardcover](https://hardcover.app). The great thing about Hardcover is it has an API! It was in fact created because Goodreads took their API down.
### Movies (and TV)
I was using [Letterboxd](https://letterboxd.com) to save what movies I watched. I used it because I liked seeing what other people watched. They offer a bulk export feature, but no API (and are, like Goodreads, entirely opposed to the idea of an API). Letterboxd also _only_ handles movies, so I exported all my data and tried [Simkl](https://simkl.com/) which does have an API, but found the UI to be… lacking, for lack of a better description.
I ended up landing on [Trakt](https://trakt.tv/) which integrates well with a lot of media players, does movies and TV, and has an acceptable interface. Their API also required connecting to [TMDB](https://www.themoviedb.org) to pull images.
### Music
I’ve inconsistently used [last.fm](https://www.last.fm/) for basically forever, and it has an API. I set it up to only pull loved songs, as I scrobble a _lot_ of music. But, I’ve loved almost no songs in the last decade or so that I’ve used last.fm. But intend to going forward. I use [NepTunes](https://apps.apple.com/us/app/neptunes-for-itunes-spotify/id1006739057?mt=12) on my Mac to make it easier to do from Apple Music.
### Video Games
This is probably the clunkiest integration, currently. [Infinite Backlog](https://infinitebacklog.net) is great at syncing with my Steam and Playstation activity, but has no API. It does have an export feature, and references an [IGDB](https://www.igdb.com) ID for each game, so you can export the data and then hit the IGDB API to get richer details.