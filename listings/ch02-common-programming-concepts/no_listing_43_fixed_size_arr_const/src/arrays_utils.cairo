pub mod arrays_utils {
    pub fn handling_array (arr: Box<[u64; 5]>) {
        // doing complicated stuff here ...
        let [a, _, _, _, e] = arr.unbox();
        println!("result: {}", a + e);
    }
}