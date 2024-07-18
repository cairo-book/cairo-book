mod arrays_utils;

use core::box::BoxTrait;
use arrays_utils::arrays_utils::handling_array;

const my_arr: [u64; 5] = [1, 2, 3, 4, 5];

fn main() {
    let boxed_arr = BoxTrait::new(my_arr);
    handling_array(boxed_arr);    
}