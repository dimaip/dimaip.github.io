---
layout: post
title:  "7 Steps From jQuery Plugins to React Development"
description: "The architectural steps between a jQuery plugin and a full-fledged SPA"
image: "https://cloud.githubusercontent.com/assets/837032/22975317/5cdfd962-f397-11e6-91e3-867508639da9.png"
tags: vdom, react, redux
comments: true
---

<p class="LeadParagraph" markdown="1">JavaScript single-page applications (SPAs) have made a huge leap in the last couple of years. We talk about them, we write them, they got all the attention and buzz you can think of. But even in 2017, not everything is a SPA. So what do you do when you need to add some interactive widget to a mostly static backend-driven website? For all those sliders, tabs, feedback forms and so on, is imperative jQuery fiddling still the best way to go?</p>

Here I'm offering you an overview of the architectural steps between a jQuery plugin and a full-fledged SPA. At each step you decide if pros outweigh the cons and move on. The trick is to stop early, bringing in as many abstractions as you need and not more.

# Step 1. You might not need jQuery

![image](https://cloud.githubusercontent.com/assets/837032/22975317/5cdfd962-f397-11e6-91e3-867508639da9.png)

The first thing we should do is to remember that jQuery is not a synonym of JavaScript (anymore), and that it's perfectly possible to go without it. There's a great website to prove the point: http://youmightnotneedjquery.com/
Ah, but what about jQuery plugins, surely we can't live without them?! Well, no, actually there's almost certainly a vanilla JS plugin for every need, look up here: http://youmightnotneedjqueryplugins.com/

Pros:

- Shave off tens of KB of JS code. And no, it's not only about download time, it's also about JS parsing time and execution time, those actually do matter on older mobile devices
- Stay closer to the DOM and browser APIs. This will make you a better JavaScript developer

Cons:

- More verbose, low-level code. You loose familiar abstractions

# Step 2. Switch to ES6

ES6 is nice, it has modernised JavaScript to look as fresh as those other hipster languages like Python. Arrow functions, destructuring, smart variable declarations etc. Don't get too excited about ES6 classes though, they are still a wrapper over JS' prototype-based inheritance, so make sure you understand how they work before using them!
Don't worry about browser support, as most of ES6 is traspileable to ES5 by Babel. But yes, that would require an extra build step.

Pros:

- More expressive language

Cons:

- Extra build step

# Step 3. Use ES6 modules

What's even better than new ES6 language constructs is the ability to break your code apart into modules that can require each other. In addition to that, you can import 3rd party code from npm. You can use Webpack to bundle your modules into a single file. Use UMD format to be able to consume the resulting bundle both from the browser or as a CommonJS module from Node or from another Webpack app.

Pros:

- No more adding extra dependencies via script tags into global scope by hand
- Your dependencies won't collide in the global scope
- Modular code is easier to manage and reuse, no more of those mile-long js files

Cons:

- Need to configure Webpack

# Step 4. View as a function of the state

Now that we have modernised JavaScript a little, let's look at architectural patterns of how to use it.

The most important thing React taught us is how cool it is to have the view as a function of app's state. This way we have just one path to both create and update the view: the render function. Will this be useful for simple JS widgets? Hell yes! No more getting a certain DOM node by some attribute from a soap of html tags, and imperatively modifying it! Let me give you an example.

To start with, let's define a little helper function that would help us to create DOM nodes. Its API would look like this: `el('h1', {class: 'headline'}, 'I'm a header')` that would render such DOM node: `<h1 class="headline">I'm a header</h1>`. My very naive implementation looks like [this](https://github.com/psmb/typo-reporter/blob/da7ffc6ec6b6d968d72cc4e2dbfa6a5229a2c3ff/src/el.js), but I'm sure you can do better in a couple of minutes.

Now that we have such helper at hand, we can nicely render some DOM nodes as a function of our state:

```js
var rootNode = document.createElement('div');
document.body.appendChild(rootNode);

var state = {
  counter: 0
};

function setState(newState) {
  state = Object.assign({}, state, newState);
  // remount the whole node tree on every change
  mount();
}
function increment() {
  setState({state: state.counter + 1});
}
function render(state) {
  return el('div', {}, [
    el('h1', {}, 'Demo'),
    el('button', {onClick: increment}),
    el('div', {class: state.counter > 10 ? 'plenty' : 'a-few'}, state.counter)
  ]);
}
function mount() {
  // sorry, delete children properly IRL
  rootNode.innerHTML = '';
  var renderedNodeTree = render(state);
  rootNode.appendChild(renderedNodeTree);
}
```

Again, this is super naive, but we got what we wanted: on every update to the state we re-render the whole view. The cool part of this is that our view now is completely declarative and has the full power of JavaScript at our disposal: conditions, loops, event handlers, anything that comes to your mind.

Pros:

- View as a function of the state. Declarative rendering. The same code path for updates and rendering
- No dependencies! No extra code download and parsing!

Cons:

- Will eventually become slow. But this is not really something to worry about from the start, don't do premature optimisations before you hit the problem!
- Elements loose state on every update. That's a major bummer for input fields! We've got to do something about it!

# Step 5. Virtual DOM

![image](https://cloud.githubusercontent.com/assets/837032/22975671/9e4b3d32-f398-11e6-9118-c1d05bce3774.png)

If you've been hit by one of the two cons of the previous solution, it's time to move on. All of our problems come from full re-rendering on every update, so to solve them we need a way update the DOM elements without re-creating them if not necessary. And that's what virtual DOM is for.
Virtual DOM keeps a virtual representation of DOM nodes in addition to DOM nodes themselves. When asked to update the state, it renders the new virtual elements tree and then decides which elements in the DOM can be updated, and which need to be thrown away and recreated. It's fun to write your own virtual DOM implementation, but we are not going to do it right now. Instead, we can take one of the existing ones, e.g. http://maquettejs.org/. It does its job in return for 3KB of extra download size.

Pros:

- View as a function of the state, but now it's going to perform well with tonnes of nodes and more importantly it will keep the state of DOM elements on the update.

Cons:

- The external dependency of 3KB added. You need to decide if you can live with that.

# Step 6. Componentization

![image](https://cloud.githubusercontent.com/assets/837032/22975738/c2e929d8-f398-11e6-85e1-774f1db366bf.png)

I guess we got all we needed to make a replacement for small jQuery widgets. But if you widget would begin to grow, you might want to break it up into smaller reusable components. That's exactly the idea behind React, so if you have gone this far, it might make sense to refactor your widget to a React component. Depending on your target browser support, you might get away with something way more lightweight than React itself by using one of its clones, e.g. Preact. The core of Preact weights 3KB, and if you add another 10KB on top you would get compatibility with existing React ecosystem via the preact-compat shim.

Pros:

- Break your monolith code into smaller reusable components with a well-designed API, props validation and many bells and whistles.
- Take advantage of enormous React ecosystem: borrow components, use devtools, performance optimisation tools and what not.

Cons:

- Once the state gets dispersed among different components, it becomes harder to share and synchronise

# Step 7. Shared state management

![image](https://cloud.githubusercontent.com/assets/837032/22975802/f92ca86c-f398-11e6-9400-151a6e809b0a.png)

So once we broke our app apart into small reusable pieces, it becomes harder for components to synchronise shared state. Usually in React the pattern is to put the shared state in the top most component among those that are going to need it and pass the state down via props. Those long chains of props can become a nightmare to manage, so that's multiple state management solutions for React appeared. The most simple one of them is Redux. The idea is really trivial: you extract the whole of your app's state to the top of your app, put it into context and access it via a helper function from the context in your child components. You mutate the state via dispatching actions and processing them via pure functions called reducers.
Redux would cost you about 5KB, but I guess you can fit the same logic even in fewer lines of code. The real Preact+Redux app may easily fit under 10KB of JS.

Pros:

- State updates are declarative, allowing to easily trace updates in your code (and bugs)
- Redux itself has a nice ecosystem of plugins and devtools

Cons:

- Yet one more dependency, one more abstraction to master

# Conclusion

Remember, every abstraction, every dependency comes at a cost. Start from the basics, learn the low-level APIs and gradually climb up the abstraction steps.

Recently I had to create a simple "[report a typo on a page[(https://github.com/psmb/typo-reporter)" widget. I had to stop at Step 4, as adding a 3KB of virtual DOM on top of 2KB of my own code was just not worth it.

Even if you are developing a small 2KB widget and not a Facebook-like SPA, your code doesn't have to suck and you should not treat the decisions you take lightly.


## The Decision

Undertaking a complete UI rewrite was not an easy decision to make. You see, by now we have one of the most intuitive UIs in the content management world, mostly stable and complete. It was written in EmberJS 1.x and for its time was pretty neatly built. But with time **things started to get out of hand**, the complexity of it multiplied and development of new interface features started to cost more and more. Touching one piece of it could backfire in other least places, we had no interface tests so refactoring it was not easy too, and the whole thing just didn’t feel predictable and fun to work with any longer. The last drop was a difficulty of upgrading it to Ember 2.x, too many things had changed during the time and we wanted to rethink multiple things anyways.

To evaluate the decision, two amazing core team developers, [Wilhelm Behncke](https://twitter.com/WilhelmBehncke) and [Tyll Weiß](https://twitter.com/inkdpixels), had spent a few days under cover to built a proof-of-concept prototype, which was able to convince the rest of the team that we should go for it.

Last week we had a code sprint in Dresden where more developers joined the rewrite effort, and now we have 6 people ([@WilhelmBehncke](https://twitter.com/WilhelmBehncke), [@inkdpixels](https://twitter.com/inkdpixels), [@DerGerDner](https://twitter.com/DerGerDner), [@skurfuerst](https://twitter.com/skurfuerst), [@MarkusGoldbeck](https://twitter.com/MarkusGoldbeck) and [me](https://twitter.com/dimaip)) actively working on it and about 5 more feeling intrigued and wanting to join our efforts too.

## Lets Pretend This is a Tutorial...

![The AddNodeModal dialog that we are going to implement](/assets/modal.png)<br>*The AddNodeModal dialog that we are going to implement*

I will try to make code walkthrough look more like a tutorial. As a kind of tutorial assignment, I will be using the feature on which I was working during last week. **Our task would be to create a dialog for creating nodes** (i.e. pages or content elements in Neos), that will provide you with a choice of all possible page types that are allowed to be created in the given place, and that would finally send the command to the server API, creating a new node of the chosen type. Let’s call it `AddNodeModal`.

<aside class="Callout Warning" markdown="1">Warning! This walkthrough presupposes you know some React and Redux essentials and will not help you getting started from zero ground.
</aside>

### React Components

<aside class="Callout Info" markdown="1">All of our React components are divided into two types: **presentational components** and **container components**. Presentational components are small reusable pieces of the interface like Buttons, Modals, Icons or even Trees.
Presentational components are encapsulated into container components, that provide more dedicated app logic, that is generally not meant to be reusable. Containers may connect to app state via [react-redux](https://github.com/reactjs/react-redux) @connect decorator. Usually, they don’t render data directly, but pass it down to presentational components.
</aside>

So to render our AddNodeModal we would need a couple of components: Dialog, Button, Icon, Headline and Grid (to nicely layout buttons into multiple rows). Luckily all of the needed components were already created by somebody else, so we can just play a bit of Lego composing our piece of UI out of existing components.

<a target="_blank" class="Button" href="https://github.com/PackageFactory/PackageFactory.Guevara/blob/9e06fdd96c1627a262c42b8405c1f128de972fa4/Resources/Private/JavaScript/Host/Containers/AddNodeModal/index.js">AddNodeModal container component</a>

### State

<aside class="Callout Info" markdown="1">
The main reason for the switch to this new stack was the desire to give more predictability and integrity to the UI. You see, our case is slightly complicated by the fact that we have the same data distributed across multiple places: the navigation tree, inline editing etc. Before we did not have a unified data model, and all of this modules functioned independently, carefully glued together by some state syncing code. Yes, that was kind of a nightmare.
