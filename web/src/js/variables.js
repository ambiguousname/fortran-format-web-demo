export const TYPES = {
	INTEGER: 0,
	REAL: 1,
	COMPLEX: 2,
	STRING: 3,
	LOGICAL: 4,	
};

export class VariableInput extends HTMLElement {
	#parent;
	#type;

	#variableInput;
	constructor(parent, type) {
		super();
		this.#parent = parent;
		const shadow = this.attachShadow({
			mode: "open"
		});
		let template = document.querySelector("#variable-template");
		shadow.appendChild(template.content.cloneNode(true));

		shadow.getElementById("delete").addEventListener("click", this.delete.bind(this));

		this.#variableInput = shadow.getElementById("value");
		this.#variableInput.addEventListener("input", () => {
			this.#parent.updateDisplay();
		});

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

	set value(v) {
		switch (this.#type) {
			case TYPES.INTEGER:
			default:
				this.#variableInput.value = v;
				break;
		}
	}

	get value() {
		switch (this.#type) {
			case TYPES.INTEGER:
			default:
				return this.#variableInput.value;
		}
	}

	delete() {
		this.#parent.remove(this);
	}

	static fromTypeAndValue(parent, type, value) {
		let newTy;
		switch(type) {
			case "i":
				newTy = TYPES.INTEGER;
				break;
			default:
				return null;
		}
		let self = new VariableInput(parent, newTy);
		self.value = value;
		return self;
	}
}
customElements.define("variable-input", VariableInput);

export class VariableHandler {
	#elem;
	constructor(listElem) {
		this.#elem = listElem;
	}

	updateDisplay;

	createNew() {
		let v = new VariableInput(this, TYPES.INTEGER);
		this.append(v);
	}

	append(v) {
		this.#elem.appendChild(v);
	}

	remove(v) {
		this.#elem.removeChild(v);
		this.updateDisplay();
	}

	displayVariableList() {
		let list = [];
		for (let v of this.#elem.children) {
			list.push(v.value);
		}
		return list.join(", ");
	}

	children() {
		return this.#elem.children;
	}
}