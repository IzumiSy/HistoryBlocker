
// options.js

var BG = chrome.extension.getBackgroundPage();

document.body.onload = function() {
	document.getElementById("remove_cookies").checked = localStorage.getItem(BG.OPTION_REMOVE_COOKIES) == "true" ? true : false;
	document.getElementById("remove_cache").checked = localStorage.getItem(BG.OPTION_REMOVE_CACHE) == "true" ? true : false;
}

document.getElementById("remove").onclick = function() {
	var options = document.getElementById("period").options;
	var onehour = 3600000;
	var during

	for (var i = 0;i < options.length;i++) {
		if (options[i].selected) {
			switch (options[i].value) {
				case "1hour": during = onehour; break;
				case "6hours": during = onehour * 6; break;
				case "12hours": during = onehour * 12; break;
				case "1day": during = onehour * 24; break;
			}
			chrome.browsingData.removeHistory(
				{
					"since": (new Date()).getTime() - during,
					"originTypes": {
						"unprotectedWeb": true
					}
				}, function() {
					alert("Successfully removed.");
				}
			);
		}
	}
}

document.getElementById("save").onclick = function() {
	localStorage.setItem(BG.OPTION_REMOVE_COOKIES, document.getElementById("remove_cookies").checked);
	localStorage.setItem(BG.OPTION_REMOVE_CACHE, document.getElementById("remove_cache").checked);
	window.close();
}

document.getElementById("cancel").onclick = function() {
	window.close();
}
