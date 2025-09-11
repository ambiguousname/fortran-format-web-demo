var Module = require("Formatter/out");
require("bootstrap");

async function load() {
	let output = document.getElementById("output-text");
	function printErr(e) {
		output.innerText += e + "\n";
		output.classList.add("code-error");
	}
	
	let m = await Module({
		printErr: printErr,
		print: (p) => {
			output.innerText += p + "\n";
		}
	});

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

	output.innerText = "";
	try {
		let f = new FormattedOutput("('Testing hellooo' I2)");
		// TODO: Need to save the above string somewhere, otherwise this throws it off:
		// f.addAscii("Test");
		// f.outputAscii(io, );
		f.print();
		// m.ccall("_FortranAioOutputAscii", "number", ["string", "number"], ["('Hello')", 9]);
	} catch (e) {
		printErr(e);
	}
}

document.addEventListener("DOMContentLoaded", load);