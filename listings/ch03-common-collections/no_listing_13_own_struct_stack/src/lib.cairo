#[derive(Destrcut, Default)]
struct Stack {
    items: Felt252Dict<Nullable<u256>>,
    len: usize,
}

fn pop(ref self: Stack) -> u256 {
    if self.len() == 0 {
    	panic_with_felt252('stack underflow');
    }
    let last_index = self.len() - 1;
    self.len -= 1;
    let item = self.items.get(last_index.into());
    item.deref()
}
