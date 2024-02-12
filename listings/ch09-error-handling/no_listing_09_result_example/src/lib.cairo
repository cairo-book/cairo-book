// TAGS: does_not_compile, ignore_fmt
// ANCHOR: overflow
fn u128_overflowing_add(a: u128, b: u128) -> Result<u128, u128>;
// ANCHOR_END: overflow

// ANCHOR: checked-add
fn u128_checked_add(a: u128, b: u128) -> Option<u128> {
    match u128_overflowing_add(a, b) {
        Result::Ok(r) => Option::Some(r),
        Result::Err(r) => Option::None,
    }
}
// ANCHOR_END: checked-add
