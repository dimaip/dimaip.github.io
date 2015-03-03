---
layout: post
title:  "Hybrid deploy with Docker and Surf"
date:   2015-03-03 20:23:32
tags: docker deploy surf neos
comments: true
---

In the [previous article](http://dimaip.github.io/2014/12/20/three-steps-to-deploy/) I've written about three essential steps to modern deployment: code hosting with git and Github + contineous integration with CircleCI and Composer + contineous deployment with Surf.

I was quite happy with the results, but I knew I'd have one more problem to tackle...

**The problem**: modern projects require up-to-date server setup to perform well: fast-cgi PHP or even HHVM, tuned Nginx instance, Redis cache backend and so on. But in our case we have a hundred legacy projects lingering around our server which would be a hell to upgrade to use this latest software.

Who shall be our saviour from this dependency hell of old infrastructure? -- The buzzword of the day, 22 month old baby named Docker.

In this tutorial we will learn how to do simple multi-website hosting on one server, where each site will be running in an isolated container, and code deployments will be performed via Surf. Let's get started!

###1. Master the power of Docker

Read something about Docker, [docs](https://docs.docker.com/) is the good place to get started. Two main concepts to grasp: image and container.

Each Docker image is defined by Dockerfile. In this file you define a base image and things you'll do on top of it: you can run commands, add files to image and so on.

A solid example of Neos CMS Docker image is an [image created by Million12 guys](https://github.com/million12/docker-typo3-neos), not only is it full of cool features, but you can also learn a lot about Docker best practices from it.

Once you have written your Dockerfile, you need to build it: cd to the Dockerfile location and run `docker build -t 'me/my-project'`.

Once the image is built, you can spin up a container from it with `docker run -d -p 80:80 -t me/my-project`.

All the services your project requires like mysql or Redis should be run in separate containers, and started before your main app container. It's called a single responsibility principle -- each container should only run one service.

###2. Describe project environment with docker-compose

Spining all containers from command line and linking them together by hand is very boring and error prone, that's why I began using tool called [docker-compose](https://docs.docker.com/compose/) right from the start (originally called fig).

It allows you to describe  in a single file (`docker-compose.yml`) all of your containers needed for the project to work, and then run them all together with one command (`docker-compose up -d`).

###3. Things get cloudy -- Deploying docker containers from Docker Hub

Docker provides a very cool service for hosting your images in the cloud -- [Docker Hub](hub.docker.com).

It links to your code repository, where your Dockerfile is stored, and [automatically builds](http://docs.docker.com/docker-hub/builds/) your project image after each code change.

This way the only thing you need to start up the project is your `docker-compose.yml` -- copy it to new server, spin it up and Docker would automatically pull the latest image from the cloud on first start. It's a kind of magic.

###4. Hybrid deployment with Surf+Docker

By this moment we already have a pretty neat deployment workflow: 

1. Commit the code to repository. 
2. Image is automatically rebuilt in Docker Hub. 
3. Pull latest changes from Docker Hub and restart containers on server.

However convenient it may be, doing full container deploy for every small code change (like a CSS bugfix) sounds a bit of an overkill. Plus we already have a well-defined Surf workflow from a [previous tutorial](dimaip.github.io/2014/12/20/three-steps-to-deploy/), so why not use Surf together with Docker?

So we would use full Docker container re-deploy for big infrastructure changes (like adding Redis), and Surf for regular code commits.

For Surf to deploy code to our container, we must provide it with an ssh access. It's best to use a separate ssh container for that, which we can link with data volumes and databases from our app -- remember the single responsibility principle. Not to store your ssh password, we can use Github for authentication. Just provide it with your Github user id, and all hosts that have their keys stored in your Github account would be able to connect to your your Docker image without problem.

From Docker image we need to prepare directory structure for Surf on initial deployment, and then let Surf do its job. You can have a look at [my modification of M12's image](https://github.com/dimaip/docker-typo3-flow-neos-abstract) specificaly for this purpose.

###5. Routing

If we plan to run more then one app on the server, we should redirect a traffic based on host name to a particular container. There are many tools that allow you to automate it, but I decided to go with somethings really simple -- [docker-gen](https://github.com/jwilder/docker-gen). It reads information from running docker containers and creates any config files you need based on a template.
So let's put Nginx reverse proxy in front of our containers and let docker-gen [automatically configure Nginx](https://github.com/jwilder/nginx-proxy) for domain to internal container port mapping, based on DOMAIN context variable in each container.

###Summary

So this is how things work now:

1. Write a Dockerfile for your project and store it together with your code in Github.
2. Create an auto-build image for your project on Docker Hub. The image is built automatically and hosted in Docker Hub.
3. Write a `docker-compose.yml` file and define all your project dependencies like databases etc. Spin up all required services by typing `docker-compose up -d`.
4. Run Nginx as a reverse proxy in front of it. Route traffic based on VIRTUAL_HOST context variable.
5. Point your Surf deployment task (running on integration server like CircleCI or Jenkins) to your ssh container and do code-only deployments with Surf. If you need to re-configure the infrastructure, do full Docker deployment.
6. Setup things like auto container start on system startup, monitoring, regular backups etc.

###Next steps

There still remain a few things we haven't take care of.
The most important one is that we'll have about a minute of downtime when redeploying docker containers. If we are going to do mostly Surf deployments, and do container restart ones in a few months, a minute of downtime is probably OK. But still it's best take care of it. The steps to resolve it would be to start new container while the old one is still running, do a smoke-test on it and then stop and remove the old container. Not hard to do, just needs a bit of practice and automation.

Of course there are way more advanced setups than this like multi-host deployment, proper service discovery and other things like this. But if you need such advanced features, it's propably best to look in the direction of full-blown PaaS services like [Deis](http://deis.io/) or [Flynn](https://flynn.io/).

Now that I have this setup, I'm taking a break for at least half a year from this nifty subject of devops and do actual work: Design, CSS, Neos...
