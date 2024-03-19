# Contract Functions

In this section, we are going to be looking at the different types of functions you could encounter in contracts:

## 1. Constructors

Constructors are a special type of function that only runs once when deploying a contract, and can be used to initialize the state of a contract.

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_01_reference_contract/src/lib.cairo:constructor}}
```

Some important rules to note:

1. Your contract can't have more than one constructor.
2. Your constructor function must be named `constructor`.
3. It must be annotated with the `#[constructor]` attribute.

## 2. Public functions

As stated previously, public functions are accessible from outside of the contract. They are usually defined inside an implementation block annotated with the `#[abi(embed_v0)]` attribute. This attribute means that all functions embedded inside it are implementations of the Starknet interface, and therefore entry points of the contract. It only affects the visibility (public vs private/internal), but it doesn't inform us on the ability of these functions to modify the state of the contract. 

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_01_reference_contract/src/lib.cairo:impl_public}}
```

### State mutability of public functions

Functions can access storage easily via `self: ContractState`, which abstracts away the complexity of underlying system calls (`storage_read_syscall` and `storage_write_syscall`). Two keywords are provided to decorate `self`, which intends to help developers to isolate view functions and external functions.

In case `self: ContractState` is passed as reference with the `ref` keyword, it exposes the both the `read` and `write` access. This allows modifying the state of the contract via `self` directly. 

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_01_reference_contract/src/lib.cairo:external}}
```

In case `self: ContractState` is passed as snapshot, it exposes only the `read` access and no storage write can be made via `self`.

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_01_reference_contract/src/lib.cairo:view}}
```

However, passing `self` as a snapshot only restricts the storage write access via `self`. It does not prevent state modification via direct system calls. Hence there is no view function in Starknet and **all the public functions** have the potentiality to modify states. This is different from EVM where a staticcall opcode is provided which restricts storage modifications in the current context and subcontexts. 

> **Warning:** Developers **should not** have the assumption that calling a function where self is passed as snapshot can not modify states and reenter.

> **Note:** To create an internal function in a contract, you will need to define it outside of the implementation block annotated with the `#[abi(embed_v0)]` attribute.

### Standalone public functions

It is also possible to define public functions outside of an implementation of a trait, using the `#[external(v0)]` attribute. Doing this will automatically generate the corresponding ABI, allowing these standalone public functions to be callable by anyone from the outside. These functions can also be called from within the contract just like any function in Starknet contracts.

Listing {{#ref standalone_interface}} and listing {{#ref standalone}} show a rewrite of the `INameRegistry` interface that doesn't contain the `store_name` function, which is implemented as a standalone public function:

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_01_reference_contract/src/lib.cairo:standalone}}
```

## 3. Private functions

Functions that are not defined with the `#[external(v0)]` attribute or inside a block annotated with the `#[abi(embed_v0)]` attribute are private functions (also called internal functions). They can only be called from within the contract.

They can be grouped in a dedicated impl block (e.g in components, to easily import internal functions all at once in the embedding contracts) or just be added as free functions inside the contract module.
Note that these 2 methods are equivalent. Just choose the one that makes your code more readable and easy to use.

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_01_reference_contract/src/lib.cairo:state_internal}}
```

> Wait, what is this `#[generate_trait]` attribute? Where is the trait definition for this implementation? Well, the `#[generate_trait]` attribute is a special attribute that tells the compiler to generate a trait definition for the implementation block. This allows you to get rid of the boilerplate code of defining a trait and implementing it for the implementation block. We will see more about this in the [next section](./ch13-04-reducing-boilerplate.md).

## 4. [abi(per_item)] attribute

You can also define the entrypoint type of a function individually inside an impl using the`#[abi(per_item)]` attribute on top of your impl. It is often used with the `#[generate_trait]` attribute, as it allows you to define entrypoints without an explicit interface. In this case, the functions will not be grouped under an impl in the abi. Note that when using `#[abi(per_item)]` attribute, public functions need to be annotated with `#[external(v0)]` attribute - otherwise, they will not be exposed.

In the case of `#[abi(per_item)]` attribute usage without `#[generate_trait]`, it will only be possible to include `constructor`, `l1-handler` and `internal` functions in the trait implementation. Indeed, `#[abi(per_item)]` only works with a trait that is not defined as a Starknet interface. Hence, it will be mandatory to create another trait defined as interface to implement public functions.

Here is a short example:

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/no_listing_01_abi_per_item_attribute/src/lib.cairo}}
```
