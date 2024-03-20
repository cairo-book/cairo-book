#[starknet::interface]
trait SimpleTrait<TContractState> {
    fn ret_4(self: @TContractState) -> u8;
}

#[starknet::embeddable]
impl SimpleImpl<TContractState> of SimpleTrait<TContractState> {
    fn ret_4(self: @TContractState) -> u8 {
        4
    }
}

#[starknet::contract]
mod simple_contract {
    #[storage]
    struct Storage {}

    #[abi(embed_v0)]
    impl MySimpleImpl = super::SimpleImpl<ContractState>;
}
