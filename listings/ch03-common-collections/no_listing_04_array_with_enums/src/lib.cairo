#[derive(Copy, Drop)]
enum Data {
    Integer: u128,
    Felt: felt252,
    Tuple: (u32, u32),
}

fn main() {
    let mut messages: Array<Data> = ArrayTrait::new();
    messages.append(Data::Integer(100));
    messages.append(Data::Felt('hello world'));
    messages.append(Data::Tuple((10, 30)));
}
