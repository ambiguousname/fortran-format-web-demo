var Module = require("Formatter/out");

Module({
	printErr: (e) => {
		// TODO: Print to console
		console.error(e);
	}
}).then((m) => {
	class Formatter {
		beginExternalFormattedOutput = m.cwrap("BeginExternalFormattedOutput", "number", ["string", "number"]);
		endIo = m.cwrap("EndIoStatement", "", ["number"]);
	}
	try {
		let f = new Formatter();
		let io = f.beginExternalFormattedOutput("('Hello')", 9);
		f.endIo(io);
		// m.ccall("_FortranAioOutputAscii", "number", ["string", "number"], ["('Hello')", 9]);
	} catch (e) {
		console.log(e);
	}
});