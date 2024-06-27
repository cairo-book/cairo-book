use core::traits::Into;

#[derive(Drop, Debug)]
struct Number {
    value: u32,
}

impl U32IntoNumber of Into<u32, Number> {
    fn into(self: u32) -> Number {
        Number { value: self }
    }
}

fn main() {
    let int: u32 = 5;
    // Compiler will complain if you remove the type annotation
    let num: Number = int.into();
    println!("My number is {:?}", num);
}
