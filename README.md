# Building
Pre-compiled binaries are included for convenience's sake. If you want to re-create these, you should follow [this tutorial](https://gws.phd/posts/fortran_wasm/).

Major differences between that tutorial and this one are that I'm using [LLVM 20.x](https://github.com/llvm/llvm-project/tree/release/20.x), so some things will be accordingly changed.

# Compiling
Feel free to skip to Part Four if you have no intention of changing the binary `.wasm` code.

## Part One: Build Flang for WebAssembly

1. Clone [LLVM](https://github.com/llvm/llvm-project) on Github.
2. Apply the Git patch under `llvm/llvm-wasm.diff`.
3. Configure and build with CMAKE. Make sure `-DDLLVM_TARGETS_TO_BUILD="WebAssembly"` is set. The only projects you need to enable are `-DLLVM_ENABLE_PROJECTS="clang;flang;mlir"`. `-DCMAKE_BUILD_TYPE=MinSizeRel` is recommended.
4. Build `flang`.

Copy the binaries to the `binaries/flang` folder of the git project.

## Part Two: Build libFortranRuntime for WebAssembly

The `FORMAT` statement is actually a bunch of disguised calls to `libFortranRuntime`, so we need to compile these calls to WebAssembly:

1. Install and activate the [emscripten SDK](https://emscripten.org/docs/getting_started).
2. Prepare `libFortranRuntime` with `emcmake`: `emcmake cmake -S flang/runtime`, then build.

Copy the binaries to the `binaries/libFortranRuntime` folder of the git project.

## Part Three: Building the Program

```
emcmake cmake -B build
emcmake cmake --build build --target=fortran_wasm
```

## Part Four: Building Web Demo
```
npm -C web run build
npm -C web run start
```