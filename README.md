# AryionDisinterestFilterUltimate
A userscript for Aryion.com (aka Eka's Portal) which allows you to block search results based on blacklists of tags and of users.

## About
The vore art website aryion.com, also known as *Eka's Portal*, while it has a system for blacklisting tags, that system functions in a very minimal way: all it does is add a banner across the thumbnail which says "**BLACKLIST**" and doesn't fully cover it, which means you will still see the contents of the bad art. The blacklist on Eka's Portal also only supports tags, not users, which is a problem when a particular user refuses to tag their work with correct tags, circumventing the filter.

Aryion Disinterest Filter Ultimate adds a system to completely hide posts with blacklisted tags, and also allows you to block usernames. This script is still work-in-progress, but development is slow. You are free to do whatever you want with this code, within GPL3.0 guidelines of course.

## Features
ADFU has the following features:
  * Block users
  * Block tags
  * Import tag blacklist from your account
    * Import tags automatically
    * This feature can be turned off by editing the config variables in the script
  * Alert if all posts on the page had to be blocked

## Installation
To install ADFU, you need a compatible userscript plugin. I have tested it with the following plugins:
  ### Chrome/Chromium-based browsers:
    * Violentmonkey
