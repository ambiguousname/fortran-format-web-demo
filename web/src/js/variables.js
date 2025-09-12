export class VariableInput extends HTMLElement {
	#parent;
	#name;
	constructor(parent, name) {
		super();
		this.#parent = parent;
		const shadow = this.attachShadow({
			mode: "open"
		});
		let template = document.querySelector("#variable-template");
		shadow.appendChild(template.content.cloneNode(true));

		shadow.getElementById("delete").addEventListener("click", this.delete.bind(this));
		this.#name = name;

		let variableName = shadow.getElementById("variable-name");
		variableName.value = name;
		variableName.addEventListener("input", () => {
			this.#name = variableName.value;
			this.#parent.updateDisplay()
		});
	}

	get name() {
		return this.#name;
	}

	delete() {
		this.#parent.remove(this);
	}
}
customElements.define("variable-input", VariableInput);

export class VariableHandler {
	#variableNames = new Set();
	#elem;
	constructor(listElem) {
		this.#elem = listElem;
	}

	updateDisplay;

	createNew() {
		let name = `var_${this.#variableNames.size}`;
		if (this.#variableNames.has(name)) {
			name = `var_${this.#variableNames.size + 1}`;
		}

		let v = new VariableInput(this, name);
		this.append(v);
	}

	append(v) {
		this.#variableNames.add(v.name);
		this.#elem.appendChild(v);
	}

	remove(v) {
		this.#variableNames.delete(v.name);
		this.#elem.removeChild(v);
		this.updateDisplay();
	}

	displayVariableList() {
		let string = "";
		for (let v of this.#elem.children) {
			string += v.name + " ";
		}
		return string;
	}
}