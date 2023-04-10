## Control Flow

The ability to run some code depending on whether a condition is true and to run some code repeatedly while a condition is true are basic building blocks in most programming languages. The most common constructs that let you control the flow of execution of Cairo code are if expressions and loops.

### `if` Expressions

An if expression allows you to branch your code depending on conditions. You provide a condition and then state, “If this condition is met, run this block of code. If the condition is not met, do not run this block of code.”

<span class="filename">Filename: main.cairo</span>

```rust
use debug::PrintTrait;

fn main() {
    let number = 3;

    if number == 5 {
        'condition was true'.print();
    } else {
        'condition was false'.print();
    }
}
```

All `if` expressions start with the keyword `if`, followed by a condition. In this case, the condition checks whether or not the variable `number` has a value equal to 5. We place the block of code to execute if the condition is `true` immediately after the condition inside curly brackets.

Optionally, we can also include an `else` expression, which we chose to do here, to give the program an alternative block of code to execute should the condition evaluate to `false`. If you don’t provide an `else` expression and the condition is `false`, the program will just skip the `if` block and move on to the next bit of code.

Try running this code; you should see the following output:

```console
$ cairo-run main.cairo
[DEBUG]	condition was false
```

Let’s try changing the value of `number` to a value that makes the condition `true` to see what happens:

```rust
    let number = 5;
```

```console
$ cairo-run main.cairo
condition was true
```

It’s also worth noting that the condition in this code must be a bool. If the condition isn’t a bool, we’ll get an error.

```console
$ cairo-run main.cairo
thread 'main' panicked at 'Failed to specialize: `enum_match<felt252>`. Error: Could not specialize libfunc `enum_match` with generic_args: [Type(ConcreteTypeId { id: 1, debug_name: None })]. Error: Provided generic argument is unsupported.', crates/cairo-lang-sierra-generator/src/utils.rs:256:9
```

### Handling Multiple Conditions with `else if`

You can use multiple conditions by combining if and else in an else if expression. For example:

<span class="filename">Filename: main.cairo</span>

```rust
use debug::PrintTrait;

fn main() {
    let number = 3;

    if number == 12 {
        'number is 12'.print();
    } else if number == 3 {
        'number is 3'.print();
    } else if number - 2 == 1 {
        'number minus 2 is 1'.print();
    } else {
        'number not found'.print();
    }
}
```

This program has four possible paths it can take. After running it, you should see the following output:

```console
[DEBUG]	number is 3
```

When this program executes, it checks each `if` expression in turn and executes the first body for which the condition evaluates to `true`. Note that even though `number - 2 == 1` is `true`, we don’t see the output `number minus 2 is 1'.print()`, nor do we see the `number is not divisible by 4, 3, or 2` text from the `else` block. That’s because Cairo only executes the block for the first true condition, and once it finds one, it doesn’t even check the rest. Using too many `else if` expressions can clutter your code, so if you have more than one, you might want to refactor your code. Chapter 5 describes a powerful Cairo branching construct called `match` for these cases.

### Using `if` in a `let` statement

Because if is an expression, we can use it on the right side of a let statement to assign the outcome to a variable.

<span class="filename">Filename: main.cairo</span>

```rust
use debug::PrintTrait;

fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    if number == 5 {
        'condition was true'.print();
    }
}
```

```console
$ cairo-run main.cairo
[DEBUG]	condition was true
```

The `number` variable will be bound to a value based on the outcome of the `if` expression. Which will be 5 here.
