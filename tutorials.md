---
layout: page
title: Tutorials
permalink: /tutorials/
---

#Never resolve a dependency chain again.  Vagrant for Developers (A Tutorial)
###By: Jon Staples
##Motivation

At the company where I work it is common to have interns with technology backgrounds come in to help with programming projects.
These interns usually can work their way around a terminal, and are familiar with a programming language, but do not necessarily know the python scientific computing stack (SciPy) or any of the services that my company uses on a regular basis.  Thus, usually the first thing we have to do is get the interns set up with our stack and on the same page before we begin working on the project in question.

###Enter my nightmare.

I recall quite vividly the experience of spending something like a week dealing with this scenario:

`"I've tried to install x, but I'm getting y error..." for y >= infinity`  

Anyone who has ever tried to install python libraries that have **fortran** or **c** dependencies (like basically every mathematical python library) on OSX, can appreciate what I'm talking about here.  

I wish I could say that this was an intern-centric scenario, but I'd be lying if I did.  I have lost days of potentially productive hours where my only goal was to **experiment** with a library that I believed could save my company time and money, only to be stymied be a seemingly endless stream of errors and dependency conflicts.

###Never again.

After this little whirlwind of angst and frustration I vowed that I would find a resolution to this problem.  This was a fundamental issue that needed to be eliminated as it was a waste of my, my company's, and our interns' time.

##Vagrant to the rescue

For those who are unfamiliar, [vagrant] is a virtual machine configuration utility that makes it fairly straightforward to
automate the installation of service stacks, libraries, and other utilities onto a "vagrant box" that can then be shared by passing the file manually, or by sharing it under a git-like service for vagrant boxes called [vagrant atlas].

With vagrant, a project lead, can share a fully configured *identical* environment between team members and reduce the dependency chain step to 
 
1. [Download/install virtualbox]
2. [Download/install vagrant]
3. Install whatever vagrant plugins (i.e. vagrant-aws) you may want (Vagrant can be used to easily, build and deploy AWS AMIs, but that's for another time.)

Some general benefits of using virtual environments are:

1. Disposable environments - Build, develop, destroy
2. Share identical environments among team members.
3. Eliminate dependency chain resolution for team members.
4. Create **identical** production and development environments.
5. Automate environment configuration.
6. Develop in your home environment of choice.


##The proof is in the pudding. (The actual tutorial part)

I'm going to keep this short and sweet because... well vagrant makes this short and sweet.  Code for Nashville's website is run on a static site generating service called Jekyll.  If you haven't done so already, make sure you:
 
1. [Download/install virtualbox]
2. [Download/install vagrant]

(At the time of writing this I am using Vagrant 1.7.2 with Virtualbox 4.3.24)

We are going to use vagrant to provide us a fully configured virtual machine running on debian to run our Jekyll service.

Do the following:

1. Create a `test` directory to house the vagrant configuration files.
2. Open up a terminal and navigate/`cd` into that directory.
3. Enter the following command `vagrant init -m vegardx/debian7-jekyll` - This will initialize an new vagrant project and create a new minimal 'Vagrantfile' with the box to be utilized already configured.
4. Open the vagrantfile and add `config.vm.network "forwarded_port", guest: 4000, host: 4000` underneath the line `config.vm.box = 'vegardx/debian7-jekyll'`- This handles the port forwarding configuration to make sure that the Jekyll server is accessible on your localhost ( **NOTE** : Make sure there is no service already running on localhost:4000)
5. Lastly, add the following:
```
config.vm.provision "shell", inline: <<-SHELL
    jekyll serve --host 0.0.0.0 --detach
  SHELL
```

What you should have at the end of this is the following Vagrantfile:

```
Vagrant.configure(2) do |config|
  config.vm.box = "vegardx/debian7-jekyll"
  config.vm.network "forwarded_port", guest: 4000, host: 4000 
  config.vm.provision "shell", inline: <<-SHELL
    jekyll serve --host 0.0.0.0 --detach
  SHELL
end
```

###Explained

The three major steps we've accomplished here are:

1.  We've defined a box to use: `vegardx/debian7-jekyll` (I just searched vagrant atlas for a jekyll box and found it.  Thanks vagardx!)
2. Opened up a port for our Jekyll service to run on (4000)
3. Added what is called in vagrant parlance a 'provisioner'.  Provisioners are a fairly rich subject, and this is a pretty trivial example of one, but the `config.vm.provision 'shell'` line of the config file tells vagrant to execute the following command once it has ssh'd into the virtual machine, in this case `jekyll serve --host 0.0.0.0 --detach` which starts up the jekyll server and detaches the service from the current terminal.

###Try it out.

With the Vagrantfile configured as above all you need do is type `vagrant up` in your console.

It will take some time from here, vagrant has to go locate the "vegardx/debian7-jekyll" box from vagrant-atlas, download it to your machine (will take a while), and will then proceed to setup the virtual machine (this will also take a while)

Once everything has completed, go to the [Jekyll server] on your local machine. You (hopefully) will have a generic 'Index Of' page that Jekyll provides by default as I omitted providing an example Jekyll project.
  
###Other stuff.

So this is really only the tip of the iceburg.  There is a rich set of things you can do using vagrant including writing custom provisioning scripts for your own vagrant box, building and deploying AWS AMI's, or creating a single base image for your team that all subsequent images inherit from are a few examples.

From here I'd recommend trying out `vagrant ssh`.  This will ssh you into the virtual machine you have created which you can explore from the terminal just like your own host machine.

When you're satisfied with that, exit the ssh session with `exit`.  You can shutdown the machine temporarily using `vagrant halt` (it can always be brought back up using `vagrant up`), or you could destroy the virtual machine and all traces of it using `vagrant destroy`, and remove the box you downloaded with `vagrant box remove vegardx/debian7-jekyll`.

Blam, from there you are back to the start, all traces of the box and virtual machine are gone and you have not cluttered up your own machine with a service install that you may or may not use, and you have not seeded your machine with a completely unforeseeable dependency conflict later down the road.

**NOTE**: If you are still playing with the box and have not destroyed it, note that after `vagrant halt && vagrant up` the jekyll service is no longer running.  This is because for the sake of this tutorial I choose to launch the service during startup.  You can run the same command again by using `vagrant provision` if the machine is live. 

##Why all of this? i.e. "Jekyll isn't that hard to install"

Why? Because nothing is universally easy to install. People have different operating systems, their systems have an entirely different state due to the programs that are installed on it, what is trivial for you is almost gauranteed to be a nightmare for someone else.
 
 What about when you have a custom service stack with complex configurations that you are trying to get a new team onboarded with?  Would you rather sit there and play 'It works on my local...', or have a version controlled, preconfigured, solid base environment fully ready to go out of the box? 


[Jekyll server]: http://localhost:4000
[vagrant]: http://docs.vagrantup.com/v2/why-vagrant/
[vagrant atlas]: https://atlas.hashicorp.com/
[Download/install vagrant]: http://www.vagrantup.com/downloads.html
[Download/install virtualbox]: https://www.virtualbox.org/wiki/Downloads

##Notes
- For those running into connection time out issues after running vagrant up check that virtual technologies are enabled within your BIOS on startup