// ANCHOR: all

// ANCHOR: imports
use dict::Felt252DictTrait;
use nullable::{nullable_from_box, match_nullable, FromNullableResult, NullableTrait};
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

impl DestructNullableStack<T, impl TDrop: Drop<T>> of Destruct<NullableStack<T>> {
    fn destruct(self: NullableStack<T>) nopanic {
        self.data.squash();
    }
}


// ANCHOR: implem
impl NullableStackImpl<
    T, impl TDrop: Drop<T>, impl TCopy: Copy<T>
> of StackTrait<NullableStack<T>, T> {
    fn push(ref self: NullableStack<T>, value: T) {
        self.data.insert(self.len.into(), nullable_from_box(BoxTrait::new(value)));
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


