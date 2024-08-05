fn main() {
    let mut x: felt252 = 0;
    loop_function(x);
}

fn loop_function(mut x: felt252) {
    loop {
        if x == 2 {
            println!("x = {}", x);
            break;
        } else {
            x += 1;
        }
    };
}
