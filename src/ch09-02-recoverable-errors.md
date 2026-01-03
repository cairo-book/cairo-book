# Recoverable Errors with `Result`

Most errors aren’t serious enough to require the program to stop entirely.
Sometimes, when a function fails, it’s for a reason that you can easily
interpret and respond to. For example, if you try to add two large integers and
the operation overflows because the sum exceeds the maximum representable value,
you might want to return an error or a wrapped result instead of causing
undefined behavior or terminating the process.

## The `Result` Enum

Recall from [Generic data types][generic enums] section in Chapter
{{#chap generic-types-and-traits}} that the `Result` enum is defined as having
two variants, `Ok` and `Err`, as follows:

```cairo,noplayground
{{#include ../listings/ch09-error-handling/no_listing_07_result_enum/src/lib.cairo}}
```

The `Result<T, E>` enum has two generic types, `T` and `E`, and two variants:
`Ok` which holds the value of type `T` and `Err` which holds the value of type
`E`. This definition makes it convenient to use the `Result` enum anywhere we
have an operation that might succeed (by returning a value of type `T`) or fail
(by returning a value of type `E`).

[generic enums]: ./ch08-01-generic-data-types.md#enums

## The `ResultTrait`

The `ResultTrait` trait provides methods for working with the `Result<T, E>`
enum, such as unwrapping values, checking whether the `Result` is `Ok` or `Err`,
and panicking with a custom message. The `ResultTraitImpl` implementation
defines the logic of these methods.

```cairo,noplayground
{{#include ../listings/ch09-error-handling/no_listing_08_result_trait/src/lib.cairo}}
```

The `expect` and `unwrap` methods are similar in that they both attempt to
extract the value of type `T` from a `Result<T, E>` when it is in the `Ok`
variant. If the `Result` is `Ok(x)`, both methods return the value `x`. However,
the key difference between the two methods lies in their behavior when the
`Result` is in the `Err` variant. The `expect` method allows you to provide a
custom error message (as a `felt252` value) that will be used when panicking,
giving you more control and context over the panic. On the other hand, the
`unwrap` method panics with a default error message, providing less information
about the cause of the panic.

The `expect_err` and `unwrap_err` methods have the exact opposite behavior. If
the `Result` is `Err(x)`, both methods return the value `x`. However, the key
difference between the two methods is in case of `Ok()`. The `expect_err` method
allows you to provide a custom error message (as a `felt252` value) that will be
used when panicking, giving you more control and context over the panic. On the
other hand, the `unwrap_err` method panics with a default error message,
providing less information about the cause of the panic.

A careful reader may have noticed the `<+Drop<T>>` and `<+Drop<E>>` in the first
four methods signatures. This syntax represents generic type constraints in the
Cairo language, as seen in the previous chapter. These constraints indicate that
the associated functions require an implementation of the `Drop` trait for the
generic types `T` and `E`, respectively.

Finally, the `is_ok` and `is_err` methods are utility functions provided by the
`ResultTrait` trait to check the variant of a `Result` enum value.

- `is_ok` takes a snapshot of a `Result<T, E>` value and returns `true` if the
  `Result` is the `Ok` variant, meaning the operation was successful. If the
  `Result` is the `Err` variant, it returns `false`.
- `is_err` takes a snapshot of a `Result<T, E>` value and returns `true` if the
  `Result` is the `Err` variant, meaning the operation encountered an error. If
  the `Result` is the `Ok` variant, it returns `false`.

These methods are helpful when you want to check the success or failure of an
operation without consuming the `Result` value, allowing you to perform
additional operations or make decisions based on the variant without unwrapping
it.

You can find the implementation of the `ResultTrait` [here][result corelib].

It is always easier to understand with examples. Have a look at this function
signature:

```cairo,noplayground
{{#include ../listings/ch09-error-handling/no_listing_09_result_example/src/lib.cairo:overflow}}
```

It takes two `u128` integers, `a` and `b`, and returns a `Result<u128, u128>`
where the `Ok` variant holds the sum if the addition does not overflow, and the
`Err` variant holds the overflowed value if the addition does overflow.

Now, we can use this function elsewhere. For instance:

```cairo,noplayground
{{#include ../listings/ch09-error-handling/no_listing_09_result_example/src/lib.cairo:checked-add}}

```

Here, it accepts two `u128` integers, `a` and `b`, and returns an
`Option<u128>`. It uses the `Result` returned by `u128_overflowing_add` to
determine the success or failure of the addition operation. The `match`
expression checks the `Result` from `u128_overflowing_add`. If the result is
`Ok(r)`, it returns `Some(r)` containing the sum. If the result is `Err(r)`, it
returns `None` to indicate that the operation has failed due to overflow. The
function does not panic in case of an overflow.

Let's take another example:

```cairo,noplayground
{{#include ../listings/ch09-error-handling/listing_09_01/src/lib.cairo:function}}
```

In this example, the `parse_u8` function takes a `felt252` and tries to convert
it into a `u8` integer using the `try_into` method. If successful, it returns
`Ok(value)`, otherwise it returns `Err('Invalid integer')`.

Our two test cases are:

```cairo,noplayground
{{#rustdoc_include ../listings/ch09-error-handling/listing_09_01/src/lib.cairo:tests}}
```

Don't worry about the `#[cfg(test)]` attribute for now. We'll explain in more
detail its meaning in the next [Testing Cairo Programs][tests] chapter.

`#[test]` attribute means the function is a test function, and `#[should_panic]`
attribute means this test will pass if the test execution panics.

The first one tests a valid conversion from `felt252` to `u8`, expecting the
`unwrap` method not to panic. The second test function attempts to convert a
value that is out of the `u8` range, expecting the `unwrap` method to panic with
the error message `Invalid integer`.

[result corelib]:
  https://github.com/starkware-libs/cairo/blob/main/corelib/src/result.cairo#L20
[tests]: ./ch10-01-how-to-write-tests.md

## Propagating Errors

When a function’s implementation calls something that might fail, instead of
handling the error within the function itself you can return the error to the
calling code so that it can decide what to do. This is known as _propagating_
the error and gives more control to the calling code, where there might be more
information or logic that dictates how the error should be handled than what you
have available in the context of your code.

For example, Listing {{#ref match-example}} shows an implementation of a
function that tries to parse a number as `u8` and uses a match expression to
handle a potential error.

```cairo, noplayground
{{#include ../listings/ch09-error-handling/listing_result_match/src/lib.cairo:function}}
```

{{#label match-example}} <span class="caption">Listing {{#ref match-example}}: A
function that returns errors to the calling code using a `match`
expression.</span>

The code that calls this `parse_u8` will handle getting either an `Ok` value
that contains a number or an `Err` value that contains an error message. It’s up
to the calling code to decide what to do with those values. If the calling code
gets an `Err` value, it could call `panic!` and crash the program, or use a
default value. We don’t have enough information on what the calling code is
actually trying to do, so we propagate all the success or error information
upward for it to handle appropriately.

This pattern of propagating errors is so common in Cairo that Cairo provides the
question mark operator `?` to make this easier.

## A Shortcut for Propagating Errors: the `?` Operator

Listing {{#ref question-operator}} shows an implementation of `mutate_byte` that
has the same functionality as the one in Listing {{#ref match-example}} but uses
the `?` operator to gracefully handle errors.

```cairo, noplayground
{{#rustdoc_include ../listings/ch09-error-handling/listing_qmark_op/src/lib.cairo:function}}
```

{{#label question-operator}} <span class="caption">Listing
{{#ref question-operator}}: A function that returns errors to the calling code
using the `?` operator.</span>

The `?` placed after a `Result` value is defined to work in almost the same way
as the `match` expressions we defined to handle the `Result` values in
Listing 1. If the value of the `Result` is an `Ok`, the value inside the `Ok`
will get returned from this expression, and the program will continue. If the
value is an `Err`, the `Err` will be returned from the whole function as if we
had used the `return` keyword so the error value gets propagated to the calling
code.

In the context of Listing 2, the `?` at the end of the `parse_u8` call will
return the value inside an `Ok` to the variable `input_to_u8`. If an error
occurs, the `?` operator will return early out of the whole function and give
any `Err` value to the calling code.

The `?` operator eliminates a lot of boilerplate and makes this function’s
implementation simpler and more ergonomic.

### Where The `?` Operator Can Be Used

The `?` operator can only be used in functions whose return type is compatible
with the value the `?` is used on. This is because the `?` operator is defined
to perform an early return of a value out of the function, in the same manner as
the `match` expression we defined in Listing {{#ref match-example}}. In Listing
{{#ref match-example}}, the `match` was using a `Result` value, and the early
return arm returned an `Err(e)` value. The return type of the function has to be
a `Result` so that it’s compatible with this return.

In Listing {{#ref question-operator-wrong-return}}, let’s look at the error
we’ll get if we use the `?` operator in a function with a return type that is
incompatible with the type of the value we use `?` on.

```cairo
{{#rustdoc_include ../listings/ch09-error-handling/listing_invalid_qmark/src/lib.cairo:main}}
```

{{#label question-operator-wrong-return}} <span class="caption">Listing
{{#ref question-operator-wrong-return}}: Attempting to use the `?` in a `main`
function that returns `()` won’t compile.</span>

This code calls a function that might fail. The `?` operator follows the
`Result` value returned by `parse_u8`, but this `main` function has the return
type of `()`, not `Result`. When we compile this code, we get an error message
similar to this:

```text
{{#include ../listings/ch09-error-handling/listing_invalid_qmark/output.txt}}
```

This error points out that we’re only allowed to use the `?` operator in a
function that returns `Result` or `Option`.

To fix the error, you have two choices. One choice is to change the return type
of your function to be compatible with the value you’re using the `?` operator
on as long as you have no restrictions preventing that. The other choice is to
use a `match` to handle the `Result<T, E>` in whatever way is appropriate.

The error message also mentioned that `?` can be used with `Option<T>` values as
well. As with using `?` on `Result`, you can only use `?` on `Option` in a
function that returns an `Option`. The behavior of the `?` operator when called
on an `Option<T>` is similar to its behavior when called on a `Result<T, E>`: if
the value is `None`, the `None` will be returned early from the function at that
point. If the value is `Some`, the value inside the `Some` is the resultant
value of the expression, and the function continues.

### Summary

We saw that recoverable errors can be handled in Cairo using the `Result` enum,
which has two variants: `Ok` and `Err`. The `Result<T, E>` enum is generic, with
types `T` and `E` representing the successful and error values, respectively.
The `ResultTrait` provides methods for working with `Result<T, E>`, such as
unwrapping values, checking if the result is `Ok` or `Err`, and panicking with
custom messages.

To handle recoverable errors, a function can return a `Result` type and use
pattern matching to handle the success or failure of an operation. The `?`
operator can be used to implicitly handle errors by propagating the error or
unwrapping the successful value. This allows for more concise and clear error
handling, where the caller is responsible for managing errors raised by the
called function.

{{#quiz ../quizzes/ch09-02-error-handling-result.toml}}
