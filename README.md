ben
===

Ben (Build ENtertainment) is a build system written in JavaScript, initially for Java, eventually for other languages


It's very rough right now, but feature complete; it can build itself.
The simplest way this can be done is to run Ben#main from an IDE (idea files are included)

We will add an initial ant build, which will be replaced by a Ben one once its more stable.

HowToUse
========

It will get easier.  The plan is to have up-to-date installer for Debian based OS's first, then MacOS.
Right now you need Java 6 or 7 pre-installed.  I have tried it with Nashorn, there are still some issues in Nashorn.

For now:

Run Ben#main
Unzip ben/dist/ben.zip into a directory somewhere
add the unzipped directory to the path



Backlog
=======

 - Decent docs
 - Dependency management nailed
    - There is a separate project called bentorrent that will give torrent capabilities to builds
 - Installers
 - Rolled out to other projects I'm working on
 - Default config added for javascript projects
