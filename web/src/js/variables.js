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

	#variableInputContainer;
	constructor(parent, type) {
		super();
		this.#parent = parent;
		const shadow = this.attachShadow({
			mode: "open"
		});
		let template = document.querySelector("#variable-template");
		shadow.appendChild(template.content.cloneNode(true));

		shadow.getElementById("delete").addEventListener("click", this.delete.bind(this));

		this.#variableInputContainer = shadow.getElementById("variable-input-container");

		let selected = shadow.getElementById("type-select");
		selected.addEventListener("input", () => {
			console.log(selected);
			this.#updateType(selected.value);
		});

		this.#type = type;
		selected.children.item(this.#type).selected = true;
		this.#updateType(Object.keys(TYPES)[this.#type]);
	}

	#updateType(newTypeStr) {
		let prevVal;
		switch (this.#type) {
			case TYPES.INTEGER:
			case TYPES.REAL:
				prevVal = this.value;
				break;
			case TYPES.COMPLEX:
				prevVal = this.value[0];
				break;
			default:
				alert("TODO");
				break;
		}

		this.#type = TYPES[newTypeStr.toUpperCase()];
		this.#variableInputContainer.innerHTML = "";
		
		switch(this.#type) {
			case TYPES.INTEGER:
				{
					let input = document.createElement("input");
					input.type = "number";
					input.classList.add("form-control");
					input.value = prevVal;
					input.step = "1";

					input.addEventListener("input", () => {
						this.#parent.updateDisplay();
					});

					this.#variableInputContainer.appendChild(input);
				}
				break;
			case TYPES.REAL:
				{
					let input = document.createElement("input");
					input.type = "number";
					input.classList.add("form-control");
					input.value = prevVal;
					input.step = "0.01";
					
					input.addEventListener("input", () => {
						this.#parent.updateDisplay();
					});

					this.#variableInputContainer.appendChild(input);
				}
				break;
			case TYPES.COMPLEX:
				{
					let input = document.createElement("input");
					input.type = "number";
					input.classList.add("form-control");
					input.value = prevVal;
					input.step = "0.01";
					
					input.addEventListener("input", () => {
						this.#parent.updateDisplay();
					});

					let complexDiv = document.createElement("div");
					complexDiv.classList.add("input-group");

					let complexInput = document.createElement("input");
					complexInput.type = "number";
					complexInput.classList.add("form-control");
					complexInput.value = "0";
					complexInput.step = "0.01";

					complexInput.addEventListener("input", () => {
						this.#parent.updateDisplay();
					});

					let iSuffix = document.createElement("span");
					iSuffix.classList.add("input-group-text");
					iSuffix.innerText = "i";

					this.#variableInputContainer.appendChild(input);
					complexDiv.appendChild(complexInput);
					complexDiv.appendChild(iSuffix);
					this.#variableInputContainer.appendChild(complexDiv);
				}
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
			case TYPES.COMPLEX:
				this.#variableInputContainer.children.item(0).value = v[0];
				this.#variableInputContainer.children.item(1).value = v[1];
				break;
			case TYPES.INTEGER:
			case TYPES.REAL:
			default:
				this.#variableInputContainer.children.item(0).value = v;
				break;
		}
	}

	get value() {
		switch (this.#type) {
			case TYPES.COMPLEX:
				return [this.#variableInputContainer.children.item(0).value, this.#variableInputContainer.children.item(1).value];
			case TYPES.INTEGER:
			case TYPES.REAL:
			default:
				return this.#variableInputContainer.children.item(0).value;
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
			case "r":
				newTy = TYPES.REAL;
				break;
			case "c":
				newTy = TYPES.COMPLEX;
				value = value.split("+");
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