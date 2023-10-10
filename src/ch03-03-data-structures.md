## Flexible Data Structures with Dictionaries

When you first start programming in Cairo, you'll likely use arrays (`Array<T>`) to store collections of data. However, you quickly realize arrays have one big limitation - the data stored in them is immutable. Once you insert a value into an array, you can't modify it.

This can be frustrating when you want to treat a data structure like a mutable vector. For example, say you're making a game where the players have a level, but they can also level up. You might try to store the level of the players in an array:

```rust,noplayground
let mut level_players = Array::new();
level_players.append(5);
level_players.append(1);
level_players.append(10); 
```

But then you realize you can't increase the level once it's set. You cannot remove a player if the player dies unless he happens to be the first in the array.

Fortunately, Cairo provides a handy built-in dictionary type called FeltDict that allows us to build flexible data structures that can be modified. Let's explore how to use it to create a mutable vector implementation.

### Defining Our Ideal Interface

First, let's think about how we want our vector to behave. What operations should it support?

It should:
- Allow us to add items to the end
- Let us access any item by index 
- Allow setting an item's value by index
- Return the current length


We can define this interface in Cairo like:


```rust
{{#include ../listings/ch03-common-collections/no_listing_13_own_struct_vect/src/lib.cairo:trait}}
```

This provides a blueprint for our vector implementation. Let's build it out.

### Implementing a Mutable Vector in Cairo 

To store our data, we'll use a FeltDict which maps index numbers (felts) to values. We'll also store a separate len field to track the length.

Here is what our structure looks like:
```rust
{{#include ../listings/ch03-common-collections/no_listing_13_own_struct_vect/src/lib.cairo:struct}}
```
The key thing that makes this vector "mutable" is that we can insert into the dictionary to update values. For example, to set a new value at an index, we do:

```rust,noplayground
fn set(ref self: NullableVector<T>, index: usize, value: T) {
  self.data.insert(index.into(), nullable_from_box(BoxTrait::new(value)));
}
```
This overwrites any existing value at that index.

While arrays are immutable, dictionaries provide the flexibility we need for modifiable data structures like vectors. This is a handy technique to be aware of.

The implementation of the rest of the interface is more straitforward. The implementation of all the methods defined in our interface can be done as follow :

```rust
{{#include ../listings/ch03-common-collections/no_listing_13_own_struct_vect/src/lib.cairo:implem}}
```


### Main Collections of Objects

Several fundamental data types involve collections of objects. Specifically, the set of values is a collection of objects, and the operations revolve around adding, removing, or examining objects in the collection. Here we will discuss two of them queues and stacks.

#### Queue

Queue are data structures based on first-in-first-out (FIFO) policy. The data is accessed such that the first element that is added will be the first out. Therefore the data is added at the end of the queue and accessed in the front.

The primitive structure `Array<T>` offers a built-in implementation of the FIFO queue. Indeed the methods `append()` and `pop_front()` correspond to the spec of a Queue.

#### Stack

A Stack is a collection that is based on the last-in-first-out (LIFO) policy. The data is added at the top of the stack and removed from the top as well such that the last element added will be the first out of the stack.

To create a stack data structure in Cairo, we can again use a `Felt252Dict<T>` to store the values of the stack and a `usize` to keep track of the length of the stack to iterate over it.
The code uses the methods insert and get to access the values in the `Felt252Dict<T>`. To push an element at the end of the stack the function inserts the element at `len` and increases the size of the stack to keep track of the position of the last element. To pop a value the code retreives the last value using `len` and then decreases its value to keep track of the position of the last element.

```rust
{{#include ../listings/ch03-common-collections/no_listing_14_own_struct_stack/src/lib.cairo:struct}}

{{#include ../listings/ch03-common-collections/no_listing_14_own_struct_stack/src/lib.cairo:implem}}


```