---
title: "Note ↔ Note, thinking outside the folder"
published: 2020-07-10T15:06:05+00:00
draft: false
slug: note-note-thinking-outside-the-folder
description: Getting rid of folders in note apps.
---

I’ve used a bunch of note taking apps over the years (Evernote, OneNote, Apple Notes, [Goodnotes](https://www.goodnotes.com), [Notion](https://www.notion.so), [Bear](****)) and I’ve almost always used them similarly to how you’d use a file system: folders for organization, notes as files. I’m always a little curious about new note apps and how they organize things. I was using Notion for a while, and got along well with using it’s concept of relational databases to make connections between notes. If you create notes in a database in Notion, you can make it look like Google Keep, you can make it correlate notes to a calendar (ala [Agenda](https://www.agenda.com), another app I’ve tried, if only for a few minutes), or you can organize them in columns Trello style and use your notes as todos. It’s all the same set of notes, just with different views of the database. There’s a somewhat clunky way to associate one note with another, or one tag with another, and only if you’re using a database of notes (i.e, not just a “page” style note), but once you have that you can organize your notes in almost any fashion you can think of. A relational database + a nice UI is really just a primitive app building platform in the tradition of Access on top of Excel.

The main issue I had with Notion is that it’s slow — it’s really a wrapper around a web app, even in native form. On top of that, it doesn’t play nicely with built-in MacOS features. One small example, if you copy a link to a [Things](https://culturedcode.com/things/) project into Notion, clicking on the link… does nothing. It doesn’t know what to do with callback urls.

So I’ve drifted from a combination of Notion and Bear, where Notion was project level and Bear was for quick capture, to Bear and Things, where Bear is project level and Things is quick capture. Everything is faster and it works across all my computers, my iPad, phone, and watch.

Bear uses tags as organization, which means you can refer to a note in multiple directions. It doesn’t live in a given folder, it lives where ever it is relevant. That said, the tags end up being used mostly as folders, it’s just you might have the same file in multiple folders.

An interesting idea I’ve seen floating around the web is associating all notes with links between notes, and using backlinks and graph views to understand where notes connect. Bear has supported “live links” or wiki style links for a bit now, you can have `Note A` and reference it in `Note B` with `[[Note A]]`. If you rename A, the link updates, and you never have to think about where `Note A` is. If you want to find all of the references to `Note A`, you can search for `[[Note A]]`, and you can use Bear’s x-callback-url API to save that search at the top of `Note A`, so you can click on the link and find all of the notes referencing that note.

Some newer apps like [Roam Research ](https://roamresearch.com) and [Obsidian](https://obsidian.md)[^1] make backlinks the main focus. You might start the day with a log, and then just tag other notes as you record what you’ve done, like:

    ```
    - Did [[HIIT workout A]] for 30 minutes
    - Met [[Cool McPerson]] for lunch at [[Local Establishment]]
    - Read article about [[Rust]] at [article](link)
    ```

then in the note `HIIT workout A` you can see all of the times you logged that note. Graph view is just these associations, but rather than buried in text, in a nice visual format. Bear can’t do this, but it’s not exactly magic to make a chart of associations, and Bear has the API to support it. There’s a [python script that will generate a Graphviz view of your notes for you on Github](https://github.com/rberenguel/bear-note-graph). It includes a handy `—anonymize` option so I can even show you what my Bear notes look like, graphically:

![](/assets/images/2020/bear_graph.png)
Is it useful? I dunno. I’ve recently started daily logging with backlinks in my notes at work, and it’s proving helpful being able to click into longer running projects and see all of the times I associated it with a Jira issue, a person, a meeting, etc. The idea is that you can, with pretty low effort, record every thought in your head as it comes, then look at the graph and see what the core areas you’re thinking about are, and what areas can probably be pruned.

[^1]. Obsidian is interesting to me, and I’ve started using it at work instead of Bear. It’s a little clunky at the moment (it’s in a beta) and it’s clearly an Electron app, but it works off plain text files on a local file system, which is surprisingly hard to find. [Ia Writer](https://ia.net/writer) works that way, but doesn’t support backlinks.
