add_custom_target(fortran_wasm DEPENDS out.wasm out.js)

add_library(fortranRuntimeLib STATIC IMPORTED)
set_target_properties(fortranRuntimeLib PROPERTIES IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/binaries/libFortran/libFortranRuntime.a)

add_library(fortranDecimalLib STATIC IMPORTED)
set_target_properties(fortranDecimalLib PROPERTIES IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/binaries/libFortran/libFortranDecimal.a)

add_custom_command(
	OUTPUT
		out.wasm
		out.js
	COMMAND 
		emcc ${CMAKE_CURRENT_SOURCE_DIR}/bindings.cpp $<TARGET_FILE:fortranRuntimeLib> $<TARGET_FILE:fortranDecimalLib> -sEXPORTED_RUNTIME_METHODS=[cwrap,stringToNewUTF8] -sEXPORTED_FUNCTIONS=_free -sMODULARIZE -sENVIRONMENT=web -o out.js
	DEPENDS
		bindings.cpp
		$<TARGET_FILE:fortranRuntimeLib>
		$<TARGET_FILE:fortranDecimalLib>
		)