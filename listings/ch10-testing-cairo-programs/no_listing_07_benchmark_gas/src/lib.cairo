fn sum_n(n: usize) -> usize {
    let mut i = 0;
    let mut sum = 0;
    while i <= n {
        sum += i;
        i += 1;
    };
    sum
}

#[cfg(test)]
mod test {
    use super::sum_n;
    use core::testing;
    use core::gas;

    #[test]
    fn benchmark_sum_n_gas() {
        let initial = testing::get_available_gas();
        gas::withdraw_gas().unwrap();
        /// code we want to bench.
        let _result = sum_n(10);
        println!("consumed gas: {}\n", initial - testing::get_available_gas());
    }
}
