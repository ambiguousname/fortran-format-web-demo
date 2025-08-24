find_path(FLANG NAMES flang flang.exe HINTS ${CMAKE_SOURCE_DIR}/binaries/flang/bin)

if (NOT ${CMAKE_Fortran_COMPILER})
	set(CMAKE_Fortran_COMPILER ${FLANG})
endif()
set(CMAKE_Fortran_COMPILER_WORKS 1)
set(CMAKE_Fortran_PREPROCESS_SOURCE "${CMAKE_Fortran_COMPILER} <DEFINES> <INCLUDES> <FLAGS> -E <SOURCE> > <PREPROCESSED_SOURCE>")

project(fortran_lib LANGUAGES Fortran)
enable_language(Fortran)

set(CMAKE_Fortran_FLAGS "--target=wasm32")

add_library(formatting OBJECT formatting.f90)