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
    #[test]
    #[available_gas(2000000)]
    fn test_sum_n() {
        let result = sum_n(10);
        assert(result == 55, 'result is not 55');
    }
}
