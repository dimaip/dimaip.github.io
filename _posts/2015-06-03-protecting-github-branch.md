---
layout: post
title:  "Protecting Github Branches"
tags: git github
comments: true
---

For many years I was the sole developer on a project. I work in a [non-profit company](http://sfi.ru) that will never afford to have an array of cool developers. But in recent time a group of volunteers started to gather around our project, who dedicate some of their free time helping us out, on a part time basis. To me our website starts to feel a lot like an open source project, and that's where I started to appreciate that we host [all of our code](https://github.com/sfi-ru) on Github.

For spare-time contributors Github provides some great tooling! But as some contributors started investing more and more time and actually becoming a part of the team, Github fork workflow began to feel a bit superfluous. In addition to that Github doesn't allow people who don't have write access to repository to manage Issues, and that's a bummer!

Our repository is [setup in a way](http://dimaip.github.io/2014/12/20/three-steps-to-deploy/) that it automatically ships code to production on commits to master branch, so the desired workflow would be to allow contributors to only work on their feature branches, create pull requests and only I would be able to review and merge those PRs. But to my surprise Github doesn't allow to protect branches, the way Gitlab does with [protected branches](http://doc.gitlab.com/ce/workflow/protected_branches.html).

Looking around the internet, it seems there are only two things you can do about it:

1. Beg your developers to never push to master, and pray they don't accidentally do it.
2. Use pre-commit hooks on client side to forbid such push. Downside is that developers must not forget to install that hook.

I was content with the combination of the two, as I have no problem of malicious intentions, but just making sure contributors don't do destructive thing by accident.

##Using pre-push hook

I've scrambled together a [simple script](https://github.com/sfi-ru/SfiDistr/blob/master/hooks/pre-push), that denies push to master for everyone but me, as I have nobody to review my code anyway, and I have to deploy to production many times a day. In addition to that, it denies force-push on master  even to me.
I've added those hooks to repository in hooks folder, and [added symlink to it in the build script](https://github.com/sfi-ru/SfiDistr/blob/master/build.sh#L29).

##Extra protection on CircleCI side

As I said, we use CircleCI to deploy our site on every commit to master. I've added [some extra protection](https://github.com/sfi-ru/SfiDistr/blob/master/circle.yml#L6) by detecting on CircleCI side the Github user who initiated deploy, and aborting deploy in case if it wasn't me. In that case the build will break and I would immediately be notified that somebody is doing something stupid.

##Result

Now anyone from the world can volunteer to fix some bugs in our awesome non-profit project by just doing traditional Fork&PR. Active contributors can become a part of the team, help organize issues etc, but at the same time I can sleep well, knowing that they have no way of accidently breaking production.
