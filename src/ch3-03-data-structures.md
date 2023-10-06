## Data structures using dictionaries

Due to the immutability of the memory you migth have faced some problems while manupulating arrays and data structures. A common problem you migth have faced in not being able to change the value in an array using `Array<T>`. Insted you migth have wanted to have collections of objects with more flexibility around adding, removing, or examining objects in the collection. 

The build-in data structures have some limitation regarding changing the value of a stored value due to the immutability of the memory.To overcome this you can design and implment your own structures with all methods you need to manipulate the data and the possibility to changed the value of a stored value using `Felt252Dict<T>`.

In this chapter we will define and implement a structures that you can iterate on, access the values, modify them, add an element at a specified index, remove an element at a specific index using the `Felt252Dict<T>` data structures.

Them we will discuss about two other common object collection and how to create them in Cairo.

### An intuitive interface 



Let's examine an example of a structure that could be very useful and that would allow us to adding, removing, or examining objects. 

We created 6 methods such that the data in the structure can be accessed with `get(ref self: V, index: usize)` and `at(ref self: V, index: usize)`, depending on whether you want to use `Option<T>` or `T` as a return value. You can append a value at the end of the Vector with `push(ref self: V, value: T)`. And finally you can change the value at a given index with `set(ref self: V, index: usize, value: T)`.

 
```rust
trait VecTrait<V, T> {
    fn new() -> V;
    fn get(ref self: V, index: usize) -> Option<T>;
    fn at(ref self: V, index: usize) -> T;
    fn push(ref self: V, value: T) -> ();
    fn set(ref self: V, index: usize, value: T);
    fn len(self: @V) -> usize;
}
```

With this structure, we could get around the fact that in an `Array<T>` the content cannot be modified.


### Vector implementation

The structure we defined follow the definition of Vector as in Rust. Let us define the concept of Vector, Vectors can store values of the same type. The values can be accessed at a given index, the value can be modified and the size of the vector can be modified.

To implement the interface defined above we use a `Felt252Dict<T>` to stored the values and the built-in functions that come with it. The function `insert(key: felt252, value: T) -> ()` can be used to change the value of a strored element as it overwrite the value stared at `key` with the new value `value`. And the function `get(key: felt252) -> T` is used to acces the data



```rust

impl NullableVecImpl<T, impl TDrop: Drop<T>, impl TCopy: Copy<T>> of VecTrait<NullableVec<T>, T> {
    fn new() -> NullableVec<T> {
        NullableVec { items: Default::default(), len: 0 }
    }

    fn get(ref self: NullableVec<T>, index: usize) -> Option<T> {
        if index < self.len() {
            Option::Some(self.items.get(index.into()).deref())
        } else {
            Option::None
        }
    }

    fn at(ref self: NullableVec<T>, index: usize) -> T {
        assert(index < self.len(), X);
        self.items.get(index.into()).deref()
    }

    fn push(ref self: NullableVec<T>, value: T) -> () {
        self.items.insert(self.len.into(), nullable_from_box(BoxTrait::new(value)));
        self.len = integer::u32_wrapping_add(self.len, 1_usize);
    }

    fn set(ref self: NullableVec<T>, index: usize, value: T) {
        assert(index < self.len(), X);
        self.items.insert(index.into(), nullable_from_box(BoxTrait::new(value)));
    }

    fn len(self: @NullableVec<T>) -> usize {
        *self.len
    }
}
```




### Main Collections of Objects

Several fundamental data types involve collections of objects. Specifically, the set of values is a collection of objects, and the operations revolve around adding, removing, or examining objects in the collection. Here we will discuss two of them queues and stacks.

#### Queue

Queue are data structures based on first-in-first-out (FIFO) policy. The data in access such that the first element that is added will be the first out. Therefore the data is added at the end of the queue and accessed in the front.

The primitive structure `Array<T>` offers a built-in implementation of the FIFO queue. Indeed the methods `append()` and `pop_front()` correspond to the spec of a Queue.

#### Stack

A Stack is a collection that is based on the last-in-first-out (LIFO) policy. The data is added at the top of the stack and removed from the top as well such that the last element added will be the first out of the stack.

To create a stack data structure in Cairo, we can use a `Felt252Dict<T>` to store the values of the stack and a `usize` to keep track of the length of the stack to iterate over it.
The code uses the methods insert and get to access the values in the `Felt252Dict<T>`. To push en element at the end of the stack the function insert the element at `len` and increase the size of the stack to keep track of the position of the last element. To pop a value the code retreive the last value using `len` and then decreases its value to keep strack of the position of the last element.
 
```rust
struct NullableStack<T> {
    elements: Felt252Dict<Nullable<T>>,
    len: usize,
}

fn push(ref self: NullableStack<T>, value: T) {
    self.elements.insert(self.len.into(), nullable_from_box(BoxTrait::new(value)));
    self.len += 1;
}

fn pop(ref self: NullableStack<T>) -> Option<T> {
    if self.is_empty() {
        return Option::None;
    }
    self.len -= 1;
    Option::Some(self.elements.get(self.len.into()).deref())
}

```
 
```rust
{{#include ../listings/ch03-common-collections/no_listing_13_own_struct_stack/src/lib.cairo}}
```
