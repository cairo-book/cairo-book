use core::array::ArrayTrait as Arr;

#[executable]
fn main() {
    let mut arr = Arr::new(); // ArrayTrait was renamed to Arr
    arr.append(1);
}
