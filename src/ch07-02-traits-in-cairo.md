# Traits in Cairo

Traits specify functionality blueprints that can be implemented. The blueprint specification includes a set of function signatures containing type annotations for the parameters and return value. This sets a standard to implement the specific functionality.

## Defining and implementing a Trait

To define a trait, it is necessary to append the `#[generate_trait]` attribute to your trait declaration. The name of this trait must end with the suffix Trait for proper identification.

Implementing a trait is done using the impl keyword, followed by the name of your specific implementation. This is then followed by the keyword of and the name of the trait you're implementing. Let's consider an example where we're implementing the ShapeGeometryTrait:

```rust
#[generate_trait]
impl RectangleGeometry of ShapeGeometryTrait {
	fn boundary(self: Rectangle) -> u64 {
        2 * (self.height + self.width)
    }
	fn area(self: Rectangle) -> u64 {
		self.height * self.width
	}
}
```

In the previous code, we see RectangleGeometry being implemented without explicitly defining a corresponding trait. By incorporating the `#[generate_trait]` attribute, we delegate to the compiler the task of generating the matching trait.

## Parameter `self`

In the example above, `self` is a special parameter. When a parameter with name `self` is used, the implemented functions are also [attached to the instances of the type as methods](ch04-03-method-syntax.md#defining-methods). Here's an illustration,

When the `ShapeGeometry` trait is implemented, the function `area` from the `ShapeGeometry` trait can be called in two ways:

```rust
let rect = Rectangle { ... }; // Rectangle instantiation

// First way, as a method on the struct instance
let area1 = rect.area();
// Second way, from the implementation
let area2 = RectangleGeometry::area(rect);
// `area1` has same value as `area2`
area1.print();
area2.print();
```

And the implementation of the `area` method will be accessed via the `self` parameter.

## Generic Traits

Usually we want to write a trait when we want multiple types to implement a functionality in a standard way. However, in the example above the signatures are static and cannot be used for multiple types. To do this, we use generic types when defining traits.

In the example below, we use generic type `T` and our method signatures can use this alias which can be provided during implementation.

```rust
use debug::PrintTrait;

#[derive(Copy, Drop)]
struct Rectangle {
    height: u64,
    width: u64,
}

#[derive(Copy, Drop)]
struct Circle {
    radius: u64
}

// Implementation RectangleGeometry passes in <Rectangle>
// to implement the trait for that type
#[generate_trait]
impl RectangleGeometry of ShapeGeometryTrait<Rectangle> {
    fn boundary(self: Rectangle) -> u64 {
        2 * (self.height + self.width)
    }
    fn area(self: Rectangle) -> u64 {
        self.height * self.width
    }
}

// We might have another struct Circle
// which can use the same trait spec
impl CircleGeometry of ShapeGeometryTrait<Circle> {
    fn boundary(self: Circle) -> u64 {
        (2 * 314 * self.radius) / 100
    }
    fn area(self: Circle) -> u64 {
        (314 * self.radius * self.radius) / 100
    }
}

fn main() {
    let rect = Rectangle { height: 5, width: 7 };
    rect.area().print(); // 35
    rect.boundary().print(); // 24

    let circ = Circle { radius: 5 };
    circ.area().print(); // 78
    circ.boundary().print(); // 31
}
```

## Managing and using external trait implementations

To use traits methods, you need to make sure the correct traits/implementation(s) are imported. In the code above we imported `PrintTrait` from `debug` with `use debug::PrintTrait;` to use the `print()` methods on supported types.

In some cases you might need to import not only the trait but also the implementation if they are declared in separate modules.
If `CircleGeometry` was in a separate module/file `circle` then to use `boundary` on `circ: Circle`, we'd need to import `CircleGeometry` in addition to `ShapeGeometry`.

If the code was organised into modules like this,

```rust,does_not_compile,ignore_format
use debug::PrintTrait;

// struct Circle { ... } and struct Rectangle { ... }

mod geometry {
    use super::Rectangle;
    trait ShapeGeometry<T> {
        // ...
    }

    impl RectangleGeometry of ShapeGeometry::<Rectangle> {
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

you might also need to use `CircleGeometry`,

```rust
use circle::CircleGeometry
```
