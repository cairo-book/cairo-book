use anyhow::ensure;
use cairo_oracle_server::Oracle;
use std::process::ExitCode;

fn main() -> ExitCode {
    Oracle::new()
        .provide("sqrt", |value: u64| {
            let sqrt = (value as f64).sqrt() as u64;
            ensure!(
                sqrt * sqrt == value,
                "Cannot compute integer square root of {value}"
            );
            Ok(sqrt)
        })
        .provide("to_le_bytes", |value: u64| {
            let value_bytes = value.to_le_bytes();
            Ok(value_bytes.to_vec())
        })
        .run()
}
