## Appendix B - Most Common Types and Traits Required To Write Contracts

This appendix provides a reference for common types and traits used in contract development, along with their corresponding imports, paths, and usage examples.

# Contract Development Appendix

This appendix provides a reference for common types and traits used in contract development, along with their corresponding imports, paths, and usage examples.

| Import                    | Path                                                  | Usage                                                                                                                                                                                  |
| ------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OptionTrait`             | `std::option::OptionTrait`                            | `OptionTrait<T>` defines a set of methods required to manipulate optional value.                                      |
| `ResultTrait`             | `std::result::ResultTrait`                            | `ResultTrait<T, E>` Type for Starknet contract address, a value in the range [0, 2 \*\* 251).                                                                                          |
| `ContractAddress`         | `starknet::ContractAddress`                           | `ContractAddress` is a type to represent the smart contract address                                                                                                                    |
| `ContractAddressZeroable` | `starknet::contract_address::ContractAddressZeroable` | `ContractAddressZeroable` is the implementation of the trait `Zeroable` for the `ContractAddress` type. It is required to check whether a value of `t:ContractAddress` is zero or not. |
| `contract_address_const`  | `starknet::contract_address_const`                    | The `contract_address_const!` it's a function that allows instantiating constant contract address values.                                                                              |
| `Into`                    | `traits::Into;`                                       | `Into<T>` is a trait used for conversion between types. If there is an implementation of Into<T,S> for the types T and S, you can convert T into S.
| `TryInto` | `traits::TryInto;` | `TryInto<T>` is a trait used for conversion between types.If there is an implementation of TryInto<T,S> for the types T and S, you can convert T into S. |
| `get_caller_address` | `starknet::get_caller_address` | `get_caller_address()` is a function that returns the address of the caller of the contract. It can be used to identify the caller of a contract function. |
| `get_contract_address` | `starknet::info::get_contract_address` | `get_contract_address()` is a function that returns the address of the current contract. It can be used to obtain the address of the contract being executed. |

This is not an exhaustive list, but it covers some of the commonly used types and traits in contract development. For more details, refer to the official documentation and explore the available libraries and frameworks.
