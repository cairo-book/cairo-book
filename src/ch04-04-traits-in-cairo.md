# Traits in Cairo

Traits specify functionality blueprints that can be implemented. The specification includes a set of function signatures containing type annotations for parameters and return value.

## Defining a Trait

To define a trait, you use the keyword `trait` followed by the name of the trait in `PascalCase` then the function signatures in a pair of curly braces.

Here's what a simple trait declaration looks like.

```rust
trait ShapeGeometry {
	fn boundary( self: Rectangle ) -> u64;
	fn area( self: Rectangle ) -> u64;
}
```

## Implementing a Trait

The trait can then be implemented with `impl` keyword with the name of the implementation (to refer to when using methods/functions) like this,

```rust
impl RectangleGeometry of ShapeGeometry {
	fn boundary( self: Rectangle ) -> u64 {
        2_u64 * (self.height + self.width)
    }
	fn area( self: Rectangle ) -> u64 {
		self.height * self.width
	}
}
```

## Parameter `self`

In the example above, `self` is a special keyword. When parameter with name `self` is used, the implemented functions are also attached to the instances of the type as methods. Here's an illustration,

When `ShapeGeometry` trait is implemented,
Function `area` from `ShapeGeometry` trait can be called in two ways,

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

And the implementation of `area` method will be able to access the instance via `self` parameter.

## Traits with generic types

You would want to write a trait when you want multiple types to implement some functionality in a standard way. To do this, we use generic types.

In the example below, we use generic type `T` and our method signatures can use this alias which can be provided during implementation.

```rust
// Here T is an alias type which will be provided buring implementation
trait ShapeGeometry<T> {
	fn boundary( self: T ) -> u64;
	fn area( self: T ) -> u64;
}

// Implementation RectangleGeometry passes in <Rectangle>
// to implement the trait for that type
impl RectangleGeometry of ShapeGeometry::<Rectangle> {
	fn boundary( self: Rectangle ) -> u64 {
        2_u64 * (self.height + self.width)
    }
	fn area( self: Rectangle ) -> u64 {
		self.height * self.width
	}
}

// We might have another struct Triangle
// which can use the same trait spec
impl CircleGeometry of ShapeGeometry::<Circle> {
	fn boundary( self: Circle ) -> u64 {
        (2_u64 * 314_u64 * self.radius) / 100_u64
    }
	fn area( self: Circle ) -> u64 {
		(314_u64 * self.radius * self.radius) / 100_u64
	}
}

fn main() {
	let rect = Rectangle { height: 5_u128, width: 7_u128 };
    rect.area().print(); // 35
    rect.boundary().print(); // 24

	let circ = Circle { radius: 5_u128 };
    circ.area().print(); // 78
    circ.boundary().print(); // 31
}
```
