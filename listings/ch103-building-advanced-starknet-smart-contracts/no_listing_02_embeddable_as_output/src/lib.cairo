//TAG: does_not_compile
#[starknet::embeddable]
impl OwnableImpl<
    TContractState, +HasComponent<TContractState>, impl TContractStateDrop: Drop<TContractState>,
> of super::IOwnable<TContractState> {
    fn owner(self: @TContractState) -> ContractAddress {
        let component = HasComponent::get_component(self);
        Ownable::owner(component)
    }

    fn transfer_ownership(ref self: TContractState, new_owner: ContractAddress) {
        let mut component = HasComponent::get_component_mut(ref self);
        Ownable::transfer_ownership(ref component, new_owner)
    }

    fn renounce_ownership(ref self: TContractState) {
        let mut component = HasComponent::get_component_mut(ref self);
        Ownable::renounce_ownership(ref component)
    }
}
