// ANCHOR: associated_types
trait Concatenate<T> {
    type Result;

    fn concatenate(self: T, other: T) -> Self::Result;
}
// ANCHOR_END: associated_types

// ANCHOR: associated_types_impl
impl ConcatenateU32Impl of Concatenate<u32> {
    type Result = u64;

    fn concatenate(self: u32, other: u32) -> Self::Result {
        let shift: u64 = 0x100000000; // 2^32
        self.into() * shift + other.into()
    }
}
// ANCHOR_END: associated_types_impl

// ANCHOR: bar
fn bar<T, impl ConcatenateImpl: Concatenate<T>>(self: T, b: T) -> ConcatenateImpl::Result {
    ConcatenateImpl::concatenate(self, b)
}
// ANCHOR_END: bar

// ANCHOR: generics_usage
trait ConcatenateGeneric<T, U> {
    fn concatenate_generic(self: T, other: T) -> U;
}

impl ConcatenateGenericU32 of ConcatenateGeneric<u32, u64> {
    fn concatenate_generic(self: u32, other: u32) -> u64 {
        let shift: u64 = 0x100000000; // 2^32
        self.into() * shift + other.into()
    }
}
// ANCHOR_END: generics_usage

// ANCHOR: foo
fn foo<T, U, +ConcatenateGeneric<T, U>>(self: T, other: T) -> U {
    self.concatenate_generic(other)
}
// ANCHOR_END: foo

// ANCHOR: main
fn main() {
    let a: u32 = 1;
    let b: u32 = 1;

    let x = foo(a, b);
    let y = bar(a, b);

    // result is 2^32 + 1
    println!("x: {}", x);
    println!("y: {}", y);
}
// ANCHOR_END: main


