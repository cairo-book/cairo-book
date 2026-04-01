use starknet::ContractAddress;

#[starknet::interface]
trait IVrfConsumer<TContractState> {
    fn get_vrf_provider(self: @TContractState) -> ContractAddress;
}

#[starknet::component]
pub mod VrfConsumerComponent {
    use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
    use core::num::traits::Zero;
    use starknet::ContractAddress;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    pub struct Storage {
        VrfConsumer_vrf_provider: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct VrfProviderChanged {
        address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    #[event]
    pub enum Event {
        VrfProviderChanged: VrfProviderChanged,
    }

    pub mod Errors {
        pub const ADDRESS_ZERO: felt252 = 'VrfConsumer: address is zero';
    }

    #[embeddable_as(VrfConsumerImpl)]
    impl VrfConsumer<
        TContractState, +Drop<TContractState>, +HasComponent<TContractState>,
    > of super::IVrfConsumer<ComponentState<TContractState>> {
        fn get_vrf_provider(self: @ComponentState<TContractState>) -> ContractAddress {
            self.VrfConsumer_vrf_provider.read()
        }
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState, +HasComponent<TContractState>,
    > of InternalTrait<TContractState> {
        fn initializer(ref self: ComponentState<TContractState>, vrf_provider: ContractAddress) {
            self.set_vrf_provider(vrf_provider);
        }

        fn consume_random(self: @ComponentState<TContractState>, source: Source) -> felt252 {
            self.vrf_provider_disp().consume_random(source)
        }

        fn vrf_provider_disp(self: @ComponentState<TContractState>) -> IVrfProviderDispatcher {
            IVrfProviderDispatcher { contract_address: self.VrfConsumer_vrf_provider.read() }
        }

        fn set_vrf_provider(
            ref self: ComponentState<TContractState>, new_vrf_provider: ContractAddress,
        ) {
            assert(!new_vrf_provider.is_zero(), Errors::ADDRESS_ZERO);
            self.VrfConsumer_vrf_provider.write(new_vrf_provider);

            self.emit(VrfProviderChanged { address: new_vrf_provider })
        }
    }
}
