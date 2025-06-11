find_path(FLANG NAMES flang flang.exe HINTS ../binaries/flang/bin)

set(CMAKE_Fortran_COMPILER ${FLANG})
set(CMAKE_Fortran_COMPILER_WORKS 1)

project(fortran_lib LANGUAGES Fortran)
enable_language(Fortran)

set(CMAKE_Fortran_FLAGS "--target=wasm32")

add_library(hello hello.f90)