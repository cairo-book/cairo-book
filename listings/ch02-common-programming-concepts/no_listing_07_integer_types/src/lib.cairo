// TAG: does_not_run

fn sub_u8s(x: u8, y: u8) -> u8 {
    x - y
}

#[executable]
fn main() {
    sub_u8s(1, 3);
}
