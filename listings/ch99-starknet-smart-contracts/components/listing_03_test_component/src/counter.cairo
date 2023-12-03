//ANCHOR: interface
#[starknet::interface]
trait ICounter<TContractState> {
    fn get_counter(self: @TContractState) -> u32;
    fn increment(ref self: TContractState);
}
//ANCHOR_END: interface

//ANCHOR: component
#[starknet::component]
mod CounterComponent {
    #[storage]
    struct Storage {
        value: u32
    }

    #[embeddable_as(CounterImpl)]
    impl Counter<
        TContractState, +HasComponent<TContractState>
    > of super::ICounter<ComponentState<TContractState>> {
        //ANCHOR: get_counter
        fn get_counter(self: @ComponentState<TContractState>) -> u32 {
            self.value.read()
        }
        //ANCHOR_END: get_counter
        //ANCHOR: increment
        fn increment(ref self: ComponentState<TContractState>) {
            self.value.write(self.value.read() + 1);
        }
    //ANCHOR_END: increment
    }
}
//ANCHOR_END: component

