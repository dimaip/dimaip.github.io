---
published: false
---


Rendering HTML just on server side feels so akward in 2015. Universal apps quickly gain popularity, and it feels like people start using React even for almost static landing pages, not just for rich web apps.
In this landscape, traditional server-side frameworks like Ruby start to fret. I had my own share of shivers down my spine, being a developer of a PHP CMS: how relevant is what we do to this hipster React/Node/Mongo world?

## The problem
Two month ago we at SFI agreed to help our friends with a little semi-scientific religious study project: build a simple worldview test. The idea is simple: you have a list of questions, every question is answered by represententives of different worldviews, and you have to make a blind choice based on what they said.

Initially I thought to do all the heavy-lifting at server-side with Neos, and only add a little jQuery spaghetti on the client.
But as the project UI requirements grew, I quickly realised that the amount of required spaghetti jQuery code is way more than my poor head can manage, so I needed more rational approach to managing UI state. Lucklily I had just started to learn ReactJS ans Redux at Yandex Interface Development School, and they seemed like a perfect fit for managing UI in a predictable way.

It took me a few days to build a working UI prototype, and I really liked the taste of developer experience with React. Now I needed to store content somewhere and let editors modify it.

Naturally I started to look for a fitting nodejs API generator tool. At first sight I really loved KeystoneJS: simple, lean and easy to get started with. I created a Question, Answer and Worldivew models, and started filling in some sample data. Editing records felt nice in KeystoneJS, until I realised one hard fact: there was no way to group Answers by Questions, i.e. I could get a list of all answers and search for a needed answer, but there was no way to see at a glance which answers belong to a certain question.
This was just unusable for me, so I trashed my KeystoneJS experiment, and started looking for other tools. To my surprise they all suffered from the same weakness: no easy way to edit hierarchical data.

That came as a big suripse to me, but I couldn't find anything suiting my rather simple requirements. Even big giants of content APIs like Contentful would still give me simple lists of records, and no hierarchical grouping.
And that's where I decided to do something at that time I thought crazy: use PHP CMS to provide content for NodeJS/React app.

## NeosCMS

Neos has a few strong sides especially suited for building content APIs.

1. Totally flexible tree-shaped content structure.
2. Content dimensions (e.g. language, locale, preference for cats vs. dogs...).
3. Flexible rendering engine (TypoScript), which allows you to query tree data and dump it to JSON.
4. Really powerful yet easy to configure caching mechanish, which is very important for content API.
5. Full-fledged MVC framework (Flow), which allows handling more complex requests for data manipulation.
6. And lastly, UI with top class editor experience.

### Content Repository
Neos stores content in the Content Repository (CR). CR is a tree of nodes, where each node has a type and a set of properties.

The nodetypes are completely custom, and are defined in declarative way in a yaml file.
So I defined main nodetypes (Question, Answer and Worldview), having answers as childnodes to their respective question.
https://github.com/sfi-ru/EncultDistr/blob/master/Packages/Sites/Sfi.Encult/Configuration/NodeTypes.yaml#L125

Neos Content Repository allows you to store different variants of the same node called dimensions. This is a very powerful concept, but for this project we only needed the language dimension, for storing content in English and Russian.

### Rendering API
So having data in place, now is the time to collect it and render it to JSON, for our React app to consume it later.
Neos has a dedicated configuration language for configuring content rendering called TypoScript, it takes a bit of time getting used to, but once you learn it you are guranteed to fall in love with it. Here is a typoscript file that defines our Json API: https://github.com/sfi-ru/EncultDistr/blob/master/Packages/Sites/Sfi.Encult/Resources/Private/TypoScript/Json.ts2#L129
Basically we just map the properties of our model to related fields in our API, and render to JSON with `@process.1 = ${Json.stringify(value)}`.
Explaining how TypoScript works is outside the scope of this article, but head to officila docs and you will find that it's actually not that hard to master: http://neos.readthedocs.org/en/stable/CreatingASite/TypoScript/InsideTypoScript.html

Also take note, that for each API enpoint we define a custom caching rule, that tells in what circumstance to invalidate the cache.

All that's left is to point our React/Redux app to relevant API urls: https://github.com/sfi-ru/encultN/blob/master/app/redux/api.js#L12

### Updating content
But fetching content is not all that we can achive with Neos, we can also define a classic MVC controller for handling actions that require data manipulation. In this case we needed an action to vote for a certain answer: https://github.com/sfi-ru/EncultDistr/blob/master/Packages/Sites/Sfi.Encult/Classes/Sfi/Encult/Controller/VoteController.php#L48

Flow provides a support lot of powerful stuff like DDD, Doctrine ORM, DI, routing, configuratin and many more, so be sure you'll have some power when your API would need it.

### Docker containerization
At first I was reluctant to use two completely different stacks on the server (PHP and NodeJS). Instinctively I felt that it might turn into a hosting and deployment hell.
But none of my fears turned true. On the contrary, decoupling frontend from backend appeared to give a lot more flexiability and freedom to the whole hosting system.

To ease the pain of setting up all the infrastructure, I decided to use Docker conainers for each service: nodejs app would just get a container of its own, not interfering with Neos PHP container in any way.

All the infrastructure is descibed in a declarative way with Docker Composer: https://github.com/sfi-ru/EncultDistr/blob/master/docker/docker-compose.yml
As you can see have to pack quite a lot there: mysql, php+nginx, redis, node and a few other service containers. Managing and deploying it by hand would turn into a nightmare really quickly.

Deployement also appeared to be much easier: while I could do big infrustructure deployments with Docker, smaller frontend code changes could go without Neos even noticing it. That's so cool, when the part of code that is changing the most is actually completely stateless: database lives in its own container, and you can scale node containers freely, without caring about backend.
Neos API part was mostly stable during the whole project, and undergone quite fewer changes than the React app.

## Results

So I must say that idea of combining best from two worlds, solid content managment with modern web apps really payed off.

The whole thing is running pretty fast on a 5$ Digital Ocean plan. I get about 120ms response from Neos API and 350ms TTFB for the whole app. The app feels very responsive thanks to server-side rendering: it does not have to wait for JS code to load, and time to paint is under 2s.

But the thing that makes my heart most warm every time I integrate Neos in any project, is contemplating the editors happiness, and I'm really glad that I can retain this experince even in a cold single page application world =)


