# Aryion Disinterest Filter Ultimate
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
  * Violentmonkey - Originally written for
  * Tampermonkey - Complains about some code, but works as intended

Please follow your userscript manager's instructions to install a userscript from URL, and copy this URL:
`https://github.com/157Studios/AryionDisinterestFilterUltimate/raw/main/AryionDisinterestFilterUltimate.user.js`

Alternatively, download the file [here](https://github.com/157Studios/AryionDisinterestFilterUltimate/raw/main/AryionDisinterestFilterUltimate.user.js) and import it into you userscript manager.

## Usage
This script will automatically block posts that contain blacklisted tags, or are posted by a blacklisted user. It will also add several buttons above the gallery box:
  * Temporarily Show Blocked Content - Will show all content that was hidden, applying a red border around each item. Turns into a self-explanitory "Hide Blocked Content" button after showing
  * Export Blocked Users and Tags to File - Downloads a JSON file containing all blacklisted users and tags for transfer to another browser
  * Import Blocked Users and Tags from File - Opens a file picker to choose a JSON file containing blacklisted users and tags exported earlier
  * Unblock User (Global List) - Shows a list of buttons corresponding to all users you have blocked, allowing you to unblock them
  * Unblock User (On this Page) - Shows a list of buttons corresponding to users on the current page that were blocked. Right now, this includes non-blocked users whose content was blocked only by tags

## Editing the configuration
Most userscript managers have a code editor. Click the edit button for the script to open it.

Config options look like:
```
/****CONFIG OPTIONS****/
  /**
  * Option to skip confirmation dialogs when blocking a user.
  *
  * @type {boolean} - true = show confirmation when blocking
  */
  var skipConfirmationDialog = false;

  /**
  * Option to always show a 'Block' button next to usernames or only show the button when hovered over
  *
  * @type {boolean} - true = only show buttons when mouse is hovered them, false = always shown buttons
  */
  var useMouseOverButtons = true;

  /**
   * Option to enable automated import of account blacklist tags.
   * This, when enabled, disables the import tags button.
   *
   * @type {boolean} - true = auto-import tags
   **/
  var autoImportBlacklist = true;

  /**
   * Custom string to prefix to the Blocked Items counter
   *
   * @type {string} - The prefix string to use. Note that whitespace is not added automatically
   **/
  var blockedCounterPrefix = "Blocked: "

  //Format of above and below:
  //{prefix}{counterValue}{suffix}
  /**
   * Custom string for the seperator
   * of counter value vs items on page
   * This is usually a slash
   *
   * @type {string} - The seperator string
   **/
  var blockedCounterSeperator = '/'
  /**
   * Custom string to suffix to the Blocked Items counter
   *
   * @type {string} - The suffix string to use. Note that whitespace is not added automatically
   **/
  var blockedCounterSuffix = ""

  /**
  * Option to debug the script via logging
  *
  * @type {boolean} - true = enable debug logs
  */
  var debug = true;
	
	
  /****END OF CONFIG OPTIONS****/
  ```
  
