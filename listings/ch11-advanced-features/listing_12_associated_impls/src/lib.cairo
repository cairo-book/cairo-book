// ANCHOR: associated_impls
// T is the collection type
pub trait Iterator<T> {
    type Item;
    fn next(ref self: T) -> Option<Self::Item>;
}

/// Turn a collection of values into an iterator.
pub trait IntoIterator<T> {
    /// The iterator type that will be created.
    type IntoIter;
    impl Iterator: Iterator<Self::IntoIter>;

    fn into_iter(self: T) -> Self::IntoIter;
}
// ANCHOR_END: associated_impls}

// ANCHOR: main
fn main() {}
// ANCHOR_END: main


