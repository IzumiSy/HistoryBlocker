
// options.js

var BG = chrome.extension.getBackgroundPage();

const FAVICON_API = "http://www.google.com/s2/favicons?domain=";

document.getElementById("tab-options").onclick = function() { changeTab("options"); return false; };
document.getElementById("tab-history").onclick = function() { changeTab("history"); return false; };

function changeTab(tab) {
	document.getElementById("options").style.display = "none";
	document.getElementById("history").style.display = "none";
	document.getElementById(tab).style.display = "block";
}

function loadHistoryItems() {
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
}

document.body.onload = function() {
	changeTab("options");
	document.getElementById("remove-cookies").checked = localStorage.getItem(BG.OPTION_REMOVE_COOKIES) == "true" ? true : false;
	document.getElementById("remove-cache").checked = localStorage.getItem(BG.OPTION_REMOVE_CACHE) == "true" ? true : false;
	loadHistoryItems();

	document.getElementById("page-title").textContent = chrome.i18n.getMessage("extOptionTitle");
	document.getElementById("tab-options").textContent = chrome.i18n.getMessage("extTabOptions");
	document.getElementById("tab-history").textContent = chrome.i18n.getMessage("extTabHistory");
	document.getElementById("caption-remove-period").textContent = chrome.i18n.getMessage("extRemovePeriod");
	document.getElementById("remove-button").textContent = chrome.i18n.getMessage("extRemoveButton");
	document.getElementById("text-remove-cookies").textContent = chrome.i18n.getMessage("extRemoveCookies");
	document.getElementById("text-remove-cache").textContent = chrome.i18n.getMessage("extRemoveCache");
	document.getElementById("warning-message").innerHTML = chrome.i18n.getMessage("extWarningMessage");
	document.getElementById("save-button").textContent = chrome.i18n.getMessage("extSaveButton");
	document.getElementById("cancel-button").textContent = chrome.i18n.getMessage("extCancelButton");
	document.getElementById("history-caption").textContent = chrome.i18n.getMessage("extCustomHistory");
	document.getElementById("clear-button").textContent = chrome.i18n.getMessage("extClearAllButton");
};

document.getElementById("clear-button").onclick = function() {
	var items = document.getElementById("items");

	while (items.firstChild) {
		items.removeChild(items.firstChild);
	}
	localStorage.removeItem(BG.WORKING_HISTORY);
	alert(chrome.i18n.getMessage("extCleanUpAlert"));
};

document.getElementById("remove-button").onclick = function() {
	var button = document.getElementById("remove-button");
	var target = document.getElementById("spinner");
	var period = document.getElementById("period");
	var options = period.options;
	var onehour = 3600000;
	var during;

	var spinner = new Spinner({
		lines: 9,
		width: 2,
		length: 2,
		radius: 4,
		top: "87px",
		left: "180px"
	}).spin(target);
	button.disabled = true;
	period.disabled = true;

	for (var i = 0;i < options.length;i++) {
		if (options[i].selected) {
			switch (options[i].value) {
				case "1hour": during = onehour; break;
				case "6hours": during = onehour * 6; break;
				case "12hours": during = onehour * 12; break;
				case "1day": during = onehour * 24; break;
			}
			chrome.browsingData.remove(
				{
					"since": (new Date()).getTime() - during,
					"originTypes": {
						"unprotectedWeb": true
					}
				}, {
					"history": true,
					"cookies": localStorage.getItem(BG.OPTION_REMOVE_COOKIES) == "true" ? true : false,
					"cache": localStorage.getItem(BG.OPTION_REMOVE_CACHE) == "true" ? true : false
				}, function() {
					button.disabled = false;
					period.disabled = false;
					spinner.stop();
					alert(chrome.i18n.getMessage("extHistoryRemoveAlert"));
				}
			);
		}
	}
};

document.getElementById("save-button").onclick = function() {
	localStorage.setItem(BG.OPTION_REMOVE_COOKIES, document.getElementById("remove-cookies").checked);
	localStorage.setItem(BG.OPTION_REMOVE_CACHE, document.getElementById("remove-cache").checked);
	window.close();
};

document.getElementById("cancel-button").onclick = function() {
	window.close();
};
