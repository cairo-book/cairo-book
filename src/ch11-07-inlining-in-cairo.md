# Inlining in Cairo

The process of _inlining_ is a well-known method for optimizing code execution. It is supported by many compilers, whether automatically or not. Basically, inlining allows to replace a call to a function with its actual body. In certain situations, such a transformation might improve performance by eliminating the overhead of the function call itself, leading to a faster code generation.

## The `inline` attribute

In Cairo, the `inline` attribute suggests that the Sierra code corresponding to the attributed function should be directly injected in the caller function's context, rather than using a `function_call` libfunc to execute that code.

There are three ways to use the inline attribute:
- `#[inline]` suggests performing an inline expansion.
- `#[inline(always)]` suggests that an inline expansion should always be performed.
- `#[inline(never)]` suggests that an inline expansion should never be performed.

> Note: the `inline` attribute in every form is a hint, with no requirements on the language to place a copy of the attributed function in the caller. This means that the attribute may be ignored by the compiler.

Many of the Cairo corelib functions are inlined. User-defined functions may also be annotated with the `inline` attribute. Doing this reduces the total number of steps required when calling these attributed functions. Indeed, injecting the Sierra code at the caller site avoids the step-cost involved in calling functions and obtaining their arguments.

However, inlining can also lead to increased code size. Whenever a function is inlined, the call site contains a copy of the function's Sierra code, potentially leading to duplication of code across the codebase.

Therefore, inlining should be applied with cautious. Using the `#[inline]` or `#[inline(always)]` indiscriminately will lead to increased compile time. It is particularly useful to inline small functions, ideally with many arguments. The more frequently a function is called, the more beneficial inlining becomes in terms of performance. By doing so, the number of steps for the execution will be lower, while the code lenght will not grow that much or might even decrease in terms of total number of instructions.

> Inlining is often a tradeoff between number of steps and code length. Use the `inline` attribute cautiously where it is appropriate.

## Inlining example

Let's introduce a short example to illustrate the mechanisms of inlining in Cairo. Listing {{#ref inlining}} shows a basic program allowing comparison between inlined and not-inlined functions.

```rust
{{#rustdoc_include ../listings/ch11-advanced-features/listing_02_inlining/src/lib.cairo}}
```

{{#label inlining}}
<span class="caption">Listing {{#ref inlining}}: A small programm that prints 2 `ByteArray` values in the `main` function.</span>

First of all, let's run our program and see what the result is:

```shell
$ scarb cairo-run
First function call is inlined
Second function call is not inlined
Run completed successfully, returning []
```

Both `inlined` and `not_inlined` functions output their respective return values in the same manner, regardless of whether they are inlined or not.

Let's take a look at the corresponding Sierra code to see how inlining works under the hood. The `println!` macro usage here will greatly increase the Sierra code size while adding a lot of complexity in it, this is why we will focus on the following program that only calls  `inlined` and `not_inlined` functions without printing their return values : 

```rust
{{#rustdoc_include ../listings/ch11-advanced-features/listing_03_inlining_sierra/src/lib.cairo}}
```

The Sierra code corresponding to this Cairo program is as follows: 

```rust,noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_03_inlining_sierra/src/inline.sierra}}
```

The Sierra code statements always match the order of function declarations in the Cairo program. This means that the `return([2])` statement on line 26, which is the first `return` instruction of the Sierra program, corresponds to the `main` function return instruction. The `return([3])` statement on line 32 corresponds to the `inlined` function return instruction, and the `return([3])` on line 38 is the return instruction of the `not_inlined` function.

All statements corresponding to the `main` function are located between lines 21 and 26:

```rust,noplayground
21	array_new<bytes31>() -> ([0]) // 0
22	drop<Array<bytes31>>([0]) -> () // 1
23	function_call<user@main::main::not_inlined>() -> ([1]) // 2
24	drop<core::byte_array::ByteArray>([1]) -> () // 3
25	struct_construct<Unit>() -> ([2]) // 4
26	return([2]) // 5
```

On line 23, we can see the call to the `function_call` libfunc instantiated with the `not_inlined` function, which returns 1 value stored in `[1]`. This libfunc was previously declared on line 11:

```rust,noplayground
libfunc function_call<user@main::main::not_inlined> = function_call<user@main::main::not_inlined>
```

In our specific case, we can observe that the compiler has applied additional optimizations to the `main` function of our code : the code of the `inlined` function, which is annotated with the `#[inline(always)]` attribute, is not exactly copied in the `main` function. Instead, 2 lines are added in the Sierra program: 

```rust,noplayground
21	array_new<bytes31>() -> ([0]) // 0
22	drop<Array<bytes31>>([0]) -> () // 1
```

Because `inlined` return value is never used, the compiler optimizes `main` function execution by creating an empty `ByteArray` and then drop it. This will actually reduce the code length while reducing the number of steps required to execute `main`.

On the opposite, line 23 uses the `function_call` libfunc to execute normally the `not_inlined` function. This means that all the code from line 33 to 38 will be executed :

```rust,noplayground
33	array_new<bytes31>() -> ([0]) // 12
34	felt252_const<133508164995039583817065828>() -> ([1]) // 13
35	u32_const<11>() -> ([2]) // 14
36	struct_construct<core::byte_array::ByteArray>([0], [1], [2]) -> ([3]) // 15
37	store_temp<core::byte_array::ByteArray>([3]) -> ([3]) // 16
38	return([3]) // 17
```

Line 38 stores the `ByteArray` return value in `[3]`.  This value is then dropped on line 24 in the `main` function: 

```rust,noplayground
24	drop<core::byte_array::ByteArray>([1]) -> () // 3
```

Finally, as the `main` function doesn't return any value, a variable of unit type `()` is created and returned: 

```rust,noplayground
25	struct_construct<Unit>() -> ([2])
26	return([2])
```

## Summary

Inlining is a compiler optimization technique that can be very useful in various situations. Inlining a function allows to get rid of the overhead of calling a function with the `function_call` libfunc by injecting the Sierra code directly in the caller function's context, while potentially optimizing the Sierra code executed to reduce the number of steps. If used effectively, inlining can even reduce code length as shown in the previous example.

Nevertheless, applying the `inline` attribute to a function with a lot of code and few parameters might result in an increased code size, especially if the inlined function is used many times in the codebase. Use inlining only where it makes sense to use it.