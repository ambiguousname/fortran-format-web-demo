var Module = require("Formatter/out");

Module({
	printErr: (e) => {
		// TODO: Print to console
		console.error(e);
	}
}).then((m) => {
	try { 
		console.log(m.ccall("write_fmt", "string", ["string", "number", "string", "number"], ["('A')", 4, "testaskldsaldj", 14]));
	} catch (e) {
		console.log("A", e);
		
		console.log(m.ccall("write_fmt", "string", ["string", "number", "string", "number"], ["('c')", 5, "testaskldsaldj", 14]));
	}
});