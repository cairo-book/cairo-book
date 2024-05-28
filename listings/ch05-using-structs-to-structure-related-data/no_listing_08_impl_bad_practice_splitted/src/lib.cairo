#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

#[derive(Copy, Drop)]
struct Cat {}

//ANCHOR: bad_implementation
trait BadTrait {
    fn area(self: @Rectangle) -> u64;
    fn meow(self: @Cat);
}

impl BadImpl of BadTrait {
    fn area(self: @Rectangle) -> u64 {
        (*self.width) * (*self.height)
    }

    fn meow(self: @Cat) {
        println!("Meow!");
    }
}
//ANCHOR_END: bad_implementation

//ANCHOR: implementation_splitted
trait RectangleTrait {
    fn area(self: @Rectangle) -> u64;
}
trait CatTrait {
    fn meow(self: @Cat);
}

impl RectangleImpl of RectangleTrait {
    fn area(self: @Rectangle) -> u64 {
        (*self.width) * (*self.height)
    }
}
impl CatImpl of CatTrait {
    fn meow(self: @Cat) {
        println!("Meow!");
    }
}
//ANCHOR_END: implementation_splitted


