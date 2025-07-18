use core::fmt::{Display, Error, Formatter};

#[derive(Copy, Drop)]
struct Point {
    x: u8,
    y: u8,
}

impl PointDisplay of Display<Point> {
    fn fmt(self: @Point, ref f: Formatter) -> Result<(), Error> {
        let str: ByteArray = format!("Point ({}, {})", *self.x, *self.y);
        f.buffer.append(@str);
        Ok(())
    }
}

#[executable]
fn main() {
    let p = Point { x: 1, y: 3 };
    println!("{}", p); // Point: (1, 3)
}
