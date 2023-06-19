#[contract]
mod AccessControlContract {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    #[storage]
    struct Storage {
        // Role 'owner': only one address
        owner: ContractAddress,
        // Role 'role_a': a set of addresses
        role_a: LegacyMap::<ContractAddress, bool>
    }

    #[constructor]
    fn constructor() {
        owner::write(get_caller_address());
    }

    // Modifiers functions to check roles

    #[inline(always)]
    fn is_owner() -> bool {
        owner::read() == get_caller_address()
    }

    #[inline(always)]
    fn is_role_a() -> bool {
        role_a::read(get_caller_address())
    }

    #[inline(always)]
    fn only_owner() {
        assert(is_owner(), 'Not owner');
    }

    #[inline(always)]
    fn only_role_a() {
        assert(is_role_a(), 'Not role A');
    }

    // You can easily combine modifiers to perfom complex checks
    fn only_allowed() {
        assert(is_owner() || is_role_a(), 'Not allowed');
    }

    // Functions to manage roles

    #[external]
    fn set_role_a(_target: ContractAddress, _active: bool) {
        only_owner();
        role_a::write(_target, _active);
    }

    // You can now focus on the business logic of your contract
    // and reduce the complexity of your code by using modifiers

    #[external]
    fn role_a_action() {
        only_role_a();
    // ...
    }

    #[external]
    fn allowed_action() {
        only_allowed();
    // ...
    }
}

