use debug::PrintTrait;

fn main() {
    let mut data = ArrayTrait::new();
    data.append(2);
    if true == true {
        panic(data);
    }
    'This line isn\'t reached'.print();
}
