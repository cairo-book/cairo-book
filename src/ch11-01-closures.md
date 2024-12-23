# Closures

Closures are anonymous functions you can save in a variable or pass as arguments to other functions. You can create the closure in one place and then call the closure elsewhere to evaluate it in a different context. Unlike functions, closures can capture values from the scope in which they’re defined. We’ll demonstrate how these closure features allow for code reuse and behavior customization.

> Note: Closures were introduced in Cairo 2.9 and are still under development.
> Some new features will be introduced in future versions of Cairo, so this page will evolve accordingly.

## Understanding Closures

When writing Cairo programs, you'll often need to pass behavior as a parameter to another function. Closures provide a way to define this behavior inline, without creating a separate named function. They are particularly valuable when working with collections, error handling, and any scenario where you want to customize how a function behaves using a function as a parameter.

Consider a simple example where we want to process numbers differently based on some condition. Instead of writing multiple functions, we can use closures to define the behavior where we need it:

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/listing_closures/src/lib.cairo:basic}}
```

The closure's arguments go between the pipes (`|`). Note that we don't have to specify the types of arguments and of the return value (see `double` closure), they will be inferred from the closure usage, as it is done for any variables.
Of course, if you use a closure with different types, you will get a `Type annotations needed` error, telling you that you have to choose and specify the closure argument types.

The body is an expression, on a single line without `{}` like `double` or on several lines with `{}` like `sum`.

## Capturing the Environment with Closures

One of the interests of closures is that they can include bindings from their enclosing scope.

In the following example, `my_closure` use a binding to `x` to compute `x + value * 3`.

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/listing_closures/src/lib.cairo:environment}}
```

> Note that, at the moment, closures are still not allowed to capture mutable variables, but this will be supported in future Cairo versions.

## Closure Type Inference and Annotation

There are more differences between functions and closures. Closures don’t
usually require you to annotate the types of the parameters or the return value
like `fn` functions do. Type annotations are required on functions because the
types are part of an explicit interface exposed to your users. Defining this
interface rigidly is important for ensuring that everyone agrees on what types
of values a function uses and returns. Closures, on the other hand, aren’t used
in an exposed interface like this: they’re stored in variables and used without
naming them and exposing them to users of our library.

Closures are typically short and relevant only within a narrow context rather
than in any arbitrary scenario. Within these limited contexts, the compiler can
infer the types of the parameters and the return type, similar to how it’s able
to infer the types of most variables (there are rare cases where the compiler
needs closure type annotations too).

As with variables, we can add type annotations if we want to increase
explicitness and clarity at the cost of being more verbose than is strictly
necessary. Annotating the types for a closure would look like the definition
shown in Listing {{#ref closure-type}}. In this example, we’re defining a closure and storing it
in a variable rather than defining the closure in the spot we pass it as an
argument as we did in Listing 13-1.

```cairo
{{#rustdoc_include ../listings/ch11-functional-features/listing_closure_type/src/lib.cairo:here}}
```

{{#label closure-type}}
Listing {{#ref closure-type}}: Adding optional type annotations of the parameter and return value types in the closure

<!-- TODO: rework the example to add a println!(...) inside the closure -->

With type annotations added, the syntax of closures looks more similar to the
syntax of functions. Here we define a function that adds 1 to its parameter and
a closure that has the same behavior, for comparison. We’ve added some spaces
to line up the relevant parts. This illustrates how closure syntax is similar
to function syntax except for the use of pipes and the amount of syntax that is
optional:

```cairo, ignore
fn  add_one_v1   (x: u32) -> u32 { x + 1 }
let add_one_v2 = |x: u32| -> u32 { x + 1 };
let add_one_v3 = |x|             { x + 1 };
let add_one_v4 = |x|               x + 1  ;
```

The first line shows a function definition, and the second line shows a fully
annotated closure definition. In the third line, we remove the type annotations
from the closure definition. In the fourth line, we remove the brackets, which
are optional because the closure body has only one expression. These are all
valid definitions that will produce the same behavior when they’re called. The
`add_one_v3` and `add_one_v4` lines require the closures to be evaluated to be
able to compile because the types will be inferred from their usage. This is
similar to `let array = array![];` needing either type annotations or values of
some type to be inserted into the `array` for Cairo to be able to infer the type.

For closure definitions, the compiler will infer one concrete type for each of
their parameters and for their return value. For instance, Listing {{#ref closure-different-types}} shows
the definition of a short closure that just returns the value it receives as a
parameter. This closure isn’t very useful except for the purposes of this
example. Note that we haven’t added any type annotations to the definition.
Because there are no type annotations, we can call the closure with any type,
which we’ve done here with `u64` the first time. If we then try to call
`example_closure` with a `u32`, we’ll get an error.

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-functional-features/listing_closure_different_types/src/lib.cairo:here}}
```

{{#label closure-different-types}}
Listing {{#ref closure-different-types}}: Attempting to call a closure whose types are inferred with two different types

The compiler gives us this error:

```
{{#rustdoc_include ../listings/ch11-functional-features/listing_closure_different_types/output.txt}}
```

The first time we call `example_closure` with the `u64` value, the compiler
infers the type of `x` and the return type of the closure to be `u64`. Those
types are then locked into the closure in `example_closure`, and we get a type
error when we next try to use a different type with the same closure.

<!-- TODO: add a section on capturing references or moving ownership once supported -->

## Moving Captured Values Out of Closures and the `Fn` Traits

Once a closure has captured a reference or captured ownership of a value from
the environment where the closure is defined (thus affecting what, if anything,
is moved _into_ the closure), the code in the body of the closure defines what
happens to the references or values when the closure is evaluated later (thus
affecting what, if anything, is moved _out of_ the closure). A closure body can do any of the
following: move a captured value out of the closure, neither move nor mutate the value, or capture
nothing from the environment to begin with.

<!-- TODO: later, closures will be able to do any of the followings: -->
<!-- A closure body can
do any of the following: move a captured value out of the closure, mutate the
captured value, neither move nor mutate the value, or capture nothing from the
environment to begin with. -->

The way a closure captures and handles values from the environment affects
which traits the closure implements, and traits are how functions and structs
can specify what kinds of closures they can use. Closures will automatically
implement one, two, or all three of these `Fn` traits, in an additive fashion,
depending on how the closure’s body handles the values:

1. `FnOnce` applies to closures that can be called once. All closures implement
   at least this trait, because all closures can be called. A closure that
   moves captured values out of its body will only implement `FnOnce` and none
   of the other `Fn` traits, because it can only be called once.

2. `Fn` applies to closures that don’t move captured values out of their body
   and that don’t mutate captured values, as well as closures that capture
   nothing from their environment. These closures can be called more than once
   without mutating their environment, which is important in cases such as
   calling a closure multiple times concurrently.

<!-- TODO: later on,
2. `FnMut` applies to closures that don’t move captured values out of their
   body, but that might mutate the captured values. These closures can be
   called more than once.
-->

Let’s look at the definition of the `unwrap_or_else` method on `OptionTrait<T>` that
we used in Listing 13-1:

```cairo, ignore
pub impl OptionTraitImpl<T> of OptionTrait<T> {
    #[inline]
    fn unwrap_or_else<F, +Drop<F>, impl func: core::ops::FnOnce<F, ()>[Output: T], +Drop<func::Output>>(
        self: Option<T>, f: F,
    ) -> T {
        match self {
            Option::Some(x) => x,
            Option::None => f(),
        }
    }
}
```

Recall that `T` is the generic type representing the type of the value in the
`Some` variant of an `Option`. That type `T` is also the return type of the
`unwrap_or_else` function: code that calls `unwrap_or_else` on an
`Option<ByteArray>`, for example, will get a `ByteArray`.

Next, notice that the `unwrap_or_else` function has the additional generic type
parameter `F`. The `F` type is the type of the parameter named `f`, which is
the closure we provide when calling `unwrap_or_else`.

The trait bound specified on the generic type `F` is `impl func: core::ops::FnOnce<F, ()>[Output: T]`,
which means `F` must be able to be called once, take no arguments (the unit type `()` is used), and return a `T` as output.
Using `FnOnce` in the trait bound expresses the constraint that
`unwrap_or_else` is only going to call `f` at most one time. In the body of
`unwrap_or_else`, we can see that if the `Option` is `Some`, `f` won’t be
called. If the `Option` is `None`, `f` will be called once. Because all
closures implement `FnOnce`, `unwrap_or_else` accepts all two kinds of
closures and is as flexible as it can be.

<!-- TODO: all _three_ types of closures -->

<!-- > Note: Functions can implement all two of the `Fn` traits too. If what we
> want to do doesn’t require capturing a value from the environment, we can use
> the name of a function rather than a closure where we need something that
> implements one of the `Fn` traits. For example, on an `Option<Vec<T>>` value,
> we could call `unwrap_or_else(Vec::new)` to get a new, empty vector if the
> value is `None`. -->

<!-- TODO: function _do not_ implement the `Fn` traits yet. -->

<!-- TODO: all _three_ types of the `Fn` traits -->

<!-- TODO: add examples using FnMut from a corelib function once it exists. -->

The `Fn` traits are important when defining or using functions or types that
make use of closures. In the next section, we’ll discuss iterators. Many
iterator methods take closure arguments, so keep these closure details in mind
as we continue!

[unwrap-or-else]: https://docs.swmansion.com/scarb/corelib/core-option-OptionTrait.html#unwrap_or_else

Under the hood, closures are implemented through `FnOnce` and `Fn` traits. `FnOnce` is implemented for closures that may consume captured variables, where `Fn` is implemented for closures that capture only copyable variables.

## Implementing Your Functional Programing Patterns with Closures

Another great interest of closures is that, like any type of variables, you can pass them as function arguments. This mechanism is massively used in functional programming, through classic functions like `map`, `filter` or `reduce`.

Here is a potential implementation of `map` to apply a same function to all the items of an array:

```cairo, noplayground
{{#rustdoc_include ../listings/ch12-advanced-features/listing_closures/src/lib.cairo:array_map}}
```

> Note that, due to a bug in inlining analysis, this analysis process should be disabled using `#[inline(never)]`.

In this implementation, you'll notice that, while `T` is the element type of the input array `self`, the element type of the output array is defined by the output type of the `f` closure (the associated type `func::Output` from the `Fn` trait).

This means that your `f` closure can return the same type of elements like as for `_double` in the following code, or any other type of elements like as for `_another`:

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/listing_closures/src/lib.cairo:map_usage}}
```

> Currently, Cairo 2.9 provides an experimental feature allowing you to specify the associated type of trait, using `experimental-features = ["associated_item_constraints"]` in your `Scarb.toml`.

Let's say we want to implement the `filter` function for arrays, to filter out elements which do not match a criteria.
This criteria will be provided through a closure which takes an element as input, and return `true` if the element has to be kept,
`false` otherwise. That means, we need to specify that the closure must return a `boolean`.

```cairo, noplayground
{{#rustdoc_include ../listings/ch12-advanced-features/listing_closures/src/lib.cairo:array_filter}}
```

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/listing_closures/src/lib.cairo:filter_usage}}
```
