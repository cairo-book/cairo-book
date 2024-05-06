#[test]
mod foundry_test {
    use starknet::{ContractAddress, contract_address_const};

    use snforge_std::{
        declare, ContractClassTrait, ContractClass, start_prank, stop_prank, CheatTarget, Event,
        SpyOn, EventSpy, EventAssertions, spy_events, EventFetcher
    };

    use source::pizza::{
        IPizzaFactoryDispatcher, IPizzaFactorySafeDispatcher, IPizzaFactoryDispatcherTrait
    };

    use source::pizza;

    use core::traits::{TryInto, Into};
    use core::num::traits::Zero;

    use pizza::PizzaFactory::ownerContractMemberStateTrait;
    use pizza::PizzaFactory::{InternalTrait};

    fn deploy_contract(name: ByteArray) -> ContractAddress {
        let contract = declare(name).unwrap();
        let owner: ContractAddress = contract_address_const::<'owner'>();

        let mut constructor_calldata = array![owner.into()];

        let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

        contract_address
    }

    #[test]
    fn test_deploy() {
        let contract_address = deploy_contract("PizzaFactory");

        let dispatcher = IPizzaFactoryDispatcher { contract_address };

        let owner_check: ContractAddress = contract_address_const::<'owner'>();

        assert(dispatcher.get_owner() == owner_check, 'owner is not the same');

        start_prank(CheatTarget::One(contract_address), owner_check);

        dispatcher.make_pizza();

        assert(dispatcher.count_pizza() == 1, 'pizza count is not 1');
    }


    #[test]
    fn test_set_as_new_owner() {
        let contract_address = deploy_contract("PizzaFactory");

        let dispatcher = IPizzaFactoryDispatcher { contract_address };

        let owner_check: ContractAddress = contract_address_const::<'owner'>();
        let new_owner: ContractAddress = contract_address_const::<'new_owner'>();
        assert(dispatcher.get_owner() == owner_check, 'owner is not the same');

        start_prank(CheatTarget::One(contract_address), owner_check);

        dispatcher.change_owner(new_owner);

        assert(dispatcher.get_owner() == new_owner, 'owner is not the same');
    }

    #[test]
    fn capture_pizza_emission_event() {
        let contract_address = deploy_contract("PizzaFactory");

        let dispatcher = IPizzaFactoryDispatcher { contract_address };

        let owner = dispatcher.get_owner();

        start_prank(CheatTarget::One(contract_address), owner);

        let mut spy = spy_events(SpyOn::One(contract_address));
        
        dispatcher.make_pizza();
        
        spy
            .assert_emitted(
                @array![
                    (
                        contract_address,
                        pizza::PizzaFactory::Event::PizzaEmission(
                            pizza::PizzaFactory::PizzaEmission { counter: dispatcher.count_pizza() }
                        )
                    )
                ]
            );

        assert(dispatcher.count_pizza() == 1, 'pizza count is not 1');
    }
    #[test]
    fn test_set_as_new_owner_direct() {
        let mut state = pizza::PizzaFactory::contract_state_for_testing();
        let owner: ContractAddress = contract_address_const::<'owner'>();
        state.owner.write(owner);
        assert(state.owner.read() == owner, 'owner is not the same');
    }
}

