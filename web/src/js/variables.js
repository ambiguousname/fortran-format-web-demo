export class VariableInput extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({
			mode: "open"
		});
		let template = document.querySelector("#variable-template");
		shadow.appendChild(template.content.cloneNode(true));
	}
}
customElements.define("variable-input", VariableInput);