fn main() -> felt252 {
    recursive_function(0)
}

fn recursive_function(mut x: felt252) -> felt252 {
    if x == 2 {
        x
    } else {
        recursive_function(x + 1)
    }
}
