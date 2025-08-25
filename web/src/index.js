var Module = require("Formatter/out");

Module().then((m) => {
	console.log(m.ccall("write_fmt", "string", ["string", "number"], ["test", 4]));
});