## Common Collections

Cairo1 provides a set of common collection types that can be used to store and manipulate data. These collections are designed to be efficient, flexible, and easy to use. This section introduces the primary collection types available in Cairo1: Array and Span.

### Array

Unlike a tuple, every element of an array must have the same type. You can create and use array methods by importing the `array::ArrayTrait` trait.

An important thing to note is that arrays are append-only. This means that you can only add elements to the end of an array.
Arrays are, in fact, queues whose values can't be popped nor modified.
This has to do with the fact that once a memory slot is written to, it cannot be overwritten, but only read from it.

Here is an example of creation of an array with 3 elements:

```rust
use array::ArrayTrait;

fn main() {
    let mut a = ArrayTrait::new();
    a.append(0);
    a.append(1);
    a.append(2);
}
```

It is possible to remove an element from the front of an array by calling the `pop_front()` method:

```rust

use option::OptionTrait;
use array::ArrayTrait;
use debug::PrintTrait;

fn main() {
    let mut a = ArrayTrait::new();
    a.append(10);
    a.append(1);
    a.append(2);

    let first_value = a.pop_front().unwrap();
    first_value.print();

}
```

The above code will print `10` as we remove the first element that was added.

You can pass the expected type of items inside the array when instantiating the array like this

```rust,
let mut arr = ArrayTrait::<u128>::new();
```

##### Accessing Array Elements

To access array elements, you can use `get()` or `at()` array methods that return different types. Using `arr.at(index)` is equivalent to using the subscripting operator `arr[index]`.

The `get` function returns an `Option<Box<@T>>`, which means it returns an option to a Box type (Cairo's smart-pointer type) containing a snapshot to the element at the specified index if that element exists in the array. If the element doesn't exist, `get` returns `None`. This method is useful when you expect to access indices that may not be within the array's bounds and want to handle such cases gracefully without panics. Snapshots will be explained in more detail in the [References and Snapshots](ch03-02-references-and-snapshots.md) chapter.

The `at` function, on the other hand, directly returns a snapshot to the element at the specified index using the `unbox()` operator to extract the value stored in a box. If the index is out of bounds, a panic error occurs. You should only use at when you want the program to panic if the provided index is out of the array's bounds, which can prevent unexpected behavior.

In summary, use `at` when you want to panic on out-of-bounds access attempts, and use `get` when you prefer to handle such cases gracefully without panicking.

```rust
fn main() {
    let mut a = ArrayTrait::new();
    a.append(0);
    a.append(1);

    let first = *a.at(0_usize);
    let second = *a.at(1_usize);
}
```

In this example, the variable named `first` will get the value `0` because that
is the value at index `0` in the array. The variable named `second` will get
the value `1` from index `1` in the array.

```rust
use array::ArrayTrait;
use box::BoxTrait;
fn main() -> u128 {
    let mut arr = ArrayTrait::<u128>::new();
    arr.append(100_u128);
    let length = arr.len();
    match arr.get(length - 1_usize) {
        Option::Some(x) => {
            *x.unbox()
        },
        Option::None(_) => {
            let mut data = ArrayTrait::new();
            data.append('out of bounds');
            panic(data)
        }
    } // returns 100
}
```

### Span
Span is a struct that represents a read-only view or snapshot of an Array. It is designed to provide safe and controlled access to the elements of an array without modifying the original data. Span is particularly useful for ensuring data integrity and avoiding borrowing issues when passing arrays between functions or when performing read-only operations.

#### Definition

```rust
struct Span<T> {
    snapshot: @Array<T>
}
```

A Span struct contains a reference to the original Array in the snapshot field. The `SpanTrait` is implemented for the Span struct, which provides methods for interacting with the underlying array in a read-only manner.

#### Methods

The following methods are provided by the `SpanTrait`:

- `pop_front(ref self: Span<T>) -> Option<@T>` - Removes and returns the first element of the Span. Returns `Option::Some` with the removed element if it exists or `Option::None` if the Span is empty.

- `get(self: Span<T>, index: usize) -> Option<Box<@T>>` - Returns an Option containing a Box with a reference to the element of type T at the specified index in the Span. Returns `Option::None` if the index is out of bounds. The Box is used here to store a reference to the heap-allocated element, ensuring proper lifetime and ownership management.

- `at(self: Span<T>, index: usize) -> @T` - Returns a reference to the element at the specified index in the Span. Panics if the index is out of bounds.

- `len(self: Span<T>) -> usize` - Returns the number of elements in the Span.

- `is_empty(self: Span<T>) -> bool` - Returns `true` if the Span has no elements, and `false` otherwise.

#### Usage

To create a `Span` of an `Array`, call the `span()` method:
```rust
let span = array.span();
```

Here is an example showing the basic usage of Span:

```rust
use array::ArrayTrait;
use array::SpanTrait;
use option::OptionTrait;
use box::BoxTrait;

fn main() {
    let mut array = ArrayTrait::new();
    array.append(1);
    array.append(2);
    array.append(3);
    
    let mut span = array.span();
    let first = span.pop_front().unwrap(); // first contains Option::Some(1)
    let second = span.pop_front().unwrap(); // second contains Option::Some(2)
    let third = span.get(2_u32).unwrap().unbox(); 
    // third contains Option::Some(Box::new(3))
    
    let first_2 = span.at(0_u32); // first_2 contains 1

    assert(span.len() == 3_u32, 'Unexpected span length.');
    assert(span.is_empty() == false, 'Unexpected span length.');
}
```

Another good use case is printing an array. In this example, the Span is used for printing the array without modifying the original data. The snapshot field of the Span is then cloned before printing. By doing this, you ensure that the Span owns the data it's working with, avoiding issues related to data ownership.

```rust
use array::ArrayTrait;
use array::ArrayTCloneImpl;
use array::SpanTrait;
use clone::Clone;
use debug::PrintTrait;

fn main() {
    let mut arr = ArrayTrait::new();
    arr.append(1);

    arr.span().snapshot.clone().print();

    arr.append(2);

    arr.print();
}
```

Without the use of Span, attempting to print the array directly would result in a compile-time error, as the ownership of the array data would be moved to the print() function, and the arr variable would become invalid for further use.