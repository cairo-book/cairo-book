## Data Types

Every value in Cairo is of a certain *data type*, which tells Cairo what kind of
data is being specified so it knows how to work with that data. his section covers two subsets of data types: scalars and compounds.

Keep in mind that Cairo is a *statically typed* language, which means that it
must know the types of all variables at compile time. The compiler can usually infer the desired type based on the value and its usage. In cases
when many types are possible, we can use a cast method where we specify the desired output type.

```Rust
let guess = cast("42",u32);
```

You’ll see different type annotations for other data types.

### Felts Type

In Cairo when you don't specify the type of a variable/argument, its type is a field element (represented by the keyword `felt`). In the context of Cairo, when we say “a field element” we mean an integer in the range -P/2 < x < P/2 
 where 
 is a very large (prime) number (currently it is a 252-bit number, which is a number with 76 decimal digits). When we add, subtract or multiply and the result is outside the range above, there is an overflow, and the appropriate multiple of P
 is added or subtracted to bring the result back into this range (in other words, the result is computed modulo P).

The most important difference between integers and field elements is division: Division of field elements (and therefore division in Cairo) is not the integer division you have in many programming languages, where the integral part of the quotient is returned (so you get `7 / 3 = 2`). As long as the numerator is a multiple of the denominator, it will behave as you expect (`6 / 3 = 2`). If this is not the case, for example when we divide `7/3`, it will result in a field element `x` that will satisfy `3 * x = 7`. It won’t be `2.3333` because x has to be an integer. If this seems impossible, remember that if `3 * x` is outside the range -P/2 < x < P/2 
, an overflow will occur which can bring the result down to 7. It’s a well-known mathematical fact that unless the denominator is zero, there will always be a value x satisfying `denominator * x = numerator`.

### Scalar Types

A *scalar* type represents a single value. Cairo has three primary scalar types:
integers, booleans, and characters. You may recognize
these from other programming languages. Let’s jump into how they work in Cairo.

#### Integer Types

An *integer* is a number without a fractional component. This type declaration indicates the number of bytes the programmer can use to store the integer. 
Table 3-1 shows
the built-in integer types in Cairo. We can use any of these variants to declare
the type of an integer value.

<span class="caption">Table 3-1: Integer Types in Cairo</span>

| Length    | Unsigned |
|-----------|----------|
| 8-bit     | `u8`     |
| 16-bit    | `u16`    |
| 32-bit    | `u32`    |
| 64-bit    | `u64`    |
| 128-bit   | `u128`   |
| 256-bit   | `u256`   |
|arch(32bit)| `usize`  |

Each variant has an explicit size.
As variables are unsigned, they can't contain a negative number. This code will cause the program to panic: 
```Swift
fn sub_u8s(x: u8, y: u8) -> u8 {
    x - y
}

main() {
    sub_u8s(1,3)
}
```
Unsigned ints can store numbers from 0 to 2<sup>n</sup> - 1,
so a `u8` can store numbers from 0 to 2<sup>8</sup> - 1, which equals 0 to 255.

Additionally, the `usize` type depends on the architecture of the
computer your program is running on, which is denoted in the table as “arch”:
64 bits if you’re on a 64-bit architecture and 32 bits if you’re on a 32-bit
architecture.

You can write integer literals in any of the forms shown in Table 3-2. Note
that number literals that can be multiple numeric types allow a type suffix,
such as `57_u8`, to designate the type.

<span class="caption">Table 3-2: Integer Literals in Cairo</span>

| Numeric literals | Example       |
|------------------|---------------|
| Decimal          | `98222`       |
| Hex              | `0xff`        |

So how do you know which type of integer to use? Try to estimate the max value your int can have and choose the good size.
The primary situation in which you’d use `usize` is when indexing some sort of collection.

[//]: # "TODO: write panic chapter"

> ##### Integer Overflow
>
> Let’s say you have a variable of type `u8` that can hold values between 0 and
> 255. If you try to change the variable to a value outside that range, such as
> 256, *integer overflow* will occur, which can result in one of two behaviors.
> When you’re compiling in debug mode, Cairo includes checks for integer overflow
> that cause your program to *panic* at runtime if this behavior occurs. Cairo
> uses the term *panicking* when a program exits with an error; we’ll discuss
> panics in more depth in the [“Unrecoverable Errors with
> `panic!`”][unrecoverable-errors-with-panic]<!-- ignore --> section in Chapter
> 9.

#### Numeric Operations

Cairo supports the basic mathematical operations you’d expect for all the number
types: addition, subtraction, multiplication, division, and remainder. Integer
division truncates toward zero to the nearest integer. The following code shows
how you’d use each numeric operation in a `let` statement:

```rust
fn main() {
     // addition
    let sum = 5 + 10;

    // subtraction
    let difference = 95 - 4;

    // multiplication
    let product = 4 * 30;

    // division
    let quotient = 56 / 32; //result is 1
    let quotient = 64 / 32; //result is 2

    // remainder
    let remainder = 43 % 5; // result is 3
}
```

[//]: # "TODO: Appendix operator"
Each expression in these statements uses a mathematical operator and evaluates
to a single value, which is then bound to a variable. [Appendix
B][appendix_b]<!-- ignore --> contains a list of all operators that Cairo
provides.

#### The Boolean Type

As in most other programming languages, a Boolean type in Cairo has two possible
values: `true` and `false`. Booleans are one byte in size. The Boolean type in
Cairo is specified using `bool`. For example:

```rust
fn main() {
    let t = true;

    let f: bool = false; // with explicit type annotation
}
```

[//]: # "TODO: control flow section"
The main way to use Boolean values is through conditionals, such as an `if`
expression. We’ll cover how `if` expressions work in Cairo in the [“Control
Flow”][control-flow]<!-- ignore --> section.

#### The Short String Type

Cairo’s `short sting` type is the language’s most primitive alphabetic type, the length is at most 31 characters as they are stored in a felt. Here are
some examples of declaring values by puting them beteen single quotes:


```rust
let my_first_char = 'C';
let my_first_string = 'Hello world';
```

### Compound Types

*Compound types* can group multiple values into one type. Cairo has two
primitive compound types: tuples and arrays.

#### The Tuple Type

A *tuple* is a general way of grouping together a number of values with a
variety of types into one compound type. Tuples have a fixed length: once
declared, they cannot grow or shrink in size.

We create a tuple by writing a comma-separated list of values inside
parentheses. Each position in the tuple has a type, and the types of the
different values in the tuple don’t have to be the same. We’ve added optional
type annotations in this example:

```rust
fn main() {
    let tup: (u32,u64,bool) = (10,20,true);
}
```

The variable `tup` binds to the entire tuple because a tuple is considered a
single compound element. To get the individual values out of a tuple, we can
use pattern matching to destructure a tuple value, like this:

```Rust
fn main() {
    let tup = (500, 6, true);

    let (x, y, z) = tup;

    if y == 6 {
        debug::print_felt('y is six!');
    }
}
```

This program first creates a tuple and binds it to the variable `tup`. It then
uses a pattern with `let` to take `tup` and turn it into three separate
variables, `x`, `y`, and `z`. This is called *destructuring* because it breaks
the single tuple into three parts. Finally, the program prints the value of
`y`, which is `6.4`.

We can also declare the tuple with value and name at the same time.
For example:

```Rust
fn main() {
    let tup: (x: felt, y: felt) = (2,3);
}
```

#### The Struct Type

Struct are very similar to tuple, they are only easier to use as we can create the structure and use it as much as we want to create struct items like Points in the below example: 
```Rust
#[derive(Copy, Drop)]
struct Point { x: felt, y: felt }

fn main() -> felt {
    let mut origin = Point { x: 0, y: 0 };
    let p = Point { x: 1, y: 2 };
    let x = origin.x;
    let Point{x: a, y: b } = origin;
    a // returns 0
}
```
It is possible to implement methods that can operate on struct by using `impls` and `traits`, we will talk about it later in this book

#### The Array Type

Another way to have a collection of multiple values is with an *array*. Unlike
a tuple, every element of an array must have the same type. You can create and use array methods by importing the `array::ArrayTrait` trait.

An important thing to note is that arrays are append-only. This means that you can only add elements to the end of an array.
You cannot modify an elements in an array.
This has to do with the fact that once a memory slot is written to, it cannot be overwritten, but only read from it.

Here is an example of creation of an array with 3 elements:

```Rust
use array::ArrayTrait;

fn main() {
    let mut a = ArrayTrait::new();
    a.append(0);
    a.append(1);
    a.append(2);
}
```

It is possible to remove an element of an array by doing: 
```Rust
    let mut a = create_array();

    a.pop_front().unwrap();
```
[//]: # "TODO: stack and heap"
Arrays are useful when you want your data allocated on the stack rather than
the heap (we will discuss the stack and the heap more in [Chapter
4][stack-and-heap]<!-- ignore -->).

You write an array’s type by passing the type like this: 

```Rust
let mut arr = array_new::<u128>();
```

##### Accessing Array Elements

You can access elements of an array using indexing,
like this:


```Rust
fn main() {
    let mut a = ArrayTrait::new();
    a.append(0);
    a.append(1);

    let first = a.get(0_usize);
    let second = a.get(1_usize);
}
```

In this example, the variable named `first` will get the value `0` because that
is the value at index `0` in the array. The variable named `second` will get
the value `1` from index `1` in the array.

##### Invalid Array Element Access

By using the ArrayTrait::get() function because it returns an Option type, meaning that if you're trying to access an index out of bounds, it will return None instead of exiting your program, meaning that you can implement error management functionalities.



```Rust
use array::ArrayTrait;
// While the core library declares the drop implementation for felt arrays,
// u128 are not supported yet. We can declare it ourself like this:
impl ArrayU128Drop of Drop::<Array::<u128>>;

fn main() -> u128 {
    let mut arr = array_new::<u128>();
    arr.append(100_u128);
    let length = arr.len();
    match arr.get(length - 1_usize) {
        Option::Some(x) => {
            x
        },
        Option::None(_) => {
            let mut data = ArrayTrait::new();
            data.append('out of bounds');
            panic(data)
        }
    } // returns 100
}
```