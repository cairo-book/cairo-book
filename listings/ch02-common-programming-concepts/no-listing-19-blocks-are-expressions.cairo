use debug::PrintTrait;
fn main() {
    let y = {
        let x = 3;
        x + 1
    };

    y.print();
}
