#[executable]
fn main() {
    let tup = (500_u32, 6_u32, true);

    println!("The second value is {}", tup.1);

    let nested = ((1_u32, 2_u32), 3_u32);
    println!("The inner second value is {}", nested.0.1);

    let mut scores = (10_u32, 20_u32);
    scores.0 = 15;
    scores.1 += 5;
    println!("Scores are now {} and {}", scores.0, scores.1);
}
