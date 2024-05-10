#[cfg(test)]
mod native_test {
    use source::pizza::{PizzaFactory, IPizzaFactoryDispatcher, IPizzaFactoryDispatcherTrait};

    use starknet::{ContractAddress, SyscallResultTrait, contract_address_const};

    use starknet::syscalls::deploy_syscall;

    use starknet::testing::set_contract_address;

    fn deploy(owner_address: ContractAddress) -> IPizzaFactoryDispatcher {
        let mut calldata = array![];
        owner_address.serialize(ref calldata);

        let class_hash = PizzaFactory::TEST_CLASS_HASH.try_into().unwrap();

        let (contract_address, _) = deploy_syscall(class_hash, 0, calldata.span(), false)
            .unwrap_syscall();

        IPizzaFactoryDispatcher { contract_address }
    }

    #[test]
    fn test_deploy() {
        let owner = contract_address_const::<1>();
        let contract = deploy(owner);

        assert_eq!(contract.get_owner(), owner);
    }

    #[test]
    fn test_set_as_new_owner() {
        let owner = contract_address_const::<1>();
        let new_owner = contract_address_const::<2>();
        let contract = deploy(owner);
        assert_eq!(contract.get_owner(), owner);

        set_contract_address(owner);
        contract.change_owner(new_owner);

        assert_eq!(contract.get_owner(), new_owner);
    }

    #[test]
    fn test_make_pizza_should_increase_pizza_count() {
        let owner = contract_address_const::<1>();
        let contract = deploy(owner);
        assert_eq!(contract.get_owner(), owner);

        set_contract_address(owner);
        contract.make_pizza();
        assert_eq!(contract.count_pizza(), 1)
    }

    #[test]
    #[should_panic(expected: ('Only the owner can make pizza', 'ENTRYPOINT_FAILED'))]
    fn test_make_pizza_should_fail_when_not_owner() {
        let owner = contract_address_const::<1>();
        let not_owner = contract_address_const::<2>();

        let contract = deploy(owner);
        assert(contract.get_owner() == owner, 'incorrect owner');

        set_contract_address(not_owner);
        contract.make_pizza();
    }
}

