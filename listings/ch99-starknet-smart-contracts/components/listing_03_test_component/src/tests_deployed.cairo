use core::traits::TryInto;
use super::MockContract;
use super::counter::{ICounterDispatcher, ICounterDispatcherTrait};
use starknet::deploy_syscall;
use starknet::SyscallResultTrait;

fn setup_counter() -> ICounterDispatcher {
    let (address, _) = deploy_syscall(
        MockContract::TEST_CLASS_HASH.try_into().unwrap(), 0, array![].span(), false
    )
        .unwrap_syscall();
    ICounterDispatcher { contract_address: address }
}

#[test]
#[available_gas(20000000)]
fn test_constructor() {
    let counter = setup_counter();
    assert_eq!(counter.get_counter(), 0);
}

#[test]
#[available_gas(20000000)]
fn test_increment() {
    let counter = setup_counter();
    counter.increment();
    assert_eq!(counter.get_counter(), 1);
}
