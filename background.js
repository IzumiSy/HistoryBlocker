
// background.js

var isExtensionWorking;

// Initialize
chrome.browserAction.setBadgeBackgroundColor({color: "#00FF00"});
isExtensionWorking = false;

function deleteCurrentTab()
{
	chrome.tabs.getSelected(window.id, function(tab) {
		chrome.history.search({text: tab.url}, function(results) {
			if (results.length == 0) {
				console.log("Any matched urls not found.");
			} else {
				results.forEach(function(rs, i) {
					console.log("Deleted: " + rs.url);
					chrome.history.deleteUrl({url: rs.url});
				});
			}
		});
	});
}

chrome.browserAction.onClicked.addListener(function() {
	var status;
	
	isExtensionWorking = ! isExtensionWorking;
	if (isExtensionWorking == true) {
		status = "ON";
		deleteCurrentTab();
	} else {
		status = "";
	}
	chrome.browserAction.setBadgeText({text: status});
});
