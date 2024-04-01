fn main() {
    inlined();
    not_inlined();
}

#[inline(always)]
fn inlined() -> ByteArray {
    "inlined"
}

fn not_inlined() -> ByteArray {
    "not inlined"
}

