---
layout: post
title:  "Mounting remote partition over SSHFS in Linux"
tags: sshfs linux
comments: true
---

I've maderss a switch to linux in flavour of Elementary OS. My web development setup is super simple: 
Chromium + Sublime Text 3 + partition mounted from our dev server over SSHFS.

This post is more of a note to self on how to mount remote partitions.

## 1. Logging onto remote server via ssh keys

We will need to be able to login to remote server via ssh keys and not by password.

{% highlight bash %}
#generate keys
ssh-keygen # and hit enter at all prompts
#copy keys to remote server
ssh-copy-id USERNAME@SERVERADDRRESS
#try logging in
ssh USERNAME@SERVERADDRRESS
{% endhighlight %}

If you wasn't prompted for password and made a login successfully you are done with this.

## 2. Permanently mount remote partiation in fstab

{% highlight bash %}
#edit your fstab file
sudo vi /etc/fstab
{% endhighlight %}

And add this line to the end of fstab file:

{% highlight bash %}
sshfs#USERNAME@SERVERADDRRESS:/path /media/your_mount    fuse      user,_netdev,reconnect,uid=1000,gid=1000,follow_symlinks,identityfile=/home/USERNAME/.ssh/id_rsa,idmap=user,allow_other  0   0
{% endhighlight %}

{% highlight bash %}
#Install sshfs, if not already installed
sudo apt-get install sshfs
#make dir for mount point
sudo mkdir /media/your_mount
#Mount all partitions according to fstab file
sudo mount -a
{% endhighlight %}

As a result you get your remote file system mounted under `/media/your_mount`.

