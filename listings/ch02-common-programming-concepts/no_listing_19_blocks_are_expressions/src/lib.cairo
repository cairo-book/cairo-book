//ANCHOR: all
use debug::PrintTrait;
fn main() {
    //ANCHOR: block_expr
    let y = {
        let x = 3;
        x + 1
    };
    //ANCHOR_END: block_expr

    y.print();
}
//ANCHOR_END: all


