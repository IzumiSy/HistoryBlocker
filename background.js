
// background.js

var isExtensionWorking;
var workingSince;

// Initialize
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
				}, function() {
					console.log("Removed: " + tab.url);
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
		workingSince = (new Date()).getTime();
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
