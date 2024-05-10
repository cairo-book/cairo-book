#[cfg(test)]
mod foundry_test {
    use source::pizza::{
        IPizzaFactoryDispatcher, IPizzaFactorySafeDispatcher, IPizzaFactoryDispatcherTrait,
        PizzaFactory::{ownerContractMemberStateTrait, InternalTrait}
    };

    use starknet::{ContractAddress, contract_address_const};

    use snforge_std::{
        declare, ContractClassTrait, ContractClass, start_prank, stop_prank, CheatTarget, Event,
        SpyOn, EventSpy, EventAssertions, spy_events, EventFetcher
    };

    use snforge_std as snf;

    fn deploy_contract(name: ByteArray) -> (IPizzaFactoryDispatcher, ContractAddress) {
        let contract = snf::declare(name).unwrap();
        let owner: ContractAddress = contract_address_const::<'owner'>();

        let mut constructor_calldata = array![owner.into()];

        let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

        let dispatcher = IPizzaFactoryDispatcher { contract_address };

        (dispatcher, contract_address)
    }

    #[test]
    #[should_panic(expected: ('Only the owner can make pizza', ))]
    fn test_deploy() {
        let (pizza_factory, pizza_factory_address) = deploy_contract("PizzaFactory");

        let owner_check: ContractAddress = contract_address_const::<'owner'>();

        assert_eq!(pizza_factory.get_owner(), owner_check);

        start_prank(CheatTarget::One(pizza_factory_address), owner_check);

        pizza_factory.make_pizza();

        assert_eq!(pizza_factory.count_pizza(), 1);

        stop_prank(CheatTarget::One(pizza_factory_address));

        pizza_factory.make_pizza();
    }

    #[test]
    fn test_set_as_new_owner() {
        let (pizza_factory, pizza_factory_address) = deploy_contract("PizzaFactory");

        let owner_check: ContractAddress = contract_address_const::<'owner'>();
        let new_owner: ContractAddress = contract_address_const::<'new_owner'>();
        assert_eq!(pizza_factory.get_owner(), owner_check);

        start_prank(CheatTarget::One(pizza_factory_address), owner_check);

        pizza_factory.change_owner(new_owner);

        assert_eq!(pizza_factory.get_owner(), new_owner);
    }

    #[test]
    fn capture_pizza_emission_event() {
        let (pizza_factory, pizza_factory_address) = deploy_contract("PizzaFactory");

        let owner = pizza_factory.get_owner();

        start_prank(CheatTarget::One(pizza_factory_address), owner);

        let mut spy = spy_events(SpyOn::One(pizza_factory_address));

        pizza_factory.make_pizza();

        spy
            .assert_emitted(
                @array![
                    (
                        pizza_factory_address,
                        source::pizza::PizzaFactory::Event::PizzaEmission(
                            source::pizza::PizzaFactory::PizzaEmission {
                                counter: pizza_factory.count_pizza()
                            }
                        )
                    )
                ]
            );

        assert_eq!(pizza_factory.count_pizza(), 1);
    }

    #[test]
    fn test_set_as_new_owner_direct() {
        let mut state = source::pizza::PizzaFactory::contract_state_for_testing();
        let owner: ContractAddress = contract_address_const::<'owner'>();
        state.owner.write(owner);
        assert_eq!(state.owner.read(), owner);
    }
}


