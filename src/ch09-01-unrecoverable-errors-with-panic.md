# Unrecoverable Errors with panic

In Cairo, unexpected issues may arise during program execution, resulting in runtime errors. While the panic function from the core library doesn't provide a resolution for these errors, it does acknowledge their occurrence and terminates the program. There are two primary ways that a panic can be triggered in Cairo: inadvertently, through actions causing the code to panic (e.g., accessing an array beyond its bounds), or deliberately, by invoking the panic function.

When a panic occurs, it leads to an abrupt termination of the program. Panics take an array as an argument which can be used to provide an error message, perform an unwind process where all variables are dropped and dictionaries squashed to ensure the soundness of the program and exit the program.

Here is how we can panic from inside a program and return the error code `2`:

<span class="filename">Filename: lib.cairo</span>

```rust
use array::ArrayTrait;
use debug::PrintTrait;

fn main() {
    let mut data = ArrayTrait::new();
    data.append(2);
    panic(data);
    'This line isn't reached'.print();
}
```

Running the program will produce the following output:

```console
$ cairo-run test.cairo 
Run panicked with err values: [2]
```

The call to panic causes the error message.

An alternative and more idiomatic approach to handling errors in Cairo is to use the panic_with_felt252 function. This function serves as an abstraction of the array-defining process and is often preferred due to its clearer and more concise expression of intent. By utilizing panic_with_felt252, developers can manage runtime errors in a way that aligns better with the language's design principles, making the code more readable and maintainable.

Let's consider an example:

```rust
fn main() {
    panic_with_felt252(2);
}
```
Executing this program will yield the same error message as before. However, if there is no need for an array and multiple values must be returned within the error, panic_with_felt252 offers a more succinct option. In cases where an array is necessary, such as when dealing with a collection of related values or when the number of values is dynamic, using an array would be the appropriate choice. Otherwise, panic_with_felt252 provides a cleaner alternative for handling single value in error situations.

## Using assert

An even more meaningful way to panic is by using assert function from the Cairo core library. It asserts that a boolean expression is true at runtime, and if it is not, it calls the panic function with an error value. The assert function takes two arguments: a boolean expression, an error value. Error value can be expressed as a string directly as it is handled as a felt.

Here is an example of its usage:

```rust
fn main() {
    let my_number: u8 = 0;
    
    assert(my_number != 0, 'number is zero');

    100 / my_number;
}
```

We are asserting in main that `my_number` is not zero so we don't make a division by 0. Here `my_number` is zero so the assert will call panic function with the string value (as a felt) and the division will not be reached.