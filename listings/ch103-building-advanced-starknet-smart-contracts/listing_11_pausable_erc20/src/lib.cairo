#[starknet::contract]
pub mod PausableERC20 {
    use openzeppelin_access::accesscontrol::AccessControlComponent;
    use openzeppelin_introspection::src5::SRC5Component;
    use openzeppelin_security::pausable::PausableComponent;
    use openzeppelin_token::erc20::{DefaultConfig, ERC20Component};
    use starknet::ContractAddress;

    const PAUSER_ROLE: felt252 = selector!("PAUSER_ROLE");
    const MINTER_ROLE: felt252 = selector!("MINTER_ROLE");

    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: PausableComponent, storage: pausable, event: PausableEvent);
    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    // AccessControl
    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;
    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;

    // SRC5
    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    // Pausable
    #[abi(embed_v0)]
    impl PausableImpl = PausableComponent::PausableImpl<ContractState>;
    impl PausableInternalImpl = PausableComponent::InternalImpl<ContractState>;

    // ERC20
    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        pausable: PausableComponent::Storage,
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        PausableEvent: PausableComponent::Event,
        #[flat]
        ERC20Event: ERC20Component::Event,
    }

    // ERC20 Hooks implementation
    impl ERC20HooksImpl of ERC20Component::ERC20HooksTrait<ContractState> {
        fn before_update(
            ref self: ERC20Component::ComponentState<ContractState>,
            from: ContractAddress,
            recipient: ContractAddress,
            amount: u256,
        ) {
            let contract_state = self.get_contract();
            // Check that the contract is not paused
            contract_state.pausable.assert_not_paused();
        }
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        let name = "PausableToken";
        let symbol = "PST";

        self.erc20.initializer(name, symbol);

        // Grant admin role
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(AccessControlComponent::DEFAULT_ADMIN_ROLE, admin);

        // Grant specific roles to admin
        self.accesscontrol._grant_role(PAUSER_ROLE, admin);
        self.accesscontrol._grant_role(MINTER_ROLE, admin);
    }

    #[external(v0)]
    fn pause(ref self: ContractState) {
        self.accesscontrol.assert_only_role(PAUSER_ROLE);
        self.pausable.pause();
    }

    #[external(v0)]
    fn unpause(ref self: ContractState) {
        self.accesscontrol.assert_only_role(PAUSER_ROLE);
        self.pausable.unpause();
    }

    #[external(v0)]
    fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256) {
        self.accesscontrol.assert_only_role(MINTER_ROLE);
        self.erc20.mint(recipient, amount);
    }
}
