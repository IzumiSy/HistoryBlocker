
// background.js

var OPTION_REMOVE_COOKIES = "RemoveCookies";
var OPTION_REMOVE_CACHE   = "RemoveCache";
var WORKING_HISTORY       = "workingHistory";
var LOG_ACTIVATED         = "Activated on ";
var LOG_DEACTIVATED       = "Deactivated on ";

var extensionData = {
  isWorking: false,
  since:     0,
  history:   []
};

var miscFunctions = {
  executeHistoryCleanUp: function(since) {
    chrome.browsingData.remove({
      "since": extensionData.since,
      "originTypes": { "unprotectedWeb": true }
    }, {
      "history": true,
      "cookies": localStorage.getItem(OPTION_REMOVE_COOKIES) == "true" ? true : false,
      "cache": localStorage.getItem(OPTION_REMOVE_CACHE) == "true" ? true : false
    });    
  },
  
  isChromePage: function(url) {
    if (url.indexOf("chrome://") === 0) {
      if (url.indexOf("chrome://history/") === 0) { 
        miscFunctions.executeHistoryCleanUp();
      }
      return true;
    }
    return false;
  },
  
  recordLog: function(title, url) {
    console.log("Removed: " + url);
    extensionData.history.unshift({ "title": title, "url": url });    
  },
  
  logActivate: function(time) {
    extensionData.history.unshift({
      "title": LOG_ACTIVATED, 
      "url": time.toString()
    });    
  },
  
  logDeactivate: function(time) {
    extensionData.history.unshift({
      "title": LOG_DEACTIVATED,
      "url": time.toString()
    });    
  }
};

var eventListeners = {
  onUpdated: function(id, info, tab) {
    if (extensionData.isWorking && info.status == "complete") {
      if (!miscFunctions.isChromePage(tab.url)) {
        miscFunctions.recordLog(tab.title, tab.url);
      }
    }
  },
  
  onClicked: function() {
    var activatedTime, status;
  
    extensionData.isWorking = ! extensionData.isWorking;
    status = extensionData.isWorking === true ? "ON" : "";
    currentTime = new Date();
    if (extensionData.isWorking === true) {
      extensionData.since = currentTime.getTime();
      miscFunctions.logActivate(currentTime);
    } else {
      miscFunctions.executeHistoryCleanUp(extensionData.since);
      miscFunctions.logDeactivate(currentTime);
      localStorage.setItem(WORKING_HISTORY, JSON.stringify(extensionData.history));
    }
    chrome.browserAction.setBadgeText({text: status});
  },
  
  onCommand: function(command) {
    if (command == "toggle-blocking") {
      eventListeners.onClicked();
    }
  }
};

chrome.tabs.onUpdated.addListener(eventListeners.onUpdated);
chrome.browserAction.onClicked.addListener(eventListeners.onClicked);
chrome.commands.onCommand.addListener(eventListeners.onCommand);
