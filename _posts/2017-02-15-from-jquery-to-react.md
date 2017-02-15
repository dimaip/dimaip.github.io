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

The first thing we should do is to remember that jQuery is not a synonym of JavaScript (anymore), and that it's perfectly possible to go without it. There's a great website to prove the point: [youmightnotneedjquery.com](http://youmightnotneedjquery.com/)
Ah, but what about jQuery plugins, surely we can't live without them?! Well, no, actually there's almost certainly a vanilla JS plugin for every need, look up here: [youmightnotneedjqueryplugins.com](http://youmightnotneedjqueryplugins.com/)

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
  setState({counter: state.counter + 1});
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
Virtual DOM keeps a virtual representation of DOM nodes in addition to DOM nodes themselves. When asked to update the state, it renders the new virtual elements tree and then decides which elements in the DOM can be updated, and which need to be thrown away and recreated. It's fun to write your own virtual DOM implementation, but we are not going to do it right now. Instead, we can take one of the existing ones, e.g. [maquettejs.org](http://maquettejs.org). It does its job in return for 3KB of extra download size.

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

# Step X. Beyond JavaScript

I won't write in detail about it here, but just so you know, there is a world of web development beyound JavaScript. [Elm](http://elm-lang.org), the inspirer of Redux, and Facebook's next toy, [ReasonML](https://facebook.github.io/reason/) are among a few. Static type checking, immutabillity and functional programming paradigms are among the things to expect in that outer space. But we've gone too far from our comfy jQuery shire, haven't we?

# Conclusion

Remember, every abstraction, every dependency comes at a cost. Start from the basics, learn the low-level APIs and gradually climb up the abstraction steps.

Recently I had to create a simple ["report a typo on a page"](https://github.com/psmb/typo-reporter) widget. I had to stop at Step 4, as adding a 3KB of virtual DOM on top of 2KB of my own code was just not worth it.

Even if you are developing a small 2KB widget and not a Facebook-like SPA, your code doesn't have to suck and you should not treat the decisions you take lightly.

P.S.: If you've gone this far, watch [this talk](https://www.youtube.com/watch?v=mVVNJKv9esE).
