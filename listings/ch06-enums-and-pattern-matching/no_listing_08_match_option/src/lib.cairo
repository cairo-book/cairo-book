//ANCHOR:all
fn plus_one(x: Option<u8>) -> Option<u8> {
    match x {
        //ANCHOR: option_some
        Some(val) => Some(val + 1),
        //ANCHOR_END: option_some
        // ANCHOR: option_none
        None => None,
        //ANCHOR_END: option_none
    }
}

fn main() {
    let five: Option<u8> = Some(5);
    let six: Option<u8> = plus_one(five);
    let none = plus_one(None);
}
//ANCHOR_END:all


