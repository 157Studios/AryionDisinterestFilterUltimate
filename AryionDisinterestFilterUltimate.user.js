 // ==UserScript==
// @name         Aryion Disinterest Filter Ultimate
// @namespace    https://github.com/157Studios/AryionDisinterestFilterUltimate
// @description  Filter out artists, and tags you don't like on Aryion.com
// @author       VA145
// @version      1.4.0
// @encoding     utf-8
// @licence      https://raw.githubusercontent.com/???/LICENSE
// @homepage     https://github.com/157Studios/AryionDisinterestFilterUltimate
// @supportURL   https://github.com/157Studios/AryionDisinterestFilterUltimate/issues
// @updateURL    https://github.com/???.user.js
// @downloadURL  https://github.com/???.user.js
// @match        http://aryion.com/g4/*
// @match        https://aryion.com/g4/*
// @exclude-match http://aryion.com/g4/view/*
// @exclude-match https://aryion.com/g4/view
// @grant        none
// old require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js
// ==/UserScript==

(function() {
	'use strict';
  //alert("I am alive!");
	/**
	 * Option to skip confirmation dialogs when blocking a user.
	 *
	 * @type {boolean} - true = show confirmation when blocking
	 */
	var skipConfirmationDialog = false;

	/**
	 * Option to disable MouseOver-Buttons and use all-time shown buttons
	 *
	 * @type {boolean} - true = only show buttons when mouse is hovered them, false = always shown buttons
	 */
	var useMouseOverButtons = true;

  /**
   * Option to enable automated import of account blacklist tags.
   * This, when enabled, disables the import tags button
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

  /*
   * Posts an alert if Xdebug is true
   *
   * @param {data} message - Data to show in the alert
   **/

  function dAlert(message) {
    if(Xdebug)
      alert(message);
  }

  var Xdebug = false;

  dAlert('Option variables: \n  skipConfirmationDialog:'+skipConfirmationDialog+'\n  useMouseOverButtons:'+useMouseOverButtons+'\n  autoImportBlacklist:'+autoImportBlacklist+'\n  blockedCounterPrefix:'+blockedCounterPrefix+'\n  blockedCounterSuffix:'+blockedCounterSuffix);

	/**
	 * Contains all users we have blocked
	 *
	 * @type {Array} - All blocked Users
	 */
	var badUserList = [];

	/**
	 * Contains tags that are blocked.
	 *
	 * @type {Array} - All blacklisted tags
	 */

  var badTagList = [];

	/**
	 * Keep track of which users we've actually hidden, so we can display unblock buttons for them.
	 *
	 * @type {Array} - Currently hidden Users
	 */
	var currentUserHiddenList = [];

	/**
	 * DON'T CHANGE! Contains the value if you want to see blocked content (Changes via button action)
	 *
	 * @type {boolean} - true shows blocked content
	 */
	var showBlockedContent = false;

  /******************************
   * Inject script into webpage
   ******************************/
  /* function hook() {
     logAdd("Hooked into webpage");
     alert("We have hooked into the page! Variable bltags first entry: " + window.blTags[1]);
   }

  var scriptHook = document.createElement('script');
  //scriptHook.appendChild(document.createTextNode('('+hook+')();'));
  scriptHook.appendChild(document.createTextNode('alert(blTags);'))
  (document.body || document.head || document.documentElement).appendChild(scriptHook);
  */

  //Attempt to get window variables
  /**
   * Retrieves variables from the webpage as an object
   *
   * @param {Array} variables - Array containing variable names as strings
   **/

  /*function retrieveWindowVariables(variables) { var ret = {}; var scriptContent = ""; for (var i = 0; i < variables.length; i++) { var currVariable = variables[i]; scriptContent += "if (typeof " + currVariable + " !== 'undefined') $('body').attr('tmp_" + currVariable + "', " + currVariable + ");\n" } var script = document.createElement('script'); script.id = 'tmpScript'; script.appendChild(document.createTextNode(scriptContent)); (document.body || document.head || document.documentElement).appendChild(script); for (var i = 0; i < variables.length; i++) { var currVariable = variables[i]; ret[currVariable] = $("body").attr("tmp_" + currVariable); $("body").removeAttr("tmp_" + currVariable); } $("#tmpScript").remove(); return ret; }

  var ep = retrieveWindowVariables(['blTags']);
  console.log(ep.blTags);
  alert("Blacklist tags from page: " + ep.blTags[1]);
  */

  //Final attempt
  var blsTags = window.blTags
  dAlert('blsTags:'+blsTags);

	/**
	 * Resets the current Block User List
	 */
  dAlert("147 Create function resetCurrentBlockUser");
	function resetCurrentBlockUser() {
    dAlert('resetCurrentBlockUser() called');
		currentUserHiddenList = [];
	}

	/**
	 * Save the bad user list to local storage.
	 */
  dAlert('155 Create function saveData');
	function saveData() {
    dAlert('saveData() called');
	  try {
      localStorage.setItem('whtb-blocklist', badUserList.join());
		  localStorage.setItem('whtb-taglist', badTagList.join());
      //alert(badTagList.join());
    } catch(e) {
      logAdd("Error while saving: " + e);
      logAdd('We tried to save userlist: '+badUserList);
      logAdd('We tried to save taglist: '+badTagList)
    }

	}

	/**
	 * Load the bad user list from local storage.
	 */
  dAlert('172 Create function loadData');
	function loadData() {
    dAlert('loadData() called');
		var loadedList = localStorage.getItem('whtb-blocklist');
		var loadedTagList = localStorage.getItem('whtb-taglist');
		logAdd('Loading Block-List');

		// Handle if list doesn't exists
		if(loadedList !== null) {
		    badUserList = loadedList.split(',');
		} else {
		    badUserList = []
		}
		if(loadedTagList !== null) {
		    badTagList = loadedTagList.split(',')
		} else {
		    badTagList = []
		}




		// Show Loaded User in Log
		for(var i = 0; i < badUserList.length; i++)
			logAdd('Loaded bad user: ' + badUserList[i]);

		for(var i = 0; i < badTagList.length; i++)
		  logAdd('Loaded bad tag: ' + badTagList[i]);
	}

	/**
	 * Block a user by name.
	 *
	 * @param {string} username - Username to block
	 */
  dAlert('206 Create function blockUser');
	function blockUser(username) {
    dAlert('blockUser('+username+') called');
		// Check if User is already in list
		if(badUserList.indexOf(username) !== -1) {
			refreshPage(); // Reload to remove wrong buttons that may cause this case
			return;
		}

		// Add User and save
		badUserList.push(username);
		refreshPage();
		saveData();
	}

	/**
	 * Block a tag by name
	 *
	 * @param {string} tagnane - Tag to block
	 */
  dAlert('225 Create function blockTag');
	function blockTag(tagname) {
    dAlert('blockTag('+tagname+') called');
	  if(badTagList.indexOf(tagname) !== -1) {
			refreshPage(); // Reload to remove wrong buttons that may cause this case
			return;
		}

		// Add Tag and save
		badTagList.push(tagname);
		refreshPage();
		saveData();
	  }

	/**
	 * Unblock a user by name.
	 *
	 * @param {string} username - Username to unblock
	 */
  dAlert('243 Create function unblockUser');
	function unblockUser(username) {
    dAlert('unblockUser('+username+') called');
		var index = badUserList.indexOf(username);

		// Check if User is in list
		if(index === -1) {
			refreshPage(); // Reload to remove wrong buttons that may cause this case
			return;
		}

		badUserList.splice(index, 1);
		refreshPage();
		saveData();
	}

		/**
	 * Unblock a tag by name.
	 *
	 * @param {string} tagname - Tag to unblock
	 */
  dAlert('263 Create function unblockTag');
	function unblockTag(tagname) {
    dAlert('unblockTag('+tagname+') called');
		var index = badTagList.indexOf(tagname);

		// Check if User is in list
		if(index === -1) {
			refreshPage(); // Reload to remove wrong buttons that may cause this case
			return;
		}

		badTagList.splice(index, 1);
		refreshPage();
		saveData();
	}

	/**
	 * Detect if the haystack starts with needle this function is case insensitive
	 *
	 * @param {string} haystack - String to check
	 * @param {string} needle - Start string on haystack
	 * @returns {boolean} - true if haystack starts with needle
	 */
  dAlert('285 Create function stringStartWith');
	function stringStartWith(haystack, needle) {
    dAlert('stringStartWith('+haystack+', '+needle+') called');
    dAlert('stringStartWith: Result: '+haystack.toLowerCase()+haystack.toLowerCase().indexOf(needle.toLowerCase()) + ' === 0 is ' + haystack.toLowerCase().indexOf(needle.toLowerCase()) === 0);
		return haystack.toLowerCase().indexOf(needle.toLowerCase()) === 0;
	}

	/**
	 * Displays a message on the console if debug is enabled
	 *
	 * @param {string} message - Message to add
	 */
  var logList = []
  dAlert('296 Create function logAdd');
	function logAdd(message) {
		if(debug) {
			console.log(message);
      logList.push(message);
    }
	}


  /**
   * Imports blacklisted tags from the user's account from the variabke inside the webpage
   **/
  dAlert('308 Create function importTags');
  function importTags() {
    if(! autoImportBlacklist) {
      if(blsTags.length < 1) {
        if(! confirm('You are not signed in to Aryion.com or your account doesn\'t appear to have any blacklisted tags. Continue importing?'))
          return;
      } else if(badTagList.length > 0) {
        if(! confirm('Importing tags from your account will overwrite the tags stored for this script. Continue importing?'))
          return;
      }
    }
    badTagList = blsTags;
    dAlert('importTags: blsTags = '+blsTags);
    dAlert('importTags: Also, badTagList = '+badTagList);
    saveData();

    if(! autoImportBlacklist) {
      alert('Successfully imported ' + badTagList.length + ' tags from your account.')
    } else {
      dAlert('importTags: auto imported ' + badTagList);
    }
  }

	/**
	 * Imports Data from a JSON-String
	 *
	 * @param {Object|String} importJSON - Imported JSON-Object/String
	 */
  dAlert('331 Create function importData');
	function importData(importJSON) {
    dAlert('importData('+importJSON+') called');
		var newListUsers = [];
		var newListTags = [];

		try {
			importList = JSON.parse(importJSON);
			newListUsers = importList.badUsers;
      newListTags = importList.badTags;
		} catch(e) {
			alert('Error: Your browser doesn\'t support JSON-Methods...');

			return;
		}

		// Warn user on specific behaviours
		if(newListUsers.length < 1 && newListTags.length < 1) {
			if(! confirm('WARNING: The list file you are importing is empty or invalid. Continuing will wipe your existing list clean. Continue?'))
				return;
		} else if(badUserList.length > 0 || badTagList.length > 0)
			if(! confirm('WARNING: The list file to be imported will overwrite your current one. Continue?'))
				return;

		// Save new List
		badUserList = newListUsers;
		badTagList = newListTags;
		saveData();

		alert('Successfully imported ' + badUserList.length + ' Users and ' + badTagList.length + ' Tags from File');
	}

	/**
	 * Exports the Blocked-User-List to an JSON-File
	 */
  dAlert('365 Create function exportData');
	function exportData() {
    dAlert('exportData() called');
		var jsonExport = '';
	//	var jsonExport2 = '';

		try {
			jsonExport = JSON.stringify({"badUsers":badUserList, "badTags":badTagList});
		//	jsonExport2 = JSON.stringify({"badTags":badTagList});
		} catch(e) {
			alert('Error: Your browser doesn\'t support JSON-Methods...');

			return;
		}

		var fileBlob = new Blob([jsonExport], {type: 'text/plain'});
		var blobUrl = window.URL.createObjectURL(fileBlob);

		// Download
		var a = document.createElement('a');
		a.style.display = 'none';
		a.href = blobUrl;
		a.download = 'EkasDisinterestFilterPlusExport.json';
		a.innerHTML = 'Download Exported File';

		/**
		 * Removes this Element from HTML-Document
		 *
		 * @param {Object} ev - Event-Object
		 */
		a.onclick = function(ev) {
			document.body.removeChild(ev.target);
		};

		document.body.appendChild(a);
		a.click();

		// Clear Memory
		window.URL.revokeObjectURL(blobUrl);
		fileBlob = null;
	}

	/**
	 * Creates a UnBlock button with assigned OnClick function
	 *
	 * @param {string} username - Username of the UnBlock-User for this Button
	 * @returns {Element} - UnBlock-Button
	 */
  dAlert('412 Create function createUnBlockButton');
	function createUnBlockButton(username) {
    dAlert('createUnBlockButton('+username+') called');
		var restoreButton = document.createElement('button');
		restoreButton.type = 'button';
		restoreButton.innerHTML = username;

		/**
		 * Adds the unblockUser function to this Button
		 */
		restoreButton.onclick = function() {
			if(skipConfirmationDialog || confirm('Do you wish to unblock ' + username + '?'))
				unblockUser(username);
		};

		return restoreButton;
	}

	/**
	 * Creates a Block button with assigned OnClick function
	 *
	 * @param {string} username - Username of the Block-User for this Button
	 * @param {boolean} displayName - Display the Name on the button? Default is true
	 * @returns {Element} - BlockButton
	 */
  dAlert('436 Create function createBlockButton');
	function createBlockButton(username, displayName) {
    dAlert('createBlockButton('+username+', '+displayName+') called');
		var hideButton = document.createElement('button');
		hideButton.type = 'button';
		displayName = (typeof displayName === 'undefined') ? true : displayName;

		if(displayName)
			hideButton.innerHTML = 'Block ' + username;
		else
			hideButton.innerHTML = 'Block';

		hideButton.className = 'whtb-block-button';

		/**
		 * Adds the blockUser function to this Button
		 */
		hideButton.onclick = function() {
			if(skipConfirmationDialog || confirm('Are you sure you want to block ' + username + '?'))
				blockUser(username);
		};

		return hideButton;
	}

	/**
	 * Creates a button to show/hide the hideElement
	 *
	 * @param {Element} hideElement - Element to Hide/Show
	 * @returns {Element} - Show/Hide Button
	 */
  dAlert('466 Create function createShowHideButton');
	function createShowHideButton(hideElement) {
    dAlert('createShowHideButton() called');
		var showHideButton = document.createElement('button');
		showHideButton.type = 'button';

		// Initial text depends on status of the element
		if(hideElement.style.display === 'none')
			showHideButton.innerHTML = 'Show';
		else
			showHideButton.innerHTML = 'Hide';

		/**
		 * Hide/Shows the Element also changes the Text on the Button
		 */
		showHideButton.onclick = function() {
			if(hideElement.style.display === 'none') {
				hideElement.style.display = '';
				this.innerHTML = 'Hide';
			} else {
				hideElement.style.display = 'none';
				this.innerHTML = 'Show';
			}
		};

		return showHideButton;
	}

	/**
	 * Creates a button that allow you temporary show blocked content
	 *
	 * @returns {Element} - Temp show all Button
	 */
  dAlert('498 Create function createShowContentButton');
	function createShowContentButton() {
    dAlert('createShowContentButton() called');
		var button = document.createElement('button');
		button.type = 'button';
		button.className = 'whtb-button-reshow-blocked-content';

		// Initial text depends on the status of showBlockedContent
		if(showBlockedContent)
			button.innerHTML = 'Hide blocked content';
		else
			button.innerHTML = 'Temporarily show blocked content';

		/**
		 * Switches the option if blocked content will be shown or not
		 */
		button.onclick = function() {
			if(showBlockedContent) {
				showBlockedContent = false;
				this.innerHTML = 'Temporarily show blocked content';
			} else {
				showBlockedContent = true;
				this.innerHTML = 'Hide blocked content';
			}

			// Refresh the page to update the content
			refreshPage();
		};

		return button;
	}

	/**
	 * Creates an Export-Button
	 *
	 * @returns {Element} - Export Button
	 */
  dAlert('534 Create function createExportButton');
	function createExportButton() {
    dAlert('createExportButton() called');
		var button = document.createElement('button');
		button.type = 'button';
		button.className = 'whtb-button-export';
		button.innerHTML = 'Export Blocked Users and Tags to File';

		/**
		 * Downloads a JSON-File with all currently blocked users
		 */
		button.onclick = function() {
			exportData();
		};

		return button;
	}

	/**
	 * Creates an Import-Button
	 *
	 * @returns {Element} - Import Button
	 */
  dAlert('556 Create function createImportButton');
	function createImportButton() {
		var button = document.createElement('button');
		button.type = 'button';
		button.className = 'whtb-button-import';
		button.innerHTML = 'Import Blocked Users and Tags from File';

		/**
		 * Downloads a JSON-File with all currently blocked users
		 */
		button.onclick = function() {
			var inputFile = document.createElement('input');
			inputFile.style.display = 'none';
			inputFile.type = 'file';
			inputFile.accept = 'text/*';
			inputFile.click();
			/**
			 * Process the Files
			 */
			inputFile.onchange = function() {
				if(inputFile.files.length < 1)
					return;

				var reader = new FileReader();
				/**
				 * Reads the File and import its Content
				 */
				reader.addEventListener('load', function() {
					importData(this.result);

					// Refresh the Page and remove this element
					refreshPage();
					inputFile.remove();
				}, false);

				reader.readAsText(inputFile.files[0]);
			};
		};

		return button;
	}

  /**
   * Creates a button to import tags from the user's aryion.com account.
   *
   * @returns {Element} - Import Tags Button
   **/
  dAlert('603 Create function createTagImportButton');
  function createTagImportButton() {
    dAlert('createTagImportButton() called');
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'whtb-button-tag-import';
    button.innerHTML = 'Import Tag Blacklist from Account';

    /**
     * Sets this scripts variable badTagList to match the page's blTags
     **/
    button.onclick = function() {
      importTags();
    }

    return button;
  }

  /**
   * Creates a simple text display showing the number of blocked elements on the page
   *
   * @param {integer} value - What value to display
   * @returns {Element} - Blocked items counter
   **/
  dAlert('626 Create function createBlockedCounterDisplay');
  function createBlockedCounterDisplay() {
    dAlert('createBlockedCounterDisplay() called');
    var counter = document.createElement('div');
    counter.type = 'div';
    counter.className = 'whtb-blocked-counter';
    counter.innerHTML = blockedCount + '/' + itemsOnPage + " Blocked (init)";

    return counter;
  }

  /**
   * Refreshes the counter for number of blocked items
   **/
  dAlert('639 Create function refreshBlockedCounter');
  function refreshBlockedCounter() {
    dAlert('refreshBlockedCounter() called');
    var counterItem = document.getElementsByClassName('whtb-blocked-counter');
    //alert("Beginning refresh...")
    if(counterItem.length < 1){
      //alert("Failed to refresh counter")
      return;
    }
    logAdd("Refreshing counter...");
    //alert(blockedCounterPrefix + blockedCount + blockedCounterSuffix);
    counterItem = counterItem[0]
    counterItem.innerHTML = blockedCounterPrefix + blockedCount + blockedCounterSeperator + itemsOnPage + blockedCounterSuffix;
  }

	/**
	 * Check if a unlock Button-container is available if not create it
	 *
	 * @param {string} className - Class Name of the unlock Button-Container
	 * @param {NodeList|Element} insertBefore - The element where to place the Button-Container(before element)
	 * @param {string} text - Text to describe the Content
	 * @returns {Element} - The unlock Button-Container
	 */
  dAlert('661 Create function unlockButtonContainer');
	function unlockButtonContainer(className, insertBefore, text) {
		dAlert('unlockButtonContainer('+className+', '+insertBefore+', '+text+') called');
    var unblockButtonBox = document.getElementsByClassName(className);

		if(unblockButtonBox.length === 0) {
			var newUnblockButtonBox = document.createElement('div');
			var unblockButtonArea = document.createElement('div');

			unblockButtonArea.style.display = 'none';
			newUnblockButtonBox.className = className + ' g-box';
			newUnblockButtonBox.innerHTML = text;
			newUnblockButtonBox.style.padding = '2px 4px';
			newUnblockButtonBox.style.margin = '3px 0';
			newUnblockButtonBox.appendChild(createShowHideButton(unblockButtonArea));
			newUnblockButtonBox.appendChild(unblockButtonArea);
			insertBefore.insertBefore(newUnblockButtonBox, insertBefore.firstChild);

			return unblockButtonArea;
		}

		return unblockButtonBox[0].getElementsByTagName('div')[0];
	}

	/**
	 * Creates UnBlock-Buttons from User Array
	 *
	 * @param {Array} userArray - Array with User Names
	 * @param {Element} addToEl - Element where the Buttons go as child
	 */
  dAlert('690 Create function createUnblockButtonListFromArray');
	function createUnblockButtonListFromArray(userArray, addToEl) {
		// Clear Element first to avoid double buttons
		dAlert('createUnblockButtonListFromArray('+userArray+', '+addToEl+') called');
    addToEl.innerHTML = '';

		// Sort by ABC
		userArray.sort();

		for(var i = 0; i < userArray.length; i++) {
			if(userArray[i]) { // Handle empty spots in some arrays.
				var restoreButton = createUnBlockButton(userArray[i]);
				addToEl.appendChild(restoreButton);
			}
		}
	}

  /**
   * Checks input string of comma+space delimited list if it contains a prohibited tag and returns true if it does
   *
   * @param {string} tagstr - String containing ", " delimited list of tags
   * @returns {Boolean} - Whether it found a bad tag.
   */
  dAlert('712 Create function containsBadTag');
  function containsBadTag(tagstr) {
    var currentTags = [];
    if(tagstr === null) {
        logAdd('Note: tagstr was null');
        return false;
    }
    currentTags = tagstr.split(', ');
    for(var i=0;i<badTagList.length;i++) {
      if(currentTags.indexOf(badTagList[i]) !== -1) {
        logAdd("Found bad tag '" + badTagList[i] + "' in tagstr " + tagstr);
        return true;
      }
    }
    logAdd("Did not find any bad tags in tagstr " + tagstr);
    return false;
  }

	/**
	 * Remove all existing Buttons with the specified class name
	 *
	 * @param {string} className - Class Name of the Button(s)
	 */
  dAlert('735 Create function removeExistingButtons');
	function removeExistingButtons(className) {
		var existingButtons = document.getElementsByClassName(className);

		while(existingButtons.length > 0)
			existingButtons[0].parentNode.removeChild(existingButtons[0]);
	}

	/**
	 * Hide blocked User-Content and add a block button to non blocked User-Content
	 *
	 * @param {Document|Element} element - Content-Element
	 * @param {boolean} mouseOverButtons - Use mouse over buttons
	 */
  dAlert('749 Create function handleItem');
	function handleItem(element, mouseOverButtons) {
    dAlert('handleItem('+element+', '+mouseOverButtons+') called');
		var userLink = element.getElementsByClassName('user-link');
    //var galleryItem = element.getElementsByClassName('gallery-item');
    var elemTags = element.getAttribute("title");
    logAdd("Read tags: " + elemTags);
    //alert('userlink length: '+userLink.length);
		if(userLink.length === 0) {
      dAlert('handleItem: userLink === 0 is true');
			return;
    }
		// Get UserLink and Username
		userLink = userLink[0];
		var username = userLink.innerHTML;
    dAlert('handleItem: userLink.innerHTML = ' + username);

		// Hide if user is in list
    //alert('user '+username+' is listed: '+badUserList.indexOf(username) !== -1 +', bag tag:'+ containsBadTag(elemTags));
		if(badUserList.indexOf(username) !== -1 || containsBadTag(elemTags)) {
      blockedCount++;
      dAlert('handleItem: Checking to hide item: Is user on list?' + badUserList.indexOf(username) !== -1 + '. Contains bad tag?' + containsBadTag(elemTags));
      //alert('Search if post, titled "'+element.getElementsByClassName('item-title')[0].innerHTML+'" blocked, user '+username+' blocked? '+(badUserList.indexOf(username) !== -1 )+'. Bad tag found? '+(containsBadTag(elemTags)))
      if(showBlockedContent) {
				element.style.display = '';
				element.style.backgroundColor = 'rgba(170, 0, 0, 0.13)';
				element.style.border = '4px solid #FF0000';
			} else
				element.style.display = 'none';

			// Add to current block list if not in there
			if(currentUserHiddenList.indexOf(username) === -1)
				currentUserHiddenList.push(username);
		} else { // Show Block-Button
			var hideButton;
			element.style.display = '';
			// Remove if there is some left from temp shown content
			element.style.backgroundColor = '';
			element.style.border = '';

			// Add Button
			if(mouseOverButtons) {
				hideButton = createBlockButton(username, false);
				hideButton.style.display = 'none';
				userLink.parentElement.insertBefore(hideButton, userLink.nextSibling);

				/**
				 * Makes Block-Button visible
				 */
				element.onmouseover = function() {
					var blockButton = this.getElementsByClassName('whtb-block-button')[0];
					blockButton.style.display = 'inline-block';
				};

				/**
				 * Makes Block-Button invisible if Mouse go out
				 */
				element.onmouseout = function() {
					var blockButton = this.getElementsByClassName('whtb-block-button')[0];
					blockButton.style.display = 'none';
				}
			} else {
				hideButton = createBlockButton(username, true);

				// Stick this right next to the username.
				userLink.parentElement.insertBefore(hideButton, userLink.nextSibling);
			}
		}
	}

	/**
	 * Refresh OUR data on the page. (Doesn't cause an actual page request.)
	 */
  var blockedCount = 0;
  var itemsOnPage = 0;
  dAlert('817 Create function refreshPage');
	function refreshPage() {
    dAlert('refreshPage() called');
		logAdd('Refresh Page...');
		resetCurrentBlockUser();
    blockedCount = 0;

		// Check the function we need to build or stuff in use the <title> content to check
		dAlert('refreshPage: Check with multiple if statements value of document.title: '+document.title);
    if(stringStartWith(document.title, 'g4 :: Latest Updates'))
			refreshSiteByParam('g-box-contents', 0, 'detail-item', false);

		if(stringStartWith(document.title, 'g4 :: Messages'))
			refreshSiteByParam('g-box-contents', 0, 'gallery-item', true);

		if(stringStartWith(document.title, 'g4 :: Tagged'))
			refreshSiteByParam('gallery-items', 0, 'gallery-item', true);

		if(stringStartWith(document.title, 'g4 :: Search Results'))
			refreshSiteByParam('g-box-contents', 1, 'gallery-item', true);
	}

	/**
	 * Refreshes the page by using params of specific elements
	 *
	 * @param {string} mainContainerClassName - Class name of the Main-Container(s)
	 * @param {int} targetContainer - Target Container of the class (starts with 0) the first (0) of them is usually the right one
	 * @param {string} itemClassName - Class name of Content-Elements
	 * @param {boolean} allowMouseOver - Allow use of MouseOver-Buttons here
	 */
  dAlert('845 Create function refreshSiteByParam');
	function refreshSiteByParam(mainContainerClassName, targetContainer, itemClassName, allowMouseOver) {
		dAlert('refreshSiteByParam('+mainContainerClassName+', '+targetContainer+', '+itemClassName+', '+allowMouseOver+') called');
    // Get the MainContainer
		var mainContainer = document.getElementsByClassName(mainContainerClassName);

		// Check if the class exists
		if(mainContainer.length < targetContainer)
			return;



    // Use all instances of a class as a workaround for a bug where some items get ignored
    var items = []
    /*for(var i=0;i<targetContainer;i++) {
		  mainContainer = mainContainer[i];

		  // Create or find the existing unblock button box, then clear it out so we can rebuild it.
		  var unblockButtonBox = unlockButtonContainer('whtb-unblock-box', mainContainer, 'Unblock User (On this Page):');
		  var globalUnblockButtonBox = unlockButtonContainer('whtb-global-unblock-box', mainContainer, 'Unblock User (Global List):');
		  // Add Buttons to global List
		  createUnblockButtonListFromArray(badUserList, globalUnblockButtonBox);

		  // Clear out existing block buttons from the last iteration.
		  removeExistingButtons('whtb-block-button');

		  // Get all items
		  items.push(mainContainer.getElementsByClassName(itemClassName));
    }*/




		// Use the first occur of the class there more of these containers but the first one is the correct container
		mainContainer = mainContainer[targetContainer];

		// Create or find the existing unblock button box, then clear it out so we can rebuild it.
		var unblockButtonBox = unlockButtonContainer('whtb-unblock-box', mainContainer, 'Unblock User (On this Page):');
		var globalUnblockButtonBox = unlockButtonContainer('whtb-global-unblock-box', mainContainer, 'Unblock User (Global List):');
		// Add Buttons to global List
		createUnblockButtonListFromArray(badUserList, globalUnblockButtonBox);

		// Clear out existing block buttons from the last iteration.
		removeExistingButtons('whtb-block-button');

		// Get all items
		var items = mainContainer.getElementsByClassName(itemClassName);

		// Generate Block buttons and hide blocked user
    //alert('items: '+items.length);
    itemsOnPage = items.length
		for(var i = 0; i < items.length; i++) {
			handleItem(items[i], ((allowMouseOver) ? useMouseOverButtons : false));
      //alert('handle loop '+i);
    }
    if(blockedCount === itemsOnPage) {
      if(! showBlockedContent)
        alert('Aryion Moment: All ' + itemsOnPage + ' items on this page had to be be blocked!');
    }
		// Generate the "Unblock button" list at the top. just for user on this page
		createUnblockButtonListFromArray(currentUserHiddenList, unblockButtonBox);

		// Add all main buttons to the Main Container
		if(mainContainer.getElementsByClassName('whtb-button-reshow-blocked-content').length < 1) {
		  if(! autoImportBlacklist)
        mainContainer.insertBefore(createTagImportButton(), mainContainer.firstChild);
      mainContainer.insertBefore(createImportButton(), mainContainer.firstChild);
			mainContainer.insertBefore(createExportButton(), mainContainer.firstChild);
			mainContainer.insertBefore(createShowContentButton(), mainContainer.firstChild);
      mainContainer.insertBefore(createBlockedCounterDisplay(), mainContainer.firstChild);
		}
    refreshBlockedCounter();
    if(debug) {
      var ll2 = ''
      for(var i=0; i<logList.length; i++) {
        ll2 = ll2 + logList[i] + '\n';
      }
      //alert(ll2)
    }
	}

	/**
	 * Creates optional event listener on a page for ajax load
	 */
  dAlert('899 Create function createEventListener');
	function createEventListener() {
    dAlert('createEventListener() called');
		if(stringStartWith(document.title, 'g4 :: Messages')) {
			var elements = document.getElementsByClassName('msg-loader');

			for(var i = 0; i < elements.length; i++) {
				/**
				 * Adds a refresh function if clicked on show more
				 */
				elements[i].onclick = function() {
					setTimeout(function() {
						refreshPage();
					}, 2000);
				}
			}
		}
	}

	// ------------------------------------------------

	// Loads settings
  dAlert('920 Execute loadData()');
	loadData();
  dAlert('922 Execute importTags()');
  importTags();

	// Now just do an initial refresh to show our optional stuff.
	dAlert('926 Execute refreshPage()');
  refreshPage();
  //alert("Blocked " + blockedCount + " gallery items");
	// Check if we need to add optional event listeners - but only 1 time
	dAlert('930 Execute createEventListener()');
  createEventListener();

})();
