fn main() {

    let result = loop {
        let mut x: felt252 = 0;
        if x == 2 {
            break x;
        } else {
            x += 1;
        }
    };

    println!("x = {} " , result);
}