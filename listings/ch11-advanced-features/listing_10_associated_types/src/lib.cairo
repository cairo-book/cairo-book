// ANCHOR: associated_types
trait CustomAdd<T, U> {
    type Result;

    fn add(self: T, other: U) -> Self::Result;
}
// ANCHOR_END: associated_types

// ANCHOR: associated_types_impl
impl CustomAddImplU32 of CustomAdd<u32, u32> {
    type Result = u32;

    fn add(self: u32, other: u32) -> Self::Result {
        self + other
    }
}
// ANCHOR_END: associated_types_impl

// ANCHOR: bar
fn bar<T, U, impl AddImpl: CustomAdd<T, U>>(self: T, b: U) -> AddImpl::Result {
    AddImpl::add(self, b)
}
// ANCHOR_END: bar

// ANCHOR: generics_usage
trait AddGeneric<T, U, V> {
    fn add_generic(self: T, other: U) -> V;
}

impl AddGenericU32 of AddGeneric<u32, u32, u32> {
    fn add_generic(self: u32, other: u32) -> u32 {
        self + other
    }
}
// ANCHOR_END: generics_usage

// ANCHOR: foo
fn foo<T, U, V, +AddGeneric<T, U, V>>(self: T, other: U) -> V {
    self.add_generic(other)
}
// ANCHOR_END: foo

// ANCHOR: main
fn main() {
    let a: u32 = 3;
    let b: u32 = 4;

    let x = foo(a, b);
    let y = bar(a, b);

    println!("x: {}", x);
    println!("y: {}", y);
}
// ANCHOR_END: main


