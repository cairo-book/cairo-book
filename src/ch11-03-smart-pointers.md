# Smart Pointers

A pointer is a general concept for a variable that contains an address in memory. This address refers to, or “points at,” some other data.

Smart pointers, on the other hand, are data structures that act like a pointer but also have additional metadata and capabilities. The concept of smart pointers isn’t unique to Cairo: smart pointers originated in C++ and exist in other languages as well. For example, Rust has a variety of smart pointers defined in the standard library that provide various functionalities.

In the specific case of Cairo, smart pointers play a crucial role in preventing illegal memory address references. Their usage ensures that dereferences cannot fail. Remember that it is not possible to prove the execution of a code that fails with the Cairo VM. Hence, it is mandatory to make sure that failing attempt to dereference a pointer and access an unallocated memory cell will never happen.

## The `Box` Type

The `Box` type represents the main smart pointer type in Cairo. Inspired by Rust, it allows us to allocate a new memory segment for our type, and access this segment using a pointer that can only be manipulated in one place at a time.

The Cairo VM memory is composed avec segments defined by an index, each segment containing slots to store felts. Each time you instantiate a variable of `Box<T>` type, you allocate and initialize a pointer instance in a new memory segment for this pointer variable.

### `BoxTrait` and its methods

The Cairo corelib provides the `BoxTrait` trait which contains the following methods:
- `new`: this method takes a variable of type `T` as argument and returns a new `Box<T>` variable. It is guaranteed to never panic.
- `unbox`: this method takes a variable of type `Box<T>` as argument, unboxes it and returns the variable of type `T` contained in it. It is also guaranteed to never panic.
- `box_forward_snapshot`: this method takes a variable of type `@Box<T>` (snapshot of a box), and returns a `Box<@T>` variable, which is box that contains a snapshot of the variable of type `T` contained in the box passed as a snapshot in the function.

`new`, `unbox` and `as_snapshot` methods all use a dedicated libfunc and don't do anything else. The Sierra libfunc is responsible of allocating a new segment in the memory in the case of `new`, or dereferencing a pointer that contains any value in the case of `unbox`. 

### Example with Consts

Cairo allows to declare complex consts. Let's take a look at the code in Listing {{#ref box}}, which defines a complex `const` and use it in different functions:

```rust
{{#include ../listings/ch11-advanced-features/listing_04_box/src/lib.cairo}}
```

{{#label box}}
<span class="caption">Listing {{#ref box}}: A `main` function that contains multiple function calls that either take or return a `const` or a boxed `const`.</span>

The `main` function includes 4 function calls:
- `complex_const` that returns a variable of type `RandomStruct`.
- `box_complex_const` that returns a variable of type `Box<RandomStruct>`.
- `const_passed_by_value` that takes a variable of type `RandomStruct` and returns nothing.
- `box_const_passed_by_value `that takes a variable of type `Box<RandomStruct>` and returns nothing.

The important thing to note here is that in the case of `const_passed_by_value`, the compiler actually creates a copy of the  `RandomStruct` with all its fields when passing the variable to the function, while `box_const_passed_by_value` only requires the copy of the value of the pointer which is a felt.

#### Sierra Code

Here is there Sierra code of the previous program:

```rust
{{#include ../listings/ch11-advanced-features/listing_04_box/src/lib.sierra}}
```

The first thing that we can notice is the drastic optimization that has been made by the compiler. Indeed, because `complex_const` and `box_complex_const` variables are just created, passed to a function and then dropped, the `main` function that starts on line 9 of the statements actually omits these steps.

All that `main` does is:
- Instantiating a variable of type `Box<RandomStruct>` with the `const_as_immediate` libfunc.
- Unboxing this variable with the `unbox` libfunc.
- Drop the previouslys unboxed variable of type `RandomStruct`.

### Quick Recap

Using boxes can improve efficiency as it allows to pass the variable, which is a reference, from a function to another without the need to copy the whole value. Indeed, there is no access to the value contained in the box while there is no unbox. We still need to pay to copy the value of the reference itself, but not the whole `const` struct. Because there is a dedicated segment and because a box can only be used in one place at a time, the `Box<T>` type reduces the number of steps while ensuring soundness in pointers dereferences.

Also, the `Box<T>` is of paramount importance for memory safety, especially when dealing with arrays. Because arrays can grow in size with the `append` method, there is a room for potential illegal out of bounds access that would induce a failure. This is why a new memory segment is allocated when a new array is instantiated. Hence, if you want to retrieve the value of an item contained in an array, you will get at some point a `Box<@T>` that you will have to unbox.

## The `Nullable<T>` Type

`Nullable<T>` is another type of smart pointer that can either point to a value or be null in the absence of value. It is usually used in Object Oriented Programming Languages when a reference doesn't point anywhere. The difference with `Option<T>` is that the wrapped value is stored inside a `Box<T>` smart pointer data type.

### Usage

The `Nullable<T>` type is defined at the Sierra level. It is mainly used in dictionaries for types that do not natively implement the `Felt252DictValue<T>` trait, i.e., mainly arrays and structs.

## Conclusion
