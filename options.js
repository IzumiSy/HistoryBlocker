
// options.js

document.body.onload = function() {
	// Load settings;
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
	// Save settings;
}

document.getElementById("cancel").onclick = function() {
	window.close();
}
