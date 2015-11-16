---
published: false
---

Rendering HTML just on server side feels so akward in 2015. Universal apps gain popularity at a rapid rate, and it feels like people start using React even for almost static landing pages, not talking about dynamic apps.
In this landscape, traditional server-side frameworks like Ruby start to feel a little dizzy. I had my own share of shivers down my spine, being a developer of a PHP CMS: how relevant is what we do to this hipster React/Node/Mongo world?

## The problem
Two month ago we at SFI agreed to help our friends with a little semi-scientific religious study project: build a simple worldview test. The idea is simple: you have a list of questions, every question is answered by represententives of different worldviews, and you have to make a blind choice based on what they said.

Initially I thought to do all the heavy-lifting at server-side with Neos, and only add a little jQuery spaghetti on the client.
But as the project UI requirements grew, I quickly realised that the amount of required spaghetti code is way

started adding some frontend code, some jQuery, added two-step voting UI, and then I realised that the whole frontend part is turning into a real mess, and it's just not how stuff is done in 2015.
I knew something had to change, so I decided to give ReactJS a try. It took me a couple of days to learn the basics and build a working UI prototype with React, and I really liked the experience. Now I needed to store content somewhere and let editors modify it.
Naturally I started to look for a fitting nodejs API generator tool. At first sight I really loved KeystoneJS, simple, lean and easy to get started with. I create a Question and Answer models, and started feeling in some sample data. Entering data was quick and flawless, until I realised one hard truth: there was no way to group Answers by Questions, i.e. I could get a list of all answers and search for a needed answer, but there was no way to see at a glance which answers belong to a certain question. This was unacceptable, so I trashed by KeystoneJS experiment, and started looking for other tools. To my surprise they all suffered from the same weakness: no easy way to edit hierarchical data. That came as a big suripse to me, but I couldn't find anything suiting my rather simple requirements. Even big giants of content APIs like Contentful would still give me simple lists of records, and no hierarchical grouping.
And that's where I decided to do something crazy: use PHP CMS to provide content for NodeJS/React app.

## NeosCMS

### Content Repository
Neos stores content in Content Repository (CR). CR is a tree of nodes, where each node has type and a list of fields.
So I defined main nodetypes (Question, Answer and Worldview), and would put all answers as childnodes to a certain question.
https://github.com/sfi-ru/EncultDistr/blob/master/Packages/Sites/Sfi.Encult/Configuration/NodeTypes.yaml#L125

Neos Content Repository allows you to store different variants of the same node called dimensions (e.g. language, country, love for cats etc). This is a very powerful concept, but for this project we only needed to store content in two languages, English and Russian.

### Fetching content
So having data in place, now was the time to collect it and render it to JSON, for our React app to consume it later.
Neos has a dedicated configuration language for configuring content rendering called TypoScript, it takes a bit of time getting used to, but once you learn it you are guranteed to fall in love with it. Here is a typoscript file that defines our Json API: https://github.com/sfi-ru/EncultDistr/blob/master/Packages/Sites/Sfi.Encult/Resources/Private/TypoScript/Json.ts2#L129

All is left is to point our frontend React/Redux app to relevant API urls: https://github.com/sfi-ru/encultN/blob/master/app/redux/api.js#L12

### Updating content
But fetching content is not all that we can achive with Neos, we can also define a classic MVC controller for handling actions that require data manipulation. In this case we needed an action to vote for a certain answer: https://github.com/sfi-ru/EncultDistr/blob/master/Packages/Sites/Sfi.Encult/Classes/Sfi/Encult/Controller/VoteController.php#L48

## Two-stack CMS
At first I was reluctant to use two completely different stacks on the server-side (PHP and NodeJS), for the project. Instinctively I felt that it might turn into a hosting and deployment hell.
But none of my fears turned true. On the contrary, decoupling frontend from backend appeared to give a lot more flexiability and freedom to the whole hosting system.

### Docker containerization
To ease the pain of setting up all infrastructure, I decided to use Docker conainers for each service: nodejs app would just get a container of its own, not interfering with Neos PHP container in any way.

Deployement also appeared to be much easier: while I could do big infrustructure deployments with Docker, smaller frontend code changes could go without Neos even noticing it. That's so cool, when the part of code that is changing the most is actually completely stateless: database lives in its own container, and you can scale node containers freely, without caring about backend.
Neos API part was mostly stable during the whole project, and undergone quite fewer changes than the React app.









