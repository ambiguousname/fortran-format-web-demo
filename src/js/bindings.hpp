#pragma once
#include <cstddef>
#include <cstdint>

class IoStatementState;
using Cookie = IoStatementState *;

extern "C" Cookie _FortranAioBeginExternalListOutput(int = 6, const char* = nullptr, int = 0);
extern "C" bool _FortranAioOutputAscii(Cookie, const char*, std::size_t);
extern "C" bool _FortranAioOutputInteger64(Cookie, std::int64_t);
extern "C" int _FortranAioEndIoStatement(Cookie);

extern "C" Cookie _FortranAioBeginExternalFormattedOutput(const char* format, std::size_t, const void* = nullptr, int = 6, const char* = nullptr, int = 0);