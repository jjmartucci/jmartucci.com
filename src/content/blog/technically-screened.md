---
title: Technically Screened
description: Thoughts on tech screens in interviews.
heroImage: /blog-hero-images/2024/code-1.jpeg
pubDate: 2024-12-18
---

As I’m currently in the job search process I have thoughts on the “technical screen” round of software developer interviews. If you’re not a software developer, a technical screen round is an interviewer asking the interviewee to write code, in real time. Could be a small CRUD application, or coding trivia, or [fizz-buzz](https://en.wikipedia.org/wiki/Fizz_buzz), or something from [LeetCode](https://leetcode.com/problemset/), or something else entirely, but the expectation is code gets written while an interviewer watches.

If you read that and thought “that sounds awful”, well, sometimes! But they don’t have to be, they can actually be fun.

At this point I’ve been the interviewee for tens of these, and the interviewer for hundreds, so this blog post covers:
- Things I enjoyed while interviewing that I would adopt for future interviews, and maybe you should too.
- Things I have not enjoyed, or thought didn’t work well while I was the interviewer. 

This post is specific to front-end developer roles, which are in a bit of a weirder place for these types of interviews than back-end or full-stack roles, primarily because it’s much easier to have a front-end developer actually build something in real-time.

## Process improvement: things I’ve seen done better as I’ve been interviewing.

These are things that I’ve seen during a technical screen interview that I thought worked better than either how I’ve done them in the past, or compared to other companies I’ve interviewed with.

### Use [GitHub Codespaces](https://github.com/features/codespaces), or let the interviewer bring their own IDE.

I find it odd that developers, known for spending hours setting up their IDE to just their liking, or spending years mastering VIM, are expected to jump on a call and learn the CoderLeetPadHackBox dog shit coding platform du jour. The one interview I did that used Codespaces allowed me to run the code in my local VS Code and we could jump to a much more complicated full-stack problem very quickly.

### Get right to the point.
Many places have adopted an interview style where a 1-hour interview is:

- 10 minutes of introductions
- 40 minutes of coding
- 10 minutes for the interviewee to ask questions. 

It rarely works out this cleanly, and honestly leaving the interviewee just ten minutes to suss out if your company is a clown car parked in a dumpster fire is cruel. Just do some “hellos” and get into the coding. If things fly by, have a normal human conversation. Reserve learning more about the candidate to the pre-screen, and give the candidate a lot more than 10 minutes to ask questions with someone else.


### Don’t believe code screens are unbiased.
Beyond the obvious fact that most code screens will be with camera on, and most will start with some sort of introductions, there’s also the fact that some people just don’t do well coding in front of others.

![Meme, where the top panel shows the villain Rhino destroying a city with the words “Coding alone” next to it, and the bottom panel shows Rhino looking silly with the words “Coding when someone is watching” next to it.](/blog-hero-images/2024/rhino-coding.JPG)

Or, they just don’t code the way you do, or think about a problem the way you would, or have the ability to talk thorougly when typing or _whatever_. When I was the interviewer if someone approached a solution in a way I’d never seen or considered, I’d spend a good amount of time thinking about how they went about it before writing it off as “not the way I’d do it”. I don’t get the impression everyone does this, however, and it’s probably worth some introspection on whether or not you’re really trying to hire someone who thinks (and maybe, incidentally, looks) a lot like you.


## Interviews go both ways: red flags I’ve seen as an interviewee.

Here’s the other side of the coin, things I’ve seen as an interviewee that gave me a bad impression of the company I was interviewing at.

### If you’re interviewing a front-end developer and you don’t touch on accessibility.
In a perfect world the only front-end technical screen would be:

> Here’s an endpoint to POST data to. Make a form with two fields, name and phone number, and have those fields validated client side. There should be one submit button that submits the form.

And if the candidate uses JavaScript, or a `<div>` instead of a button, they’re banned from front-end jobs forever.

![Gif from the Outkast song Ms. Jackson of André 3000 saying “forever ever?”](https://nyc3.digitaloceanspaces.com/coffee-cake/images/gifs/forever-ever.gif)

OK maybe that’s going to far, but I will say every company I _did_ end up working for covered accessibility in the interview process, and so should you.

### Don’t make your technical screen framework specific.
If you want to offer a UI technical screen in various template languages for people with different backgrounds, ok, that’s fine. I still think plain old “it runs right in the browser” JavaScript is the best option but sometimes you want to see someone go further/faster with a framework.

But, if your entire interview is about, let’s say, React[^1], then I’m guessing your entire front-end stack is a rats-nest of poorly maintained React nightmares. And I say that as someone who has worked with React for almost 10 years now, and maybe made some of those nightmares. You don’t look for framework knowledge unless you’re in some pretty strong technical binds to that framework. 

### Don’t call the process “pair programming” unless you’re actually pairing.

When I was the interviewer and I said we could treat a technical screen as a “pair programming” session I did my best to make that true. If someone was stuck I wouldn’t make them flounder about, I’d say “hey I’d use x here, why don’t you look that up.” or even send them a link to documentation in the (dog shit) code platform (du jour). But I’ve been the interviewee and had people suggest it was a “pair programming” session then… just sit there quietly. Or when asked a question, respond coyly like they don’t want to give away the answer to the test. This weird liminal state between “we’re working on this together” and “I’m interviewing you” leads me to my last point.

### Make it clear what you’re actually evaluating the person on.
One nice thing about getting fixed problems in a platform like HackerRank or LeetCode is you’re just trying to create the most optimal solution to a problem. With human-led technical screens you could be evaluated on:
- Code quality and knowledge of a given language.
- How much they like working with you.
- How you approach the problem given.
- How performant your code is.
- Whether or not you caught the little gotcha they hid in the code.
- How thorough your code is in covering edge cases and how well you test for them.
- If they’re hungry, or tired, or just got out of a bad meeting.

I’ve definitely left interviews with the realization that what I was doing and what the interviewer was expecting didn’t line up, which is frustrating but also feels like a waste of time for both of us. 

## So technical screens are bad?

Oh, no, absolutely not. Before being a software developer I worked in a different career as a contractor, and would keep getting turned down for full-time jobs because I didn’t have a relevant degree. Switching to software development and being able to interview by showing that I knew how to do things was amazing by comparison.

## What does the perfect technical screen look like?

The best experience I have had is this:
- A short take home assignment. Think something that would take about 30-60 minutes, the same type and scale of problem you’d ask on a technical screen call.
- I bring that code with me in my own IDE, get asked about my implementation, and then get asked to extend the code in some small way. One example I’ve seen for a front-end test is having the take-home test be to render a UI based off of static data in a JSON file, then having the in-person test be replacing that data source with one from an API.

I think this format works well for both parties. The interviewee isn’t getting a problem thrown at them in an unfamiliar environment, and when they are asked to code in front of another person they have the tools they like and the context of what the problem is. The interviewer gets a preview of the code before the interview, which means they can get into the headspace of how the candidate is solving the problem, and allows them to tailor specific evaluations they can be clear about during the in person interview.

That’s my perfect interview, anyway. If it sounds like yours maybe we should talk, I’m still looking for my next gig.

---

[^1]: It’s always React.