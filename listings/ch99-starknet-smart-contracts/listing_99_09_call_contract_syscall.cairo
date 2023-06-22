#[starknet::contract]
mod Contract {
    use array::ArrayTrait;

    impl Contract of IContract<ContractState> {
        fn transfer_token(
            ref self: ContractState,
            address: starknet::ContractAddress,
            selector: felt252,
            calldata: Array<felt252>
        ) -> Span::<felt252> {
            starknet::call_contract_syscall(address, selector, calldata.span()).unwrap_syscall()
        }
    }
}
