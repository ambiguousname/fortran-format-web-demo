// Because EMCC can't make wrappers for Fortran, we expose the functions in C.

#include <stdint.h>
#include <emscripten.h>

extern int32_t _test(int32_t a);

EMSCRIPTEN_KEEPALIVE
int32_t test(int32_t a) {
	return _test(a);
}