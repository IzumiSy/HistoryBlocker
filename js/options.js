
// options.js

(function(){
  const FAVICON_API = "http://www.google.com/s2/favicons?domain=";

  var BG = chrome.extension.getBackgroundPage();

  var elements = {
    captions: {
      pageTitle:      document.getElementById("page-title"),
      tabOptions:     document.getElementById("tab-options"),
      tabHistory:     document.getElementById("tab-history"),
      removePeriod:   document.getElementById("remove-period"),
      removeCookies:  document.getElementById("text-remove-cookies"),
      removeCache:    document.getElementById("text-remove-cache"),
      warningMessage: document.getElementById("warning-message"),
      historyCaption: document.getElementById("history-caption")
    },

    inputs: {
      removeCookies: document.getElementById("remove-cookies"),
      removeCache:   document.getElementById("remove-cache"),
      selectPeriod:  document.getElementById("period")
    },

    buttons: {
      remove: document.getElementById("remove-button"),
      clear:  document.getElementById("clear-button"),
      save:   document.getElementById("save-button"),
      cancel: document.getElementById("cancel-button")
    },

    tabs: {
      options: document.getElementById("options"),
      history: document.getElementById("history")
    }
  };

  var alertTxts = {
    cleanUp: chrome.i18n.getMessage("extCleanUpAlert"),
    historyRemove: chrome.i18n.getMessage("extHistoryRemoveAlert")
  };

  var miscFunctions = {
    changeTab: function(tab) {
      elements.tabs.options.style.display = "none";
      elements.tabs.history.style.display = "none";
      document.getElementById(tab).style.display = "block";
    },

    setupHandlers: function() {
      elements.buttons.remove.onclick = onClickHandlers.removeButton;
      elements.buttons.save.onclick   = onClickHandlers.saveButton;
      elements.buttons.cancel.onclick = onClickHandlers.cancelButton;
      elements.buttons.clear.onclick  = onClickHandlers.clearHistoryButton;
      elements.captions.tabOptions.onclick = onClickHandlers.tabs.options;
      elements.captions.tabHistory.onclick = onClickHandlers.tabs.history;
    },

    loadCustomHistory: function() {
      var newAnchor, newList, newDiv, newFavicon;
      var mainMenu = document.getElementById("items");
      var items = [];

      items = JSON.parse(localStorage.getItem(BG.WORKING_HISTORY));
      if (items) {
        items.forEach(function(item, i) {
          newAnchor = document.createElement("a");
          newList = document.createElement("li");
          newSpan = document.createElement("span");
          if (item["title"] == BG.LOG_ACTIVATED || item["title"] == BG.LOG_DEACTIVATED) {
            newAnchor.innerHTML = "<b>" + item["title"] + item["url"] + "</b>";
          } else {
            newFavicon = document.createElement("img");
            newFavicon.setAttribute("src", FAVICON_API + item["url"]);
            newFavicon.setAttribute("class", "favicon");
            newAnchor.setAttribute("href", item["url"]);
            newAnchor.appendChild(newFavicon);
            newAnchor.appendChild(document.createTextNode(item["title"]));
            newSpan.appendChild(document.createTextNode(" " + item["url"]));
            newSpan.setAttribute("style", "color: #C0C0C0");
          }
          newList.appendChild(newAnchor);
          newList.appendChild(newSpan);
          mainMenu.appendChild(newList);
        });
      }
    },

    loadPreferences: function() {
      elements.inputs.removeCookies.checked = localStorage.getItem(BG.OPTION_REMOVE_COOKIES) == "true" ? true : false;
      elements.inputs.removeCache.checked   = localStorage.getItem(BG.OPTION_REMOVE_CACHE) == "true" ? true : false;
    },

    i18nApply: function() {
      elements.captions.pageTitle.textContent      = chrome.i18n.getMessage("extOptionTitle");
      elements.captions.tabOptions.textContent     = chrome.i18n.getMessage("extTabOptions");
      elements.captions.tabHistory.textContent     = chrome.i18n.getMessage("extTabHistory");
      elements.captions.removePeriod.textContent   = chrome.i18n.getMessage("extRemovePeriod");
      elements.captions.warningMessage.innerHTML   = chrome.i18n.getMessage("extWarningMessage");
      elements.captions.historyCaption.textContent = chrome.i18n.getMessage("extCustomHistory");

      elements.captions.removeCookies.textContent = chrome.i18n.getMessage("extRemoveCookies");
      elements.captions.removeCache.textContent   = chrome.i18n.getMessage("extRemoveCache");
      elements.buttons.remove.textContent = chrome.i18n.getMessage("extRemoveButton");
      elements.buttons.save.textContent   = chrome.i18n.getMessage("extSaveButton");
      elements.buttons.cancel.textContent = chrome.i18n.getMessage("extCancelButton");
      elements.buttons.clear.textContent  = chrome.i18n.getMessage("extClearAllButton");
    }
  };

  var onClickHandlers = {
    tabs: {
      options: function() {
        miscFunctions.changeTab("options");
        return false;
      },

      history: function() {
        miscFunctions.changeTab("history");
        return false;
      }
    },

    clearHistoryButton: function() {
      var items = document.getElementById("items");

      while (items.firstChild) {
        items.removeChild(items.firstChild);
      }
      localStorage.removeItem(BG.WORKING_HISTORY);
      alert(alertTxts.cleanUp);
    },

    removeButton: function() {
      elements.buttons.remove.disabled = true;
      elements.inputs.selectPeriod.disabled = true;

      var options = elements.inputs.selectPeriod.options;
      var onehour = 3600000;
      var args, during;

      for (var i = 0;i < options.length;i++) {
        if (options[i].selected) {
          switch (options[i].value) {
            case "1hour": during = onehour; break;
            case "6hours": during = onehour * 6; break;
            case "12hours": during = onehour * 12; break;
            case "1day": during = onehour * 24; break;
          }
          break;
        }
      }

      args = {
        misc: {
          "since": (new Date()).getTime() - during,
          "originTypes": { "unprotectedWeb": true }
        },

        targets: {
          "history": true,
          "cookies": localStorage.getItem(BG.OPTION_REMOVE_COOKIES) == "true" ? true : false,
          "cache": localStorage.getItem(BG.OPTION_REMOVE_CACHE) == "true" ? true : false
        }
      };

      chrome.browsingData.remove(args.misc, args.targets, onClickHandlers._handler_browsingDataRemove);
    },

    _handler_browsingDataRemove: function() {
      elements.buttons.remove.disabled = false;
      elements.inputs.selectPeriod.disabled = false;
      alert(alertTxts.historyRemove);
    },

    saveButton: function() {
      localStorage.setItem(BG.OPTION_REMOVE_COOKIES, elements.inputs.removeCookies.checked);
      localStorage.setItem(BG.OPTION_REMOVE_CACHE, elements.inputs.removeCache.checked);
      window.close();
    },

    cancelButton: function() {
      window.close();
    }
  };

  document.body.onload = function() {
    miscFunctions.loadPreferences();
    miscFunctions.loadCustomHistory();
    miscFunctions.setupHandlers();
    miscFunctions.i18nApply();
    miscFunctions.changeTab("options");
  };
})();
