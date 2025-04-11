//TAG: does_not_compile

//ANCHOR: here
fn plus_one(x: Option<u8>) -> Option<u8> {
    match x {
        Some(val) => Some(val + 1),
    }
}
//ANCHOR_END: here

fn main() {
    let five: Option<u8> = Some(5);
    let six: Option<u8> = plus_one(five);
    println!("six: {}", six.unwrap());
    let none = plus_one(None);
    println!("none: {}", none.unwrap());
}
