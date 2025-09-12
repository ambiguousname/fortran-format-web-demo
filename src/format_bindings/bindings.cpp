#ifndef EMSCRIPTEN
#include <flang/Runtime/main.h>
#include <flang/Runtime/io-api.h>
using namespace Fortran::runtime::io;

#define EMSCRIPTEN_KEEPALIVE
#else
#include "bindings.hpp"
#include <emscripten.h>
#endif

EMSCRIPTEN_KEEPALIVE
extern "C" Cookie BeginExternalFormattedOutput(const char* fmt_string, std::size_t fmt_len, int unit = 6) {
	return _FortranAioBeginExternalFormattedOutput(fmt_string, fmt_len, nullptr, unit);
}

EMSCRIPTEN_KEEPALIVE
extern "C" void EndIoStatement(Cookie io) {
	_FortranAioEndIoStatement(io);
}

EMSCRIPTEN_KEEPALIVE
extern "C" Cookie BeginOpenNewUnit() {
	return _FortranAioBeginOpenNewUnit();
}

EMSCRIPTEN_KEEPALIVE
extern "C" Cookie BeginClose(ExternalUnit unit) {
	return _FortranAioBeginClose(unit);
}

EMSCRIPTEN_KEEPALIVE
extern "C" ExternalUnit GetNewUnit(Cookie io) {
	int out = -1;
	_FortranAioGetNewUnit(io, out);
	return out;
}

EMSCRIPTEN_KEEPALIVE
extern "C" bool SetScratch(Cookie io) {
	return _FortranAioSetStatus(io, "SCRATCH", 7);
}

EMSCRIPTEN_KEEPALIVE
extern "C" bool OutputAscii(Cookie io, const char* string, std::size_t len) {
	return _FortranAioOutputAscii(io, string, len);
}