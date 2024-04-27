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

Let's now take a look at the corresponding Casm code, generated using the Cairo Compiler version 2.5.3 to avoid optimisations applied with last releases.

 ```rust
{{#include ../listings/ch11-advanced-features/listing_04_basic_box/src/listing_04_basic_box.casm}}
```

The code defined between `%{` and `%}` is what we call a **hint**. A hint is a piece of code that doesn't need to be proven and is only used by the prover, mainly to set some memory cells before executing a Cairo instruction.

As the Cairo VM in production is currently written in Python, so are the hints, and you can see that the generated Casm code contains Python code.

The first hint works as follows: `__boxed_segment = segments.add()` creates a new `__boxed_segment` if it doesn't exist yet. Then, `memory[ap + 0] = __boxed_segment` writes at location `ap` the value `__boxed_segment` which is a pointer to the segment that contains boxes. Ultimately, `__boxed_segment += 1`  increments by one the value of the pointer, because `first_box`  contains a single value.

The second hint does almost the same, except that:
- It doesn't create a new segment but reuse the previously created boxed segment.
- `__boxed_segment += 2` increments the pointer written at `ap` by 2, because the box contains a tuple of 2 values.

### Basic Example of Box Efficiency

Cairo allows to declare structs that can become very complex. Let's take a look at the code in Listing {{#ref box}}, which defines a simple struct named `RandomStruct` and use it in different functions, whether inside a `Box` or not:

```rust
{{#include ../listings/ch11-advanced-features/listing_04_box/src/lib.cairo}}
```

{{#label box}}
<span class="caption">Listing {{#ref box}}: A `main` function that contains 2 function calls that take and return a `RandomStruct` or a boxed `RandomStruct`.</span>

The `main` function includes 2 function calls:
- `struct_passed_by_value` that takes a variable of type `RandomStruct` and returns a variable of type `RandomStruct`.
- `box_struct_passed_by_value` that takes a variable of type `Box<RandomStruct>` and returns a variable of type `Box<RandomStruct>`.

The important thing to note here is that in the case of `struct_passed_by_value`, the compiler actually creates a copy of the  `RandomStruct` with all its fields when passing the variable to the function, while `box_const_passed_by_value` only requires the copy of the `new_box` pointer which is one felt.

Let's see the corresponding non-optimized Casm code to see what happens under the hood:

```rust
{{#include ../listings/ch11-advanced-features/listing_04_box/src/listing_04_box.casm}}
```

Lines 1 to 7 correspond to the 2 functions we defined outside of the `main` function, i.e., `struct_passed_by_value` and `box_struct_passed_by_value`.

The `main` function starts on line 8 with the declaration of the `new_struct` variable: 

```rust,noplayground
8   [ap + 0] = 1, ap++;
9   [ap + 0] = 1, ap++;
10  [ap + 0] = 0, ap++;
11  [ap + 0] = 289397109359, ap++;
```

Note that the `second` field of our struct is a `u256`, which is is actually stored as 2 `felt252` interpreted as 2 `u128`. This is why we write `1` (low part) and then `0` (high part) to memory for this field. `289397109359` is the decimal represensation of the `felt252` `'Cairo'`.


The next line is `call rel -15;`, which will execute the code from lines 1 to 5:

```rust,noplaygroubd
1   [ap + 0] = [fp + -6], ap++;
2   [ap + 0] = [fp + -5], ap++;
3   [ap + 0] = [fp + -4], ap++;
4   [ap + 0] = [fp + -3], ap++;
5   ret;
```

This code extracts from the memory all the fields of our struct that have been passed to the `struct_passed_by_value` function using the Frame Register (equivalent to a stack, that points to memory cells), and writes them again in memory. This shows that when our struct is not contained in a box, passing it to a function requires to copy all its elements from and to the memory in order to use it later. The `ret` tells us to go back to the line after the `call rel` instruction. Therefore, the next lines to be executed start on line 13:

```rust,noplayground
13  [ap + 0] = 1, ap++;
14  [ap + 0] = 1, ap++;
15  [ap + 0] = 0, ap++;
16  [ap + 0] = 18947149983205714, ap++;
17  %{
18  if '__boxed_segment' not in globals():
19      __boxed_segment = segments.add()
20  memory[ap + 0] = __boxed_segment
21  __boxed_segment += 4
22  %}
23  [ap + -4] = [[ap + 0] + 0], ap++;
24  [ap + -4] = [[ap + -1] + 1];
25  [ap + -3] = [[ap + -1] + 2];
26  [ap + -2] = [[ap + -1] + 3];
```

This code declares the `new_box` by writting all the fields of the struct contained in the box in memory. After that, a python hint is used to create a dedicated boxed segment if it doesn't exist yet. Because all the fields of our struct are represented with 4 `felt252`, the hint writes to memory the value of the pointer and then increments by 4 the value of the pointer.

After that, the memory is reorganized, with the value of the pointer written at `[ap + -4]`  and the next cells set to 0.

The next line is `call rel -24;` and corresponds to the call to `box_struct_passed_by_value`  function. This tells us to go back to line 6:

```rust,noplayground
6   [ap + 0] = [fp + -3], ap++;
7   ret;
```

In that case, we can notice that we only write to memory the `new_box` pointer instead of writting all the fields of the struct contained in it. Then, we return and go to line 28 which the final return of the `main` function.

## The `Nullable<T>` Type for Dictionaries

`Nullable<T>` is another type of smart pointer that can either point to a value or be `null` in the absence of value. It is defined at the Sierra level. This type is mainly used in dictionaries that contain types that don't implement the `zero_default` method of the `Felt252DictValue<T>` trait (i.e., arrays and structs).

If we try to access to an element that does not exist in a dictionarie, the code will fail is the `zero_default` cannot be called.

[Chapter 3.2](./ch03-02-dictionaries.md#dictionaries-of-types-not-supported-natively) about dictionaries thoroughly explained how to to store a `Span<felt252>` variable inside a dictionary using the `Nullable<T>` type. Please refer to it for further information.

