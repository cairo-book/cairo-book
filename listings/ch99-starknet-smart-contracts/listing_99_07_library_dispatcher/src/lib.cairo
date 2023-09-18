//TAG: does_not_compile
use starknet::ContractAddress;

trait IERC20DispatcherTrait<T> {
    fn name(self: T) -> felt252;
    fn transfer(self: T, recipient: ContractAddress, amount: u256);
}

#[derive(Copy, Drop, starknet::Store, Serde)]
struct IERC20LibraryDispatcher {
    class_hash: starknet::ClassHash,
}

impl IERC20LibraryDispatcherImpl of IERC20DispatcherTrait<IERC20LibraryDispatcher> {
    fn name(
        self: IERC20LibraryDispatcher
    ) -> felt252 { // starknet::syscalls::library_call_syscall  is called in here
    }
    fn transfer(
        self: IERC20LibraryDispatcher, recipient: ContractAddress, amount: u256
    ) { // starknet::syscalls::library_call_syscall  is called in here
    }
}
