var Module = require("Formatter/out");

Module({
	printErr: (e) => {
		// TODO: Print to console
		console.error(e);
	}
}).then((m) => {
	class Formatter {
		static beginExternalFormattedOutput = m.cwrap("BeginExternalFormattedOutput", "number", ["string", "number"]);
		static outputAscii = m.cwrap("OutputAscii", "number", ["number", "string", "number"])
		static endIo = m.cwrap("EndIoStatement", "", ["number"]);
	}

	class FormattedOutput {
		#io;
		constructor(formatString) {
			this.#io = Formatter.beginExternalFormattedOutput(formatString, formatString.length);
		}

		addAscii(string) {
			Formatter.outputAscii(this.#io, string, string.length);
		}

		print() {
			Formatter.endIo(this.#io);
		}
	}
	try {
		let f = new FormattedOutput("(A I2)");
		// f.addAscii("Test");
		// f.outputAscii(io, );
		f.print();
		// m.ccall("_FortranAioOutputAscii", "number", ["string", "number"], ["('Hello')", 9]);
	} catch (e) {
		console.log(e);
	}
});