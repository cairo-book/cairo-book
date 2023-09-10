#[starknet::interface]
trait ITokenWrapper<TContractState> {
    fn transfer_token(
        ref self: TContractState,
        address: starknet::ContractAddress,
        selector: felt252,
        calldata: Array<felt252>
    ) -> bool;
}

#[starknet::contract]
mod TokenWrapper {
    use super::ITokenWrapper;
    use starknet::SyscallResultTrait;

    #[storage]
    struct Storage {}

    impl TokenWrapper of ITokenWrapper<ContractState> {
        fn transfer_token(
            ref self: ContractState,
            address: starknet::ContractAddress,
            selector: felt252,
            calldata: Array<felt252>
        ) -> bool {
            let mut res = starknet::call_contract_syscall(address, selector, calldata.span())
                .unwrap_syscall();
            Serde::<bool>::deserialize(ref res).unwrap()
        }
    }
}
