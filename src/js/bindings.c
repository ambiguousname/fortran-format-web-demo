// Because EMCC can't make wrappers for Fortran, we expose the functions in C.

#include <stdint.h>
#include <emscripten.h>

extern int32_t test_(int32_t* a);
// For the C ABI, Fortran CHARACTER(len=*) are positioned normally as char*, but then their sizes are appended to the end.
extern void write_fmt_(char*, char*, int, int);

EMSCRIPTEN_KEEPALIVE
int32_t test(int32_t a) {
	return test_(&a);
}

EMSCRIPTEN_KEEPALIVE
char* write_fmt(char* fmt_stmt, size_t fmt_len, char* out, size_t len) {
	write_fmt_(fmt_stmt, out, fmt_len, len);
	return out;
}