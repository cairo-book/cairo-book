use core::starknet::ContractAddress;

#[starknet::interface]
trait ITokenWrapper<TContractState> {
    fn transfer_token(
        ref self: TContractState,
        address: ContractAddress,
        recipient: ContractAddress,
        amount: u256,
    ) -> bool;
}

#[starknet::contract]
mod TokenWrapper {
    use super::ITokenWrapper;
    use core::starknet::{ContractAddress, syscalls, SyscallResultTrait, get_caller_address};

    #[storage]
    struct Storage {}

    impl TokenWrapper of ITokenWrapper<ContractState> {
        fn transfer_token(
            ref self: ContractState,
            address: ContractAddress,
            recipient: ContractAddress,
            amount: u256,
        ) -> bool {
            let mut call_data: Array<felt252> = array![];
            Serde::serialize(@get_caller_address(), ref call_data);
            Serde::serialize(@recipient, ref call_data);
            Serde::serialize(@amount, ref call_data);

            let mut res = syscalls::call_contract_syscall(
                address, selector!("transfer_from"), call_data.span(),
            )
                .unwrap_syscall();

            Serde::<bool>::deserialize(ref res).unwrap()
        }
    }
}
