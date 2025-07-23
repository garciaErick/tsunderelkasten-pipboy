---
title: 💾 Windows - Setup a clean install
created: 2025-05-09
dg-publish: true
dg-show-local-graph: false
description: How I do my windows clean install efficiently
tags:
  - how-to
  - setup
  - windows
aliases:
---
![[pasted-image-20250509130155.png]]
This is a WIP of what I install to my windows clean install and how to do it properly. The goal is to possibly do this every year, so trying to get this setup down to an hour.
```dataviewjs
const currentFile = dv.current().file;
const content = await dv.io.load(currentFile.path);
const lines = content.split("\n");

// Find headers
const headings = lines
  .map((line, index) => {
    const match = line.match(/^(#+)\s*(.+)$/);
    if (match) {
      return {
        level: match[1].length,
        text: match[2].trim(),
        line: index
      };
    }
    return null;
  })
  .filter(h => h);

// Build TOC items with indentation
const tocItems = headings.map(h => {
  const indent = "  ".repeat(h.level - 1); // Indent based on header level
  const link = dv.sectionLink(currentFile.path, h.text, false, h.text);
  return `${indent}- ${link}`; // Single bullet with indent
});

// Render TOC in one paragraph
dv.paragraph("## 📑 Table of Contents\n" + tocItems.join("\n"));
```

## 🪟 Windows Installation
### AtlasOS
[AtlasOS](https://atlasos.net/) is an Optimized Windows, designed for enthusiasts. Creating a "kinder" Windows experience. Reducing bloatware and optimizing performance for enthusiasts, gamers, and privacy-conscious individuals. 

Just follow their [Official install guide](https://docs.atlasos.net/getting-started/installation/), but in summary its just download an official Windows image, backup your files, backup your OEM drivers. Perform a regular windows install for the most part, then run the atlas playbook in the AME wizard. It can be done really fast, the only real bottleneck is your internet speed. 
![[pasted-image-20250509144512.png]]
### 💽 Hard Drives
![[pasted-image-20250509115240.png]]
#### 💿 C - OS Drive
For this buy the most expensive/fastest drive you can afford. It doesn't have to have much storage, I use a *Samsung SSD 960 PRO 512GB NVME*. Really just install the OS here, and the software you will install from WinUtil down below. Other than that I keep it mostly free, maybe install the ocassional game I want to load fast.
#### 📀 X - Storage Drive
Pick your poison for this one I chose a Samsung SSD 870 QVO 8TB. I usually have just two folders on the root of the drive
#### 💻 For Laptops or if you only have one hard drive
Replicates the C: (OS) and D: (Storage) drive setup on a laptop’s single drive using partitions for a clean, organized Windows install.
- **C: Size**: 250–300 GB (150–200 GB for 512 GB SSDs, up to 512 GB for 2 TB+).
- **Steps**: During AtlasOS install, create C: (e.g., 250 GB) and D: (remaining space) partitions, or post-install, use Disk Management/MiniTool Partition Wizard. Format D: as NTFS, set up `ok-to-delete` and `do-NOT-delete` folders.
##### 📁 ok-to-delete
This is basically anything that is OK to nuke after a clean install. I have the following folders:
* All downloads: Don't be a hoarder, nuke your downloads directory. If you store important stuff there you are doing it wrong.
* Games: Any game I don't install through steam such as any FitGirl repack. My main library is my Steam Library so its ok to nuke this directory.
* Google Drive: I use this for my obsidian sync, but the source of truth is in the cloud, so ok to delete
* Program Files: Any program not installed through WinUtil I typically install here.
##### 📁 do-NOT-delete
* ROMS Megathread: Literally all the videogames in existence LMAO
* Portable Software
	* SpaceSniffer
	* 8BitDo Ultimate Software
	* GuitarPro 8
* Pictures
* Recordings
* Software and Cracks: Mindful piracy 😆🏴‍☠️
* SteamLibrary: Ok so this is a game changer, you can basically nuke your PC then just point your new steam library here. You don't need to download anything else
## 💾 Software to Install 
The goal is to do the little work as possible and as fast as possible when trying to get back our system into the usual working state, while also keeping in mind principles of open source and light weight applications mindfully. We went through all the trouble of a clean install so we don't want to add to the fluff.
![[pasted-image-20250509131447.png]]
### WinUtil
Christ Titus' WinUtil is an open source app that allows for some awesome tweaks to your Windows. Its a staple in many installations. In our specific case since I installed **AtlasOS** which already heavily debloats Windows I opted for using WinUtil solely as a Ninite replacement. I installed the software below using WinUtil. 
![[pasted-image-20250509113744.png]]

To use the tool just paste the command below in powershell:
```powershell
irm "https://christitus.com/win" | iex
```
#### Anki (winget: Anki.Anki)
* [bitcast.ing](https://bitcast.ing/posts/2025/1/12/mpvacious-yomitan/)

#### ShareX (winget: ShareX.ShareX, choco: sharex)
Captures screenshots and records screens with annotation and sharing options. AtlasOS removes the windows one in favor for ShareX. 

I wanted to keep the same Win+Shift+S screenshot hotkey so first I unbound the windows hotkey using a registry key.
```
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced]
"DisabledHotkeys"="S"
```

Afterwards just bind that same hotkey in ShareX.
#### Obsidian (winget: Obsidian.Obsidian, choco: obsidian)
Organizes notes with markdown and links ideas in a graph-based system.
#### NVCleanstall (winget: TechPowerUp.NVCleanstall, choco: na)
Customizes NVIDIA driver installations to remove unwanted features. This for me is a game changer, no more NVIDIA app resetting my settings and displays.
#### HWiNFO (winget: REALiX.HWiNFO, choco: hwinfo)
Monitors system hardware, showing details like CPU, GPU, RAM, and temperatures.
#### WinMerge (winget: WinMerge.WinMerge, choco: winmerge)
Compares and merges text files and folders for developers and version control.
#### CopyQ (winget: hluk.CopyQ, choco: copyq)
Manages clipboard history, storing copied text and images for easy access.
#### Discord (winget: Discord.Discord, choco: discord)
Connects gamers and communities through voice, video, and text chat.
#### Foxit PhantomPDF (winget: Foxit.PhantomPDF, choco: na)
Edits and annotates PDF documents with advanced tools.
#### Microsoft Windows Terminal (winget: Microsoft.WindowsTerminal, choco: microsoft-windows-terminal)
Runs command-line tools like PowerShell and CMD in a customizable terminal.
#### Musescore (winget: Musescore.Musescore, choco: musescore)
Composes, edits, and plays sheet music for musicians.
#### Bitwarden (winget: Bitwarden.Bitwarden, choco: bitwarden)
Stores and autofills passwords securely across devices.
#### Steam (winget: Valve.Steam, choco: steam-client)
Buys, downloads, and plays video games on a gaming platform.
#### Git (winget: Git.Git, choco: git)
Tracks code changes and supports collaborative development.
#### Brave (winget: Brave.Brave, choco: brave)
Browses the web with privacy, blocking ads and trackers. Its just a better flavor of Chrome/Chromium, I am done with Google and tracking. If you need a search engine recommendation, I recommend [Startpage](https://www.startpage.com/).
#### Everything (winget: voidtools.Everything, choco: everything)
Searches files and folders instantly on your system. I am trying to replace my windows start menu with this instead.
#### Foxit Reader (winget: Foxit.FoxitReader, choco: foxitreader)
Views and annotates PDF files quickly and lightly.
#### SpaceSniffer (winget: UderzoSoftware.SpaceSniffer, choco: spacesniffer)
Visualizes disk space to find large files and folders. This just helps you find lost space, been using it for years.
#### VSCodium (winget: VSCodium.VSCodium, choco: vscodium)
Edits code in an open-source editor without telemetry. Just fuck all telemetry guys why does everything need to be so *smart*?
#### GitHub Desktop (winget: GitHub.GitHubDesktop, choco: git;github-desktop)
Manages Git repositories and GitHub projects with a simple interface.
#### Calibre (winget: calibre.calibre, choco: calibre)
Manages, converts, and reads e-books in various formats. Since I [jailbreak](https://www.youtube.com/watch?v=Qtk7ERwlIAk) my Kindle, Calibre will be very useful to sync my library wirelessly.
#### Google Drive (winget: Google.GoogleDrive, choco: googledrive)
Syncs and accesses files stored in Google Drive cloud storage.
#### NanaZip (winget: M2Team.NanaZip, choco: nanazip)
Compresses and extracts files like ZIP and RAR with a modern interface.
#### OBS
I'm trying to do more clips while gaming, so the objective is to setup OBS so it starts with windows ready to take 45 second clips when pressing the `F10` hotkey. 
##### Setup OBS startup
To do so simply press `win+R` then type in the dialog `shell:startup`, create/paste your obs shortcut and add the following parameters to the target:

```
"C:\Program Files\obs-studio\bin\64bit\obs64.exe" --startreplaybuffer --minimize-to-tray --disable-shutdown-check
```

This will make it so it always starts with windows silently and turns on the replay buffer. I chose `F10` for my hotkey. 
##### Settings > Output
![[pasted-image-20250509160034.png]]
##### Settings > Video
![[pasted-image-20250509160116.png]]
##### Settings > Hotkeys
![[pasted-image-20250509160137.png]]
##### Settings > Advanced
![[pasted-image-20250509160213.png]]
##### Scene
###### Camera 
Make sure to edit colors of the camera
###### Display capture
Check if checking force SDR makes colors look better.
### 🍫 Chocolatey
#### Mpv.io (Media player)
```powershell
choco install mpvio
```
##### Setup

##### Resources
* [bitcast.ing](https://bitcast.ing/posts/2025/1/12/mpvacious-yomitan/)
* [Mining from movies and TV-shows](https://tatsumoto-ren.github.io/blog/mining-from-movies-and-tv-shows.html#mpvacious)
* 
### ⚙️ Steam Library Software
#### Wallpaper Engine
Wallpaper Engine enables you to use live wallpapers on your Windows desktop. I just store this in my `X:\do-NOT-delete\SteamLibrary\steamapps\common\wallpaper_engine` and just keep adding to my collection. Its always refreshing to see some wallpapers in my CRT 📺
![[crt-wallpaper.png]]
* [Wallpaper Engine](https://store.steampowered.com/app/431960/Wallpaper_Engine/)
#### Aseprite
* [Aseprite](https://store.steampowered.com/app/431730/Aseprite/)
#### Borderless Gaming
Runs games in borderless windowed mode for better multitasking. Its the type of thing that you just set it and forget it... makes overall all games work better IMO. Can also setup CSGO to disable clicking outside the game... Jesus Christ!
* [Borderless Gaming on Steam](https://store.steampowered.com/app/388080/Borderless_Gaming/)
### Other Software
This software is not included in WinUtil so it had to be installed separately.
#### GuitarPro
I store this in my `X://do-NOT-delete/Portable Software` 
* [Guitar Pro - Tab Editor Software](https://www.guitar-pro.com/) You need a license
#### Launchbox
I bought a lifetime license for this and I love it, I even bought another license for android to play on my [Retroid Pocket 5 Handheld](https://www.goretroid.com/products/retroid-pocket-5-handheld). It is such a great piece of software, even if buggy. I basically just set up the portable launchbox installation in my `X://do-NOT-delete/Roms Megathread/Launchbox` and what you end up with is after each clean install you get your same Launchbox instance with all of your roms/emulators/settings configured. Take your time and build up your Emulation station, it is worth it.
![[pasted-image-20250509135926.png]]
* [LaunchBox Frontend for Emulation](https://www.launchbox-app.com/)