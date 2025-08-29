var Module = require("Formatter/out");

Module({
	printErr: (e) => {
		// TODO: Print to console
		console.error(e);
	}
}).then((m) => {
	try { 
		let io = m.ccall("BeginExternalFormattedOutput", "number", ["string", "number"], ["('Hello')", 9]);
		m.ccall("EndIoStatement", "", ["number"], [io]);
		// m.ccall("_FortranAioOutputAscii", "number", ["string", "number"], ["('Hello')", 9]);
	} catch (e) {
		console.log(e);
	}
});