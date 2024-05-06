#[test]
mod native_test {
    use source::pizza::{
        IPizzaFactory, PizzaFactory, IPizzaFactoryDispatcher, IPizzaFactoryDispatcherTrait
    };

    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, contract_address_const
    };

    use starknet::SyscallResultTrait;
    use starknet::syscalls::deploy_syscall;

    use starknet::testing::{set_caller_address, set_contract_address};


    fn deploy(owner_address: ContractAddress) -> IPizzaFactoryDispatcher {
        let mut calldata = array![];
        owner_address.serialize(ref calldata);

        let class_hash = PizzaFactory::TEST_CLASS_HASH.try_into().unwrap();

        let (contract_address, _) = deploy_syscall(class_hash, 0, calldata.span(), false)
            .unwrap_syscall();

        IPizzaFactoryDispatcher { contract_address }
    }

    #[test]
    #[available_gas(20000000)]
    fn test_deploy() {
        let owner = contract_address_const::<1>();
        let contract = deploy(owner);

        assert(contract.get_owner() == owner, 'wrong owner');
    }

    #[test]
    #[available_gas(20000000)]
    fn test_set_as_new_owner() {
        let owner = contract_address_const::<1>();
        let new_owner = contract_address_const::<2>();
        let contract = deploy(owner);
        assert(contract.get_owner() == owner, 'incorrect owner');

        set_contract_address(owner);
        contract.change_owner(new_owner);

        assert(contract.get_owner() == new_owner, 'incorrect owner');
    }

    #[test]
    #[available_gas(20000000)]
    fn test_pizza_creation() {
        let owner = contract_address_const::<1>();
        let contract = deploy(owner);
        assert(contract.get_owner() == owner, 'incorrect owner');

        set_contract_address(owner);
        contract.make_pizza();
        assert(contract.count_pizza() == 1, 'incorrect pizza count')
    }

    #[test]
    #[should_panic]
    #[available_gas(20000000)]
    fn test_set_not_owner() {
        let owner = contract_address_const::<1>();
        let not_owner = contract_address_const::<2>();

        let contract = deploy(owner);
        assert(contract.get_owner() == not_owner, 'incorrect owner');

        set_contract_address(not_owner);
        contract.make_pizza();
    }
}

