# Appendix A - Common Starknet Error Messages

Similarly to Cairo common error messages, a few errors are encountered very oftenly, and it is worth listing them in a dedicated appendix.

## General Error Messages

- `Got an exception while executing a hint: Hint Error: Failed to deserialize param #x.`: this error means that the execution failed because an entrypoint was called without the expected arguments. Make sure that the arguments you provide when calling an entrypoint are correct. There is a classic issue with `u256` variables, which are actually structs of 2 `u128`. Therefore, when calling a function that takes a `u256` as argument, you need to pass 2 values.

## Components Related Error Messages

You might encounter some errors when trying to implement components.
Unfortunately, some of them lack meaningful error messages to help debug. This
section aims to provide you with some pointers to help you debug your code.

- `Trait not found. Not a trait.`: this error can occur when you're not importing the component's impl block
  correctly in your contract. Make sure to respect the following syntax:

  ```rust,noplayground
  #[abi(embed_v0)]
  impl IMPL_NAME = PATH_TO_COMPONENT::EMBEDDED_NAME<ContractState>
  ```
- `Plugin diagnostic: name is not a substorage member in the contract's Storage. Consider adding to Storage: (...)`: the compiler helps you a lot debugging this by giving you recommendation on the action to take. Basically, you forgot to add the component's storage to your contract's storage. Make sure to add the path to the component's storage annotated with the `#[substorage(v0)]` attribute to your contract's storage.

- `Plugin diagnostic: name is not a nested event in the contract's Event enum. Consider adding to the Event enum:` similar to the previous error, the compiler tells you that you forgot to add the component's events to your contract's events. Make sure to add the path to the component's events to your contract's events.


