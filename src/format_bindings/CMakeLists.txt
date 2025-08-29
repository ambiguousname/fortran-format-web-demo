add_custom_target(fortran_wasm DEPENDS out.wasm out.js)

add_library(fortranRuntimeLib STATIC IMPORTED)
set_target_properties(fortranRuntimeLib PROPERTIES IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/binaries/libFortranRuntime/libFortranRuntime.a)

add_custom_command(
	OUTPUT
		out.wasm
		out.js
	COMMAND 
		emcc ${CMAKE_CURRENT_SOURCE_DIR}/bindings.cpp $<TARGET_FILE:fortranRuntimeLib> -sEXPORTED_RUNTIME_METHODS=ccall -sMODULARIZE -sENVIRONMENT=web -o out.js
	DEPENDS
		bindings.cpp
		$<TARGET_FILE:fortranRuntimeLib>
		)