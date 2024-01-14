use core::fmt::Formatter;
fn main() {
    let mut formatter: Formatter = Default::default();
    write!(formatter, "hello");
    write!(formatter, "world");
    println!("{}", formatter.buffer); // helloworld
}
