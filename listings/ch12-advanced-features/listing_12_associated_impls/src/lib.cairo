// ANCHOR: associated_impls
// Collection type that contains a simple array
#[derive(Drop)]
pub struct ArrayIter<T> {
    array: Array<T>,
}

// T is the collection type
pub trait Iterator<T> {
    type Item;
    fn next(ref self: T) -> Option<Self::Item>;
}

impl ArrayIterator<T> of Iterator<ArrayIter<T>> {
    type Item = T;
    fn next(ref self: ArrayIter<T>) -> Option<T> {
        self.array.pop_front()
    }
}

/// Turns a collection of values into an iterator
pub trait IntoIterator<T> {
    /// The iterator type that will be created
    type IntoIter;
    impl Iterator: Iterator<Self::IntoIter>;

    fn into_iter(self: T) -> Self::IntoIter;
}

impl ArrayIntoIterator<T> of IntoIterator<Array<T>> {
    type IntoIter = ArrayIter<T>;
    fn into_iter(self: Array<T>) -> ArrayIter<T> {
        ArrayIter { array: self }
    }
}
// ANCHOR_END: associated_impls

// ANCHOR: main
fn main() {
    let mut arr: Array<felt252> = array![1, 2, 3];

    // Converts the array into an iterator
    let mut iter = arr.into_iter();

    // Uses the iterator to print each element
    loop {
        match iter.next() {
            Option::Some(item) => println!("Item: {}", item),
            Option::None => { break; },
        };
    }
}
// ANCHOR_END: main


