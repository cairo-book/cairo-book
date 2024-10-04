// ANCHOR: associated_types
trait Pack<T> {
    type Result;

    fn pack(self: T, other: T) -> Self::Result;
}
// ANCHOR_END: associated_types

// ANCHOR: associated_types_impl
impl PackU32Impl of Pack<u32> {
    type Result = u64;

    fn pack(self: u32, other: u32) -> Self::Result {
        let shift: u64 = 0x100000000; // 2^32
        self.into() * shift + other.into()
    }
}
// ANCHOR_END: associated_types_impl

// ANCHOR: bar
fn bar<T, impl PackImpl: Pack<T>>(self: T, b: T) -> PackImpl::Result {
    PackImpl::pack(self, b)
}
// ANCHOR_END: bar

// ANCHOR: generics_usage
trait PackGeneric<T, U> {
    fn pack_generic(self: T, other: T) -> U;
}

impl PackGenericU32 of PackGeneric<u32, u64> {
    fn pack_generic(self: u32, other: u32) -> u64 {
        let shift: u64 = 0x100000000; // 2^32
        self.into() * shift + other.into()
    }
}
// ANCHOR_END: generics_usage

// ANCHOR: foo
fn foo<T, U, +PackGeneric<T, U>>(self: T, other: T) -> U {
    self.pack_generic(other)
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


