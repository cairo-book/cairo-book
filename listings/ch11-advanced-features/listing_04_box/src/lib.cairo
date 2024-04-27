#[derive(Drop)]
struct RandomStruct {
    first: bool,
    second: u256,
    third: felt252
}

fn struct_passed_by_value(complex_const: RandomStruct) -> RandomStruct {
    complex_const
}

fn box_struct_passed_by_value(box_complex_const: Box<RandomStruct>) -> Box<RandomStruct> {
    box_complex_const
}

fn main() {
    let new_struct = RandomStruct { first: true, second: 1, third: 'Cairo' };
    struct_passed_by_value(new_struct);

    let new_box = BoxTrait::new(RandomStruct { first: true, second: 1, third: 'CPU AIR' });
    box_struct_passed_by_value(new_box);
}
