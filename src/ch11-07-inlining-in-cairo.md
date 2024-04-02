# Inlining in Cairo

Inlining is a common code optimization technique supported by most compilers. It involves replacing a function call at the call site with the actual code of the called function, eliminating the overhead associated with the function call itself. This can improve performance by reducing the number of instructions executed, but may increase the total size of the program. When you're thinking about whether to inline a function, take into account things like how big it is, what parameters it has, how often it gets called, and how it might affect the size of your compiled code.

## The `inline` attribute

In Cairo, the `inline` attribute suggests whether or not the Sierra code corresponding to the attributed function should be directly injected in the caller function's context, rather than using a `function_call` libfunc to execute that code.

There are three variants of the `inline` attribute that one can use:
- `#[inline]` suggests performing an inline expansion.
- `#[inline(always)]` suggests that an inline expansion should always be performed.
- `#[inline(never)]` suggests that an inline expansion should never be performed.

> Note: the `inline` attribute in every form is a hint, with no requirements on the language to place a copy of the attributed function in the caller. This means that the attribute may be ignored by the compiler. In practice, `#[inline(always)]` will cause inlining in all but the most exceptional cases.

Many of the Cairo corelib functions are inlined. User-defined functions may also be annotated with the `inline` attribute. Annoting a function with an inlining attribute reduces the total number of steps required when calling these attributed functions. Indeed, injecting the Sierra code at the caller site avoids the step-cost involved in calling functions and obtaining their arguments.

However, inlining can also lead to increased code size. Whenever a function is inlined, the call site contains a copy of the function's Sierra code, potentially leading to duplication of code across the codebase.

Therefore, inlining should be applied with cautious. Using the `#[inline]` or `#[inline(always)]` indiscriminately will lead to increased compile time. It is particularly useful to inline small functions, ideally with many arguments. This is because inlining large functions will increase the code length of the program, and handling many arguments will increase the number of steps to execute these functions.

The more frequently a function is called, the more beneficial inlining becomes in terms of performance. By doing so, the number of steps for the execution will be lower, while the code length will not grow that much or might even decrease in terms of total number of instructions.

> Inlining is often a tradeoff between number of steps and code length. Use the `inline` attribute cautiously where it is appropriate.

## Inlining example

Let's introduce a short example to illustrate the mechanisms of inlining in Cairo. Listing {{#ref inlining}} shows a basic program allowing comparison between inlined and not-inlined functions.

```rust
{{#rustdoc_include ../listings/ch11-advanced-features/listing_02_inlining/src/lib.cairo}}
```

{{#label inlining}}
<span class="caption">Listing {{#ref inlining}}: A small program that calls 2 functions, with one of them being inlined.</span>

Let's take a look at the corresponding Sierra code to see how inlining works under the hood:

```rust
{{#rustdoc_include ../listings/ch11-advanced-features/listing_02_inlining/src/inline.sierra}}
```

The Sierra file is structured in three parts:
- Type and libfunc declarations.
- Statements that constitute the program.
- Declaration of the functions of the program.

The Sierra code statements always match the order of function declarations in the Cairo program. This means that the `return([1])` statement on line 15, which is the first `return` instruction of the Sierra program, corresponds to the `main` function return instruction. The `return([0])` statement on line 18 corresponds to the `inlined` function return instruction, and the `return([0])` on line 21 is the return instruction of the `not_inlined` function.

All statements corresponding to the `main` function are located between lines 12 and 15:

```rust,noplayground
12	function_call<user@main::main::not_inlined>() -> ([0]) // 0
13	drop<felt252>([0]) -> () // 1
14	struct_construct<Unit>() -> ([1]) // 2
15	return([1]) // 3
```

On line 12, we can see the call to the `function_call` libfunc instantiated with the `not_inlined` function, which returns 1 value stored in `[0]`. This libfunc was previously declared on line 5:

```rust,noplayground
libfunc function_call<user@main::main::not_inlined> = function_call<user@main::main::not_inlined>
```

In our specific case, we can observe that the compiler has applied additional optimizations to the `main` function of our code : the code of the `inlined` function, which is annotated with the `#[inline(always)]` attribute, is actually not copied in the `main` function. Instead, the `main` function starts with the `function_call` libfunc to call the `not_inlined` function, entirely omitting the code of the `inlined` function.

> Because `inlined` return value is never used, the compiler optimizes the `main` function by skipping the `inlined` function code. This will actually reduce the code length while reducing the number of steps required to execute `main`.

On the opposite, line 12 uses the `function_call` libfunc to execute normally the `not_inlined` function. This means that all the code from line 19 to 21 will be executed:

```rust,noplayground
19	felt252_const<133508164995039583817065828>() -> ([0]) // 7
20	store_temp<felt252>([0]) -> ([0]) // 8
21	return([0]) // 9
```

Line 21 stores the `felt252` return value in `[0]`.  This value is then dropped on line 13, as it is not used in the `main` function: 

```rust,noplayground
13	drop<felt252>([0]) -> () // 1
```

Finally, as the `main` function doesn't return any value, a variable of unit type `()` is created and returned: 

```rust,noplayground
14	struct_construct<Unit>() -> ([1]) // 2
15	return([1]) // 3
```

## Summary

Inlining is a compiler optimization technique that can be very useful in various situations. Inlining a function allows to get rid of the overhead of calling a function with the `function_call` libfunc by injecting the Sierra code directly in the caller function's context, while potentially optimizing the Sierra code executed to reduce the number of steps. If used effectively, inlining can even reduce code length as shown in the previous example.

Nevertheless, applying the `inline` attribute to a function with a lot of code and few parameters might result in an increased code size, especially if the inlined function is used many times in the codebase. Use inlining only where it makes sense to use it.