fn main() {
    let inlined: ByteArray = inlined();
    let not_inlined: ByteArray = not_inlined();

    println!("First function call is {}", inlined);
    println!("Second function call is {}", not_inlined);
}

#[inline(always)]
fn inlined() -> ByteArray {
    "inlined"
}

fn not_inlined() -> ByteArray {
    "not inlined"
}
