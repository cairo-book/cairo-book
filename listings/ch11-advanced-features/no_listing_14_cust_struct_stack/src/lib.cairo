// ANCHOR: all

// ANCHOR: imports
use core::dict::Felt252Dict;
use core::nullable::{match_nullable, FromNullableResult, NullableTrait};
// ANCHOR_END: imports

// ANCHOR: trait
trait StackTrait<S, T> {
    fn push(ref self: S, value: T);
    fn pop(ref self: S) -> Option<T>;
    fn is_empty(self: @S) -> bool;
}
// ANCHOR_END: trait

// ANCHOR: struct
struct NullableStack<T> {
    data: Felt252Dict<Nullable<T>>,
    len: usize,
}
// ANCHOR_END: struct

impl DestructNullableStack<T, +Drop<T>> of Destruct<NullableStack<T>> {
    fn destruct(self: NullableStack<T>) nopanic {
        self.data.squash();
    }
}


// ANCHOR: implem
impl NullableStackImpl<T, +Drop<T>, +Copy<T>> of StackTrait<NullableStack<T>, T> {
    fn push(ref self: NullableStack<T>, value: T) {
        self.data.insert(self.len.into(), NullableTrait::new(value));
        self.len += 1;
    }

    fn pop(ref self: NullableStack<T>) -> Option<T> {
        if self.is_empty() {
            return Option::None;
        }
        self.len -= 1;
        Option::Some(self.data.get(self.len.into()).deref())
    }

    fn is_empty(self: @NullableStack<T>) -> bool {
        *self.len == 0
    }
}
// ANCHOR_END: implem


