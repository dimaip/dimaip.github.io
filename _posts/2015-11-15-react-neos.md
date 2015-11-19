---
layout: post
title:  "Building Rich Content API with Neos for your React App"
description: "Integrating Neos with React in one project to provide editor happiness"
image: "http://dimaip.github.io/assets/react-neos.png"
tags: neos react api
comments: true
---

![React + Neos](/assets/react-neos.png)

Rendering HTML just on server side feels so akward in 2015. Universal apps quickly gain popularity, and some people start using React even for mostly static landing pages, not talking about rich web apps.
In this landscape, traditional server-side frameworks like Ruby on Rails start to fret. I had shivers down my spine myself, being a developer of a PHP CMS: how relevant is what we do to this hipster React/Node/Mongo world?

## The problem

Two month ago we at [SFI](http://sfi.ru) agreed to help our friends with a little semi-scientific religious-study project: build a simple worldview test. The idea is this: you have a list of questions, every question is answered by represententives of different worldviews, and you have to make a blind choice based on what they had said.

Initially I thought to do all the heavy-lifting on server-side with [Neos](http://www.neos.io), and only add a little jQuery spaghetti on the client.
But as the project UI requirements grew, I quickly realised that the amount of required spaghetti jQuery code is way more than my poor head could manage, so I was in need of a more sane approach to managing UI state. Luckily I had just started to learn [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/) at [Yandex Interface Development School](http://dimaip.github.io/2015/11/03/yandex-shri/), and these tools seemed like a perfect fit for managing UI in a predictable way.

It took me a few days to build a working UI prototype, and I really liked the taste of developer experience with React. Then I needed to store content somewhere and let editors modify it.

I started looking for a fitting nodejs API generator tool. At first sight I really liked KeystoneJS: simple, lean and easy to get started with. I created the Question, Answer and Worldivew models, and started filling in some sample data. KeystoneJS was living up to me expectations, until I realised one usability detail: there was no way to group Answers by Questions, i.e. I could get a list of all answers and search for a needed answer, but there was no way to see at a glance which answers belong to a certain question.
This was made working with a long list of answers really unsatisfying, so I trashed my KeystoneJS experiment, and started looking for other soulutions. To my surprise everything I had found at nodejs land suffered from the same weakness: no easy way to edit hierarchical data.

That came as a big suripse to me, but I couldn't find anything suiting my rather simple requirements. Even big giants of content APIs like Contentful would still give me simple lists of records, and no hierarchical grouping.
And that's where I decided to do something at that time I thought crazy: use PHP CMS to provide content for NodeJS/React app.

![Neos editing interface](/assets/izm-neos-backend.png)

## Neos

I had a few things in mind about [Neos](http://www.neos.io), that would be especially useful for building the content API:

1. Totally flexible tree-shaped content structure.
2. Content dimensions (e.g. language, locale, preference for cats vs. dogs...).
3. Flexible rendering engine (TypoScript), which allows you to query tree data and dump it to JSON.
4. Powerful, yet easy to configure caching mechanish, which is very important for building responsive content API.
5. Full-fledged MVC framework (Flow), which allows handling more complex requests for data manipulation.
6. And at last, UI with top class editor experience.

### Content Repository

Neos stores content in the Content Repository (CR). CR represents a tree of nodes, where each node has a type and a set of properties.

The nodetypes are completely custom, and are defined in declarative way in a yaml file.
So I [defined main nodetypes](https://github.com/sfi-ru/EncultDistr/blob/master/Packages/Sites/Sfi.Encult/Configuration/NodeTypes.yaml#L125) (Question, Answer and Worldview), having answers as childnodes to their respective question.

Neos Content Repository allows you to store different variants of the same node called dimensions. This is a very powerful concept, but for this project we only needed the language dimension, for storing content in English and Russian.

### Rendering Json

So having data in place, now was the time to collect and render it to JSON, for our React app to consume it later.

Neos has a dedicated configuration language for configuring content rendering called [TypoScript](http://neos.readthedocs.org/en/stable/CreatingASite/TypoScript/InsideTypoScript.html), it takes a bit of time getting used to, but once you learn it you are guranteed to fall in love with it. [Here is a typoscript file that defines our Json API](https://github.com/sfi-ru/EncultDistr/blob/master/Packages/Sites/Sfi.Encult/Resources/Private/TypoScript/Json.ts2#L129).

Basically we just map properties of the model to related fields in our API, and render to JSON with `@process.1 = ${Json.stringify(value)}`.
For each API endpoint we define a custom caching rule, that tells in what circumstance to invalidate the cache. This is important to get good reponse time from our API, while still get fresh version of content.

Explaining how TypoScript works is outside the scope of this article, so [head to official docs](http://neos.readthedocs.org/en/stable/CreatingASite/TypoScript/InsideTypoScript.html) for more information.

All we have left is to [point our React/Redux app to relevant API urls](https://github.com/sfi-ru/encultN/blob/master/app/redux/api.js#L12). There's not much magic going on at JS side to explain, we just use a universal fetch library to query for data from our Json API.


### Updating content

But fetching content is not all that we can achive with Neos, we can also define a classic MVC controller for handling actions that require data manipulation. In this case we needed [an action to vote for a certain answer](https://github.com/sfi-ru/EncultDistr/blob/master/Packages/Sites/Sfi.Encult/Classes/Sfi/Encult/Controller/VoteController.php#L48).

Flow, the underlying framework of Neos, packs a lot of other cool stuff like DDD, Doctrine ORM, DI, routing, configuratin management and many more, so be assured you'll have some power under the hood when your API would need it.

### Docker containerization

At first I was reluctant to use two completely different stacks on the server (PHP and NodeJS). Instinctively I felt that it might turn into a hosting and deployment hell.
But none of my fears turned true. On the contrary, decoupling frontend from backend appeared to give a lot more flexiability and freedom to the whole hosting system.

To ease the pain of setting up all of the infrastructure, I decided to use Docker conainers for each service: nodejs app would just get a container of its own, not interfering with Neos PHP container in any way.

All the infrastructure is descibed in a declarative way in a [docker-compose.yml](https://github.com/sfi-ru/EncultDistr/blob/master/docker/docker-compose.yml) file.
As you can see have to pack quite a lot there: mysql, php+nginx, redis, nodejs and a few other service containers. Managing and deploying it by hand would turn into a nightmare quite quickly.

In practice, separating the frontend from the backend greatly simplified deployment: while I could do big infrustructure deployments with Docker, smaller frontend code changes could go without Neos even noticing it. That's so cool, when the part of the code that is changing the most is actually completely stateless: database lives in its own container, and you can scale node containers freely, without caring about the backend.

API quickly stabilized, so I could focus my attention on developing the frontend React part, while letting editors already to start feeling in the content, even before the whole project was ready.

![Izm.io website](/assets/izm.png)

## Results

The [Izm](http://izm.io) project went live. Hooray!

So the idea of combining the best from two worlds, solid content managment with modern web apps, really payed off. We met met the deadlines, despite it being my first React project.

The whole thing is running pretty fast on a 5$ Digital Ocean plan. I get about 120ms response from Neos API and 350ms TTFB for the whole app. The app feels very responsive thanks to server-side rendering: it does not have to wait for JS code to load, and time to paint is under 2s.

Would I would have done differently when designing an API, is planing it so that the data that changes frequently would be fetched separately from the main content. It would allow nodejs part of the app to quickly serve initial html, while the frontend would fetch the vote count and other changing missing pieces already after the page loads.

So React part was fun, but the thing that makes my heart most warm every time I integrate Neos in a project, is contemplating the editors happiness, and I'm really glad that I can retain this experince even in a cold single page application world =)

## TL;DR

- Neos can be a flexible tool for building rich content APIs for JS-powered apps and webistes
- Editors love Neos
- React is great even for static websites, and you should really dive into the world of universal apps by now
- Don't be afraid of having a zoo of technology stacks on your project. Docker has your back covered!

**Many thanks to Gerhard Boden for proof-reading and reviewing this article**