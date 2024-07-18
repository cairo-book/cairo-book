# Loops 

In Cairo, the `loop` keyword is used to assign a specific code block to run indefinitely until a predefined condition is satisfied. We use the keyword `break` to explicitly end the loop. 

We will also encounter snippets of Sierra which is an intermediary representation of Cairo and one of its purpose is to ensure that only valid Cairo programs can be deployed to the Starknet blockchain. 

In this chapter, we will uncover the following topics about `loop` keyword: 

1. How `loop` keyword compiles to recursion by looking at Sierra and gas usage. 
2. Possible ownership issues that might come across when using `loop`. 
3. Comparing gas costs of accessing arrays with `loop` using `match` with `pop_front` vs directly accessing the array by the subscript.

## Comparing Loop and Recursion

As a refresher, loops are typically used to iterate over a collection of items until a condition is met.

```rust,noplayground
{{#include ../listings/ch11-advanced-features/listing_06_loop/src/examples/loop_example.cairo}}
```

In this case, the code block inside `loop` will repeat itself until `x == 2` is met. 

On the other hand, a recursive function repetitively calls itself until the condition is satisfied. 

```rust,noplayground
{{#include ../listings/ch11-advanced-features/listing_06_loop/src/examples/recursion_example.cairo}}
```

In this case, the `recursive` function will call itself until `x == 2` condition is met. 

Next, we will examine the two Cairo examples in Sierra to see how `loop` compiles to recursion. 

**Loop**
```rust,noplayground
00 disable_ap_tracking() -> () 
01 const_as_immediate<Const<felt252, 0>>() -> ([2])
02 store_temp<RangeCheck>([0]) -> ([0]) 
03 store_temp<GasBuiltin>([1]) -> ([1]) 
04 store_temp<felt252>([2]) -> ([2]) 
05 function_call<user@main::main::loop_function[expr43]>([0], [1], [2]) -> ([3], [4], [5]) 
```

**Recursion**
```rust,noplayground
00 disable_ap_tracking() -> () 
01 const_as_immediate<Const<felt252, 0>>() -> ([2]) 
02 store_temp<RangeCheck([0]) -> ([0])
03 store_temp<GasBuiltin>([1]) -> ([1])
04 store_temp<felt252>([2])-> ([2])
05 function_call<user@main::main::recursive_function>([0], [1], [2]) -> ([3], [4], [5]) 
```

>Note: For our example, we will be looking at the snippets of the *statements* section in Sierra that shows the execution traces of the two programs. To learn more about Sierra, check out the three [blog](https://medium.com/nethermind-eth/under-the-hood-of-cairo-1-0-exploring-sierra-7f32808421f5) series by Mathieu. 

Notable findings from the Sierra code:

1. Both programs invoke `disable_ap_tracking` to suspend tracking of the allocation pointer (AP). This is because during compilation, the Cairo compiler cannot statically determine the exact number of iterations for loops or recursive calls at compile-time. This demonstrates that the compiler treats `loop` similarly to recursive function calls in terms of control flow and optimization. 

2. Before the recursive/loop function is called both examples require the same arguments which includes RangeCheck, GasBuiltin, and the variable that is being manipulated.

Next, let's look at the gas usage between the two examples.

```bash,noplayground
testing advanced_cairo ...
running 1 test
x = 2
test advanced_cairo::normal::loop_test::tests::test_loop ... ok (gas usage est.: 195030)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 filtered out;
```

```bash,noplayground
testing advanced_cairo ...
running 1 test
x = 2
test advanced_cairo::normal::recursion_test::tests::test_recursion ... ok (gas usage est.: 194430)
test result: ok. 1 passed; 0 failed; 0 ignored; 0 filtered out;
```

From the result, we can see that both examples have similar gas usage. This can suggest that in this specific case, Cairo's `loop` keyword compiles into a recursive form similar to the explicit recursion example, resulting in comparable execution costs.  

## Ownership Issues with Loop

When using `loop`, there are some ownership issues that you might come across. 

```rust,noplayground
{{#include ../listings/ch11-advanced-features/listing_06_loop/src/examples/simple_ownership_example.cairo}}
```

This code will output `Failed to infer` error due to the variable `x` being out of scope. 

The issue arises from Cairo's unique ownership which states that once a variable goes out of scope, it is destroyed. (see [Ownership][ownership]) Therefore, the variable that you are trying to manipulate inside `loop` must be declared outside of the `loop` block. 

[ownership]: ./ch04-01-what-is-ownership.md

A way to mitigate this issue is by declaring a variable that will equal to the output of the `loop` block. 

```rust,noplayground
{{#include ../listings/ch11-advanced-features/listing_06_loop/src/examples/simple_ownership_example_fixed.cairo}}
```

Next, we will look at how iterating and accessing values in `loop` can cause ownership issues. 

On here, we are trying to match a specific index in the `pizza_ingredients` array and in particular, we are iterating through the array until we find the `mushroom` variable then append the variable to the new `result` array. 

```rust,noplayground
{{#include ../listings/ch11-advanced-features/listing_06_loop/src/examples/ownership_example_complex.cairo}}
```

This code will output compile-time error with `variable was previously used here` message . Due to the way ownership works in Cairo, once a variable is moved, its original reference is destroyed and a new variable is created under the new scope. In this case, the `result` array is moved under `Option::Some` scope  and the compiler will not allow the variable to be used again under a new scope under `Option::None` condition.

To mitigate the issue, we can snapshot the array (see [Snapshots][Snapshots]) to create an immutable reference of the array instead of taking ownership of the array. 

[Snapshots]: ./ch04-02-references-and-snapshots.md#snapshots


## Comparing Gas Costs of Accessing Arrays with Loop

We will be comparing the gas costs of accessing arrays with `loop` using `match` with `pop_front` vs directly accessing the array by the subscript.


```rust,noplayground
{{#include ../listings/ch11-advanced-features/listing_06_loop/src/examples/gas_cost_example.cairo}}
```

For `loop_array` function, we perform test by setting the `assert_eq!` macro to the desired value that we want to match in the array. This means that the function will iterate through the array until the `value` matches to the `some` variable. 
For `access_array` function, we directly access the value in array by passing the desired index in the argument.

```bash,noplayground
testing advanced_cairo ...
running 2 tests
test advanced_cairo::normal::gas_test::tests::test_access_array ... ok (gas usage est.: 182980)
test advanced_cairo::normal::gas_test::tests::test_loop_array ... ok (gas usage est.: 200790)
test result: ok. 2 passed; 0 failed; 0 ignored; 0 filtered out;
```

The result shows that both methods use similar gas with `loop_array` being slightly higher. The test suggests that Cairo developers does not have to sacrifice too much in gas to utilize match operation inside `loop` when accessing arrays with a predefined value to search in the array.  

