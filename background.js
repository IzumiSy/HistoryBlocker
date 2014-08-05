
// background.js

var isExtensionWorking;
var workingSince;

const OPTION_REMOVE_COOKIES = "RemoveCookies";
const OPTION_REMOVE_CACHE = "RemoveCache";

// Initialize
isExtensionWorking = false;
workingSince = 0;
dataHistory = [];
temporalHistory = [];

chrome.tabs.onUpdated.addListener(function(id, info, tab) {
	if (isExtensionWorking) {
		if (info.status == "complete") {
			chrome.browsingData.remove(
				{
					"since": workingSince,
					"originTypes": {
						"unprotectedWeb": true
					}
				}, {
					"history": true,
					"cookies": localStorage.getItem(OPTION_REMOVE_COOKIES) == "true" ? true : false,
					"cache": localStorage.getItem(OPTION_REMOVE_CACHE) == "true" ? true : false
				}, function() {
					console.log("Removed: " + tab.url);
					temporalHistory.push({
						"title": tab.title,
						"url": tab.url
					});
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
		temporalHistory = [];
		console.log("Activated on: " + workingSince);
	} else {
		status = "";
		dataHistory.push(temporalHistory);
	}
	chrome.browserAction.setBadgeText({text: status});
}

chrome.commands.onCommand.addListener(function(command) {
	if (command == "toggle-blocking") {
		toggleActivation();
	}
});

chrome.browserAction.onClicked.addListener(toggleActivation);
