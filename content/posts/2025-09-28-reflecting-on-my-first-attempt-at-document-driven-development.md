---
title: "Reflecting on My First Attempt at Document-Driven Development"
lang: en
published: 2025-09-28
gist_url: "https://gist.github.com/otariidae/5f0794328403c3707b6b667d2958a7fb"
---

TL;DR: My implementation plan was flawed, and it took too long to get a working happy path.

The concept of spec-driven development is gaining traction, supported by tools like [Kiro](https://kiro.dev/) and [Spec Kit](https://github.com/github/spec-kit). I've personally struggled to get the output I want from AI when giving it complex requests. So, to find a better way to use AI, I decided to try this approach on a recent Rails project.
However, since I had already done a rough design, I had the AI focus on the detailed design, creating an implementation plan, and the actual coding. This is probably different from formal spec-driven development, so I’ll just call it document-driven development.

The main benefit was that I could catch potential issues early by outlining all the requirements and the implementation details from the start. It allowed me to think about things like error handling, non-functional requirements, quality standards, and what to test ahead of time. You could call it a form of "shift-left." I’ve always felt that getting stuck on design decisions during implementation is the biggest thing that slows down development. That's why this approach was a huge plus for me. It fits with one of my personal mottos: "Hestitation is defeat."

The downside was that it took a while to get a piece of working software. This wasn't a problem with the process itself, but more about how I structured the implementation plan. I broke the plan down into small phases and focused heavily on making sure end-to-end tests passed for each one. This meant each phase could be verified with request specs. However, a working happy path—the kind that gives you practical feedback—wasn't ready until the very last phase. This was because the approach had effectively become a "horizontal slice." It was a strong reminder of how important "vertical slicing" is for building working software early, even when AI is speeding up the development process.

Also, it wasn't a case of just writing the docs and letting the AI do all the work. Even after finishing the initial documents, I hadn't figured everything out. During implementation, I sometimes found things I’d missed or realized parts of the original plan wouldn't work, which required small design changes. That said, this didn't happen often, and the amount of rework was small, so development never really stalled.

Last week, I attended Kaigi on Rails 2025. The opening keynote, titled "[dynamic!](https://kaigionrails.org/2025/talks/moro/)", was about developing software as a dynamic entity rather than a static structure. Overall, I feel my experiment with document-driven development has been promising. However, I've come to realize that I may have been treating software too much like hardware. Next time, I plan to try a more flexible, "softer" approach to document-driven development.
