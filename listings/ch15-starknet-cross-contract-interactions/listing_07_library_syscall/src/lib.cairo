use starknet::ContractAddress;

#[starknet::interface]
trait IContractB<TContractState> {
    fn set_value(ref self: TContractState, value: u128) -> bool;
}

#[starknet::contract]
mod ContractA {
    use super::{IContractBDispatcherTrait, IContractBLibraryDispatcher};
    use starknet::{class_hash::class_hash_const, syscalls, SyscallResultTrait};

    #[storage]
    struct Storage {
        value: u128
    }

    #[external(v0)]
    fn set_value(ref self: ContractState, value: u128) -> bool {
        let mut call_data: Array<felt252> = array![];
        Serde::serialize(@value, ref call_data);

        let mut res = syscalls::library_call_syscall(
            class_hash_const::<'ContractB class hash'>(), selector!("set_value"), call_data.span()
        )
            .unwrap_syscall();

        Serde::<bool>::deserialize(ref res).unwrap()
    }

    #[external(v0)]
    fn get_value(self: @ContractState) -> u128 {
        self.value.read()
    }
}

