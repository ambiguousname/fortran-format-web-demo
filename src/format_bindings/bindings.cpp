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
extern "C" void test() {
	Cookie io = _FortranAioBeginExternalFormattedOutput("(A I2)", 6);
	_FortranAioOutputAscii(io, "Hello World!", 12);
	
	_FortranAioOutputInteger64(io, 20);
	_FortranAioEndIoStatement(io);
}