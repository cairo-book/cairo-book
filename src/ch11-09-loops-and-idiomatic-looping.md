# Loops 

In Cairo, the `loop` keyword is used to assign a specific code block to run indefinitely until a predefined condition is satisfied. We use the keyword `break` to explicitly end the loop. 

We also utilized Sierra to analyze the similarities between recursion and `loop` keyword.  

In this chapter, we will uncover the following topics about `loop` keyword: 

1. How `loop` compiles down to recursion by looking at Sierra and gas usage. 
2. Possible ownership issues that might come across when using `loop`. 


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

Next, we will examine the two Cairo examples in Sierra and note any findings that can help us understand how the `loop` keyword is compiled to recursion. 

>Note: For our example, our findings came from understanding the **statments** section in Sierra that shows the execution traces of the two programs. If you are curious to learn more about Sierra, check out the three [blog](https://medium.com/nethermind-eth/under-the-hood-of-cairo-1-0-exploring-sierra-7f32808421f5) series by Mathieu. 

Notable findings from Sierra: 

1. **Initialization**: Both the loop and recursive implementations start with similar initialization steps. They both disable allocation pointer (AP) tracking, set up constants, and prepare necessary arguments for respective function calls. 

2. **Arguments**: Both versions require the same set of arguments for their respective function calls, including RangeCheck, GasBuiltin, and the variable being manipulated. 

3. **AP Tracking**: Both programs invoke `disable_ap_tracking` to suspend tracking of the allocation pointer (AP). This is because during compilation, the Cairo compiler cannot statically determine the exact number of iterations for loops or recursive calls at compile-time. This demonstrates that the compiler treats `loop` similarly to recursive function calls in terms of control flow and optimization.

These three findings suggests that loop internally compiles into recursion due to similar low-level representations and execution patterns. 

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

From the result, we can see that both examples have nearly identical gas usage. This can suggest that the compiler treats loop syntax as functionally equivalent to explicit recursive calls, leading to consistent performance and gas consumption. 

## Ownership Issues with Loop

We will look at how iterating and accessing values in `loop` can cause ownership issues. 

From our example, we are iterating over the `pizza_ingredients` array and appending the felt252 value of `mushroom` to the `ingredient` array. In the case where `mushroom` is not found, it prints `Ingredients not found` message. After `append`, we print the value of `ingredient.at(0)`. 

```rust,noplayground
{{#include ../listings/ch11-advanced-features/listing_06_loop/src/examples/ownership_example_complex.cairo}}
```

This code will output compile-time error with `variable was previously used here` message when we try to print the value of `ingredient.at(0)`. The error happens because once the `ingredient` array is passed to `append` function, it's original `ingredient` array is destroyed and a new one is created under the scope of the `loop` keyword. We can fix it by retrieving the `ingredient` array after the `loop` scope is finished. 

```rust,noplayground
{{#include ../listings/ch11-advanced-features/listing_06_loop/src/examples/ownership_example_complex_fixed.cairo}}
``` 

From the code above, we have mitigated the issue by returning the `ingredient` array after the `loop` scope is finished under the new variable `result`. This way, we can bring back the ownership of `ingredient` and have access to the appended value in `ingredient.at(0)`. 

