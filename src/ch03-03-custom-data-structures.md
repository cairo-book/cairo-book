# Custom Data Structures

When you first start programming in Cairo, you'll likely want to use arrays
(`Array<T>`) to store collections of data. However, you will quickly realize
that arrays have one big limitation - the data stored in them is immutable. Once
you append a value to an array, you can't modify it.

This can be frustrating when you want to use a mutable data structure. For
example, say you're making a game where the players have a level, and they can
level up. You might try to store the level of the players in an array:

```rust,noplayground
let mut level_players = Array::new();
level_players.append(5);
level_players.append(1);
level_players.append(10);
```

But then you realize you can't increase the level at a specific index once it's
set. If a player dies, you cannot remove it from the array unless he happens to
be in the first position.

Fortunately, Cairo provides a handy built-in [dictionary
type](./ch03-02-dictionaries.md) called `Felt252Dict<T>` that allows us to
simulate the behavior of mutable data structures. Let's first explore how to use
it to create a dynamic array implementation.

Note: Several concepts used in this chapter are presented in later parts of the
book. We recommend you to check out the following chapter first:
[Structs](ch05-00-using-structs-to-structure-related-data),
[Methods](./ch05-03-method-syntax.md), [Generic
types](./ch08-00-generic-types-and-traits.md),
[Traits](./ch08-02-traits-in-cairo.md)

## Simulating a dynamic array with dicts

First, let's think about how we want our mutable dynamic array to behave. What
operations should it support?

It should:

- Allow us to append items at the end
- Let us access any item by index
- Allow setting the value of an item at a specific index
- Return the current length

We can define this interface in Cairo like:

```rust
{{#include ../listings/ch03-common-collections/no_listing_13_cust_struct_vect/src/lib.cairo:trait}}
```

This provides a blueprint for the implementation of our dynamic array. We named
it Vec as it is similar to the `Vec<T>` data structure in Rust.

### Implementing a dynamic array in Cairo

To store our data, we'll use a `Felt252Dict<T>` which maps index numbers (felts)
to values. We'll also store a separate `len` field to track the length.

Here is what our struct looks like. We wrap the type `T` inside `Nullable`
pointer to allow using any type `T` in our data structure, as explained in the
[Dictionaries](./ch03-02-dictionaries.md#dictionaries-of-types-not-supported-natively)
section:

```rust
{{#include ../listings/ch03-common-collections/no_listing_13_cust_struct_vect/src/lib.cairo:struct}}
```

The key thing that makes this vector mutable is that we can insert values into
the dictionary to set or update values in our data structure. For example, to
update a value at a specific index, we do:

```rust,noplayground
{{#include ../listings/ch03-common-collections/no_listing_13_cust_struct_vect/src/lib.cairo:set}}
```

This overwrites the previously existing value at that index in the dictionary.

While arrays are immutable, dictionaries provide the flexibility we need for
modifiable data structures like vectors.

The implementation of the rest of the interface is straightforward. The
implementation of all the methods defined in our interface can be done as follow
:

```rust
{{#include ../listings/ch03-common-collections/no_listing_13_cust_struct_vect/src/lib.cairo:implem}}
```

The full implementation of the `Vec` structure can be found in the
community-maintained library
[Alexandria](https://github.com/keep-starknet-strange/alexandria/tree/main/src/data_structures).

## Simulating a Stack with dicts

We will now look at a second example and its implementation details: a Stack.

A Stack is a LIFO (Last-In, First-Out) collection. The insertion of a new
element and removal of an existing element takes place at the same end,
represented as the top of the stack.

Let us define what operations we need to create a stack :

- Push an item to the top of the stack
- Pop an item from the top of the stack
- Check whether there are still any elements in the stack.

From these specifications we can define the following interface :

```rust
{{#include ../listings/ch03-common-collections/no_listing_14_cust_struct_stack/src/lib.cairo:trait}}
```

### Implementing a Mutable Stack in Cairo

To create a stack data structure in Cairo, we can again use a `Felt252Dict<T>`
to store the values of the stack along with a `usize` field to keep track of the
length of the stack to iterate over it.

The Stack struct is defined as:

```rust
{{#include ../listings/ch03-common-collections/no_listing_14_cust_struct_stack/src/lib.cairo:struct}}
```

Next, let's see how our main functions `push` and `pop` are implemented.

```rust
{{#include ../listings/ch03-common-collections/no_listing_14_cust_struct_stack/src/lib.cairo:implem}}
```

The code uses the `insert` and `get` methods to access the values in the
`Felt252Dict<T>`. To push an element at the top of the stack, the `push`
function inserts the element in the dict at index `len` - and increases the
`len` field of the stack to keep track of the position of the stack top. To
remove a value, the `pop` function retrieves the last value at position `len-1`
and then decreases the value of `len` to update the position of the stack top
accordingly.

The full implementation of the Stack, along with more data structures that you
can use in your code, can be found in the community-maintained
[Alexandria](https://github.com/keep-starknet-strange/alexandria/tree/main/src/data_structures)
library, in the "data_structures" crate.

## Summary

While Cairo's memory model is immutable and can make it difficult to implement
mutable data structures, we can fortunately use the `Felt252Dict<T>` type to
simulate mutable data structures. This allows us to implement a wide range of
data structures that are useful for many applications, effectively hiding the
complexity of the underlying memory model.
