use debug::PrintTrait;

fn main() {
    another_function(5, 6);
}

fn another_function(x: felt252, y: felt252) {
    x.print();
    y.print();
}
