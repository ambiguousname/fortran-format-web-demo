var Module = require("Formatter/out");
require("bootstrap");

function printErr(e) {
	let output = document.getElementById("output-text");
	output.innerText += e + "\n";
	output.classList.add("code-error");
}

Module({
	printErr: printErr
}).then((m) => {
	let output = document.getElementById("output-text");
	output.classList.remove("code-error");
	output.innerText = "_";
	try {
		console.log(m.ccall("test", "", [], []));
	} catch (e) {
		printErr(e);
	}
});