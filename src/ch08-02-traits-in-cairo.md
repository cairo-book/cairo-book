# Traits in Cairo

A trait defines a set of methods that can be implemented by a type. These methods can be called on instances of the type when this trait is implemented.
A trait combined with a generic type defines functionality a particular type has and can share with other types. We can use traits to define shared behavior in an abstract way.
We can use _trait bounds_ to specify that a generic type can be any type that has certain behavior.

> Note: Note: Traits are similar to a feature often called interfaces in other languages, although with some differences.

While traits can be written to not accept generic types, they are most useful when used with generic types. We already covered generics in the [previous chapter](./ch08-01-generic-data-types.md), and we will use them in this chapter to demonstrate how traits can be used to define shared behavior for generic types.

## Defining a Trait

A type’s behavior consists of the methods we can call on that type. Different types share the same behavior if we can call the same methods on all of those types. Trait definitions are a way to group method signatures together to define a set of behaviors necessary to accomplish some purpose.

For example, let’s say we have a struct `NewsArticle` that holds a news story in a particular location. We can define a trait `Summary` that describes the behavior of something that can summarize the `NewsArticle` type.

```rust,noplayground
{{#rustdoc_include ../listings/ch08-generic-types-and-traits/no_listing_14_simple_trait/src/lib.cairo:trait}}
```

<!-- TODO add `pub` visibility -->

Here, we declare a trait using the trait keyword and then the trait’s name, which is `Summary` in this case.

<!-- We’ve also declared the trait as pub so that crates depending on this crate can make use of this trait too, as we’ll see in a few examples.  -->

Inside the curly brackets, we declare the method signatures that describe the behaviors of the types that implement this trait, which in this case is `fn summarize(self: @NewsArticle) -> ByteArray`. After the method signature, instead of providing an implementation within curly brackets, we use a semicolon.

> Note: the `ByteArray` type is the type used to represent Strings in Cairo.

As the trait is not generic, the `self` parameter is not generic either and is of type `@NewsArticle`. This means that the `summarize` method can only be called on instances of `NewsArticle`.

Now, consider that we want to make a media aggregator library crate named `aggregator` that can display summaries of data that might be stored in a `NewsArticle` or `Tweet` instance. To do this, we need a summary from each type, and we’ll request that summary by calling a summarize method on an instance. By defining the `Summary` trait on generic type `T`, we can implement the `summarize` method on any type we want to be able to summarize.

```rust,noplayground
{{#rustdoc_include ../listings/ch08-generic-types-and-traits/no_listing_15_traits/src/lib.cairo:trait}}
```

<span class="caption">A `Summary` trait that consists of the behavior provided by a `summarize` method</span>

Each generic type implementing this trait must provide its own custom behavior for the body of the method. The compiler will enforce that any type that has the Summary trait will have the method summarize defined with this signature exactly.

A trait can have multiple methods in its body: the method signatures are listed one per line and each line ends in a semicolon.

## Implementing a Trait on a type

Now that we’ve defined the desired signatures of the `Summary` trait’s methods,
we can implement it on the types in our media aggregator. The next code snippet shows
an implementation of the `Summary` trait on the `NewsArticle` struct that uses
the headline, the author, and the location to create the return value of
`summarize`. For the `Tweet` struct, we define `summarize` as the username
followed by the entire text of the tweet, assuming that tweet content is
already limited to 280 characters.

```rust,noplayground
{{#rustdoc_include ../listings/ch08-generic-types-and-traits/no_listing_15_traits/src/lib.cairo:impl}}
```

Implementing a trait on a type is similar to implementing regular methods. The
difference is that after `impl`, we put a name for the implementation,
then use the `of` keyword, and then specify the name of the trait we are writing the implementation for.
If the implementation is for a generic type, we place the generic type name in the angle brackets after the trait name.

Within the `impl` block, we put the method signatures
that the trait definition has defined. Instead of adding a semicolon after each
signature, we use curly brackets and fill in the method body with the specific
behavior that we want the methods of the trait to have for the particular type.

Now that the library has implemented the `Summary` trait on `NewsArticle` and
`Tweet`, users of the crate can call the trait methods on instances of
`NewsArticle` and `Tweet` in the same way we call regular methods. The only
difference is that the user must bring the trait into scope as well as the
types. Here’s an example of how a crate could use our `aggregator` crate:

```rust
{{#rustdoc_include ../listings/ch08-generic-types-and-traits/no_listing_15_traits/src/lib.cairo:main}}
```

This code prints the following:

```text
New article available! Cairo has become the most popular language for developers by Cairo Digger (Worldwide)

1 new tweet: EliBenSasson: Crypto is full of short-term maximizing projects.
 @Starknet and @StarkWareLtd are about long-term vision maximization.
```

Other crates that depend on the `aggregator` crate can also bring the `Summary`
trait into scope to implement `Summary` on their own types.

<!-- TODO: move traits as parameters here -->
<!-- ## Traits as parameters

Now that you know how to define and implement traits, we can explore how to use
traits to define functions that accept many different types. We'll use the
`Summary` trait we implemented on the `NewsArticle` and `Tweet` types to define a `notify` function that calls the `summarize` method
on its `item` parameter, which is of some type that implements the `Summary`
trait. To do this, we use the `impl Trait` syntax, like this:

```rust,ignore
{{#rustdoc_include ../listings/ch10-generic-types-traits-and-lifetimes/no-listing-04-traits-as-parameters/src/lib.rs:here}}
```

Instead of a concrete type for the `item` parameter, we specify the `impl`
keyword and the trait name. This parameter accepts any type that implements the
specified trait. In the body of `notify`, we can call any methods on `item`
that come from the `Summary` trait, such as `summarize`. We can call `notify`
and pass in any instance of `NewsArticle` or `Tweet`. Code that calls the
function with any other type, such as a `String` or an `i32`, won’t compile
because those types don’t implement `Summary`. -->

<!-- TODO trait bound syntax -->

<!-- TODO multiple trait bounds -->

<!-- TODO: Using trait bounds to conditionally implement methods -->

## Implementing a trait, without writing its declaration.

You can write implementations directly without defining the corresponding trait. This is made possible by using the `#[generate_trait]` attribute within the implementation, which will make the compiler generate the trait corresponding to the implementation automatically. Remember to add `Trait` as a suffix to your trait name, as the compiler will create the trait by adding a `Trait` suffix to the implementation name.

```rust,noplayground
{{#include ../listings/ch08-generic-types-and-traits/no_listing_16_generate_trait/src/lib.cairo}}
```

In the aforementioned code, there is no need to manually define the trait. The compiler will automatically handle its definition, dynamically generating and updating it as new functions are introduced.

<!-- TODO: rework this section -->

## Managing and using external trait implementations

To use traits methods, you need to make sure the correct traits/implementation(s) are imported. In the code above we imported `PrintTrait` from `debug` with `use core::debug::PrintTrait;` to use the `print()` methods on supported types. All traits included in the prelude don't need to be explicitly imported and are freely accessible.

In some cases you might need to import not only the trait but also the implementation if they are declared in separate modules.
If `CircleGeometry` was in a separate module/file `circle` then to use `boundary` on `circ: Circle`, we'd need to import `CircleGeometry` in addition to `ShapeGeometry`.

If the code was organized into modules like this, where the implementation of a trait was defined in a different module than the trait itself, explicitly importing the relevant implementation is required.

```rust,noplayground
use core::debug::PrintTrait;

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
