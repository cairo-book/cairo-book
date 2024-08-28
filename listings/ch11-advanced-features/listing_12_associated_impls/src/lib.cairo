// TAG: does_not_run

// ANCHOR: AssociatedImpl
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
// ANCHOR_END: AssociatedImpl}

// ANCHOR: EniExample
#[derive(Drop, Copy)]
struct TupleThree<T> {
    x: T,
    y: T,
    z: T,
}

impl IndexTupleThree<T, +Copy<T>> of core::ops::IndexView<TupleThree<T>, usize> {
    type Target = T;
    fn index(self: @TupleThree<T>, index: usize) -> Self::Target {
        match index {
            0 => *self.x,
            1 => *self.y,
            2 => *self.z,
            _ => panic!("Index out of bounds"),
        }
    }
}

trait TupleThreeTrait<T, impl IndexImpl: core::ops::IndexView<TupleThree<T>, usize>> {
    fn at_index(self: @TupleThree<T>, index: usize) -> IndexImpl::Target;
}

impl TupleThreeTraitImpl<
    T, impl IndexImpl: core::ops::IndexView<TupleThree<T>, usize>
> of TupleThreeTrait<T> {
    fn at_index(self: @TupleThree<T>, index: usize) -> IndexImpl::Target {
        return self[index];
    }
}
// ANCHOR_END: EniExample

// ANCHOR: Main
fn main() {
    let tuple = TupleThree { x: 1, y: 2, z: 3 };
    println!("The first element is {}", tuple[0]);
    println!("The second element is {}", tuple[1]);
    println!("The third element is {}", tuple[2]);

    println!("The first element is {}", tuple.at_index(0));
    println!("The second element is {}", tuple.at_index(1));
    println!("The third element is {}", tuple.at_index(2));
}
// ANCHOR_END: Main


