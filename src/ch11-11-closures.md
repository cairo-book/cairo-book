# Closures

Closures are anonymous functions you can save in a variable or pass as arguments to other functions. You can create the closure in one place and then call the closure elsewhere to evaluate it in a different context. Unlike functions, closures can capture values from the scope in which they’re defined. We’ll demonstrate how these closure features allow for code reuse and behavior customization.

> Note: Closures were introduced in Cairo 2.9 and are still under development.
> Some new features will be introduced in future versions of Cairo, so this page will evolve accordingly.

## Syntax

Here is a basic example with two simple closures:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_closures/src/lib.cairo:basic}}
```

The closure's arguments go between the pipes (`|`). Note that we don't have to specify the types of arguments (see `double` closure), they will be inferred from the closure usage.
Of course, if you use a closure with different types, you will get a `Type annotations needed` error, telling you that you have to choose and specify the closure argument types.

The body is an expression, on a single line without `{}` like `double` or on several lines with `{}` like `sum`.


## Capturing the environment with closures

One of the interests of closures is that they can include bindings from their enclosing scope.

In the following example, `my_closure` use a binding to `x` to compute `x + value * 3`.

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_closures/src/lib.cairo:environment}}
```

> Note that, at the moment, closures are still not allowed to capture mutable variables, but this will be supported in future Cairo versions.

Under the hood, closures are implemented through `FnOnce` and `Fn` traits. `FnOnce` is implemented for closures that may consume captured variables, where `Fn` is implemented for closures that capture only copyable variables.
