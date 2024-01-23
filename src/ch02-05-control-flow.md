## Control Flow

The ability to run some code depending on whether a condition is true and to run some code repeatedly while a condition is true are basic building blocks in most programming languages. The most common constructs that let you control the flow of execution of Cairo code are if expressions and loops.

### `if` Expressions

An if expression allows you to branch your code depending on conditions. You provide a condition and then state, “If this condition is met, run this block of code. If the condition is not met, do not run this block of code.”

Create a new project called _branches_ in your _projects_ directory to explore the `if` expression. In the src/lib.cairo file, input the following:

<span class="filename">Filename: src/lib.cairo</span>

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_24_if/src/lib.cairo}}
```

All `if` expressions start with the keyword `if`, followed by a condition. In this case, the condition checks whether or not the variable `number` has a value equal to 5. We place the block of code to execute if the condition is `true` immediately after the condition inside curly brackets.

Optionally, we can also include an `else` expression, which we chose to do here, to give the program an alternative block of code to execute should the condition evaluate to `false`. If you don’t provide an `else` expression and the condition is `false`, the program will just skip the `if` block and move on to the next bit of code.

Try running this code; you should see the following output:

```shell
$ scarb cairo-run --available-gas=20000000
condition was false and number = 3
Run completed successfully, returning []
Remaining gas: 19780390
```

Let’s try changing the value of `number` to a value that makes the condition `true` to see what happens:

```rust, noplayground
    let number = 5;
```

```shell
$ scarb cairo-run --available-gas=20000000
condition was true and number = 5
Run completed successfully, returning []
Remaining gas: 19780390
```

It’s also worth noting that the condition in this code must be a bool. If the condition isn’t a bool, we’ll get an error. For example, try running the following code:

<span class="filename">Filename: src/lib.cairo</span>

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_24_bis_if_not_bool/src/lib.cairo}}
```

The `if` condition evaluates to a value of 3 this time, and Cairo throws an error:

```shell
$ scarb build
error: Mismatched types. The type core::bool cannot be created from a numeric literal.
 --> projects/branches/src/lib.cairo:2:18
    let number = 3;
                 ^


error: could not compile `hello_world` due to previous error
Error: `scarb metadata` exited with error

The error indicates that Cairo inferred the type of `number` to be a `bool`
based on its later use as a condition of the `if` statement. It tries to create
a `bool` from the value `3`, but Cairo doesn't support instantiating a `bool`
from a numeric literal anyway - you can only use `true` or `false` to create a
`bool`. Unlike languages such as Ruby and JavaScript, Cairo will not
automatically try to convert non-Boolean types to a Boolean. If we want the if
code block to run only when a number is not equal to 0, for example, we can
change the if expression to the following:

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_24_ter_if_not_equal_zero/src/lib.cairo}}

```

Running this code will print `number was something other than zero`.

### Handling Multiple Conditions with `else if`

You can use multiple conditions by combining if and else in an else if expression. For example:

<span class="filename">Filename: src/lib.cairo</span>

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_25_else_if/src/lib.cairo}}
```

This program has four possible paths it can take. After running it, you should see the following output:

```shell
$ scarb cairo-run --available-gas=20000000
number is 3
Run completed successfully, returning []
Remaining gas: 1999937120
```

When this program executes, it checks each `if` expression in turn and executes the first body for which the condition evaluates to `true`. Note that even though `number - 2 == 1` is `true`, we don’t see the output `number minus 2 is 1'` nor do we see the `number not found` text from the `else` block. That’s because Cairo only executes the block for the first true condition, and once it finds one, it doesn’t even check the rest. Using too many `else if` expressions can clutter your code, so if you have more than one, you might want to refactor your code. [Chapter 6](./ch06-02-the-match-control-flow-construct.md) describes a powerful Cairo branching construct called `match` for these cases.

### Using `if` in a `let` statement

Because if is an expression, we can use it on the right side of a let statement to assign the outcome to a variable.

<span class="filename">Filename: src/lib.cairo</span>

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_26_if_let/src/lib.cairo}}
```

```shell
$ scarb cairo-run --available-gas=20000000
condition was true and number is 5
Run completed successfully, returning []
Remaining gas: 1999780390
```

The `number` variable will be bound to a value based on the outcome of the `if` expression. Which will be 5 here.

### Repetition with Loops

It’s often useful to execute a block of code more than once.
For this task, Cairo provides two simple looping constructs: `while` and `loop`.

#### Repeating Code with `while`

The `while` keyword tells Cairo to execute a block of code while a condition is true.

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_27_infinite_while_loop/src/lib.cairo}}
```

When we run this program, we’ll see `i = 0` printed over and over continuously
until we stop the program manually, because the stop condition `i <= 10` will never be satisfied.
While the compiler prevents us from writing programs without a stop condition,
the stop condition might never be reached, resulting in an infinite loop.

Most terminals support the keyboard shortcut <span class="keystroke">ctrl-c</span> to interrupt a program that is
stuck in a continual loop. Give it a try:

```shell
$ scarb cairo-run --available-gas=20000000
i = 0
i = 0
i = 0
...
i = 0
Run panicked with [375233589013918064796019 ('Out of gas'), ].
Remaining gas: 120810
```

> Note: Cairo prevents us from running program with infinite loops by including a gas meter. The gas meter is a mechanism that limits the amount of computation that can be done in a program. By setting a value to the `--available-gas` flag, we can set the maximum amount of gas available to the program. Gas is a unit of measurement that expresses the computation cost of an instruction. When the gas meter runs out, the program will stop. In this case, the program panicked because it ran out of gas, as the stop condition was never reached.
> It is particularly important in the context of smart contracts deployed on Starknet, as it prevents from running infinite loops on the network.
> If you're writing a program that needs to run a loop, you will need to execute it with the `--available-gas` flag set to a value that is large enough to run the program.

Let's fix the infinite loop by adding `i += 1` to the loop body:

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_28_while_loop/src/lib.cairo}}
```

If you want to explicitly break out of a loop inside the loop body, you can use the `break` keyword.
We can add a `break` statement to the loop to stop the loop when `i` is equal to `5` for example:

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_29_while_loop_break/src/lib.cairo}}
```

> We could simply use `i == 5` as the condition of the `while` loop, but we want to demonstrate the use of the `break` keyword.

`break` are particularly useful when you want to stop a loop based on a condition that involves the state of the program that is being updated in the loop body.
`break` is also used in `loop` expressions, which we will see in the next section.

Lastly, we can skip the rest of the code in the current iteration of the loop and start a new iteration by using the `continue` keyword.
Note that the stop condition of the loop will be checked when `continue` is used.
Let's add a `continue` statement to our loop to skip the `print` statement when `i` is equal to `5`:

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_30_while_loop_continue/src/lib.cairo}}
```

Executing this program will not print the value of `i` when it is equal to `5`.

#### Repeating Code with `loop`

The `loop` keyword tells Cairo to execute a block of code over and over again forever or until you explicitly tell it to stop.
You can think of a `loop` as a `while` loop with a condition that is always `true`. We can also use `break` and `continue` in `loop` expressions.

Here's the same program as above, but using a `loop` instead of a `while` loop, by using the `break` keyword to handle the stop condition:

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_31_loop/src/lib.cairo}}
```

> Before Cairo 2.5.0, it was the only way to create a loop.

#### Returning Values in Loops with `break` and `loop`

One of the uses of a `loop` is to retry an operation you know might fail, such
as checking whether an operation has succeeded. You might also need to pass
the result of that operation out of the loop to the rest of your code. To do
this, you can add the value you want returned after the `break` expression you
use to stop the loop; that value will be returned out of the loop so you can
use it, as shown here:

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_32_loop_return_values/src/lib.cairo}}
```

Before the loop, we declare a variable named `counter` and initialize it to
`0`. Then we declare a variable named `result` to hold the value returned from
the loop. On every iteration of the loop, we check whether the `counter` is equal to `10`, and then add `1` to the `counter` variable.
When the condition is met, we use the `break` keyword with the value `counter * 2`. After the loop, we use a
semicolon to end the statement that assigns the value to `result`. Finally, we
print the value in `result`, which in this case is `20`.

> This is only possible with `loop` expressions, not with `while` loops.

## Summary

You made it! This was a sizable chapter: you learned about variables, data types, functions, comments,
`if` expressions and loops! To practice with the concepts discussed in this chapter,
try building programs to do the following:

- Generate the _n_-th Fibonacci number.
- Compute the factorial of a number _n_.

Now, we’ll review the common collection types in Cairo in the next chapter.
