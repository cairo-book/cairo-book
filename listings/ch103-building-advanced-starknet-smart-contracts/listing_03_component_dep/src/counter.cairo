//ANCHOR: full
//ANCHOR: interface

#[starknet::interface]
trait IOwnableCounter<TContractState> {
    fn get_counter(self: @TContractState) -> u32;
    fn increment(ref self: TContractState);
}
//ANCHOR_END: interface

//ANCHOR: component
#[starknet::component]
pub mod OwnableCounterComponent {
    use listing_03_component_dep::owner::OwnableComponent;
    use listing_03_component_dep::owner::OwnableComponent::InternalImpl;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    pub struct Storage {
        value: u32,
    }

    //ANCHOR: component_impl
    #[embeddable_as(OwnableCounterImpl)]
    //ANCHOR: component_signature
    impl OwnableCounter<
        TContractState,
        +HasComponent<TContractState>,
        +Drop<TContractState>,
        impl Owner: OwnableComponent::HasComponent<TContractState>,
    > of super::IOwnableCounter<ComponentState<TContractState>> {
        //ANCHOR_END: component_signature
        //ANCHOR: get_counter
        fn get_counter(self: @ComponentState<TContractState>) -> u32 {
            self.value.read()
        }
        //ANCHOR_END: get_counter

        //ANCHOR: increment
        fn increment(ref self: ComponentState<TContractState>) {
            let ownable_comp = get_dep_component!(@self, Owner);
            ownable_comp.assert_only_owner();
            self.value.write(self.value.read() + 1);
        }
        //ANCHOR_END: increment
    }
    //ANCHOR_END: component_impl
}
//ANCHOR_END: component
//ANCHOR_END: full


