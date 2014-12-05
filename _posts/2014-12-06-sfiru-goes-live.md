---
layout: post
title:  "SFI.ru goes live with Neos"
tags: typo3 neos
comments: true
---


So yeah, we have just launched a Neos project we have been working on for almost half a year -- the [website of St Philaret`s Christian Orthodox Institute](http://sfi.ru). I want to share with you the experience I have gained during this time, both technical and humanitarian.

![sfi.ru website](/assets/sfi.png)

###The team

But first, allow me to introduce to you our small team: 

* [Alexandra](https://www.facebook.com/alexandra.strotceva) -- a true monumental painting artist and our designer, copywriter and content strategist.
* [Sofia](https://www.facebook.com/sonya.androsenko) -- talented journalist, news writer, translator and just really smart person.
* [Natalia](https://www.facebook.com/profile.php?id=100002126400211) -- the Boss! Soon to become a PhD in Church History, one to ask about all sorts of scientific research questions, expert in Russian educational laws and an awesome person too!
* And [me](https://www.facebook.com/dimaip) -- mediocre frontender with love for all things beautiful, including Neos, since this summer.

###The Institute

We together are proud to be an information services team behind truly unique education center -- St' Philat's Christian Institute. It is the first free theological Institute in Russia, which neither belongs to the state nor to the official structures of the church, which allows it to be a centre of dialog between church and society.
I not only happen to work here, but also study, which helps me to overcome technological bias and adds some humanities to my narrow rationalistic mind :-)

So for all of us, me included, working on this project meant way more than a financial interest or a mere hobby. It was a strong passion backed up by moral reason, that our work promotes something that is so needed in crippled Russian society: the spirit of openness and dialog, social change and consolidation, in the view of Christ and His Church.

###The goal

The objectives of the website redesign were clear:
* Represent loads of legal and educational information in a clear way without frightening the user.
* Tell our story in simple words, that not only scientists or clergy would be able to understand. 
* Show the life of the Institute with the eyes of a student, try to bring in some of the spirit, that dwells a midst the walls of the Institute.

###How we worked

####Mobile first
There were a few things different about this project from any other project I had been a part of.
The first thing is that it was truly mobile-first. We did not have a desktop version 3 weeks before the release... And now I really understand what is at heart of mobile-first: constraints help you achieve simplicity, and once you have it for mobile you do not want to give it up for desktop. I dare say even if you don't have any mobile visitors, start with mobile, just for the sake of your desktop version to stay clear.

####We design a system of components, not pages
And yes, that's where Neos with its node repository really shines. We have built a styleguide with Neos, way before we had actual site itself. Through the styleguide we could track status of development of components, test both frontend and server-side parts and so on. Once I give it some polish I will publish it.
We had a long way with components, reducing the number of components into a solid system used throughout the site.
The main trick, as always, is with naming. I got a simple rule: do not invent semantics where there aren't any. If the role of a block is solely presentational, do name it 'Text with Image' and do not worry about it. However when there are domain-level semantics do not hesitate to highlight it in your code!

####Designer-to-developer collaboration
We shared responsibility for making many design decisions together. Design is not veneer, not what things look like, but it is how things work. I spent a lot of time reading some books on visual design and typography, while spending a lot of time explaining to Alexandra how certain technology actually works and giving a few HTML/CSS lessons.
Working in the same office is invaluable and I doubt I would ever agree to work on remote projects again.

###Gratitude
During these months I felt a real support from the Neos community, without which I might have given up quite early. The spirit of free sharing and humility among the core devs has really given me some breathing space and inspiration.
Our boss also got inspired by my stories of Neos community, and has given me permission to [publish all of the code we create here at SFI as open source](https://github.com/sfi-ru/Sfi.Sfi). I hope that complete practical examples of our production code would help some of you learn a few new tricks and solutions. Hope this would be a small way to pay back for all of the help I received from you guys (in addition to some of the issues I could fix in Neos while working at this project).


###This is only the beginning...

Yes, there are still bugs, quirks, and a whole lot of stuff not done. Yes, some things could have been done more professionally and in some areas our team is lacking expertise and experience. But I do feel confident about one thing: our site will succeed in its mission, because we dedicated a lot of love, care and thought to it, which we hope to continue to do towards all work God allows us to do here on Earth.
