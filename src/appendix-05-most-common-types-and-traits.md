## Appendix B - Most Common Types and Traits Required To Write Contracts

This appendix provides a reference for common types and traits used in contract development, along with their corresponding imports, paths, and usage examples.

# Contract Development Appendix

This appendix provides a reference for common types and traits used in contract development, along with their corresponding imports, paths, and usage examples.

| Import                    | Path                                                  | Usage                                                                                                                                                                                                       |
| ------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OptionTrait`             | `std::option::OptionTrait`                            | `OptionTrait<T>` represents an optional value, where `T` is the type of the value. It can be used for handling optional values in contract logic.                                                           |
| `ResultTrait`             | `std::result::ResultTrait`                            | `ResultTrait<T, E>` represents the result of an operation, where `T` is the type of the success value and `E` is the type of the error value. It is commonly used for error handling in contract execution. |
| `ContractAddress`         | `starknet::ContractAddress`                           | `ContractAddress` is a type to represent the smart contract address                                                                                                                                         |
| `ContractAddressZeroable` | `starknet::contract_address::ContractAddressZeroable` | `ContractAddressZeroable` is a trait implemented by types that can be converted to a zero-initialized contract address. It is commonly used for initializing contract addresses.                            |
| `contract_address_const`  | `starknet::contract_address_const`                    | The `contract_address_const!` macro is to allow the declaration and initialization of constant values that represent contract addresses in a concise and readable manner.                                   |
| `Into`                    | `traits::Into;`                                       | `Into<T>` is a trait implemented by types that can be converted into another type `T`. It can be used for type conversions in contract logic.                                                               |
| `TryInto`                 | `traits::TryInto;`                                    | `TryInto<T>` is a trait implemented by types that can be converted into another type `T`, but may fail with an error. It is used for fallible type conversions.                                             |
| `get_caller_address`      | `starknet::get_caller_address`                        | `get_caller_address()` is a function that returns the address of the caller of the contract. It can be used to identify the caller of a contract function.                                                  |
| `get_contract_address`    | `starknet::info::get_contract_address`                | `get_contract_address()` is a function that returns the address of the current contract. It can be used to obtain the address of the contract being executed.                                               |

This is not an exhaustive list, but it covers some of the commonly used types and traits in contract development. For more details, refer to the official documentation and explore the available libraries and frameworks.
