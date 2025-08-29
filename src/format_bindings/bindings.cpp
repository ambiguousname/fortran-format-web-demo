#ifdef _WIN32
#include <flang/Runtime/main.h>
#include <flang/Runtime/io-api.h>
using namespace Fortran::runtime::io;
#else
#include "bindings.hpp"
#endif
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
extern "C" void test() {
	Cookie io = _FortranAioBeginExternalFormattedOutput("(A I2)", 6);
	_FortranAioOutputAscii(io, "Hello World!", 12);
	
	_FortranAioOutputInteger64(io, 20);
	_FortranAioEndIoStatement(io);
}