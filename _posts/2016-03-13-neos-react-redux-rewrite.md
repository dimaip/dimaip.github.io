---
layout: post
title:  "Neos CMS Goes for a Full UI Rewrite with React and Redux"
description: "Tutorial-based walkthrough of our new user interface"
image: "http://dimaip.github.io/assets/react-neos.png"
tags: neos, react, redux
comments: true
---

<p class="LeadParagraph" markdown="1">[Neos](https://neos.io) is a modern content management system, known for its flexibility and ease of use. Behind the project we have 19 active team members spread across 3 agile teams, and 85 contributors to the project in total, and if you ever visit a Neos event or a code sprint, you will soon find out that we are more like a family, than a corporation. In fact Neos is a rare case when large open source project is not being backed by any commercial company.</p>

But don’t worry, I won’t spend the rest of the article worshiping our product or describing all of its features (even though it totally deserves it). 

I have some other story to tell you, namely **how we approached the rewrite of Neos UI with React, Redux, and the rest of modern and shiny JS stack of 2016**.

The web is full of Redux tutorials and great learning materials, but **it is much harder to find real open source projects of our scale to be written with modern JS stack**. In this writeup I will try to do two things at once: give you a brief walkthrough of our codebase, alongside some theory behind the parts of the stack that we have chosen. Be warned though, **we are currently in the very begininng of the rewrite, so the code that you will see is pretty much WORK IN PROGRESS**.

## The Decision

Undertaking a complete UI rewrite was not an easy decision to make. You see, by now we have one of the most intuitive UIs in the content management world, mostly stable and complete. It was written in EmberJS 1.x and for its time was pretty neatly built. But with time **things started to get out of hand**, the complexity of it multiplied and development of new interface features started to cost more and more. Touching one piece of it could backfire in other least places, we had no interface tests so refactoring it was not easy too, and the whole thing just didn’t feel predictable and fun to work with any longer. The last drop was difficulty of upgrading it to Ember 2.x, too many things had changed during the time and we wanted to rethink multiple things anyways.

To evaluate the decision, two amazing coreteam developers, [Wilhelm Behncke](https://twitter.com/WilhelmBehncke) and [Tyll Weiß](https://twitter.com/inkdpixels), had spend a few days under cover to built a proof-of-concept prototype, which was able to convince the rest of the team that we should go for it.

Last week we had a code sprint in Dresden where more developers joined the rewrite effort, and now we have 5 people ([@WilhelmBehncke](https://twitter.com/WilhelmBehncke), [@inkdpixels](https://twitter.com/inkdpixels), [@DerGerDner](https://twitter.com/DerGerDner), [@skurfuerst](https://twitter.com/skurfuerst) and [me](https://twitter.com/dimaip)) actively working on it and about 5 more feeling intrigued and wanting to join our efforts too.

## Lets Pretend This is a Tutorial...

I will try to make code walkthrough look more like a tutorial. As a kind of tutorial assignment, I will be using the feature on which I was working during last week. **Our task would be to create a dialog for creating nodes** (i.e. pages or content elements in Neos), that will provide you with a choice of all possible page types that are allowed to be created in the given place, and that would finally send the command to the server API, creating a new node of the chosen type. Let’s call it `AddNodeModal`.

<aside class="Callout Warning" markdown="1">Warning! This walkthrough presupposes you know some React and Redux essentials and will not help you getting started from zero groud.
</aside>

### React Components

<aside class="Callout Info" markdown="1">All of our React components are divided into two types: **presentational components** and **container components**. Presentational components are small reusable pieces of the interface like Buttons, Modals, Icons or even Trees.
presentational components are encapsulated into container components, that provide more dedicated app logic, that is generally not meant to be reusable. Containers may connect to app state via [react-redux](https://github.com/reactjs/react-redux) @connect decorator. Usually they don’t render data directly, but pass it down to presentational components.
</aside>

So to render our AddNodeModal we would need a couple of components: Dialog, Button, Icon, Headline and Grid (to nicely layout buttons into multiple rows). Luckily all of the needed components were already created by somebody else, so we can just play a bit of Lego composing our piece of UI out of existing components.

<a target="_blank" class="Button" href="https://github.com/PackageFactory/PackageFactory.Guevara/blob/9e06fdd96c1627a262c42b8405c1f128de972fa4/Resources/Private/JavaScript/Host/Containers/AddNodeModal/index.js">AddNodeModal container component</a>

### State

<aside class="Callout Info" markdown="1">
The main reason for the switch to this new stack was the desire to give more predictability and integrity to the UI. You see, our case is slightly complicated by the fact that we have the same data distributed across multiple places: the navigation tree, inline editing etc. Before we did not have a unified data model, and all of this modules functioned independently, carefully glued together by some state syncing code. Yes, that was kind of a nightmare.
That is why here from the start we for having all data clearly normalised and stored in the state. But that includes not only the content data, but also the state of the UI itself: all trees, panels, user preferences and so on now have a dedicated place in the application state.
</aside>

For our AddNodeModal we would need two things stored in the state: reference node, relative to which the new node would be created, and an insertion mode (inside, before, after). Lets store these two values at `UI.AddNodeModal.referenceNode` and `UI.AddNodeModal.mode` inside the state.
Our dialog will show up when we put some node into `referenceNode`, and disappear once we clear that value.


### Reducers

<aside class="Callout Info" markdown="1">The idea behind Redux is to join app state into one single state tree, and manipulate it via a side-effect free function, that takes previous state and returns the new state, based on an action that describes the manipulations that we want to apply to it. The reducer may be split into multiple reducers, for the sake of modularity. The state itself is kept in the store and not in the reducer, the reducer is just a simple function, remember?
Actions that manipulate the state may be likened to C (Command) in CQRS (Command-Query Responsibility Segregation). You may record and later replay actions to get a kind of Event Sourcing.

To manipulate state efficiently we use our own library called plow-js, which has that scent of functional programming to it. Check it out, it is really cool!
You might have noticed that we do not use the usual switch statement block in the reducers, and describe them via map handlers instead. Nothing fancy about it, just our taste preference.
</aside>

So to manipulate the state we would need to create a reducer handling two actions: OPEN and CLOSE. OPEN would set `referenceNode` and `mode` to provided values, CLOSE would clear the value of `referenceNode`, closing the dialog. Nothing difficult so far, right?

<a target="_blank" target="_blank" class="Button" href="https://github.com/PackageFactory/PackageFactory.Guevara/blob/9e06fdd96c1627a262c42b8405c1f128de972fa4/Resources/Private/JavaScript/Host/Redux/UI/AddNodeModal/index.js">UI.AddNodeModal reducer</a>

### Selectors

<aside class="Callout Info" markdown="1">It is a general recommendation to keep data in the state normalised, just like in a relational database. This way it is easier to manipulate it, without worrying that some parts of data get out of sync. But often you need to have data gathered from multiple places in the state, and that is when selectors come to the rescue. Selectors are functions that take the state and return the needed part of it. We use a very nice selector library called reselect. It helps you to create more complex selectors by combining simple selectors, and also helps to make them more performant by automatic memoization.
</aside>

We had no difficulty in getting `referenceNode` and `mode` from the state, but now we have a bigger challenge coming. We need to get a list of allowed nodetypes for the reference node and mode. For that we need to combine data from multiple places across the state: nodeType data, nodeType constraints, referenceNode, mode, parent and grandparent node to given referenceNode and so on. But that’s not all, now we need to group allowed node types and sort them in the right order. You see, quite a complex logic that is comprised of multiple simple selectors, each of which needs independant testing and performance optimization.

So we got the list of allowed node types, nicely grouped and sorted. Now it is time to add some behavior to them that would actually create nodes.

<a target="_blank" class="Button" href="https://github.com/PackageFactory/PackageFactory.Guevara/blob/9e06fdd96c1627a262c42b8405c1f128de972fa4/Resources/Private/JavaScript/Host/Selectors/CR/Constraints/index.js">Constraints selectors</a>

### Side-effects

<aside class="Callout Info" markdown="1">Redux architecture mainly focuses on the client state and does not consider effects, such as asynchronous requests to the server. There is no consensus on the best practices here, but for our case we chose redux-saga library. It uses generators and looks really fancy at first sight, but we found most freedom in using it. Basically it watches for one of your actions to happen and then executes some code, which may be asynchronous and as effect trigger other actions.
</aside>

We have a fancy new server API to describe the desired actions we want to perform on the server. Any action we want to take is encoded as a change object, e.g. `Create`, `Move`, `Property` and so on. For our task of creating nodes, we need to choose between actions `Create`, `CreateAfter` and `CreateBefore` actions based on `mode` state. After we construct correct change object, we need to send it as a parameter to `Changes.add` action creator, and it would be transparently picked up by the changes saga and sent to the correct API endpoint on the server. On success saga fires a `FINISH` action, on failure `FAIL`.

<a target="_blank" class="Button" href="https://github.com/PackageFactory/PackageFactory.Guevara/blob/9e06fdd96c1627a262c42b8405c1f128de972fa4/Resources/Private/JavaScript/Host/Redux/Sagas/Changes/index.js">Changes saga</a>

### Testing

It should go without saying that we must cover at least critical parts of our codebase with tests. In the given task we have to test reducers, selectors, component itself and probably sagas too. The most critical parts are reducers and selectors, and they are the easiest to test, after all they are just a pure functions: pass some input and expect some output!
To write assertions in behavioural style we use chai. To run them in real browsers we use Karma. For acceptance tests we use Selenium.
I have yet to finish writing acceptance tests for this feature, so I will update this article once I have some code to show.

So I hope this gives you some insights into how we apply core React & Redux architecture principles to our app. Feel free to browse the rest of the codebase, I am sure you will find a lot of interesting stuff there.

## The Neos Family

If you stayed with me this far, you may be interested in the project itself, and not only the technology we use. As some very clever people [put it to words](https://blog.engineyard.com/2014/open-source-software-contribution), open source project is nothing without people behind it. And we are truly blessed here, we are not just some nerds scaterred all around the globe, neither are we emploeeys payed by some businesses to do coding. We are a community of friends, almost a family. [We organise code sprints](http://dimaip.github.io/2014/10/05/the-code-sprint/) regularily to not only code together, but as well share all the good things we are given in this life, be it a walk across the Elba river in the night or game of laser tag.

**So if you like our code, come join us!** We have a lot of code to write together, but in the end it does not have to end there, lets be friends!
