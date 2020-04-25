---
layout: post
title:  "What You should Consider before Deploying an App with Code Splitting"
description: "The challenges I've faced deploying my first app with code splitting"
image: "https://user-images.githubusercontent.com/837032/80278193-fc3da380-86fc-11ea-810c-c7c7b92aa0f3.png"
tags: core-splitting, webpack, react
comments: true
---

![Some exceptions from Sentry](https://user-images.githubusercontent.com/837032/80278193-fc3da380-86fc-11ea-810c-c7c7b92aa0f3.png)

<p class="LeadParagraph" markdown="1">
Recently I had to publish my first ever PWA with code-splitting. Quite quickly I figured out I had no idea what I was doing... Maybe I am not the only one who didn't consider that deploying apps with code-splitting is not all that trivial.
</p>

**TL;DR**
Keep previously deployed JS chunks. If you can't, prefetch + force-update app on failed imports

## Some Context

Nowadays code splitting for JavaScript apps has become mainstream. It is trivial to achieve and dramatically improves initial load time for your app. Webpack provides code-splitting out of the box on dynamic imports.

Imagine you have a React web app and you would like `SomeVeryHeavyComponent` to be loaded only when the user navigates to that route. Here's how you would achieve it:

```js
const SomeHeavyComponent = React.lazy(
  () => import('./SomeHeavyComponent')
);
```

That's it. Webpack would extract it into a separate JS bundle so your app assets would look somehow like this:

```
main.a3e4.js <-- main bundle
0.ef23.js <-- 'SomeHeavyComponent' bundle
```

## The Issue

So far so good. But now comes the time to deploy our app to production. You build your app assets and put them to some static web hosting.
Users start using your app, perhaps installing it on their phone, if it is a PWA.
Then you discover a bug in your app. You quickly fix it, rebuild the app and put new assets online, replacing the old ones.

And here comes the boom! You start getting exceptions of this kind popping up in Sentry (you do monitor your JS apps, right?!):

```
ChunkLoadError (error: (built/0.ef23)
Loading chunk 6 failed. (error: https://your.app/built/0.ef23.js)
```

What happened? Somebody had the previous version of your app running in the browser (or cached with a service-worker). When navigating to the route that required `SomeHeavyComponent`, the app tried to load it and failed. Well of course, we removed those old assets and they are no longer available.

Had we had assets always named the same way (e.g. `0.js` instead of `0.ef23.js`), we would have gotten a different exception, along the lines of:

```
TypeError __webpack_require__(webpack/bootstrap)
Cannot read property 'call' of undefined
```

That happens because `SomeHeavyComponent` might have changed, and Webpack no longer finds what it expected to see in it.

Let's get this problem solved!

## Solution 1. Keep previous versions of assets

The only no-compromise solution is to keep all ever deployed assets forever (or at least for a long enough time). It would obviously help to prevent the aforementioned problem and keep the users happy.
There is a small consideration of disk space, but the way bigger problem is that most deployment tools just don't support such an approach.

For example, Vercel (ex. ZEIT) [claims](https://github.com/zeit/now/discussions/4140) that it is not what their users would expect.
On the contrary, AWS Amplify Console works correctly out of the box (though it performs considerably slower than Vercel both in terms of delivery and build times).

I would love to gather more data on what deployment platforms support keeping previously deployed assets available, so please comment if you know how other platforms behave in this regard.

You can always build a custom deployment pipeline that would support keeping previously deployed assets, but in many cases it is just not worths the effort.

Recap:
**PROS**: the most reliable solution
**CONS**: not many platforms support it out of the box

## Solution 2. Catch exceptions and force-reload app

If we can't afford to keep previous versions of assets deployed, we can at least catch those loading mistakes and force-reload the app. Since dynamic imports return just a Promise, it is very easy to do that:

```js
const SomeHeavyComponent = React.lazy(
  () => import('./SomeHeavyComponent')
     .catch(e => window.location.reload())
);
```

Of course, your app should be able to self update its service worker on reload. It is actually rather tricky to do it and it desires a dedicated article which I may right some day. For now read this Twitter thread: 

<blockquote class="twitter-tweet" data-lang="en" data-dnt="true"><p lang="en" dir="ltr">So people have asked me to share how to make sure your PWA automatically updates itself, even on <a href="https://twitter.com/hashtag/iOS?src=hash&amp;ref_src=twsrc%5Etfw">#iOS</a> 12 (which preserves the state of your app even when quitting it). Thread follows.</p>&mdash; Dmitri Pisarev 🇷🇺 (@dimaip) <a href="https://twitter.com/dimaip/status/1250009587866009601?ref_src=twsrc%5Etfw">April 14, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

But this approach has one serious down side: if your app is stateful, it would be hard to keep the app's state during force-update. E.g. imagine writing some Tweet and getting Twitter to force-reload on you, that would be a drama.

**PROS**: works with all deployment platforms
**CONS**: horrible UX for stateful apps
 
## Solution 3. Pre-cache all JS bundles with a service worker

Alternatively, another technique could be to pre-cache all JS bundles with a service worker on initial page load.

This technique is very easy to implement with Workbox, in just one line of code with the help of `workbox-webpack-plugin` Webpack Plugin:

```js
precacheAndRoute(self.__WB_MANIFEST);
```

It is usually a good idea to do prefetching in any case, the only consideration here is bandwidth. If your app is really large, are you sure your user would be happy you'd download all of its assets at once plus keep them in phone memory?

But this technique is not 100% reliable in preventing the aforementioned exceptions, so it should still be combined with the previously described technique of catching dynamic import exceptions.

**PROS**: prefetching makes sense in many cases anyways
**CONS**: does not conserve bandwidth

## Conclusion

I find it super strange that such a crucial topic of deploying web apps does not get enough attention. I sincerely hope that deployment platforms like Vercel will get their shit together and provide an option to keep previously deployed assets available. For the time being, some apps can get away with prefetching all JS chunks and reloading on dynamic exceptions.
