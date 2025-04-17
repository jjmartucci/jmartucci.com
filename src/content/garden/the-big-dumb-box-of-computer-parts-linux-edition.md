---
title: "The Big Dumb Box of Computer Parts: Linux Edition"
description: "Putting together a Linux box in “The Year of the Linux Desktop” - 1."
image: "/garden/tux.jpg"
tags: ["blog", "hardware"]
created: 2024-12-17T12:00:00-0400
modified: 2025-04-16T08:50:14-0400
---
# The Big Dumb Box of Computer Parts: Linux Edition

![](/garden/tux.jpg)  
Let me start by saying this: I like Macs. I’m writing this on a Mac, I use a Mac every day for personal and work use, I have an iPad and an iPhone and a Watch and an Apple TV. I’m all in on the Mac ecosystem.  
_That said_, I get annoyed that computers have become these little precious things running operating systems that are tightly coupled to both their hardware and the services that run on them. Sometimes you want a big dumb box that can do computing tasks or serve files without asking you to sign into iCloud, or tell you about the latest improvements to Siri, or offer you a free month of Apple Music, or make you confirm 3 times that you understand that the thing you downloaded from the Internet could be malware.  
In the past, I’d build this "big dumb box" as a desktop PC and have it run Windows[1](#fn:1), usually doubling as a file server and a gaming PC, but these days Windows is an absolute dumpster fire of an operating system. So when I recently started reaching the limits of the external hard drive I had hooked up to my Mac Mini server, I decided to get a bigger hard drive, a big box, and stick Linux on it.

## Build Notes

I wanted this computer to:

1.  Be a full time [Plex](https://www.plex.tv) server, and run whatever other apps I wanted to play around with in a Docker container.
2.  Host network shared folders and run as a JBOD with parity drives[2](#fn:2).
3.  Bonus points if it could be a decent enough of a gaming rig to play some games I enjoyed on the Steam Deck at better FPS / higher resolution.

### The Hardware

I grabbed a bunch of stuff off of eBay.  
You might think I’m joking, but no, there’s so many cheap 4-ish-year-old parts out there these days that you can build an incredibly powerful machine for under $200. Mine was:

*   An AMD Ryzen 3400G build with 32GB of RAM and an ok A320 motherboard. It was about $100.
*   An Sapphire RX6600 GPU. Another $100. My early testing with running games on the 3400G was not impressive, so I figured why not try this.
*   The original box I bought had a case and power supply but both were ugly and bad, so I did splurge and get a [Cooler Master Qube Macaron Edition](https://www.coolermaster.com/en-global/products/qube-500-flatpack-macaron-edition/) because from what I could find it is both the smallest (and most adorable) case that can fit 4 3.5" hard drives[4](#fn:4). I replaced the power supply with a [Corsair RM850x](https://www.corsair.com/us/en/p/psu/cp-9020270-na/rmx-series-rm850x-fully-modular-power-supply-cp-9020270-na) because it seemed well reviewed, was gold rated, and most importantly, was on sale.
*   All of the 3.5" hard drives were coming from my long running collection, in different sizes and brands. This mish-mosh of drives is why I wanted a JBOD solution.

![Fits in with the pegboard-core aesthetic](/garden/qube.png)

### The operating system

There’s two paths you can go when building something like this:

1.  Run a Linux distro, run Docker containers through that.
2.  Run a server/NAS oriented OS (which… is gonna be some version of Linux), run virtual machines / docker containers on top of that.

On the surface those might not sound very different, but in terms of ease of setup and mainteance they can be vastly different. I tried both so you don’t have to!

#### Running with Pop\_OS!

There’s about 7000 Linux distros you can choose from, but I decided to give [Pop!\_OS](https://pop.system76.com) a try, because:

1.  It’s maintained by [system76](https://system76.com), a maker of Linux specific hardware, which I find laudable, and I assume means they have a vested interest in making the distro work well.
2.  It seemed to get generally good reviews in Linux communities and have some better out of the box support for Steam and gaming. Although it wasn’t relevant to me, they have an NVIDIA specific install for NVIDIA GPU owners, which is convenient.

If you have experience with Linux from years past, let me say this one important thing: **installing a Linux OS in 2024 is easier and works better out of the box than Windows**. The installer worked more reliably, I didn’t have to uncheck 14 boxes to keep my information private, there was no suggestion to enable an AI assistant, and on boot the GPU drivers were installed and worked.  
As far as getting the goals of this project going in Pop\_OS!

1.  I set up Plex and everything else with Docker via [Dockge](https://github.com/louislam/dockge).
2.  Network shares are as simple as enabling shared folders using the UI. The JBOD part can be accomplished with [mergerfs](https://github.com/trapexit/mergerfs) and [SnapRAID](https://www.snapraid.it)[5](#fn:5).
3.  AMD drivers worked right away. There is the silly Linux problem of “too much choice” in picking which installer to use for Steam[3](#fn:3), but after installation you toggle on Proton compatibility and most games work. [protondb](https://www.protondb.com) is a helpful source for figuring out any known issues.

So what’s wrong with this setup? Nothing. It comes down to how much overhead, both in terms of CPU/RAM usage, and in terms of system maintenance (updates and config changes) you want to manage on host OS more than anything. If I was using this computer regularly as a desktop, I think it would make sense, but considering most services I was looking to run could be run headless, there are better options.

#### Running with Unraid

[Unraid](https://unraid.net) has been around for a while, but I hadn’t heard of it until recently. It’s one of many NAS/Server oriented operating systems available today (see also: [Proxmox](https://www.proxmox.com/en/), [TrueNAS Core](https://www.truenas.com/truenas-core/), [openmediavault](https://www.openmediavault.org)). The basic idea is a a very small host OS than can serve files from shared folders, and also run virtual machines on top of it. Unraid is a little unique compared to the other options because:

*   Out of the box it’s built to work as a JBOD solution.
*   It can run Docker containers separate from virtual machines, which means you don’t need to spin up an initial VM to run containers out of.
*   They’ve abstracted a lot of the common homeserver uses cases into [apps](https://unraid.net/community) that are relatively easy to install and get running.

There were a few Unraid-specific gotchas I had to figure out when setting it up:

*   It’s not obvious from the UI how the initial storage array needs to be set up and how a cache drive should be allocated. Specifically:
    *   The drives need to be cleared to be added to the storage array, so don’t plan on bringing in drives with data already on them.
    *   You absolutely want a cache drive, although maybe not to actually store cache, but as the primary drive for the Docker containers and VMs. Otherwise (and this is obvious if you think about it), you’re trying to run containers/VMs off of 3.5" drives like it’s 1999 again.
*   If you want to run a VM off of the computer with full GPU and mouse/keyboard passthrough you need to boot and initially run the VM with VNC output until you install the GPU drivers on the VM’s OS. Then it works great!

Unraid has a free trial, but after that does [cost some money](https://unraid.net/pricing). For what it handles for you out of the box it seems worth it to me. Currently I have it configured as:

1.  The JBOD solution I wanted.
2.  All of the Docker containers I was running with Dockge on Pop\_OS! running on Unraid directly.
3.  A Windows 10 VM that I can boot into that’s connected to the monitor and keyboard/mouse in my office for Windows testing and… yes… gaming. While I was impressed by what Linux could do via Proton I figured if it was easy to run a Windows VM with passthrough that does nothing but run Steam, why not set it up.

## Conclusions

Here’s my final take on this: the appeal of the “big dumb computer box” is I _could_ do all of this. The OS didn’t tell me I needed special hardware to run it, I could decide tomorrow to put another 32GB of RAM in and it would take 10 minutes, if I decide I never want to use it for gaming I could pull the GPU and nuke the Windows VM, if I decide I want to run alllll the things on this I could find a CPU with more cores and go nuts and take the existing CPU / motherboard and turn it into a little baby dumb computer for some other purpose.  
Sometimes it’s good to remember what made computers fun and interesting in the first place.  
Also look at this guy, who wouldn’t want to run an OS with this guy.  
![](/garden/tuxwaddle.gif)

* * *

  
  

[1](#fnref:1): OK, I tried a bunch of variations of Linux, and maybe BeOS, and maybe a Hackintosh too....  

[2](#fnref:2): JBOD = “Just a bunch of disks”. Parity means there’s an additional disk that allows at least 1 disk in the array to fail without you losing all your data. When I ran a home server like this on Windows I’d use [StableBit DrivePool](https://stablebit.com/DrivePool). It’s a pretty good setup for data you either already have another backup of, or things that aren’t super critical but take up a lot of space.  

[4](#fnref:4): It was somewhat hard to find details online for the Qube 500 so let me add this: it can hold 4 3.5” hard drives, but in a bit of a wild configuration. One will be on the floor of the case, one mounted upside down on the top, one behind the motherboard tray, and one you’d need to repurpose the radiator mount to hold the hard drive. If you want a nice, clean, four-in-a-row kind of set up probably just go get a Fractal mid-tower.  

[3](#fnref:3): In Pop\_OS! it’s either a .deb or a [flatpak](https://flatpak.org) install, both through the Pop\_OS! store. The main hitch here is that if you’re running Proton you’re running the game via emulation, which the flatpak version has some issues with.  

[5](#fnref:5): Before actually getting mergerfs and SnapRAID set up I jumped over to Unraid. I don’t think it would have been hard, but it was the point at which I started thinking a server specific OS might be the way to go.