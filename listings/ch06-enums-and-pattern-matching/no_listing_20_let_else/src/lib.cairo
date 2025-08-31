#[derive(Drop)]
enum MyEnum {
    A: u32,
    B: u32,
}

fn foo(a: MyEnum) {
    let MyEnum::A(x) = a else {
        println!("Called with B");
        return;
    };
    println!("Called with A({x})");
}

#[executable]
fn main() {
    foo(MyEnum::A(42));
    foo(MyEnum::B(7));
}

