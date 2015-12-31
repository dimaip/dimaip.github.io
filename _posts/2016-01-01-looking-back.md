---
layout: post
title:  "Building a Rich Content API with Neos for your React App"
description: "Integrating Neos with React in one project to provide editor happiness"
image: "http://dimaip.github.io/assets/looking-back.jpg"
tags: neos
comments: true
---

<figure markdown="1">
  ![React + Neos](/assets/looking-back.jpg)
</figure>

<p class="LeadParagraph">Having celebrated the New Year with family and friends, and now that everyone around is asleep, it is time to write one of those personal New Year's resolution posts no one reads and except yourself a year later.<br/>
Technology world is pacing so fast, that it is impossible to predict where one will end up in a year from now. Literally no wishes/predictions I made last year were fulfilled, and that makes it even more funny to make new guesses again.</p>

## Looking behind

But first a quick glance back at my professional year.

**The first quarter** of 2015 I spent making friends with [Docker](http://docker.io/) and eventually [running it in production](http://dimaip.github.io/2015/03/03/hybrid-deploy-with-docker-and-surf/). It has become an indispensable tool in my toolbox, which taught me to think about web applications being inseparable from infrastructure that they require. Need redis, elasticsearch, php7? Just add a few lines to your docker-compose.yml file and you got it!

**The second quarter** I spent mostly working on our [institute's main website](http://sfi.ru). I learnt a lot more about Neos, but main discoveries were in the land of project management. We started using [Trello](https://trello.com/) with some simple burndown chart tool, and indeed it is a great experience to work in the small agile team full of people who are dedicated to their job.

**The third quarter** was the most exhausting one of all. I finally understood that I am light years behind on what is going on in modern JavaScript world, so I decided to try to enroll in [Yandex Interface Development School](http://dimaip.github.io/2015/11/03/yandex-shri/) to make up for the lack of knowledge in this area, and surpisingly I got accepted. We had a team of six people building sample [chat app with React+Redux+nodejs](https://github.com/shri-2015-org/shrimp/), mentored by Yandex web developers, having multiple lectures each week from the best of Yandex staff plus a couple of full-day hackathons. The fun lasted for two month and completely blew my mind away.
Alongside with studying at Yandex interface Development School, I decided to convert one of our work projects to single page application with the same stack we used at Yandex, so I ended up with the [very interesting mix of React/Redux, nodejs and Neoscms](http://dimaip.github.io/2015/11/15/react-neos/).
It was the fun time, but maybe it was a bit too much for me, which resulted in a sort of emotional burnout, so I needed to take a step back and reconsider some things.

**The last quarter** was probably the most important one for me. During the whole year I was able to dedicate significant amount of time to the Neos project (thanks to my work at SFI plus people who sponsored some of my Neos contributions), [attended two code sprints](http://dimaip.github.io/2015/07/18/t3dd-and-neos-sprint/) and had great fun! But in September I got an invitation to join the development team of the project itself, something I never dreamed would have happened so soon. I was lucky to be put on the Minions team (we have [three small teams](https://www.neos.io/news/the-neos-teams.html) that drive the project) which was in charge of the Neos 2.1 release. During November and December we had some great fun crafting the release, I never felt such level of collaboration and team spirit from working together on Neos before, and it is definitely a great challenge being inside such project.

Also during December I [greatly simplified our CI process on top Ansible](https://github.com/sfi-ru/ansible-deploy/blob/master/deploy.yml) and moved to [new php7 containers](https://github.com/sfi-ru/docker-neos-bare). A small effort that brings a good feeling to my developer mind.

## Looking ahead

Looking at the upcoming year technology-wise, I say that I really do not know what to expect. So many things that need fixing, so many new things I want to learn. Here is a very random lists of work-related things that come to my mind:

- Do more React or maybe even React-native projects!
- Try to invest into making our websites more testable and reliable: start using [Gemini](http://gemini-testing.github.io/gemini/) for CSS regressions testing, test crucial TypoScript parts, test contaieners and deployment scripts and so on.
- Build a little Docker cloud to remove single points of failure and not depend on our bare metal so much.
- Invest a lot of time into Neos project itself. All of our key websites depend on it now, and I plan to spend most effort on user experience and snappiness of user interface of Neos, basically anything that makes our editors happy and solves our goals.
- Start taking more responsibility in design and project management parts, making sure the whole thing works, and not just the technical parts.
- Continue building a tech open source community around [our church movement](http://en.psmb.ru/about-us/). We already have a few people volunteering to help with our work, and I have brought in to our company a lot of things learned at Neos community (e.g. we have [all of our code](https://github.com/sfi-ru/) public on Github), but we are just getting started here.
- Read more books!
- Focus more on work ethics, not working up until late in night and improving life-work balance. I have quite some things to fix here!

But the key tune always remains the same for me throughout my professional life: "making technology the servant to people, not vice versa". It is so easy to get entangled in the world of new fashionable libraries and tools, in personal career growth and self-improvement, that shifts your priorities away from the people to whom you are supposed to be serving with all these technical gifts.
