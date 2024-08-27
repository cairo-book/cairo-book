// ANCHOR: AssociatedTypes
trait Add<T, U> {
    type Result;

    fn add(self: T, rhs: U) -> Self::Result;
}
// ANCHOR_END: AssociatedTypes

// ANCHOR: AssociatedTypesImpl
impl AddImpl<T, U> of Add<T, U> {
    type Result = u32;

    fn add(self: T, rhs: U) -> Self::Result {
        self.add(rhs)
    }
}
// ANCHOR_END: AssociatedTypesImpl

// ANCHOR: BarBaz
fn bar<T, U, impl AddImpl: Add<T, U>>(self: T, other: U) -> AddImpl::Result {
    AddImpl::add(self, other)
}

fn baz<T, U>(self: T, other: U) -> AddImpl::<T, U>::Result {
    self.add(other)
}
// ANCHOR_END: BarBaz

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

    let x: u32 = foo(a, b);
    let y = bar(a, b);
    let z = baz(a, b);

    println!("x: {}", x);
    println!("y: {}", y);
    println!("z: {}", z);
}
// ANCHOR_END: Main


