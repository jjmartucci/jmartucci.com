---
title: Code is not literature
image: ../images/2023/lit.jpg
draft: false
published: 2023-08-16T04:00:00.000Z
description: The overlap between coding and writing, to me, are the mental models you make while doing both.
---

Another link found via Hacker News: [Code is not literature](https://gigamonkeys.com/code-reading/). Start of the second paragraph this had me interested:

> As a former English major and a sometimes writer, I had always been drawn to the idea that code is like literature…

I’m a former English major, and I’ve made the argument that coding and writing are similar in the past. But the author of this post went in a different direction than me:

> …and that we ought to learn to write code the way we learn to write English: by reading good examples.

To which I recoiled, a bit. The article gets to a conclusion that matched my immediate reaction — no one reads code. We understand it by working with it, but it’s rare to even read it and rarer to appreciate it by reading it.

The overlap between coding and writing, to me, are the mental models you make while doing both. I keep application state in my mind the same way I do characters, locations, plot points. I look at a class with the mindset of “given this class, and the known business logic, how should this method behave”, and to me it runs down similar mental pathways to “given this character, and their known backstory, how would they behave in this situation”. In both writing and coding you’ll produce better output if you take multiple looks and pare down everything to its essentials. Kill your darlings is relevant in writing and code.

I like thinking about coding this way because it makes it easier to understand the challenges of coding collectively, or explaining to someone who doesn’t program one of the fundamental challenges of programming. Books with a single story are rarely written by multiple authors, although they might be worked on by many people. But code is rarely written by a single person — all of those mental models of backstory, plot, character models, need to be shared and internalized by everyone contributing. And that’s hard! Programming might be easier because you can’t argue at length about the motivations of an addNumbers method, but we also often shove the working notes into a “done” column, never to be seen again, or authors leave for new works, and expect new contributors to look at the final work and discern the why from only the how.

The post comes around to the conclusion that rather than reading code, in depth, we should approach it as naturalists:

> I think a better model is for one of us to play the role of a 19th century naturalist returning from a trip to some exotic island to present to the local scientific society a discussion of the crazy beetles they found: “Look at the antenna on this monster! They look incredibly ungainly but the male of the species can use these to kill small frogs in whose carcass the females lay their eggs.”

Which I agree with. But if you want to keep the idea of code as literature, or writing at least, consider giving your code a director’s commentary. Record the little bits of deep knowledge about why a particular line got written that might be missed in scope of the full, final work, but will be dearly appreciated by a fellow programmer.
