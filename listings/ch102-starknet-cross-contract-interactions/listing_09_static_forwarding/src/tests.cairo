use snforge_std::{ContractClassTrait, DeclareResultTrait, declare};
use crate::{
    IValueStoreDispatcher, IValueStoreDispatcherTrait, StaticValueStoreForwarder, ValueStoreLogic,
};

#[test]
fn test_forwards_to_logic_class() {
    declare!(ValueStoreLogic).unwrap();
    let forwarder = declare!(StaticValueStoreForwarder).unwrap().contract_class();
    let (address, _) = forwarder.deploy(@array![]).unwrap();
    let dispatcher = IValueStoreDispatcher { contract_address: address };

    dispatcher.set_value(42);
    assert_eq!(dispatcher.get_value(), 42);
}
