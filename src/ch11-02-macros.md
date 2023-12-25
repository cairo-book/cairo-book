# Macros

The Cairo language has some plugins that allows developers to simplify their code. They are called `inline_macros` and are a way of writing code that generates other code.

### `print!` and `println!` macros

`println!` and `print!` both call a Cairo macro. If it had called a function instead, it would be entered as `println` or `print` (without the `!`). Two macros are available for printing values:
- `println!` which prints on a new line 
- `print!` with inline printing
  
Both can be used with curly brackets as placeholders that hold a value in place:
- When printing the value of a variable, the variable name can go inside the curly brackets.
- When printing the result of evaluating an expression, use empty curly brackets in the format string, then follow the format string with a comma-separated list of expressions to print in each empty curly bracket placeholder in the same order.

### `consteval_int!` macro

In some situations, a developer might need to declare a constant that is the result of a computation of integers. To compute a constant expression and use its result at compile time, it is required to use the `consteval_int!` macro.

Here is an example of `consteval_int!`:

```rust
const a: felt252 = consteval_int!(2 * 2 * 2);
```

This will be interpreted as `const a: felt252 = 8;` by the compiler.

### `array!` macro

Please refer to the [Arrays](./ch03-01-arrays.md) page.

### `panic!`, `assert!` and `assert_eq!` macros macro

See [Unrecoverable Errors with panic](./ch10-01-unrecoverable-errors-with-panic.md) page.

### `format!` macro

Similarly to rust, `format!` macro is useful to format and concatenate multiple variables as `ByteArray`: 

```rust
let var1 = 5;
let var2: ByteArray = "hello";
let var3: u32 = 5;
let byte_array = format!("{},{},{}", var1, var2, var3);
let byte_array = format!("{var1}{var2}{var3}");
```

### `write!` macro

This macro takes 2 arguments:
- a Formatter, which is a struct containing a `ByteArray`, representing the pending result of formatting
- a 'ByteArray' or formatted string
  
Calling this macro will append the `ByteArray` to the formatter. It is mostly used in cairo corelib for the implementation of Debug and Display traits.





