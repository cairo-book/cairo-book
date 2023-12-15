# An Example Program Using Structs

To understand when we might want to use structs, let’s write a program that calculates the area of a rectangle. We’ll start by using single variables, and then refactor the program until we’re using structs instead.

Let’s make a new project with Scarb called _rectangles_ that will take the width and height of a rectangle specified in pixels and calculate the area of the rectangle. Listing 5-6 shows a short program with one way of doing exactly that in our project’s _src/lib.cairo_.

<span class="filename">Filename: src/lib.cairo</span>

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_04_06_no_struct/src/lib.cairo:all}}
```

<span class="caption">Listing 5-6: Calculating the area of a rectangle specified by separate width and height variables</span>

Now run the program with `scarb cairo-run --available-gas=200000000`:

```bash
$ scarb cairo-run --available-gas=200000000
[DEBUG] ,                               (raw: 300)

Run completed successfully, returning []
```

This code succeeds in figuring out the area of the rectangle by calling the `area` function with each dimension, but we can do more to make this code clear and readable.

The issue with this code is evident in the signature of `area`:

```rust,noplayground
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_04_06_no_struct/src/lib.cairo:here}}
```

The `area` function is supposed to calculate the area of one rectangle, but the function we wrote has two parameters, and it’s not clear anywhere in our program that the parameters are related. It would be more readable and more manageable to group width and height together. We’ve already discussed one way we might do that in [Chapter 2](ch02-02-data-types.html#the-tuple-type): using tuples.

## Refactoring with Tuples

Listing 5-7 shows another version of our program that uses tuples.

<span class="filename">Filename: src/lib.cairo</span>

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_04_07_w_tuples/src/lib.cairo}}
```

<span class="caption">Listing 5-7: Specifying the width and height of the rectangle with a tuple</span>

In one way, this program is better. Tuples let us add a bit of structure, and we’re now passing just one argument. But in another way, this version is less clear: tuples don’t name their elements, so we have to index into the parts of the tuple, making our calculation less obvious.

Mixing up the width and height wouldn’t matter for the area calculation, but if we want to calculate the difference, it would matter! We would have to keep in mind that `width` is the tuple index `0` and `height` is the tuple index `1`. This would be even harder for someone else to figure out and keep in mind if they were to use our code. Because we haven’t conveyed the meaning of our data in our code, it’s now easier to introduce errors.

## Refactoring with Structs: Adding More Meaning

We use structs to add meaning by labeling the data. We can transform the tuple we’re using into a struct with a name for the whole as well as names for the parts.

<span class="filename">Filename: src/lib.cairo</span>

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_04_08_w_structs/src/lib.cairo}}
```

<span class="caption">Listing 5-8: Defining a `Rectangle` struct</span>

Here we’ve defined a struct and named it `Rectangle`. Inside the curly brackets, we defined the fields as `width` and `height`, both of which have type `u64`. Then, in `main`, we created a particular instance of `Rectangle` that has a width of `30` and a height of `10`. Our `area` function is now defined with one parameter, which we’ve named `rectangle` which is of type `Rectangle` struct. We can then access the fields of the instance with dot notation, and it gives descriptive names to the values rather than using the tuple index values of `0` and `1`.

## Adding Useful Functionality with Trait

It’d be useful to be able to print an instance of `Rectangle` while we’re debugging our program and see the values for all its fields. Listing 5-9 tries using the `print` as we have used in previous chapters. This won’t work.

<span class="filename">Filename: src/lib.cairo</span>

<!-- TODO implement debug instead -->

```rust
{{#include ../listings/ch05-using-structs-to-structure-related-data/listing_04_10_print_rectangle/src/lib.cairo:here}}
```

<span class="caption">Listing 5-9: Attempting to print a `Rectangle` instance</span>

When we compile this code, we get an error with this message:

```text
$ cairo-compile src/lib.cairo
error: Method `print` not found on type "../src::Rectangle". Did you import the correct trait and impl?
 --> lib.cairo:16:15
    rectangle.print();
              ^***^

Error: Compilation failed.
```

The `print` trait is implemented for many data types, but not for the `Rectangle` struct. We can fix this by implementing the `PrintTrait` trait on `Rectangle` as shown in Listing 5-10.
To learn more about traits, see [Traits in Cairo](ch08-02-traits-in-cairo.md).

<span class="filename">Filename: src/lib.cairo</span>

```rust
{{#rustdoc_include ../listings/ch05-using-structs-to-structure-related-data/listing_04_10_print_rectangle/src/lib.cairo:all}}
```

<span class="caption">Listing 5-10: Implementing the `PrintTrait` trait on `Rectangle`</span>

Nice! It’s not the prettiest output, but it shows the values of all the fields for this instance, which would definitely help during debugging.
