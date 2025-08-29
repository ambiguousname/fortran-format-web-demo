var Module = require("Formatter/out");

Module({
	printErr: (e) => {
		// TODO: Print to console
		console.error(e);
	}
}).then((m) => {
	try { 
		console.log(m.ccall("test", "", [], []));
	} catch (e) {
		console.log("A", e);
	}
});