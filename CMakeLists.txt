cmake_minimum_required(VERSION 3.20.0)

project(fortran_format)

add_subdirectory(src)

add_custom_target(fortran_wasm DEPENDS out.wasm VERBATIM)

add_library(fortranRuntimeLib SHARED IMPORTED)
set_target_properties(fortranRuntimeLib PROPERTIES IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/binaries/libFortranRuntime/libFortranRuntime.a)

add_custom_command(
	OUTPUT
		out.wasm
	COMMAND 
		emcc $<TARGET_FILE:hello> -sEXPORTED_FUNCTIONS=_test_ $<TARGET_FILE:fortranRuntimeLib> -o out.js
	DEPENDS
		hello
		)