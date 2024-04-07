use core::fmt::Formatter;

fn main() {
    let mut formatter: Formatter = Default::default();
    let a = 10;
    let b = 20;
    write!(formatter, "hello");
    write!(formatter, "world");
    write!(formatter, " {a} {b}");

    println!("{}", formatter.buffer); // helloworld 10 20
}
