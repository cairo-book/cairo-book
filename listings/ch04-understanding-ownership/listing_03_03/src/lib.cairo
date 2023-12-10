//TAG: ignore_fmt
#[derive(Drop)]
struct MyStruct{}

fn main() {
    let my_struct = MyStruct{};  // my_struct comes into scope

    takes_ownership(my_struct);     // my_struct's value moves into the function...
                                    // ... and so is no longer valid here

    let x = 5;                 // x comes into scope

    makes_copy(x);                  // x would move into the function,
                                    // but u128 implements Copy, so it is okay to still
                                    // use x afterward

}                                   // Here, x goes out of scope and is dropped.


fn takes_ownership(some_struct: MyStruct) { // some_struct comes into scope
} // Here, some_struct goes out of scope and `drop` is called.

fn makes_copy(some_uinteger: u128) { // some_uinteger comes into scope
} // Here, some_integer goes out of scope and is dropped.