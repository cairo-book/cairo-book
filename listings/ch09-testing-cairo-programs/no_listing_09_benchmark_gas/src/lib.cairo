fn sum_n(n: usize) -> usize {
    let mut i = 0;
    let mut sum = 0;
    loop {
        if i == n {
            sum += i;
            break;
        };
        sum += i;
        i += 1;
    };
    sum
}

#[cfg(test)]
mod test {
    use super::sum_n;
    use debug::PrintTrait;
    #[test]
    #[available_gas(2000000)]
    fn benchmark_sum_n_gas() {
        let initial = testing::get_available_gas();
        gas::withdraw_gas().unwrap();
        /// code we want to bench.
        let result = sum_n(10);
        (initial - testing::get_available_gas()).print();
    }
}
