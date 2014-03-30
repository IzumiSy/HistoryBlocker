
// background.js

var isExtensionWorking;

// Initialize
chrome.browserAction.setBadgeBackgroundColor({color: "#00FF00"});
isExtensionWorking = false;

chrome.browserAction.onClicked.addListener(function() {
	var status;
	
	isExtensionWorking = ! isExtensionWorking;
	if (isExtensionWorking == true) {
		status = "ON";
	} else {
		status = "";
	}
	chrome.browserAction.setBadgeText({text: status});
});
