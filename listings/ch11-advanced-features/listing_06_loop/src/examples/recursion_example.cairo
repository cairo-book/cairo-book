fn main() {
    
    let mut x: felt252 = 0;
    recursive_function(x);
}

fn recursive_function(mut x: felt252) {
    if x == 2 {
        println!("x = {}", x);
    } else {
        x += 1;
        recursive_function(x);
    }
}