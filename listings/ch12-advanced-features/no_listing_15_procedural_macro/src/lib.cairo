#[executable]
fn main() {
    // ANCHOR: hello_example
    let a = SomeType {};
    a.hello();
    // ANCHOR_END: hello_example

    // ANCHOR: pow_example
    let res = pow!(10, 2);
    println!("res : {}", res);
    // ANCHOR_END: pow_example

    // ANCHOR: rename_example
    let _a = RenamedType {};
    // ANCHOR_END: rename_example
}


// ANCHOR: some_struct
#[derive(HelloMacro, Drop, Destruct)]
struct SomeType {}
// ANCHOR_END: some_struct

// ANCHOR: old_trait
#[rename]
struct OldType {}
// ANCHOR_END: old_trait

// ANCHOR: hello_trait
trait Hello<T> {
    fn hello(self: @T);
}
// ANCHOR_END: hello_trait


