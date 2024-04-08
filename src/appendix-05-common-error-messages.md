# Appendix E - Common Error Messages

You might encounter error messages when writing Cairo code. Some of them occur very frequently, which is why we will be listing the most common error messages in this appendix to help you resolve common issues.

- `Variable not dropped.`: this error message means that you are trying to make a variable with a type that do not implement the `Drop` trait go out of scope, withtout destroying it. Make sure that variables that need to be dropped at the end of the execution of a function implement the `Drop` trait or the `Destruct` trait. See [Ownership](ch04-01-what-is-ownership.md#destroying-values---example-with-feltdict) section.

- `Variable was previously moved.`: this error message means that you are trying to use a variable whose ownership has already been transferred to another function. When a variable doesn't implement the `Copy` trait, it is passed by value to functions, and ownership of the variable is transferred to the function. Such a variable cannot be used anymore in the current context after its ownership has been transferred. It is often useful to use the `clone` method in this situation.

- `error: Trait has no implementation in context: core::fmt::Display::<package_name::struct_name>`: this error message is encountered if you try to print an instance of a custom data type with `{}` placeholders in a `print!` or `println!` macro. To mitigate this issue, you need to either manually implement the `fmt` method of the `Display` trait for your type, or use the `Debug` trait by applying `derive(Debug)` to your type, allowing to print your instance by adding `:?` in `{}` placeholders.
