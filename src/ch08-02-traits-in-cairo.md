# Traits in Cairo

Traits specify functionality blueprints that can be implemented. The blueprint specification includes a set of function signatures containing type annotations for the parameters and return value. This sets a standard to implement the specific functionality.

## Defining a Trait

To define a trait, you use the keyword `trait` followed by the name of the trait in `PascalCase` then the function signatures in a pair of curly braces.

For example, let's say that we have multiple structs representing shapes. We want our application to be able to perform geometry operations on these shapes, So we define a trait `ShapeGeometry` that contains a blueprint to implement geometry operations on a shape like this:

```rust,noplayground
{{#include ../listings/ch08-generic-types-and-traits/no_listing_14_traits/src/lib.cairo:trait}}
```

Here our trait `ShapeGeometry` declares signatures for two methods `boundary` and `area`. When implemented, both these functions should return a `u64` and accept parameters as specified by the trait.

## Implementing a Trait

A trait can be implemented using `impl` keyword with the name of your implementation followed by `of` then the name of trait being implemented. Here's an example implementing `ShapeGeometry` trait.

```rust,noplayground
{{#include ../listings/ch08-generic-types-and-traits/no_listing_14_traits/src/lib.cairo:impl}}
```

In the code above, `RectangleGeometry` implements the trait `ShapeGeometry` defining what the methods `boundary` and `area` should do. Note that the function parameters and return value types are identical to the trait specification.

## Implementing a trait, without writing its declaration.

You can write implementations directly without definining the corresponding trait. This is made possible by using the `#[generate_trait]` attribute with on the implementation, which will make the compiler generate the trait corresponding to the implementation automatically. Remember to add `Trait` as a suffix to your trait name, as the compiler will create the trait by adding a `Trait` suffix to the implementation name.

```rust,noplayground
{{#include ../listings/ch08-generic-types-and-traits/no_listing_15_generate_trait/src/lib.cairo}}
```

In the aforementioned code, there is no need to manually define the trait. The compiler will automatically handle its definition, dynamically generating and updating it as new functions are introduced.

## Parameter `self`

In the example above, `self` is a special parameter. When a parameter with name `self` is used, the implemented functions are also [attached to the instances of the type as methods](ch05-03-method-syntax.md#defining-methods). Here's an illustration,

When the `ShapeGeometry` trait is implemented, the function `area` from the `ShapeGeometry` trait can be called in two ways:

```rust
{{#rustdoc_include ../listings/ch08-generic-types-and-traits/no_listing_14_traits/src/lib.cairo:main}}
```

And the implementation of the `area` method will be accessed via the `self` parameter.

## Generic Traits

Usually we want to write a trait when we want multiple types to implement a functionality in a standard way. However, in the example above the signatures are static and cannot be used for multiple types. To do this, we use generic types when defining traits.

In the example below, we use generic type `T` and our method signatures can use this alias which can be provided during implementation.

```rust
{{#include ../listings/ch08-generic-types-and-traits/no_listing_16_generic_traits/src/lib.cairo}}
```

## Managing and using external trait implementations

To use traits methods, you need to make sure the correct traits/implementation(s) are imported. In the code above we imported `PrintTrait` from `debug` with `use debug::PrintTrait;` to use the `print()` methods on supported types.

In some cases you might need to import not only the trait but also the implementation if they are declared in separate modules.
If `CircleGeometry` was in a separate module/file `circle` then to use `boundary` on `circ: Circle`, we'd need to import `CircleGeometry` in addition to `ShapeGeometry`.

If the code was organised into modules like this, where the implementation of a trait was defined in a different module than the trait itself, explicitly importing the relevant implementation is required.

```rust,noplayground
use debug::PrintTrait;

// struct Circle { ... } and struct Rectangle { ... }

mod geometry {
    use super::Rectangle;
    trait ShapeGeometry<T> {
        // ...
    }

    impl RectangleGeometry of ShapeGeometry<Rectangle> {
        // ...
    }
}

// Could be in a different file
mod circle {
    use super::geometry::ShapeGeometry;
    use super::Circle;
    impl CircleGeometry of ShapeGeometry<Circle> {
        // ...
    }
}

fn main() {
    let rect = Rectangle { height: 5, width: 7 };
    let circ = Circle { radius: 5 };
    // Fails with this error
    // Method `area` not found on... Did you import the correct trait and impl?
    rect.area().print();
    circ.area().print();
}
```

To make it work, in addition to,

```rust
use geometry::ShapeGeometry;
```

you will need to import `CircleGeometry` explicitly. Note that you do not need to import `RectangleGeometry`, as it is defined in the same module as the imported trait, and thus is automatically resolved.

```rust
use circle::CircleGeometry
```
