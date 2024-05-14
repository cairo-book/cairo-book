# Contract Entrypoints and ABI

Smart contracts deployed on Starknet expose _entrypoints_, defined as functions able to execute some of the contract's code.
The most common entrypoint in contracts corresponds to [public functions][public function], accessible from outside of the contract. But other types of entrypoints also exist, such as constructor entrypoints. We will define them in the following section.

All entrypoints are ultimately added to the _contract class_, which contains the Cairo bytecode, entrypoint names, and everything that defines its semantics.

From this contract class is generated a JSON formatted file containing the contract ABI (Application Binary Interface). The ABI includes all functions, structs and events defined in the contract. We will explain in more detail what the ABI is later in this chapter.

[public function]: ./ch14-02-contract-functions.md#2-public-functions

## Types of Entrypoints

### Function Entrypoints

Function entrypoints are represented by public functions. There are multiple ways to define function entrypoints when writing a Cairo contract:
- Annotating an impl block with `#[abi(embed_v0)]` attribute. By doing this, all functions defined in the impl block will be publicly exposed.
- Annotating an impl block with `#[abi(per_item)]` attribue, while manually declaring public functions under the `#[external(v0)]` attribute. 
- Defining standalone functions annotated with the `#[external(v0)]` attribute.

>  In the first and second cases, the corresponding function entries will be located within the child hierarchy, alongside impls and interfaces in the ABI. Conversely, standalone public functions entries will be found in the same hierarchy as impls and interfaces in the ABI.

A function entrypoint is represented by a _selector_ and a `function_idx` in a Cairo contract class.

#### Selector

In the context of smart contracts, a selector is a unique identifier for a specific function entrypoint of a contract. When a transaction is sent to a contract, it includes the selector in the calldata to specify which function should be executed.

On Starknet, the selector is computed by applying the `sn_keccak` hash function to the string representation of the function name. If the function name is `transfer`, the selector can be computed with `selector!("transfer")`

Note that in `starknet::call_contract_syscall`, we didn't specify the function name as a string, but rather used the `selector!` macro, which computes the `sn_keccak` hash of the provided function signature.


#### `function_idx`

The `function_idx` is the index of the function inside the Sierra program. This index is extremely important as it defines the code that will be executed when an entrypoint is called.

### Constructor Entrypoints

A contract class can contain a constructor entrypoint. This entrypoint will be called only once when deploying the contract. Note that the compiler currently allows only one constructor per contract class and instance.

You can refer to the ["Constructor"][constructor] section for more information about constructor definition and implementation.

[constructor]: ./ch14-02-contract-functions.md#1-constructors

### L1-Handler Entrypoints

L1-handler functions are defined as separated entrypoints. They allow communication between the Starknet network and the underlying settlement layer. L1-handler are necessarly defined as standalone functions. 

You can learn more about L1-handler functions and L1-L2 messaging system in the [dedicated chapter][L1-L2].

[L1-L2]: ./ch16-04-L1-L2-messaging.md

## ABI or Application Binary Interface

The ABI of a Starknet contract is a JSON representation of the contract's functions and structures, generated from the contract class.

While we write our smart contract logics in high-level Cairo, what is actually stored onchain is Cairo bytecode in binary format. Since this bytecode is not human readable, it requires interpretation to be understood. This is where ABIs come into play, defining specific methods for a contract that can be called.

With the ABI, anyone (or any other contract) has the ability to create valid encoded calls to it. It is a blueprint that instructs how functions should be called, what input parameters they expect, and in what format.

ABIs are typically used in dApps frontends, allowing them to encode and decode data correctly. When you interact with a smart contract through a block explorer like [Voyager][voyager] or [Starkscan][starkscan], the contract's ABI is used under the hood to format the data you send to the contract and the data it returns.

[voyager]: https://voyager.online/
[starkscan]: https://starkscan.co/