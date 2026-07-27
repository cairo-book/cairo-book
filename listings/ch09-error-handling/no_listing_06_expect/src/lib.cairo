// TAG: does_not_run

fn wrap_if_not_zero(value: u128) -> Option<u128> {
    if value == 0 {
        None
    } else {
        Some(value)
    }
}

#[executable]
fn main() {
    let value = wrap_if_not_zero(42).expect('value is 0'); // this returns 42
    println!("value: {}", value);
    wrap_if_not_zero(0).expect('value is 0'); // this panics with 'value is 0'
}
