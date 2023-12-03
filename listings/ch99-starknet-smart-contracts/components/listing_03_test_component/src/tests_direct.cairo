use super::counter::{CounterComponent};
use super::MockContract;
use CounterComponent::{CounterImpl};

//ANCHOR: type_alias
type TestingState = CounterComponent::ComponentState<MockContract::ContractState>;

// You can derive even `Default` on this type alias
impl TestingStateDefault of Default<TestingState> {
    fn default() -> TestingState {
        CounterComponent::component_state_for_testing()
    }
}
//ANCHOR_END: type_alias

//ANCHOR: test
#[test]
#[available_gas(2000000)]
fn test_increment() {
    let mut counter: TestingState = Default::default();

    counter.increment();
    counter.increment();

    assert(counter.get_counter() == 1, 'result should be 1');
}
//ANCHOR_END: test

