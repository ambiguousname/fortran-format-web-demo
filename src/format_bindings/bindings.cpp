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
extern "C" Cookie BeginExternalFormattedOutput(const char* fmt_string, std::size_t fmt_len) {
	return _FortranAioBeginExternalFormattedOutput(fmt_string, fmt_len);
}

EMSCRIPTEN_KEEPALIVE
extern "C" void EndIoStatement(Cookie io) {
	_FortranAioEndIoStatement(io);
}

EMSCRIPTEN_KEEPALIVE
extern "C" bool OutputAscii(Cookie io, const char* string, std::size_t len) {
	return _FortranAioOutputAscii(io, string, len);
}