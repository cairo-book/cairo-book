# Loops 

In Cairo, the `loop` keyword is used to assign a specific code block to run indefinitely until a predefined condition is satisfied. We use the keyword `break` to explicitly end the loop. 

In this chapter, we will cover the following topics about `loop` keyword: 

1. How `loop` is similar to recursion on Sierra level.
2. Possible ownership issues that might come across when using `loop`. 
3. Comparing gas costs of accessing arrays with `loop` using `match` with `pop_front` vs directly accessing the array by the subscript.

## Comparing Loop and Recursion

As a refresher, loops are typically used to iterate over a collection of items until a condition is met.

```
fn main() {
    let mut i: usize = 0;

    loop {
        if i > 2 {
            break;
        }
        i += 1;
        
    };
}
```

In this case, the code block will increment `x` until `x > 5` is met. Once the condition is met, the loop will exit.

Recursion is done by calling its own function until the condition is satisfied. 

```
fn recursion(mut x: felt252) {
    
    if x == 2 {
        println!("x = {} " , x);
    } else {
        x += 1;
        recursion(x);
    }

}

fn main() {
    let mut x: felt252 = 0;

    recursion(x);
}
```

In this case, the `recursion` function will increment `x` until `x == 2` is met. Once the condition is met, the loop will exit and print the value of `x`.

Let's look at the two code examples in Sierra and compare its similarities.

**loop.sierra**
```


```

Explanation of Sierra code here

**recursion.sierra**
```

```

Explanation of Sierra code here

From the two examples, we notice few things:

1. Both invokes `disable_ap_tracking` libfunc to disable the tracking of accumulation pointer. This is because Sierra recognizes that both code examples cannot be determined of its memory usage deterministically.

2. The general invocations is almost identical in both cases which shows that the `loop` keyword can be seen as a way to rewrite a recursive function in a more readable way.

3. The Sierra gas between the two is almost the same. In terms of L1 gas cost, it is.. answer here 

## Ownership Issues with Loop

The variable that is being manipulated inside `loop` must be declared outside of the `loop` block. 

If you try to return a variable that has been declared inside the `loop` block, you will get an error since the intialized variable outside of the `loop` block has "moved" into the `loop` block to perform manipulations. Therefore, the lifetime of the variable is only within the `loop` block. 

```

```

## Comparing Gas Costs

We will be comparing the gas costs of accessing arrays with `loop` using `match` with `pop_front` vs directly accessing the array by the subscript.

code here w/ test

```

```

```

```

The result of the test shows that `loop` example uses 2x more Sierra gas than the direct access example. This is because... 