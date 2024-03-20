//TAG: does_not_compile
use starknet::{ContractAddress};

trait IERC20DispatcherTrait<T> {
    fn name(self: T) -> felt252;
    fn transfer(self: T, recipient: ContractAddress, amount: u256);
}

#[derive(Copy, Drop, starknet::Store, Serde)]
struct IERC20Dispatcher {
    contract_address: ContractAddress,
}

impl IERC20DispatcherImpl of IERC20DispatcherTrait<IERC20Dispatcher> {
    fn name(
        self: IERC20Dispatcher
    ) -> felt252 { // starknet::call_contract_syscall is called in here
    }
    fn transfer(
        self: IERC20Dispatcher, recipient: ContractAddress, amount: u256
    ) { // starknet::call_contract_syscall is called in here
    }
}
