fn main() {
    let var1 = 1;
    let var2 = 2;
    assert!(var1 != var2);
    assert!(var1 != var2, "values should not be equal");
    assert!(var1 != var2, "{},{} should not be equal", var1, var2);
}
