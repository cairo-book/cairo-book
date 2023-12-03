mod counter;
mod tests_deployed;
mod tests_direct;

// ANCHOR: mock_contract
#[starknet::contract]
mod MockContract {
    use super::counter::CounterComponent;
    component!(path: CounterComponent, storage: counter, event: CounterEvent);
    #[storage]
    struct Storage {
        #[substorage(v0)]
        counter: CounterComponent::Storage,
    }
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        CounterEvent: CounterComponent::Event
    }

    #[abi(embed_v0)]
    impl CounterImpl = CounterComponent::CounterImpl<ContractState>;
}
//ANCHOR_END: mock_contract


