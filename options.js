
// options.js

document.getElementById("remove").onclick = function() {
	var options = document.getElementById("period").options;

	for (var i = 0;i < options.length;i++) {
		if (options[i].selected) {
			console.log(options[i].value);
		}
	}
}