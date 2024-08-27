// ANCHOR: AssociatedTypes
trait Add<T, U> {
    type Result;

    fn add(lhs: T, rhs: U) -> Self::Result;
}
// ANCHOR_END: AssociatedTypes

// ANCHOR: GenericsUsage
trait AddGeneric<T, U, V> {
    fn add<T, U, V>(a: T, b: U) -> V;
}

fn foo<T, U, V, +AddGeneric<T, U, V>>(a: T, b: U) -> V {
    a + b
}
// ANCHOR_END: GenericsUsage

// ANCHOR: AssociatedTypesUsage
fn foo<T, U, AddImpl: Add<T,U>>(a: T, b: U) -> AddImpl::Result {
    a + b
}
// ANCHOR_END: AssociatedTypesUsage

