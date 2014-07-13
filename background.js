
// background.js

var isExtensionWorking;
var workingSince;
var date;

// Initialize
chrome.browserAction.setBadgeBackgroundColor({color: "#00FF00"});
isExtensionWorking = false;
workingSince = 0;
date = new Date();

chrome.tabs.onUpdated.addListener(function(id, info, tab) {
	if (isExtensionWorking) {
		if (info.status == "complete") {
			chrome.browsingData.removeHistory(
				{
					"since": workingSince,
					"originTypes": {
						"unprotectedWeb": true
					}
				},
				function() {
					console.log("Eliminated: " + tab.url);
				}
			);
		}
	}
});

chrome.browserAction.onClicked.addListener(function() {
	var status;
	
	isExtensionWorking = ! isExtensionWorking;
	if (isExtensionWorking == true) {
		status = "ON";
		workingSince = date.getTime();
		console.log("Activated on: " + workingSince);
	} else {
		status = "";
	}
	chrome.browserAction.setBadgeText({text: status});
});
