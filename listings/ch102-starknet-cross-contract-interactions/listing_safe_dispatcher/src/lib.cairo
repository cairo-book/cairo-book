#[starknet::interface]
pub trait IFailableContract<TState> {
    fn can_fail(self: @TState) -> u32;
}

#[feature("safe_dispatcher")]
fn interact_with_failable_contract() -> u32 {
    let contract_address = 0x123.try_into().unwrap();
    // Use the Safe Dispatcher
    let faillable_dispatcher = IFailableContractSafeDispatcher { contract_address };
    let response: Result<u32, Array<felt252>> = faillable_dispatcher.can_fail();

    // Match the result to handle success or failure
    match response {
        Result::Ok(x) => x, // Return the value on success
        Result::Err(_panic_reason) => {
            // Handle the error, e.g., log it or return a default value
            // The panic_reason is an array of felts detailing the error
            0 // Return 0 in case of failure
        },
    }
}
