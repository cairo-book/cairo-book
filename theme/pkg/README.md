WASM runtime for Cairo language and Starknet

<div align="center">

  <h1><code>WASM-Cairo</code></h1>

  <strong>A suite of development tools and an environment for Cairo, all based on WebAssembly.</strong>
  
  [Github](https://github.com/cryptonerdcn/wasm-cairo)

  <sub>Built with 🦀🕸 by <a href="https://twitter.com/cryptonerdcn">cryptonerdcn from Starknet Astro</a></sub>
</div>


## 🚴 Usage


### 🛠️ Build WASM-bindgen's WASM-Cairo Toolkit 
With Modules

```
wasm-pack build --release --target web --out-dir output/module/pkg --out-name wasm-cairo
```

No Modules

```
wasm-pack build --release --target no-modules --out-dir output/no_module/pkg --out-name wasm-cairo
```

You will find `wasm-cairo_bg.wasm` and `wasm-cairo.js` in `pkg` folder.

#### Pack & Publish

With Modules
```
wasm-pack pack output/module
wasm-pack publish  
```

No Modules
```
wasm-pack pack output/no_module 
```

### 🛠️ Build WASMTIME's WASM-Cairo Toolkit

```
cargo build --target wasm32-wasi --release
```

You can test it by using: 

Compile Cairo

```
./wasmtime_test.sh compileCairoProgram ./cairo_files/HelloStarknetAstro.cairo ./cairo_files/HelloStarknetAstro.sierra
```

Run
```
./wasmtime_test.sh runCairoProgram ./cairo_files/HelloStarknetAstro.cairo
```

Run Tests
```
./wasmtime_test.sh runTests ./cairo_files/Test.cairo
```

Compile Contract

```
./wasmtime_test.sh compileStarknetContract ./cairo_files/erc20.cairo ./cairo_files/erc20.json
```

## 🔋 Batteries Included

* [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) for communicating
  between WebAssembly and JavaScript.
* [`console_error_panic_hook`](https://github.com/rustwasm/console_error_panic_hook)
  for logging panic messages to the developer console.
* [`wee_alloc`](https://github.com/rustwasm/wee_alloc), an allocator optimized
  for small code size.
* [`Cairo`](https://github.com/starkware-libs/cairo) for Cairo-lang support.
* `LICENSE-APACHE` and `LICENSE-MIT`: most Rust projects are licensed this way, so these are included for you

## Cairo-Specific Syntax Highlighting

### Feature: Cairo-Specific Syntax Highlighting

#### Overview

This update introduces syntax highlighting tailored specifically for the Cairo programming language, replacing the existing Rust syntax highlighting.

#### Changes Implemented

1. **Highlight.js Replacement:**
   - The entire `highlight.js` file was replaced with Cairo syntax highlighting code, approximately 10,000 lines of code, to ensure accurate and specific syntax highlighting for Cairo.
   
2. **Syntax Registration:**
   - The Cairo language was registered in the highlight configuration file.
   
3. **Global Replacement:**
   - A find-and-replace operation was performed to change all instances of ```rust``` to ```cairo``` in the codebase, ensuring that Cairo syntax highlighting is applied universally where needed.

#### Impact

- Documentation: No changes were made to the documentation files. The Cairo-specific highlighting now ensures that code snippets written in Cairo are accurately highlighted, improving readability and consistency throughout the project.
- Ensured there are no regressions or issues related to the new syntax highlighting.

## License

* Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)

### Contribution

Unless you explicitly state otherwise, any contribution intentionally
submitted for inclusion in the work by you, as defined in the Apache-2.0
license, shall be dual licensed as above, without any additional terms or
conditions.