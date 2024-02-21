# Macros

The Cairo language has some plugins that allow developers to simplify their code. They are called `inline_macros` and are a way of writing code that generates other code.

## `print!` and `println!` macros

Please refer to the [Printing](./ch11-04-printing.md) page.

## `consteval_int!` macro

In some situations, a developer might need to declare a constant that is the result of a computation of integers. To compute a constant expression and use its result at compile time, it is required to use the `consteval_int!` macro.

Here is an example of `consteval_int!`:

```rust
const a: felt252 = consteval_int!(2 * 2 * 2);
```

This will be interpreted as `const a: felt252 = 8;` by the compiler.

## `array!` macro

Please refer to the [Arrays](./ch03-01-arrays.md) page.

## `panic!`, `assert!` and `assert_eq!` macros

See [Unrecoverable Errors with panic](./ch10-01-unrecoverable-errors-with-panic.md) page.

## `format!` macro

Please refer to the [Printing](./ch11-04-printing.md) page.

## `write!` and `writeln!` macros

Please refer to the [Printing](./ch11-04-printing.md) page.

## `get_dep_component!` macro

Please refer to the [Components dependencies](./ch99-01-05-02-component-dependencies.md)
