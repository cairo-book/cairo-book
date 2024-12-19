# Closures

Closures are anonymous functions you can save in a variable or pass as arguments to other functions. You can create the closure in one place and then call the closure elsewhere to evaluate it in a different context. Unlike functions, closures can capture values from the scope in which they’re defined. We’ll demonstrate how these closure features allow for code reuse and behavior customization.

> Note: Closures were introduced in Cairo 2.9 and are still under development.
> Some new features will be introduced in future versions of Cairo, so this page will evolve accordingly.

## Syntax

Here is a basic example with two simple closures:

```cairo
{{#rustdoc_include ../listings/ch11-advanced-features/listing_closures/src/lib.cairo:basic}}
```

The closure's arguments go between the pipes (`|`). Note that we don't have to specify the types of arguments and of the return value (see `double` closure), they will be inferred from the closure usage, as it is done for any variables.
Of course, if you use a closure with different types, you will get a `Type annotations needed` error, telling you that you have to choose and specify the closure argument types.

The body is an expression, on a single line without `{}` like `double` or on several lines with `{}` like `sum`.


## Capturing the environment with closures

One of the interests of closures is that they can include bindings from their enclosing scope.

In the following example, `my_closure` use a binding to `x` to compute `x + value * 3`.

```cairo
{{#rustdoc_include ../listings/ch11-advanced-features/listing_closures/src/lib.cairo:environment}}
```

> Note that, at the moment, closures are still not allowed to capture mutable variables, but this will be supported in future Cairo versions.

Under the hood, closures are implemented through `FnOnce` and `Fn` traits. `FnOnce` is implemented for closures that may consume captured variables, where `Fn` is implemented for closures that capture only copyable variables.

## Closures as function arguments

Another great interest of closures is that, like any type of variables, you can pass them as function arguments. This mechanism is massively used in functional programming, through classic functions like `map`, `filter` or `reduce`.

Here is a potential implementation of `map` to apply a same function to all the items of an array:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_closures/src/lib.cairo:array_map}}
```

> Note that, due to a bug in inlining analysis, this analysis process should be disabled using `#[inline(never)]`. 

In this implementation, you'll notice that, while `T` is the element type of the input array `self`, the element type of the output array is defined by the output type of the `f` closure (the associated type `func::Output` from the `Fn` trait).

This means that your `f` closure can return the same type of elements like as for `_double` in the following code, or any other type of elements like as for `_another`:

```cairo
{{#rustdoc_include ../listings/ch11-advanced-features/listing_closures/src/lib.cairo:map_usage}}
```

> Currently, Cairo 2.9 provides an experimental feature allowing you to specify the associated type of trait, using `experimental-features = ["associated_item_constraints"]` in your `Scarb.toml`.

Let's say we want to implement the `filter` function for arrays, to filter out elements which do not match a criteria.
This criteria will be provided through a closure which takes an element as input, and return `true` if the element has to be kept,
`false` otherwise. That means, we need to specify that the closure must return a `boolean`.

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_closures/src/lib.cairo:array_filter}}
```


```cairo
{{#rustdoc_include ../listings/ch11-advanced-features/listing_closures/src/lib.cairo:filter_usage}}
```