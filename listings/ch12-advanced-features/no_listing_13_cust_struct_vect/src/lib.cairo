// ANCHOR: all

// ANCHOR: imports
use core::dict::Felt252Dict;
use core::nullable::NullableTrait;
use core::num::traits::WrappingAdd;
// ANCHOR_END: imports

// ANCHOR: trait
trait MemoryVecTrait<V, T> {
    fn new() -> V;
    fn get(ref self: V, index: usize) -> Option<T>;
    fn at(ref self: V, index: usize) -> T;
    fn push(ref self: V, value: T) -> ();
    fn set(ref self: V, index: usize, value: T);
    fn len(self: @V) -> usize;
}
// ANCHOR_END: trait

// ANCHOR: struct
struct MemoryVec<T> {
    data: Felt252Dict<Nullable<T>>,
    len: usize,
}
// ANCHOR_END: struct

// ANCHOR: destruct
impl DestructMemoryVec<T, +Drop<T>> of Destruct<MemoryVec<T>> {
    fn destruct(self: MemoryVec<T>) nopanic {
        self.data.squash();
    }
}
// ANCHOR_END: destruct

// ANCHOR: implem
impl MemoryVecImpl<T, +Drop<T>, +Copy<T>> of MemoryVecTrait<MemoryVec<T>, T> {
    fn new() -> MemoryVec<T> {
        MemoryVec { data: Default::default(), len: 0 }
    }

    fn get(ref self: MemoryVec<T>, index: usize) -> Option<T> {
        if index < self.len() {
            Option::Some(self.data.get(index.into()).deref())
        } else {
            Option::None
        }
    }

    fn at(ref self: MemoryVec<T>, index: usize) -> T {
        assert!(index < self.len(), "Index out of bounds");
        self.data.get(index.into()).deref()
    }

    fn push(ref self: MemoryVec<T>, value: T) -> () {
        self.data.insert(self.len.into(), NullableTrait::new(value));
        self.len.wrapping_add(1_usize);
    }
    // ANCHOR: set
    fn set(ref self: MemoryVec<T>, index: usize, value: T) {
        assert!(index < self.len(), "Index out of bounds");
        self.data.insert(index.into(), NullableTrait::new(value));
    }
    // ANCHOR_END: set
    fn len(self: @MemoryVec<T>) -> usize {
        *self.len
    }
}
// ANCHOR_END: implem


