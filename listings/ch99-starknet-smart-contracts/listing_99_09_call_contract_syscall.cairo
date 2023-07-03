#[contract]
mod contract {
    use array::ArrayTrait;
    #[external]
    fn transfer_token(
        address: starknet::ContractAddress, selector: felt252, calldata: Array<felt252>
    ) -> Span::<felt252> {
        starknet::call_contract_syscall(address, selector, calldata.span()).unwrap_syscall()
    }
}
