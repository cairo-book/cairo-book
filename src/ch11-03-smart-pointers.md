# Smart Pointers

A pointer is a general concept for a variable that contains an address in memory. This address refers to, or “points at,” some other data.

Smart pointers, on the other hand, are data structures that act like a pointer but also have additional metadata and capabilities. The concept of smart pointers isn’t unique to Cairo: smart pointers originated in C++ and exist in other languages as well. For example, Rust has a variety of smart pointers defined in the standard library that provide various functionalities.

In the specific case of Cairo, smart pointers play a crucial role in preventing illegal memory address references. Their usage ensures that dereferences cannot fail. Remember that it is not possible to prove the execution of a code that fails with the Cairo VM. Hence, it is mandatory to make sure that failing attempt to dereference a pointer and access an unallocated memory cell will never happen.

The Cairo VM memory is composed with segments defined by an index, each segment containing slots to store felts. Using smart pointers allows one to store data in a dedicated segment of the memory, while manipulating a pointer variable in the regular segment.

## The `Box<T>` Type to Safely Store Data

The `Box` type represents the main smart pointer type in Cairo. It allows us to store data in the `boxed_segment` segment of the Cairo VM memory. This segment is dedicated to the storage of all boxed values. Whenever you instantiate a new pointer variable of type `Box<T>`, you append the data of type `T` to the boxed segment.

Using boxes can improve efficiency as it allows to pass the variable, which is a pointer, from a function to another without the need to copy the whole value. Indeed, there is no access to the value contained in the box while there is no unbox. We still need to execute steps to copy the value of the pointer itself, but not the value the box points to. If the variable stored in the box is very complex, improvement can be massive. Because there is a dedicated segment for boxes and because a box can only be used in one place at a time, using the `Box<T>` type when manipulating complex data types reduces the number of steps while ensuring soundness in pointers dereferences.

Also, the `Box<T>` is of paramount importance for memory safety, especially when dealing with any variable whose size cannot be known at compile time, like recursive structs or arrays. In the case of arrays, the `append` method allows for grow in size depending on conditions, and there is a room for potential illegal out of bounds access that would induce a failure. This is why items of an array are stored in the `boxed_segment` memory segment. Hence, if you want to retrieve the value of an item contained in an array, you will get at some point a `Box<@T>` that you will have to unbox.

> To resume, the `Box<T>` type is mainly used for 2 purposes : 
> - Efficiency: Manually defining variables of type `Box<T>` that contain a large amount of data can be very useful in reducing the number of steps as it ensures that the data contained in the box won't be copied when passed from a function to another.
> 
> - Safety: variable whose size is not known at compile time need to use the `Box<T` type for items they contain. For example, arrays use by default the `Box<T>` for items they contain. 

Creating a new pointer variable of type `Box<T>` is very straightforward: simply use the `BoxTrait::new(T)` method. To retrieve the value contained in a box, call `unbox` method on your pointer variable.

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

## The `Nullable<T>` Type for Dictionaries

`Nullable<T>` is another type of smart pointer that can either point to a value or be `null` in the absence of value. It is defined at the Sierra level. This type is mainly used in dictionaries that contain types that don't implement the `zero_default` method of the `Felt252DictValue<T>` trait (i.e., arrays and structs).

If we try to access to an element that does not exist in a dictionarie, the code will fail is the `zero_default` cannot be called.

[Chapter 3.2](./ch03-02-dictionaries.md#dictionaries-of-types-not-supported-natively) about dictionaries thoroughly explained how to to store a `Span<felt252>` variable inside a dictionary using the `Nullable<T>` type. Please refer to it for further information.

