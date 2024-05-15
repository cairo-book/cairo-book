fn main() {
    let s1: ByteArray = "tic";
    let s2: ByteArray = "tac";
    let s3: ByteArray = "toe";
    let s = s1 + "-" + s2 + "-" + s3;
    // using + operator consumes the strings, so they can't be used again!

    let s1: ByteArray = "tic";
    let s2: ByteArray = "tac";
    let s3: ByteArray = "toe";
    let s = format!("{s1}-{s2}-{s3}"); // s1, s2, s3 are not consumed by format!
    // or
    let s = format!("{}-{}-{}", s1, s2, s3);

    println!("{}", s);
}
