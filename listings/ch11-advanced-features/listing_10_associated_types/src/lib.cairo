// ANCHOR: AssociatedTypes
trait CustomAdd<T, U> {
    type Result;

    fn add(self: T, other: U) -> Self::Result;
}
// ANCHOR_END: AssociatedTypes

// ANCHOR: AssociatedTypesImpl
impl CustomAddImplU32 of CustomAdd<u32, u32> {
    type Result = u32;

    fn add(self: u32, other: u32) -> Self::Result {
        self + other
    }
}
// ANCHOR_END: AssociatedTypesImpl

// ANCHOR: Bar
fn bar<T, U, impl AddImpl: CustomAdd<T, U>>(self: T, b: U) -> AddImpl::Result {
    AddImpl::add(self, b)
}
// ANCHOR_END: Bar

// ANCHOR: GenericsUsage
trait AddGeneric<T, U, V> {
    fn add_generic(self: T, other: U) -> V;
}

impl AddGenericU32 of AddGeneric<u32, u32, u32> {
    fn add_generic(self: u32, other: u32) -> u32 {
        self + other
    }
}
// ANCHOR_END: GenericsUsage

// ANCHOR: Foo
fn foo<T, U, V, +AddGeneric<T, U, V>>(self: T, other: U) -> V {
    self.add_generic(other)
}
// ANCHOR_END: Foo

// ANCHOR: Main
fn main() {
    let a: u32 = 3;
    let b: u32 = 4;

    let x = foo(a, b);
    let y = bar(a, b);

    println!("x: {}", x);
    println!("y: {}", y);
}
// ANCHOR_END: Main


