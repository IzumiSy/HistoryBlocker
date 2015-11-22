
// background.js

var isExtensionWorking;
var workingSince;

const OPTION_REMOVE_COOKIES = "RemoveCookies";
const OPTION_REMOVE_CACHE = "RemoveCache";
const WORKING_HISTORY = "workingHistory";
const LOG_ACTIVATED = "Activated on ";
const LOG_DEACTIVATED = "Deactivated on ";

// Initialize
isExtensionWorking = false;
workingSince = 0;
workingHistory = [];

chrome.tabs.onUpdated.addListener(function(id, info, tab) {
  if (isExtensionWorking) {
    if (info.status == "complete") {
      console.log("Removed: " + tab.url);
      workingHistory.unshift({"title": tab.title, "url": tab.url});
    }
  }
});

function toggleActivation()
{
  var md;
  var status;

  isExtensionWorking = ! isExtensionWorking;
  status = isExtensionWorking === true ? "ON" : "";
  md = new Date();
  if (isExtensionWorking === true) {
    workingSince = md.getTime();
    workingHistory.unshift({"title": LOG_ACTIVATED, "url": md.toString()});
  } else {
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
      }
    );
    workingHistory.unshift({"title": LOG_DEACTIVATED, "url": md.toString()});
    localStorage.setItem(WORKING_HISTORY, JSON.stringify(workingHistory));
    temporalHistory = [];
  }
  chrome.browserAction.setBadgeText({text: status});
}

chrome.commands.onCommand.addListener(function(command) {
  if (command == "toggle-blocking") {
    toggleActivation();
  }
});

chrome.browserAction.onClicked.addListener(toggleActivation);
