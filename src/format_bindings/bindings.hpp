#pragma once
#include <cstddef>
#include <cstdint>

class IoStatementState;
using Cookie = IoStatementState *;

using ExternalUnit = int;

extern "C" Cookie _FortranAioBeginExternalListOutput(int = 6, const char* = nullptr, int = 0);
extern "C" bool _FortranAioOutputAscii(Cookie, const char*, std::size_t);
extern "C" bool _FortranAioOutputInteger64(Cookie, std::int64_t);
extern "C" int _FortranAioEndIoStatement(Cookie);

extern "C" Cookie _FortranAioBeginOpenNewUnit(const char* = nullptr, int = 0);
extern "C" Cookie _FortranAioBeginClose(ExternalUnit, const char* = nullptr, int = 0);

extern "C" bool _FortranAioGetNewUnit(Cookie, int&, int kind = 4);

extern "C" bool _FortranAioSetStatus(Cookie, const char *, std::size_t);

extern "C" Cookie _FortranAioBeginExternalFormattedOutput(const char* format, std::size_t, const void* = nullptr, int = 6, const char* = nullptr, int = 0);