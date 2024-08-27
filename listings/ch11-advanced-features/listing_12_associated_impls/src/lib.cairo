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

#[derive(Drop)]
pub struct ArrayIter<T> {
    array: Array<T>,
}

impl ArrayIterator<T> of Iterator<ArrayIter<T>> {
    type Item = T;
    fn next(ref self: ArrayIter<T>) -> Option<T> {
        self.array.pop_front()
    }
}

impl ArrayIntoIterator<T> of core::iter::IntoIterator<Array<T>> {
    type IntoIter = ArrayIter<T>;
    fn into_iter(self: Array<T>) -> ArrayIter<T> {
        ArrayIter { array: self }
    }
}
