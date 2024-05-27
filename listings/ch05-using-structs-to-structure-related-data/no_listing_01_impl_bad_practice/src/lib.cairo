#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

#[derive(Copy, Drop)]
struct Circle {
    radius: u64,
    center: (u64, u64),
}

#[derive(Copy, Drop)]
struct Cat {}



//ANCHOR: bad_implementation
trait ShapeTrait {
    fn area(self: @Rectangle) -> u64;
    fn area(self: @Circle) -> u64;
}

impl ShapeImpl of RectangleTrait {
    fn area(self: @Rectangle) -> u64 {
        (*self.width) * (*self.height)
    }

    fn area(self: @Circle) -> u64 {
        (*self.radius) * (*self.radius) * 3.14
    }
}
//ANCHOR_END: bad_implementation

//ANCHOR: very_bad_implementation
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
//ANCHOR_END: very_bad_implementation

//ANCHOR: good_implementation_splitted
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
//ANCHOR_END: good_implementation_splitted

//ANCHOR: good_implementation
trait ShapeTrait<T> {
    fn area(self: @T) -> u64;
}

impl ShapeImpl of ShapeTrait<Rectangle> {
    fn area(self: @Rectangle) -> u64 {
        (*self.width) * (*self.height)
    }
}

impl ShapeImpl of ShapeTrait<Circle> {
    fn area(self: @Circle) -> u64 {
        (*self.radius) * (*self.radius) * 3.14
    }
}
//ANCHOR_END: good_implementation

//ANCHOR: main
fn main() {
    let rect1 = Rectangle { width: 30, height: 50, };
    println!("Area is {}", rect1.area());
}
//ANCHOR_END: main


