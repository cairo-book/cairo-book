## Appendix E - Common Types & Traits and the Cairo Prelude

### Prelude

The Cairo prelude is a collection of commonly used modules, functions, data
types, and traits that are automatically brought into scope of every module in a
Cairo crate without needing explicit import statements. Cairo's prelude provides
the basic building blocks developers need to start Cairo programs and writing
smart contracts.

The core library prelude is defined in the
[lib.cairo](https://github.com/starkware-libs/cairo/blob/v2.2.0/corelib/src/lib.cairo)
file of the corelib crate and contains Cairo's primitive data types, traits,
operators, and utility functions. This includes: Data types - felts, bools,
arrays, dicts, etc. Traits - behaviors for arithmetic, comparison, serialization
Operators - arithmetic, logical, bitwise Utility functions - helpers for arrays,
maps, boxing, etc. The core library prelude delivers the fundamental programming
constructs and operations needed for basic Cairo programs, without requiring the
explicit import of elements. Since the core library prelude is automatically
imported, its contents are available for use in any Cairo crate without explicit
imports. This prevents repetition and provides a better devX. This is what
allows you to use `ArrayTrait::append()` or the `Default` trait without bringing
them explicitly into scope.

### List of common types and traits

The following section provides a brief overview of commonly used types and
traits when developping Cairo programs. Most of these are included in the
prelude and not required to be imported explicitly - but not all of them.

| Import                    | Path                                                  | Usage                                                                                                                                                                                  |
| ------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OptionTrait`             | `core::option::OptionTrait`                           | `OptionTrait<T>` defines a set of methods required to manipulate optional value.                                                                                                       |
| `ResultTrait`             | `core::result::ResultTrait`                           | `ResultTrait<T, E>` Type for Starknet contract address, a value in the range [0, 2 \*\* 251).                                                                                          |
| `ContractAddress`         | `starknet::ContractAddress`                           | `ContractAddress` is a type to represent the smart contract address                                                                                                                    |
| `ContractAddressZeroable` | `starknet::contract_address::ContractAddressZeroable` | `ContractAddressZeroable` is the implementation of the trait `Zeroable` for the `ContractAddress` type. It is required to check whether a value of `t:ContractAddress` is zero or not. |
| `contract_address_const`  | `starknet::contract_address_const`                    | The `contract_address_const!` it's a function that allows instantiating constant contract address values.                                                                              |
| `Into`                    | `traits::Into;`                                       | `Into<T>` is a trait used for conversion between types. If there is an implementation of Into<T,S> for the types T and S, you can convert T into S.                                    |
| `TryInto`                 | `traits::TryInto;`                                    | `TryInto<T>` is a trait used for conversion between types.If there is an implementation of TryInto<T,S> for the types T and S, you can convert T into S.                               |
| `get_caller_address`      | `starknet::get_caller_address`                        | `get_caller_address()` is a function that returns the address of the caller of the contract. It can be used to identify the caller of a contract function.                             |
| `get_contract_address`    | `starknet::info::get_contract_address`                | `get_contract_address()` is a function that returns the address of the current contract. It can be used to obtain the address of the contract being executed.                          |

This is not an exhaustive list, but it covers some of the commonly used types
and traits in contract development. For more details, refer to the official
documentation and explore the available libraries and frameworks.
