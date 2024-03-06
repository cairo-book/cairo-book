# Method Syntax

_Methods_ are similar to functions: we declare them with the `fn` keyword and a
name, they can have parameters and a return value, and they contain some code
that’s run when the method is called from somewhere else.

Unlike functions, methods are defined within the context of a type, either with their first parameter `self`
which represents the instance of the type the method is being called on (also called _instance methods_),
or by using this type for their parameters and/or return value (also called _class methods_ in Object-Oriented programming).

## Defining Methods

Let’s start by changing the `area` function that has a `Rectangle` instance as a parameter,
to an `area` method for the `Rectangle` type.

To do that, we first define the `RectangleTrait` trait with an `area` method taking a `Rectangle` as `self` parameter.

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_05_10_define_methods/src/lib.cairo:trait_definition}}
```

Then, we implement this trait in `RectangleImpl` with the `impl` keyword. In the body of the `area` method, we can access to the calling instance with the `self` parameter.

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_05_10_define_methods/src/lib.cairo:trait_implementation}}
```

Finally, we call this `area` method on the `Rectangle` instance `rect1` using the `<instance_name>.<method_name>` syntax. The instance `rect1` will be passed to the `area` method as the `self` parameter.

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_05_10_define_methods/src/lib.cairo:main}}
```

Note that:

- there is no direct link between a type and a trait. Only the type of the `self` parameter of a method defines the type from which this method can be called. That means, it is technically possible to define methods on multiple types in a same trait (mixing `Rectangle` and `Circle` methods, for example). But **this is not a recommended practice** as it can lead to confusion.

- It is possible to use a same name for a struct attribute and a method associated to this struct. For example, we can define a `width` method for the `Rectangle` type, and Cairo will know that `my_rect.width` refers to the `width` attribute while `my_rect.width()` refers to the `width` method. This is also not a recommended practice.

## The generate_trait attribute

If you are familiar with Rust, you may find Cairo's approach confusing because methods cannot be defined directly on types. Instead, you must define a [trait](./ch08-02-traits-in-cairo.md) and an implementation of this trait associated with the type for which the method is intended.
However, defining a trait and then implementing it to define methods on a specific type is verbose, and unnecessary: the trait itself will not be reused.

So, to avoid defining useless traits, Cairo provides the `#[generate_trait]` attribute to add above a trait implementation, which tells to the compiler to generate the corresponding trait definition for you, and let's you focus on the implementation only. Both approaches are equivalent, but it's considered a best practice to not explicitly define traits in this case.

The previous example can also be written as follows:

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_05_15_gen_trait/src/lib.cairo}}
```

Let's use this `#[generate_trait]` in the following chapters to make our code cleaner.

## Snapshots and references

As the `area` method does not modify the calling instance, `self` is declared as a snapshot of a `Rectangle` instance with the `@` snapshot operator. But, of course, we can also define some methods receiving a mutable reference of this instance, to be able to modify it.

Let's write a new method `scale` which resizes a rectangle of a `factor` given as parameter:

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_05_11_references/src/lib.cairo:trait_impl}}

{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_05_11_references/src/lib.cairo:main}}
```

It is also possible to define a method which takes ownership of the instance by using just `self` as the first parameter but it is rare. This technique is usually used when the method transforms `self` into something else and you want to prevent the caller from using the original instance after the transformation.

Look at the [Understanding Ownership](ch04-00-understanding-ownership.md) chapter for more details about these important notions.

## Methods with several parameters

Let’s practice using methods by implementing another method on the `Rectangle` struct. This time we want to write the method `can_hold` which accepts another instance of `Rectangle` and returns `true` if this rectangle can fit completely within self; otherwise, it should return false.

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_05_12_some_params/src/lib.cairo:trait_impl}}

{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_05_12_some_params/src/lib.cairo:main}}
```

Here, we expect that `rect1` can hold `rect2` but not `rect3`.

## Methods without self parameter

In Cairo, we can also define a method which doesn't act on a specific instance (so, without any `self` parameter) but which still manipulates the related type. This is what we call _class methods_ in Object-Oriented programming. As these methods are not called from an instance, we don't use them with the `<instance_name>.<method_name>` syntax but with the `<Trait_or_Impl_name>::<method_name>` syntax as you will see in the next example.

These methods are often use to build new instances but they may have a lot of different utilities.

Let's create the method `new` which creates a `Rectangle` from a `width` and a `height`, and a method `compare` which compares two `Rectangle` instances, and returns `true` if both rectangle have the same area and `false` otherwise.

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_05_13_class_methods/src/lib.cairo:trait_impl}}

{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_05_13_class_methods/src/lib.cairo:main}}
```

Note that the `compare` function could also be written as an _instance method_ with `self` as the first rectangle. In this case, instead of using the method with `Rectangle::compare(rect1, rect2)`, it is called with `rect1.compare(rect2)`.

## Multiple traits and impl blocks

Each struct is allowed to have multiple `trait` and `impl` blocks. For example,
the following code is equivalent to the code shown in the _Methods with several parameters_ section, which has each method in its own `trait` and `impl` blocks.

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_05_14_multiple_traits/src/lib.cairo:here}}
```

There’s no strong reason to separate these methods into multiple `trait` and `impl`
blocks here, but this is valid syntax.

## Summary

Structs let you create custom types that are meaningful for your domain. By
using structs, you can keep associated pieces of data connected to each other
and name each piece to make your code clear. In `trait` and `impl` blocks, you
can define methods, which are functions associated to a type and let you specify
the behavior that instances of your type have.

But structs aren’t the only way you can create custom types: let’s turn to
Cairo’s enum feature to add another tool to your toolbox.
