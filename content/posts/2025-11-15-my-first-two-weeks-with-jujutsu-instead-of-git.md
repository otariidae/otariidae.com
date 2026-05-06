---
title: "My First Two Weeks with Jujutsu (Instead of Git)"
lang: en
published: 2025-11-15
gist_url: "https://gist.github.com/otariidae/3d1685ff6ca484922cb1c34b034dbb77"
---

**TL;DR:** It's reasonably convenient and I haven't run into any major issues, so I plan to keep using it.

I've been trying out Jujutsu (jj) recently, which is a relatively new version control system.

https://jj-vcs.github.io/jj/latest/

The biggest initial difference I found from Git is the lack of a staging area. File edits are tied directly to a commit, which takes some getting used to.

https://jj-vcs.github.io/jj/latest/working-copy/

After using it for two weeks, here are my impressions.

## What I Found Convenient

Jujutsu has some features that feel more straightforward than their Git counterparts.

### Easier Commit Editing

In Git, modifying older commits can be a hassle. You have to run an interactive rebase (`rebase -i`), mark commits for edit, and then amend them one by one.

Jujutsu makes this simpler. You can just use `jj new` to jump to the commit you want to change and then `jj squash` (or `jj edit`). The overall design seems to lower the barrier to rewriting commits.

### No Need for `stash`

If you need to switch tasks, you can just use `jj new` to create a new commit for your new task.

The flip side is that I've found it's easier to lose track of previous changes. If I don't leave a clear commit message or add a bookmark, my log can get confusing.

### Conflicts Don't Stop Your Workflow

This is quite helpful. You can keep creating new commits even if there's an unresolved conflict. Jujutsu just records the conflict state and lets you continue.

This helps prevent those situations where you get stuck fixing a complicated merge and forget what you were originally trying to do 🤯.

### Easy-to-Read Logs

The log is a bit richer than `git log` ✨.

## The Downsides

### AI Hallucinations

Because Jujutsu is relatively new, there isn't much information about it online. This means when I ask an AI (like Gemini) for help, I occasionally get confidently incorrect answers (hallucinations).

For example, I wasted about an hour 🫠 after it mixed up the `-r` and `-s` options for `jj rebase`. The lesson here is to stop being lazy and just read the official documentation.

## Conclusion

I'm still getting the hang of it, but overall, it's pretty convenient and I don't have any major complaints.

Since I've made it through the initial learning curve, I plan to keep using it. The goal now is to get comfortable enough that the commands become second nature.
