//TAG: does_not_compile

//ANCHOR: here
fn plus_one(x: Option<u8>) -> Option<u8> {
    match x {
        Option::Some(val) => Option::Some(val + 1),
    }
}
//ANCHOR_END: here

fn main() {
    let five: Option<u8> = Option::Some(5);
    let six: Option<u8> = plus_one(five);
    println!("six: {}", six.unwrap());
    let none = plus_one(Option::None);
    println!("none: {}", none.unwrap());
}
