fn main() {

    loop {
        let mut x: felt252 = 0;
        if x == 2 {
            break;
        } else {
            x += 1;
        }
    }

    println!("x = {} " , x);
}