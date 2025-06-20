// TAGS: does_not_compile, ignore_fmt
#[executable]
fn main() {
    let x = (let y = 6);
}
