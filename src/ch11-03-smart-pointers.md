# Smart Pointers

A pointer is a general concept for a variable that contains an address in memory. This address refers to, or “points at,” some other data.

Smart pointers, on the other hand, are data structures that act like a pointer but also have additional metadata and capabilities. The concept of smart pointers isn’t unique to Cairo: smart pointers originated in C++ and exist in other languages like Rust as well.

In the specific case of Cairo, smart pointers play a crucial role in preventing illegal memory address references. Their usage ensures that dereferences cannot fail. Remember that it is not possible to prove the execution of a code that fails with the Cairo VM. Hence, it is mandatory to make sure that failing attempt to dereference a pointer and access an unallocated memory cell will never happen.

The Cairo VM memory is composed with segments defined by an index, each segment containing slots to store felts. Using smart pointers allows one to store data in a dedicated segment of the memory, while manipulating a pointer variable in the regular segment.

## The `Box<T>` Type to Manipulate Pointers

The `Box<T>` type represents the main smart pointer type in Cairo. It allows us to store data in the `boxed_segment` segment of the Cairo VM memory. This segment is dedicated to the storage of all boxed values. Whenever you instantiate a new pointer variable of type `Box<T>`, you append the data of type `T` to the boxed segment.

Using boxes can **improve efficiency** as it allows to pass a pointer to some data from a function to another without the need to copy the entire data. Indeed, there is no access to the value contained in the box while there is no unbox. Instead of having to write `n` values into memory before you call a function, you'd only have to write a single value that corresponds to your data pointer. If the data stored in the box is very complex, improvement can be massive.

> A `Box<T>` ensures that the data contained in it won't be copied when passed from a function to another.

Also, the `Box<T>` is of paramount importance for **memory safety**, especially when dealing with any variable whose size cannot be known at compile time, like recursive structs. In that case, there is a room for failure due to overlap in memory. Using box ensures that a dedicated segment of memory ca be used to store such data. 

Creating a new pointer variable of type `Box<T>` is very straightforward: simply use the `BoxTrait::new(T)` method. To retrieve the value contained in a box, call `unbox` method on your pointer variable. The `unbox` allows one to access the value of a memory cell in a safe manner.

> Note: manually defining a pointer to a memory cell is forbidden in Cairo as it might cause a failure related to dereferencing of a non-allocated memory cell.

### Basic Illustration of `Box<T>` Memory Layout

 Listing {{#ref basic_box}} shows a basic Cairo program that creates 2 boxes and don't do anything with it:

 ```rust
{{#include ../listings/ch11-advanced-features/listing_04_basic_box/src/lib.cairo}}
```

{{#label basic_box}}
<span class="caption">Listing {{#ref basic_box}}: A `main` function that instantiates 2 boxes.</span>

`first_box` is a box that contains a `felt252` value. `second_box` is a box that contains a tuple of 2 `felt252`.

Let's now take a look at the corresponding CASM code, generated using the Cairo Compiler version 2.5.3 to avoid optimisations applied with last releases.

 ```rust
{{#include ../listings/ch11-advanced-features/listing_04_basic_box/target/dev/listing_04_basic_box.casm}}
```

The code defined between `%{` and `%}` is what we call a **hint**. A hint is a piece of code that doesn't need to be proven and is only used by the prover, mainly to set some memory cells before executing a Cairo instruction.

As the Cairo VM in production is currently written in Python, so are the hints, and you can see that the generated CASM code contains Python code.

The first hint works as follows: `__boxed_segment = segments.add()` creates a new `__boxed_segment` if it doesn't exist yet. Then, `memory[ap + 0] = __boxed_segment` writes at location `ap` the value `__boxed_segment` which is a pointer to the segment that contains boxes. Ultimately, `__boxed_segment += 1`  increments by one the value of the pointer, because `first_box`  contains a single value.

The second hint does almost the same, except that:
- It doesn't create a new segment but reuse the previously created boxed segment.
- `__boxed_segment += 2` increments the pointer written at `ap` by 2, because the box contains a tuple of 2 values.

### Example of Box Efficiency with Consts

Cairo allows to declare complex consts. Let's take a look at the code in Listing {{#ref box}}, which defines a complex `const` and use it in different functions:

```rust
{{#include ../listings/ch11-advanced-features/listing_04_box/src/lib.cairo}}
```

{{#label box}}
<span class="caption">Listing {{#ref box}}: A `main` function that contains multiple function calls that either take or return a `const` or a boxed `const`.</span>

The `main` function includes 4 function calls:
- `complex_const` that returns a variable of type `RandomStruct`.
- `const_passed_by_value` that takes a variable of type `RandomStruct` and returns nothing.
- `box_complex_const` that returns a variable of type `Box<RandomStruct>`.
- `box_const_passed_by_value `that takes a variable of type `Box<RandomStruct>` and returns nothing.

The important thing to note here is that in the case of `const_passed_by_value`, the compiler actually creates a copy of the  `RandomStruct` with all its fields when passing the variable to the function, while `box_const_passed_by_value` only requires the copy of the pointer which is one felt.

## The `Nullable<T>` Type for Dictionaries

`Nullable<T>` is another type of smart pointer that can either point to a value or be `null` in the absence of value. It is defined at the Sierra level. This type is mainly used in dictionaries that contain types that don't implement the `zero_default` method of the `Felt252DictValue<T>` trait (i.e., arrays and structs).

If we try to access to an element that does not exist in a dictionarie, the code will fail is the `zero_default` cannot be called.

[Chapter 3.2](./ch03-02-dictionaries.md#dictionaries-of-types-not-supported-natively) about dictionaries thoroughly explained how to to store a `Span<felt252>` variable inside a dictionary using the `Nullable<T>` type. Please refer to it for further information.

