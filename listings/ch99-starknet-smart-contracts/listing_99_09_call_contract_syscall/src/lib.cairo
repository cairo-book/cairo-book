use starknet::ContractAddress;
#[starknet::interface]
trait ITokenWrapper<TContractState> {
    fn transfer_token(
        ref self: TContractState,
        address: starknet::ContractAddress,
        selector: felt252,
        sender: ContractAddress,
        recipient: ContractAddress,
        amount: u256
    ) -> bool;
}

#[starknet::contract]
mod TokenWrapper {
    use super::ITokenWrapper;
    use serde::Serde;
    use starknet::SyscallResultTrait;
    use starknet::ContractAddress;

    #[storage]
    struct Storage {}

    impl TokenWrapper of ITokenWrapper<ContractState> {
        fn transfer_token(
            ref self: ContractState,
            address: ContractAddress,
            selector: felt252,
            sender: ContractAddress,
            recipient: ContractAddress,
            amount: u256
        ) -> bool {
            let mut Calldata: Array<felt252> = ArrayTrait::new();
            Serde::serialize(@sender, ref Calldata);
            Serde::serialize(@recipient, ref Calldata);
            Serde::serialize(@amount, ref Calldata);
            let mut res = starknet::call_contract_syscall(
                address, selector!("selector"), Calldata.span()
            )
                .unwrap_syscall();
            Serde::<bool>::deserialize(ref res).unwrap()
        }
    }
}

