---
title: "Homeserver"
description: "Notes on setting up a Homeserver. I wrote about my build here: The Big Dumb Box of Computer Parts: Linux Edition."
tags: []
created: 2025-04-14T14:33:31-0400
modified: 2025-05-03T09:30:15-0400
---
# Homeserver

Notes on setting up a Homeserver. I wrote about my build here: [The Big Dumb Box of Computer Parts: Linux Edition](/garden/plant/the-big-dumb-box-of-computer-parts-linux-edition).

## Music

I used [dbPoweramp](https://www.dbpoweramp.com) to rip CDs. One issue I ran into was solved by this thread: [https://forum.dbpoweramp.com/forum/dbpoweramp/cd-ripper/38208-rip-error-over-and-over-again](https://forum.dbpoweramp.com/forum/dbpoweramp/cd-ripper/38208-rip-error-over-and-over-again)

## Installed Apps

*   krusader
*   Glance
*   Glances
*   homepage
*   kavita
*   lidarr
*   nginx-proxy-manager
*   overseerr
*   plex
*   prowlarr
*   radarr
*   romm
*   sabnzbd
*   sonarr
*   syncthing
*   [metube: Self-hosted YouTube downloader](https://github.com/alexta69/metube)

## Installed but gave up on

*   [Paperless](https://github.com/paperless-ngx/paperless-ngx).
*   [Shiori](https://github.com/go-shiori/shiori). App works nicely (outside of having some issues running behind nginx proxy manager) but I’ve found I just don’t save bookmarks like this.
*   [Calibre](https://calibre-ebook.com). Very, very janky UI. Use [calibre-web](https://github.com/janeczku/calibre-web) if you want/have a Calibre db.

## Apps of Note

Stuff I have seen while researching homeserver ideas but not yet installed or used.

*   [Vikunja](https://vikunja.io). Project and todo list management.

  

## Unraid VM usage

  

### Linux installs

I’ve tried both Mint and [Bazzite](https://bazzite.gg/), both distros worked more or less out of the box without too much tweaking. The one thing I could never seem to get to work is the motherboard bluetooth connecting to a controller. It would occasionally work, but searching around it seemed like this is not a VM issue so much as a Linux issue.

### Windows 11 VM Settings

I had a heck of a time getting Windows 11 set up. The final best settings seemed to be:

*   `Machine`: `Q35-9.1`
*   `Network Model`: `e1000`
*   Multifunction on for the GPU — there’s not a lot of great descriptions in the UI of what multifunction does here, but it essentially presents the GPU card as one device with video and sound outputs instead of two separate devices that could be rejected by the VM.
*   Find your GPU bios on [TechPowerUP](https://www.techpowerup.com/vgabios/) and select it when installing the VM. I didn’t need to do this for any Linux VM but not using it with a Windows VM meant the initial boot with the GPU passthrough had an extremely low resolution and it refused to correctly install the AMD drivers.

  

For no particular reason, look at this [cool project on Github](https://github.com/massgravel/Microsoft-Activation-Scripts).