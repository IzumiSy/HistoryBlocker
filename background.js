
// background.js

var isExtensionWorking;
var workingSince;
var date;

// Initialize
chrome.browserAction.setBadgeBackgroundColor({color: "#00FF00"});
isExtensionWorking = false;
workingSince = 0;

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

function toggleActivation()
{
	var status;
	
	isExtensionWorking = ! isExtensionWorking;
	if (isExtensionWorking == true) {
		status = "ON";
		date = new Date();
		workingSince = date.getTime();
		console.log("Activated on: " + workingSince);
	} else {
		status = "";
	}
	chrome.browserAction.setBadgeText({text: status});
}

chrome.commands.onCommand.addListener(function(command) {
	if (command == "toggle-blocking") {
		toggleActivation();
	}
});

chrome.browserAction.onClicked.addListener(toggleActivation);
