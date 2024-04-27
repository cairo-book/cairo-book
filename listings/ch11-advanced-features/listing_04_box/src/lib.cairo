#[derive(Drop)]
struct RandomStruct {
    first: bool,
    second: u256,
    third: felt252
}

const complexe_const: RandomStruct =
    RandomStruct { first: true, second: 1, third: 'Cairo stands for CPU AIR' };

fn complex_const() -> RandomStruct {
    return complexe_const;
}

fn const_passed_by_value(complex_const: RandomStruct) {}

fn box_complex_const() -> Box<RandomStruct> {
    BoxTrait::new(complexe_const)
}

fn box_const_passed_by_value(box_complex_const: Box<RandomStruct>) {
    let _ = box_complex_const.unbox();
}

fn main() {
    let complex_const = complex_const();
    const_passed_by_value(complex_const);

    let box_complex_const = box_complex_const();
    box_const_passed_by_value(box_complex_const);
}
