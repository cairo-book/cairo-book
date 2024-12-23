//ANCHOR: full
//ANCHOR: interface
use core::starknet::ContractAddress;

#[starknet::interface]
trait IOwnableCounter<TContractState> {
    fn get_counter(self: @TContractState) -> u32;
    fn increment(ref self: TContractState);
    fn transfer_ownership(ref self: TContractState, new_owner: ContractAddress);
}
//ANCHOR_END: interface

//ANCHOR: component
#[starknet::component]
mod OwnableCounterComponent {
    use listing_03_component_dep::owner::{ownable_component, ownable_component::InternalImpl};
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use core::starknet::ContractAddress;

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
        impl Owner: ownable_component::HasComponent<TContractState>,
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

        //ANCHOR: transfer_ownership
        fn transfer_ownership(
            ref self: ComponentState<TContractState>, new_owner: ContractAddress,
        ) {
            let mut ownable_comp = get_dep_component_mut!(ref self, Owner);
            ownable_comp._transfer_ownership(new_owner);
        }
        //ANCHOR_END: transfer_ownership
    }
    //ANCHOR_END: component_impl
}
//ANCHOR_END: component
//ANCHOR_END: full


