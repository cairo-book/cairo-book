# Inlining in Cairo

Inlining is a common code optimization technique supported by most compilers. It involves replacing a function call at the call site with the actual code of the called function, eliminating the overhead associated with the function call itself. This can improve performance by reducing the number of instructions executed, but may increase the total size of the program. When you're thinking about whether to inline a function, take into account things like how big it is, what parameters it has, how often it gets called, and how it might affect the size of your compiled code.

## The `inline` attribute

In Cairo, the `inline` attribute suggests whether or not the Sierra code corresponding to the attributed function should be directly injected in the caller function's context, rather than using a `function_call` libfunc to execute that code.

There are three variants of the `inline` attribute that one can use:
- `#[inline]` suggests performing an inline expansion.
- `#[inline(always)]` suggests that an inline expansion should always be performed.
- `#[inline(never)]` suggests that an inline expansion should never be performed.

> Note: the `inline` attribute in every form is a hint, with no requirements on the language to place a copy of the attributed function in the caller. This means that the attribute may be ignored by the compiler. In practice, `#[inline(always)]` will cause inlining in all but the most exceptional cases.

Many of the Cairo corelib functions are inlined. User-defined functions may also be annotated with the `inline` attribute. Annoting functions with the `#[inline(always)]` attribute reduces the total number of steps required when calling these attributed functions. Indeed, injecting the Sierra code at the caller site avoids the step-cost involved in calling functions and obtaining their arguments.

However, inlining can also lead to increased code size. Whenever a function is inlined, the call site contains a copy of the function's Sierra code, potentially leading to duplication of code across the compiled code.

Therefore, inlining should be applied with cautious. Using the `#[inline]` or `#[inline(always)]` indiscriminately will lead to increased compile time. It is particularly useful to inline small functions, ideally with many arguments. This is because inlining large functions will increase the code length of the program, and handling many arguments will increase the number of steps to execute these functions.

The more frequently a function is called, the more beneficial inlining becomes in terms of performance. By doing so, the number of steps for the execution will be lower, while the code length will not grow that much or might even decrease in terms of total number of instructions.

> Inlining is often a tradeoff between number of steps and code length. Use the `inline` attribute cautiously where it is appropriate.

## Inlining Example

Let's introduce a short example to illustrate the mechanisms of inlining in Cairo. Listing {{#ref inlining}} shows a basic program allowing comparison between inlined and not-inlined functions.

```rust
{{#rustdoc_include ../listings/ch11-advanced-features/listing_03_inlining_example/src/lib.cairo}}
```

{{#label inlining}}
<span class="caption">Listing {{#ref inlining}}: A small Cairo program that calls 2 functions, with one of them being inlined.</span>

Let's take a look at the corresponding Sierra code to see how inlining works under the hood:

```rust
{{#rustdoc_include ../listings/ch11-advanced-features/listing_03_inlining_example/src/inlining.sierra}}
```

The Sierra file is structured in three parts:
- Type and libfunc declarations.
- Statements that constitute the program.
- Declaration of the functions of the program.

The Sierra code statements always match the order of function declarations in the Cairo program. This means that the `return([2])` statement on line 15, which is the first `return` instruction of the Sierra program, corresponds to the `main` function return instruction. The `return([0])` statement on line 18 corresponds to the `inlined` function return instruction, and the `return([0])` on line 21 is the return instruction of the `not_inlined` function.

All statements corresponding to the `main` function are located between lines 10 and 15:

```rust,noplayground
10	function_call<user@main::main::not_inlined>() -> ([0]) // 0
11	felt252_const<1>() -> ([1]) // 1
12	store_temp<felt252>([1]) -> ([1]) // 2
13	felt252_add([1], [0]) -> ([2]) // 3
14	store_temp<felt252>([2]) -> ([2]) // 4
15	return([2]) // 5
```

On line 10, we can see the call to the `function_call` libfunc instantiated with the `not_inlined` function and previously declared on line 4, which will execute all the code from lines 19 to 20: 

```rust,noplayground
19	felt252_const<2>() -> ([0])
20	store_temp<felt252>([0]) -> ([0])
```

This libfunc call stores the value `2` in `[0]`. After that, Sierra statements from line 11 to 12 are the actually body of the `inlined` function: 

```rust,noplayground
16	felt252_const<1>() -> ([0])
17	store_temp<felt252>([0]) -> ([0])
```

The only difference is that the inlined code will store the `felt252_const` value in `[1]` because `[0]` is not available:

```rust,noplayground
11	felt252_const<1>() -> ([1])
12	store_temp<felt252>([1]) -> ([1])
```

> Note: in both cases (inlined or not), the `return` instruction of the function being called is not executed, as this would lead to prematurely end the execution of the `main` function. Instead, return values of `inlined` and `not_inlined` will be added and the result will be returned.

Lines 13 to 15 contains the Sierra statements that will add the values contained in `[0]` and `[1]`, store the result in memory and return it:

```rust,noplayground
13	felt252_add([1], [0]) -> ([2]) // 3
14	store_temp<felt252>([2]) -> ([2]) // 4
15	return([2]) // 5
```

Now, let's take a look at the Casm code corresponding to this program to really understand the benefits of inlining.

## Casm Code Explanations

Here is the Casm code for our previous program example:

```rust,noplayground
1	call rel 3
2	ret
3	call rel 9
4	[ap + 0] = 1, ap++
5	[ap + 0] = [ap + -1] + [ap + -2], ap++
6	ret
7	[ap + 0] = 1, ap++
8	ret
9	[ap + 0] = 2, ap++
10	ret
11	ret
```

Each instruction and each argument for any instruction increments the Program Counter (known as PC) by 1. The `call` and `ret` instructions allow implementation of a function stack:
- `call` instruction acts like a jump instruction and updates the PC and the Frame Pointer (known as `fp`) registers.
- `ret` resets the value of `fp` to the value prior to the `call` instruction, and jump back and continue the execution of the code following the call instruction.

We can now decompose how these instructions are executed to understand what this code does:
- `call rel 3`: this instruction updates the PC and the `fp` to 3 and executes the instruction at this location, which is `3	call rel 9`.
- `call rel 9` updates the PC and the `fp` to 9 and executes the instruction at this location.
- `[ap + 0] = 2, ap++`: `ap` stands for Allocation Pointer, which points to the first memory cell that has not been used by the program so far. This means we store the value `2` in `[ap - 1]`, as we applied `ap++` at the end of the line. Then, we go to the next line which is `ret`.
- `ret`: resets the value of `fp` and jump back to the line after `call rel 9`, so we go to line 4.
- `[ap + 0] = 1, ap++` : We store the value `1` in `[ap]` and we apply `ap++` so that `[ap - 1] = 1`. This means we now have `[ap-1] = 1, [ap-2] = 2` and we go to the next line.
- `[ap + 0] = [ap + -1] + [ap + -2], ap++`: we sum the values `1` and `2` and store the result in `[ap]`, and we apply `ap++` so the result is `[ap-1] = 3, [ap-2] = 1, [ap-3]=2`.
- `ret`: resets the value of `fp` and jump back to the line after `call rel 3`, so we go to line 2.
- `ret`: last instruction executed as there is no more `call` instruction where to jump right after. This is the actual return instruction of the Cairo `main` function.

Note the pattern of a call instruction followed immediately by a ret instruction. This is a tail recursion, where the return values of the called function are forwarded. To summary: 
- `call rel 3` corresponds to the `main` function, which is obviously not inlined.
- `call rel 9` triggers the call the `not_inlined` function, which returns `2` and actually stores it at the final location `[ap-3]`.
- The line 4 is the inlined code of the `inlined` function, which returns `1`  and actually stores it at the final location `[ap-2]`. We clearly see that there is no `call` instruction in this case, because the body of the function is directly executed.
- After that, the sum is executed and we ultimately go back to the line 2 which contains the final `ret` instruction that returns of the sum, corresponding to the return value of the `main` function.

It is interesting to note that in both Sierra code and Casm code, the `not_inlined` function will be called and executed before the body of the `inlined` function, even though the Cairo program executes `inlined() + not_inlined()`.

> The Cams code of our program clearly shows that there is a function call for the `non_inlined` function, while the `inlined` function is correctly inlined.

## Additional Optimizations

Let's study another program that shows other benefits that inlining may sometimes provide. Listing {{#ref code_removal}} shows a Cairo program that calls 2 functions and doesn't return anything:

```rust
{{#rustdoc_include ../listings/ch11-advanced-features/listing_02_inlining/src/lib.cairo}}
```

{{#label code_removal}}
<span class="caption">Listing {{#ref code_removal}}: A small Cairo program that calls `inlined` and `not_inlined` and doesn't return any value.</span>

Here is the corresponding Sierra code:

```rust
{{#rustdoc_include ../listings/ch11-advanced-features/listing_02_inlining/src/inlining.sierra}}
```

In this specific case, we can observe that the compiler has applied additional optimizations to the `main` function of our code : the code of the `inlined` function, which is annotated with the `#[inline(always)]` attribute, is actually not copied in the `main` function. Instead, the `main` function starts with the `function_call` libfunc to call the `not_inlined` function, entirely omitting the code of the `inlined` function.

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