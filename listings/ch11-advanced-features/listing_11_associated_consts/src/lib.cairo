// ANCHOR: associated_consts
trait Shape<T> {
    const SIDES: u32;
    fn describe() -> ByteArray;
}

struct Triangle {}

impl TriangleShape of Shape<Triangle> {
    const SIDES: u32 = 3;
    fn describe() -> ByteArray {
        "I am a triangle."
    }
}

struct Square {}

impl SquareShape of Shape<Square> {
    const SIDES: u32 = 4;
    fn describe() -> ByteArray {
        "I am a square."
    }
}
// ANCHOR_END: associated_consts

// ANCHOR: print_info
fn print_shape_info<T, impl ShapeImpl: Shape<T>>() {
    println!("I have {} sides. {}", ShapeImpl::SIDES, ShapeImpl::describe());
}
// ANCHOR_END: print_info

// ANCHOR: main
fn main() {
    print_shape_info::<Triangle>();
    print_shape_info::<Square>();
}
// ANCHOR_END: main


