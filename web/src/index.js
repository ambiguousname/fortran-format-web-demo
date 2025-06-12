var Module = require("Formatter/out");

Module().then((m) => {
	m.ccall("test", "number", ["number"], [0]);
});