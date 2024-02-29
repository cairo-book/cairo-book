# Macros

The Cairo language has some plugins that allow developers to simplify their code. They are called `inline_macros` and are a way of writing code that generates other code.

## `consteval_int!` macro

In some situations, a developer might need to declare a constant that is the result of a computation of integers. To compute a constant expression and use its result at compile time, it is required to use the `consteval_int!` macro.

Here is an example of `consteval_int!`:

```rust
const a: felt252 = consteval_int!(2 * 2 * 2);
```

This will be interpreted as `const a: felt252 = 8;` by the compiler.

## `print!` and `println!` macros

Please refer to the [Printing](./ch11-09-printing.md) page.

## `array!` macro

Please refer to the [Arrays](./ch03-01-arrays.md) page.

## `panic!` macro

See [Unrecoverable Errors with panic](./ch09-01-unrecoverable-errors-with-panic.html#panic-macro) page.

## `assert!`, `assert_eq!`, and `assert_ne!` macros

See [How to Write Tests](./ch10-01-how-to-write-tests.md) page.

## `format!` macro

See [Printing](./ch11-09-printing.html#formatting) page.

## `write!` and `writeln!` macros

See [Printing](./ch11-09-printing.html#printing-custom-data-types) page.

## `get_dep_component!` macro

Please refer to the [Components Dependencies](./ch15-02-02-component-dependencies.md) page.
