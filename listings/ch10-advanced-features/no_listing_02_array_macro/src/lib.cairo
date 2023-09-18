fn main() {
    //ANCHOR: no_macro
    let mut arr = ArrayTrait::new();
    arr.append(1);
    arr.append(2);
    arr.append(3);
    arr.append(4);
    arr.append(5);
    //ANCHOR_END: no_macro

    //ANCHOR: array_macro
    let arr = array![1, 2, 3, 4, 5];
//ANCHOR_END: array_macro
}
