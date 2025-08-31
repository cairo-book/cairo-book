use core::num::traits::Pow;

// Call into the Rust oracle to get the square root of an integer.
fn sqrt_call(x: u64) -> oracle::Result<u64> {
    oracle::invoke("stdio:cargo -q run --manifest-path ./src/my_oracle/Cargo.toml", 'sqrt', (x,))
}

// Call into the Rust oracle to convert an integer to little-endian bytes.
fn to_le_bytes(val: u64) -> oracle::Result<Array<u8>> {
    oracle::invoke(
        "stdio:cargo -q run --manifest-path ./src/my_oracle/Cargo.toml", 'to_le_bytes', (val,),
    )
}

fn oracle_calls(x: u64) -> Result<(), oracle::Error> {
    let sqrt = sqrt_call(x)?;
    // CONSTRAINT: sqrt * sqrt == x
    assert!(sqrt * sqrt == x, "Expected sqrt({x}) * sqrt({x}) == x, got {sqrt} * {sqrt} == {x}");
    println!("Computed sqrt({x}) = {sqrt}");

    let bytes = to_le_bytes(x)?;
    // CONSTRAINT: sum(bytes_i * 256^i) == x
    let mut recomposed_val = 0;
    for (i, byte) in bytes.span().into_iter().enumerate() {
        recomposed_val += (*byte).into() * 256_u64.pow(i.into());
    }
    assert!(
        recomposed_val == x,
        "Expected recomposed value {recomposed_val} == {x}, got {recomposed_val}",
    );
    println!("le_bytes decomposition of {x}) = {:?}", bytes.span());

    Ok(())
}

#[executable]
fn main(x: u64) -> bool {
    match oracle_calls(x) {
        Ok(()) => true,
        Err(e) => panic!("Oracle call failed: {e:?}"),
    }
}
