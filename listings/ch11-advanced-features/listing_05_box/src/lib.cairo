#[derive(Drop)]
struct RandomStruct {
    first: bool,
    second: u256,
    third: felt252
}

fn pass_data(complex_const: RandomStruct) -> RandomStruct {
    complex_const
}

fn pass_pointer(box_complex_const: Box<RandomStruct>) -> Box<RandomStruct> {
    box_complex_const
}

fn main() {
    let new_struct = RandomStruct { first: true, second: 1, third: 'Cairo' };
    pass_data(new_struct);

    let new_box = BoxTrait::new(RandomStruct { first: true, second: 1, third: 'CPU AIR' });
    pass_pointer(new_box);
}
