//ANCHOR:all
use debug::PrintTrait;

fn plus_one(x: Option<u8>) -> Option<u8> {
    match x {
        //ANCHOR: option_some
        Option::Some(val) => Option::Some(val + 1),
        //ANCHOR_END: option_some
        // ANCHOR: option_none
        Option::None => Option::None,
    //ANCHOR_END: option_none
    }
}

fn main() {
    let five: Option<u8> = Option::Some(5);
    let six: Option<u8> = plus_one(five);
    six.unwrap().print();
    let none = plus_one(Option::None);
    none.unwrap().print();
}
//ANCHOR_END:all


