# Unrecoverable Errors with panic

In Cairo, unexpected issues may arise during program execution, resulting in runtime errors. While the panic function from the core library doesn't provide a resolution for these errors, it does acknowledge their occurrence and terminates the program. There are two primary ways that a panic can be triggered in Cairo: inadvertently, through actions causing the code to panic (e.g., accessing an array beyond its bounds), or deliberately, by invoking the panic function.

When a panic occurs, it leads to an abrupt termination of the program. The `panic` function takes an array as an argument, which can be used to provide an error message and performs an unwind process where all variables are dropped and dictionaries squashed to ensure the soundness of the program to safely terminate the execution.

Here is how we can `panic` from inside a program and return the error code `2`:

<span class="filename">Filename: src/lib.cairo</span>

```rust
{{#include ../listings/ch10-error-handling/no_listing_01_panic/src/lib.cairo}}
```

Running the program will produce the following output:

```shell
$ scarb cairo-run --available-gas=200000000
Run panicked with [2 (''), ].
```

As you can notice in the output, the print statement is never reached, as the program terminates after encountering the `panic` statement.

An alternative and more idiomatic approach to panic in Cairo would be to use the `panic_with_felt252` function. This function serves as an abstraction of the array-defining process and is often preferred due to its clearer and more concise expression of intent. By using `panic_with_felt252`, developers can panic in a one-liner by providing a felt252 error message as an argument, making the code more readable and maintainable.

Let's consider an example:

```rust
{{#include ../listings/ch10-error-handling/no_listing_02_with_felt252/src/lib.cairo}}
```

Executing this program will yield the same error message as before. In that case, if there is no need for an array and multiple values to be returned within the error, so `panic_with_felt252` is a more succinct alternative.

## nopanic notation

You can use the `nopanic` notation to indicate that a function will never panic. Only `nopanic` functions can be called in a function annotated as `nopanic`.

Example:

```rust,noplayground
{{#include ../listings/ch10-error-handling/no_listing_03_nopanic/src/lib.cairo}}
```

Wrong example:

```rust,noplayground
{{#include ../listings/ch10-error-handling/no_listing_04_nopanic_wrong/src/lib.cairo}}
```

If you write the following function that includes a function that may panic you will get the following error:

```shell
error: Function is declared as nopanic but calls a function that may panic.
 --> test.cairo:2:12
    assert(1 == 1, 'what');
           ^****^
Function is declared as nopanic but calls a function that may panic.
 --> test.cairo:2:5
    assert(1 == 1, 'what');
    ^********************^
```

Note that there are two functions that may panic here, assert and equality.

## panic_with attribute

You can use the `panic_with` attribute to mark a function that returns an `Option` or `Result`. This attribute takes two arguments, which are the data that is passed as the panic reason as well as the name for a wrapping function. It will create a wrapper for your annotated function which will panic if the function returns `None` or `Err`, the panic function will be called with the given data.

Example:

```rust
{{#include ../listings/ch10-error-handling/no_listing_05_panic_with/src/lib.cairo}}
```

## Using assert

The assert function from the Cairo core library is actually a utility function based on panics. It asserts that a boolean expression is true at runtime, and if it is not, it calls the panic function with an error value. The assert function takes two arguments: the boolean expression to verify, and the error value. The error value is specified as a felt252, so any string passed must be able to fit inside a felt252.

Here is an example of its usage:

```rust
{{#include ../listings/ch10-error-handling/no_listing_06_assert/src/lib.cairo}}
```

We are asserting in main that `my_number` is not zero to ensure that we're not performing a division by 0.
In this example, `my_number` is zero so the assertion will fail, and the program will panic
with the string 'number is zero' (as a felt252) and the division will not be reached.
