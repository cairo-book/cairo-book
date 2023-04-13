# Generic Functions

When defining a function that uses generics, we palce the generics in the signature of the function where we would usually specify the data types of the parameter and return value. For example, imagine we want to create a function which given two `Array` of items, it will return the largest one. If we need to perform this operations for lists of different types, then we would have to redefine the function each time. Luckily we can implement the function just one time using generics and be on with it.

```rust
// this code does not compile

use array::ArrayTrait;

// Specify generic type T between the angulars
fn largest_list<T>(l1: Array<T>, l2: Array<T>) -> Array<T> {
    if l1.len() > l2.len() {
        l1
    } else {
        l2
    }
}

fn main() {
    let mut l1 = ArrayTrait::new();
    let mut l2 = ArrayTrait::new();

    l1.append(1);
    l1.append(2);

    l2.append(3);
    l2.append(4);
    l2.append(5);

    // There is no need to specify the concrete type of T because
    // it is infered by the compiler
    let l3 = largest_list(l1, l2);
}
```

The `largest_list` function compares two lists of the same type and returns the one with more elements while dropping the other. If you compile the previous code, you will notice that it will fail with an error that says there are no traits defined for droping an array of a generic type. This happens because in order to drop an array of `T`, the compiler must first know how to drop `T`. This can get fix by specifiyng in the function signature that `T` implements the drop trait.

```rust
use array::ArrayTrait;

// Specify generic type T between the angulars
// Also specify that the T implements the Drop trait
fn largest_list<T, impl TDrop: Drop<T>>(l1: Array<T>, l2: Array<T>) -> Array<T> {
    if l1.len() > l2.len() {
        l1
    } else {
        l2
    }
}

fn main() {
    let mut l1 = ArrayTrait::new();
    let mut l2 = ArrayTrait::new();

    l1.append(1);
    l1.append(2);

    l2.append(3);
    l2.append(4);
    l2.append(5);

    // There is no need to specify the concrete type of T, nor of
    // TDrop because they are infered by the compiler
    let l3 = largest_list(l1, l2);
}
```

The `largest_list` function has included in it's definition the requirement that whatever generic type is placed there, it must be droppable. Note that the `main` function remained unchanged, the compiler is smart enough to deduct which concrete type it's being used: `T` is `felt252` and `TDrop` is the `impl` that drops a felt.
