var Module = require("Formatter/out");
require("bootstrap");

const { VariableHandler, TYPES } = require("./variables.js");

let runFirst = false;

let urlInfo = new URLSearchParams(window.location.search);
let stmt = urlInfo.get("stmt");

async function load() {
	let addVar = document.getElementById("add-variable");
	let variables = new VariableHandler(document.getElementById("variables"));

	let output = document.getElementById("output-text");
	let formatStmt = document.getElementById("format-stmt");

	let stmtText = document.getElementById("stmt-text");
	function updateFormatStmt() {
		stmtText.textContent = `10 FORMAT(${formatStmt.value})`;
		// Cheap hack to insert line breaks and avoid escaping sanitized strings:
		stmtText.innerHTML += `<br> WRITE(*, 10) ${variables.displayVariableList()}`;
	}

	addVar.addEventListener("click", () => {
		variables.createNew();
		updateFormatStmt();
	});
	variables.updateDisplay = updateFormatStmt;

	formatStmt.addEventListener("input", updateFormatStmt);

	if (stmt !== null) {
		formatStmt.value = stmt;
		updateFormatStmt();
	}

	function printErr(e) {
		output.innerText += e + "\n";
		output.classList.add("code-error");
	}
	
	let m = await Module({
		printErr: printErr,
		print: (p) => {
			output.innerText += p + "\n";
		}
	})

	class Formatter {
		static outputInteger64 = m.cwrap("OutputInteger64", "number", ["number", "number"]);
		static outputAscii = m.cwrap("OutputAscii", "number", ["number", "string", "number"]);
		static endIo = m.cwrap("EndIoStatement", "", ["number"]);
		static beginNewUnit = m.cwrap("BeginOpenNewUnit", "number", [""]);
		static beginClose = m.cwrap("BeginClose", "number", ["number"]);
		static getNewUnit = m.cwrap("GetNewUnit", "number", ["number"]);
		static setScratch = m.cwrap("SetScratch", "boolean", [""]);
	}

	class FormattedOutput {
		#str;
		#io;
		constructor(formatString, unit) {
			this.#str = m.stringToNewUTF8(formatString);
			this.#io = m._BeginExternalFormattedOutput(this.#str, formatString.length, unit);
		}

		addInteger(i) {
			Formatter.outputInteger64(this.#io, i);
		}

		addAscii(string) {
			Formatter.outputAscii(this.#io, string, string.length);
		}

		print() {
			Formatter.endIo(this.#io);
			m._free(this.#str);
		}
	}

	async function runFormatting() {
		output.innerText = "";
		try {
			// We create a scratch pad file each time, in case the current unit encounters an error and becomes unclosable
			// (User can reload if it starts impacting memory):
			// let newUnit = Formatter.beginNewUnit();
			// Formatter.setScratch(newUnit);
			// let i = Formatter.getNewUnit(newUnit);
			// Formatter.endIo(newUnit);

			let f = new FormattedOutput(`(${formatStmt.value})`, 6);
			
			for (let v of variables.children()) {
				switch(v.type) {
					case TYPES.INTEGER:
						f.addInteger(parseInt(v.value));
						break;
					default:
						alert("TODO");
						break;
				}
			}
			
			f.print();

			// let close = Formatter.beginClose(i);
			// Formatter.endIo(close);
			
			// let f = new FormattedOutput(`(${formatStmt.value})`);
			// TODO: Need to save the above string somewhere, otherwise this throws it off:
			// f.addAscii("Test");
			// f.outputAscii(io, );
			// m.ccall("_FortranAioOutputAscii", "number", ["string", "number"], ["('Hello')", 9]);
		} catch(e) {
			printErr(e);
			// Instead of worrying about reading a filesystem, just reload the whole module:
			load();
		}
	}

	document.getElementById("run").onclick = runFormatting;

	if (!runFirst) {
		updateFormatStmt();
		runFormatting();
		runFirst = true;
	}
}

document.addEventListener("DOMContentLoaded", load);