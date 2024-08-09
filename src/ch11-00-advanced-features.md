# Advanced Features

<!-- Now, let's learn about more advanced features offered by Cairo. -->

The #[phantom] attribute in Cairo is a powerful tool for creating types that cannot be instantiated. 
This attribute ensures that the type is only used for type-checking and cannot have actual instances. 
Running the code below will result in compilation errors:
```
#[phantom]
struct PhantomType<T> {
    x: T,
}

fn main() {

    let will_fail = PhantomType { x: 5 };
}
```
A common use case for the #[phantom] attribute is in the implementation of generics, 
where you might want to enforce certain type constraints without actually using the type in your computations. 
For example, you can use a phantom type to ensure type safety in complex data structures without impacting 
the runtime. 

```
#[phantom]
struct Validator<T> {
    pass: T,
}

fn validate_data(data: u64, _validator: Validator<i64>) -> u64 {
    if data < 0 {
        panic!("Invalid data: data cannot be negative");
    }
    return data + 1;
}
fn main() {
    let data: u64 = 10;
    // Here, Validator is used as a type marker without instantiation
    let result = validate_data(data, Validator { pass: 0 });
    println!("Validated data result: {}", result);
}
```