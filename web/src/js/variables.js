export const TYPES = {
	INTEGER: 0,
	REAL: 1,
	COMPLEX: 2,
	STRING: 3,
	LOGICAL: 4,	
};

export class VariableInput extends HTMLElement {
	#parent;
	#name;
	#type;

	#variableInput;
	constructor(parent, name, type) {
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

		this.#variableInput = shadow.getElementById("value");

		this.#type = type;
		switch(this.#type) {
			// Do nothing, this is selected by default:
			case TYPES.INTEGER:
				break;
			default:
				alert("TODO");
				break;
		}
	}

	get type() {
		return this.#type;
	}

	get name() {
		return this.#name;
	}

	get value() {
		return this.#variableInput.value;
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

		let v = new VariableInput(this, name, TYPES.INTEGER);
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

	children() {
		return this.#elem.children;
	}
}