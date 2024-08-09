// ANCHOR: Deref
pub trait Deref<T> {
    type Target;
    fn deref(self: T) -> Self::Target;
}
// ANCHOR_END: Deref

// ANCHOR: DerefMut
pub trait DerefMut<T> {
    type Target;
    fn deref_mut(ref self: T) -> Self::Target;
}
// ANCHOR_END: DerefMut


