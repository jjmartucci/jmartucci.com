---
title: PAGNIs and YAGNIs
published: 2022-10-18T02:15:02.273Z
draft: false
description: You aren’t going to need it, or will you probably need it?
---

YAGNI = [You aren't going to need it](https://martinfowler.com/bliki/Yagni.html). 

PAGNI = [Probably are gonna need it](https://simonwillison.net/2021/Jul/1/pagnis/).

Many senior software developers I’ve worked with have had their own PAGNI lists in their heads. YAGNIs, on the other hand, are more of an “argue about it every time” kind of list, not to mention as developers we often end up with “can we try to need this?” lists of things to try and learn that are more likely aren't gonna needs than probably gonna needs.

Some I have from past experiences:

- Real User Monitoring (RUM). At some point someone from the business is going to want to see a breakdown of user flows, errors, actions, everything. A one line set it and forget it RUM setup can save weeks of setting up specific logging and reporting.
- Preview environments. I push a branch, I get a place to see it. Takes time to set up but pays massively for testing and getting product sign off.
- Feature flags, because eventually you're going to have to release something to production and you don't want to have to let everyone at it.
- A no-code way to modify production. This one has pros and cons but eventually you'll have simple strings that need updating or images or a configuration that doesn't map to an API anywhere and someone will wanted it updated ASAP. Why break out a code editor when you can edit a value in a CMS and push publish.
- Regression test checklists. Not everything will be caught by automated tests. Make a checklist on the first day of prod releases, modify it so it’s up to date over time.
- Hard limits on build times, API request times, and asset load times. Because if it’s fuzzy it’ll one day seem slow, and then next time you look it’ll be unbearably slow and no one will totally understand why or how to fix it.