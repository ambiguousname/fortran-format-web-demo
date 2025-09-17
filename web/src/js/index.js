var Module = require("Formatter/out");
require("bootstrap");

const { VariableHandler, TYPES, VariableInput } = require("./variables.js");

class FormatUpdaterSingleton {
	constructor() {}

	#stmtText;
	#variables;
	#formatStmt;

	#formatType;
	init(variables) {
		this.#stmtText = document.getElementById("stmt-text");
		this.#formatStmt = document.getElementById("format-stmt");
		this.#variables = variables;

		this.#formatType = document.getElementById("format-type");
	}
	
	update() {
		let out;
		switch (this.#formatType.value) {
			case "Format Specification":
				this.#stmtText.textContent = `10 FORMAT(${this.#formatStmt.value})`;
				out = "<br> WRITE(*, 10)";
				break;
			case "List Directed Formatting":
				this.#stmtText.textContent = "";
				out = "WRITE(*, *)";
				break;
		}
		// Cheap hack to insert line breaks and avoid escaping sanitized strings:
		this.#stmtText.innerHTML += `${out} ${this.#variables.displayVariableList()}`;
	}
}

let fmtUpdate = new FormatUpdaterSingleton();

function setupFormatSwitch() {
	let formatStmtDiv = document.getElementById("format-stmt-div");
	let formatStmt = document.getElementById("format-stmt");
	let formatType = document.getElementById("format-type");

	function updateFormatType() {
		switch (formatType.value) {
			case "Format Specification":
				formatStmt.disabled = false;
				formatStmtDiv.style.maxHeight = "100%";
				break;
			case "List Directed Formatting":
				formatStmtDiv.style.maxHeight = "0%";
				formatStmt.disabled = true;
				break;
		}
		fmtUpdate.update();
	}
	formatType.addEventListener("input", updateFormatType);
	updateFormatType();
}

function setupLicenses() {
	let licenseNav = document.getElementById("license-nav");
	let licenseBody = document.getElementById("license-body");

	let licenses = ["Main", "Bootstrap", "Emscripten", "LLVM"];
	let first = true;
	for (let license of licenses) {
		let text = (fetch(`./licenses/${license}.txt`).then((res) => {
			return res.text()
		}));

		let listItem = document.createElement("li");
		listItem.classList.add("nav-item");
		listItem.role = "presentation";

		let button = document.createElement("button");
		button.role = "tab";
		button.classList.add("nav-link");
		button.id = `${license}-tab`;
		button.setAttribute("data-bs-toggle", "tab");
		button.setAttribute("data-bs-target", `#${license}`);
		button.type = "button";
		button.setAttribute("aria-controls", license);
		button.innerText = license;

		listItem.appendChild(button);

		let div = document.createElement("div");
		div.classList.add("tab-pane", "fade");
		div.id = license;
		div.setAttribute("aria-labelledby", `${license}-tab`);

		let pre = document.createElement("pre");
		div.appendChild(pre);

		text.then((t) => {
			pre.innerText = t;
		});

		licenseNav.appendChild(listItem);
		licenseBody.appendChild(div);

		if (first) {
			button.classList.add("active");
			div.classList.add("show", "active");
			first = false;
		}
	}
}

function urlHandle(variables) {
	let formatStmt = document.getElementById("format-stmt");
	let formatType = document.getElementById("format-type");

	let urlInfo = new URLSearchParams(window.location.search);
	let stmt = urlInfo.get("stmt");
	let variablesInfo = urlInfo.get("variables");
	let type = urlInfo.get("type");

	if (variablesInfo) {
		let existingVariables = variablesInfo.split(";");
		for (let v of existingVariables) {
			let [type, value] = v.split("=");
			variables.append(VariableInput.fromTypeAndValue(variables, type, value));
		}
	}
	
	if (stmt !== null) {
		formatStmt.value = stmt;
		fmtUpdate.update();
	}

	if (type) {
		formatType.value = type;
		// Too lazy to refactor, but this kind of sucks:
		if (type === "List Directed Formatting"){
			formatStmt.disabled = true;
			formatStmt.parentElement.style.maxHeight = "0%";
		}
	}

	let share = document.getElementById("share");
	share.addEventListener("click", () => {
		let p = new URLSearchParams();
		p.append("stmt", formatStmt.value);
		p.append("type", formatType.value);

		let encodeV = [];
		for (let v of variables.children()) {
			let typeStr;
			switch (v.type) {
				case TYPES.INTEGER:
					typeStr = "i";
					break;
				case TYPES.REAL:
					typeStr = "r";
					break;
				case TYPES.COMPLEX:
					typeStr = "c";
					break;
				case TYPES.STRING:
					typeStr = "s";
					break;
				case TYPES.LOGICAL:
					typeStr = "l";
					break;					
			}
			encodeV.push(`${typeStr}=${v.value}`);
		}
		p.append("variables", encodeV.join(";"));

		
		let u = new URL(window.location.href);
		u.search = p.toString();
		let newSearch = u.toString();
		navigator.clipboard.writeText(newSearch).then(() => {
			share.textContent = "Copied to clipboard!";
			setTimeout(() => {
				share.innerHTML = `<i class="bi bi-share"></i> Share`;
			}, 500);
		});
		window.history.replaceState({}, "", newSearch);
	});

}

function setupDarkMode() {
	let darkMode = document.getElementById("dark-mode");
	let darkModeIcon = document.getElementById("dark-mode-icon");
	let scheme = localStorage.getItem("mode");

	function updateDarkMode() {
		document.documentElement.setAttribute("data-bs-theme", scheme);
		if (scheme === "dark") {
			darkModeIcon.classList.remove("bi-moon");
			darkModeIcon.classList.add("bi-moon-fill");
		} else {
			darkModeIcon.classList.remove("bi-moon-fill");
			darkModeIcon.classList.add("bi-moon");
		}
	}

	darkMode.addEventListener("click", () => {
		if (scheme === "light") {
			scheme = "dark";
		} else {
			scheme = "light";
		}
		localStorage.setItem("mode", scheme);
		updateDarkMode();
	});

	scheme = scheme ?? "light";
	if (localStorage.getItem("mode") === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		scheme = "dark";
	}

	updateDarkMode();
}

async function load() {
	setupLicenses();
	setupDarkMode();

	let addVar = document.getElementById("add-variable");

	let output = document.getElementById("output-text");
	let formatStmt = document.getElementById("format-stmt");
	let formatType = document.getElementById("format-type");

	
	let variables = new VariableHandler(document.getElementById("variables"));
	fmtUpdate.init(variables);
	setupFormatSwitch();

	urlHandle(variables);

	addVar.addEventListener("click", () => {
		variables.createNew();
		fmtUpdate.update();
	});
	variables.updateDisplay = fmtUpdate.update.bind(fmtUpdate);

	formatStmt.addEventListener("input", fmtUpdate.update.bind(fmtUpdate));

	function printErr(e) {
		output.innerText += e + "\n";
		output.classList.add("code-error");
	}

	let runFirst = false;
	async function setupFormatter() {
		let m = await Module({
			printErr: printErr,
			print: (p) => {
				output.innerText += p + "\n";
			}
		})

		class Formatter {
			static outputInteger64 = m.cwrap("OutputInteger64", "number", ["number", "number"]);
			static outputReal64 = m.cwrap("OutputReal64", "number", ["number", "number"]);
			static outputComplex64 = m.cwrap("OutputComplex64", "number", ["number", "number", "number"]);
			static outputAscii = m.cwrap("OutputAscii", "number", ["number", "number", "number"]);
			static outputLogical = m.cwrap("OutputLogical", "number", ["number", "boolean"]);
			static endIo = m.cwrap("EndIoStatement", "", ["number"]);
			static beginNewUnit = m.cwrap("BeginOpenNewUnit", "number", [""]);
			static beginClose = m.cwrap("BeginClose", "number", ["number"]);
			static getNewUnit = m.cwrap("GetNewUnit", "number", ["number"]);
			static setScratch = m.cwrap("SetScratch", "boolean", [""]);
		}

		class FormattedOutput {
			#strings = [];
			#io;
			constructor(formatString, unit, type) {
				let ptr = m.stringToNewUTF8(formatString);
				this.#strings.push(ptr);
				switch (type) {
					case "List Directed Formatting":
						this.#io = m._BeginExternalListOutput();
						break;
					default:
						this.#io = m._BeginExternalFormattedOutput(ptr, formatString.length, unit);
						break;
				}
			}

			addInteger(i) {
				Formatter.outputInteger64(this.#io, i);
			}

			addReal(real) {
				Formatter.outputReal64(this.#io, real);
			}

			addComplex(real, i) {
				Formatter.outputComplex64(this.#io, real, i);
			}

			addAscii(string) {
				let str = string.substring(1, string.length - 1);
				let ptr = m.stringToNewUTF8(str);
				this.#strings.push(ptr);
				Formatter.outputAscii(this.#io, ptr, str.length);
			}

			addBool(b) {
				Formatter.outputLogical(this.#io, b);
			}

			print() {
				Formatter.endIo(this.#io);
				for (let ptr of this.#strings) {
					m._free(ptr);
				}
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

				let f = new FormattedOutput(`(${formatStmt.value})`, 6, formatType.value);
				
				for (let v of variables.children()) {
					switch(v.type) {
						case TYPES.INTEGER:
							f.addInteger(parseInt(v.value));
							break;
						case TYPES.REAL:
							f.addReal(parseFloat(v.value));
							break;
						case TYPES.COMPLEX:
							let val = v.value.substring(6, v.value.length - 1).split(",");
							f.addComplex(parseFloat(val[0]), parseFloat(val[1]));
							break;
						case TYPES.STRING:
							f.addAscii(v.value);
							break;
						case TYPES.LOGICAL:
							f.addBool(v.value === ".TRUE.");
							break;
						default:
							alert("Unsupported type.");
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
				setupFormatter();
			}
		}

		document.getElementById("run").onclick = runFormatting;

		if (!runFirst) {
			runFormatting();
			runFirst = true;
		}
	}

	// Handle URL decoding:
	fmtUpdate.update();
	setupFormatter();
}

document.addEventListener("DOMContentLoaded", load);