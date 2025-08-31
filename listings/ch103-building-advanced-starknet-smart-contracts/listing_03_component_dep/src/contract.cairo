//ANCHOR: all
#[starknet::contract]
mod OwnableCounter {
    use listing_03_component_dep::counter::OwnableCounterComponent;
    use listing_03_component_dep::owner::OwnableComponent;
    use starknet::ContractAddress;

    component!(path: OwnableCounterComponent, storage: counter, event: CounterEvent);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    //ANCHOR:  embedded_impl
    #[abi(embed_v0)]
    impl OwnableCounterImpl =
        OwnableCounterComponent::OwnableCounterImpl<ContractState>;
    //ANCHOR_END: embedded_impl

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        counter: OwnableCounterComponent::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        CounterEvent: OwnableCounterComponent::Event,
        OwnableEvent: OwnableComponent::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }
}
//ANCHOR_END: all


