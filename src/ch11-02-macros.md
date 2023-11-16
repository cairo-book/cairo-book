# Macros

The Cairo language has some plugins that allows developers to simplify their code. They are called `inline_macros` and are a way of writing code that generates other code. In Cairo, there are only two `macros`: `array![]` and `consteval_int!()`.

### Let's start by `array!`

Sometimes, we need to create arrays with values that are already known at compile time. The basic way of doing that is redundant. You would first declare the array and then append each value one by one. `array!` is a simpler way of doing this task by combining the two steps.
At compile-time, the compiler will create an array and append all values passed to the `array!` macro sequentially.

Without `array!`:

```rust
{{#include ../listings/ch11-advanced-features/no_listing_02_array_macro/src/lib.cairo:no_macro}}
```

With `array!`:

```rust
{{#include ../listings/ch11-advanced-features/no_listing_02_array_macro/src/lib.cairo:array_macro}}
```

### `consteval_int!`

In some situations, a developer might need to declare a constant that is the result of a computation of integers. To compute a constant expression and use its result at compile time, it is required to use the `consteval_int!` macro.

Here is an example of `consteval_int!`:

```rust
const a: felt252 = consteval_int!(2 * 2 * 2);
```

This will be interpreted as `const a: felt252 = 8;` by the compiler.
