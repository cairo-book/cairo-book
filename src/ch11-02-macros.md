# Macros

The Cairo language has some plugins that allows developers to simplify their code. They are called `inline_macros` and are a way of writing code that generates other code.

### `consteval_int!` macro

In some situations, a developer might need to declare a constant that is the result of a computation of integers. To compute a constant expression and use its result at compile time, it is required to use the `consteval_int!` macro.

Here is an example of `consteval_int!`:

```rust
const a: felt252 = consteval_int!(2 * 2 * 2);
```

This will be interpreted as `const a: felt252 = 8;` by the compiler.

### `print!` and `println!` macros

Please refer to the [Hello, World](./ch01-02-hello-world.md) page.

### `array!` macro

Please refer to the [Arrays](./ch03-01-arrays.md) page.

### `panic!`, `assert!` and `assert_eq!` macros macro

Please refer to the [Unrecoverable Errors with panic](./ch10-01-unrecoverable-errors-with-panic.md) page.

### `format!` macro

Similarly to rust, `format!` macro is useful to format and concatenate multiple variables as `ByteArray`: 

```rust
let var1 = 5;
let var2: ByteArray = "hello";
let var3: u32 = 5;
let ba = format!("{},{},{}", var1, var2, var3);
let ba = format!("{var1}{var2}{var3}");
```

### `write!` macro

This macro takes 2 arguments:
- a Formatter, which is a struct containing a `ByteArray`, representing the pending result of formatting
- a 'ByteArray' or formatted string
  
Calling this macro will append the `ByteArray` to the formatter. It is mostly used in cairo corelib for the implementation of Debug and Display traits.





