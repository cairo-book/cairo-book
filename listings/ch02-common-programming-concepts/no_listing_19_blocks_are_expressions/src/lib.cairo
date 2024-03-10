//ANCHOR: all
fn main() {
    //ANCHOR: block_expr
    let y = {
        let x = 3;
        x + 1
    };
    //ANCHOR_END: block_expr

    println!("The value of y is: {}", y);
}
//ANCHOR_END: all


