ben
===

Ben (Build ENtertainment) is a build system written in JavaScript, initially for Java, eventually for other languages

Why?
====

Writing a build script in xml is just wrong.  No, its not configuration, it's scripting a build in xml that calls Java.
Besides that, Javascript is the most ubiquitous language of our time.


For building software, you need something that is sometimes procedural, sometimes modular, and sometimes object oriented.
Xml is none of those.


Also, Gradle is quite crap (for a bunch of reasons), and is based on a bunch of broken maven paradigms.
And it isn't Javascript.  Did I mention js is the most popular language of our time?  Hmm, I guess I did already.


Also, ben has ascii art.  So there.


Ben is very rough right now, but feature complete; it can build itself.
The simplest way this can be done is to run Ben#main from an IDE (idea files are included)

We will add an initial ant build, which will be replaced by a Ben one once its more stable.



How To Use
==========

It will get easier.  The plan is to have up-to-date installer for Debian based OS's first, then MacOS.
Right now you need Java 6 or 7 pre-installed.  I have tried it with Nashorn, there are still some issues in Nashorn.

For now:

Run Ben#main
Unzip ben/dist/ben.zip into a directory somewhere
add the unzipped directory to the path
then use ''ben'' or ''ben <filename>'' from the command line at the root of your project.

If you use ''ben'' without a file name, ben will first look for module.js.  If it can't find that, it'll use the
defaults set in the _module.js file (in the root of the ben.jar archive)



Backlog
=======

 - Decent docs
 - Dependency management nailed
    - There is a separate project called bentorrent that will give torrent sharing capabilities to libs
 - Installers for different OS's
 - Rolled out to other projects I'm working on
 - Refactor a chunk to make it a completely pull based build system (thus promise compatible)
 - Default targets needs to be added for javascript projects (easy way to package up modules etc)
 - Fix the broken weirdness of separating dependency management into Continuous Integration and many builds, using different technology, and different scripts / config.  The plan is to re-unify this.
