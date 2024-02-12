// TAG: ignore_fmt
//ANCHOR: all
fn main() {
    let y = {
        let x = 3;
        x + 1
    };
    println!("The value of y is: {}", y);
}
//ANCHOR_END: all

fn expression() {
//ANCHOR: block_expr
let y = {
    let x = 3;
    x + 1
};
//ANCHOR_END: block_expr
}
