## Contract Functions

In this section, we are going to be looking at the different types of functions you could encounter in contracts:

### 1. Constructors

Constructors are a special type of function that only runs once when deploying a contract, and can be used to initialize the state of a contract.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:constructor}}
```

Some important rules to note:

1. Your contract can't have more than one constructor.
2. Your constructor function must be named `constructor`.
3. It must be annotated with the `#[constructor]` attribute.

### 2. Public functions

As stated previously, public functions are accessible from outside of the contract. They must be defined inside an implementation block annotated with the `#[external(v0)]` attribute. This attribute only affects the visibility (public vs private/internal), but it doesn't inform us on the ability of these functions to modify the state of the contract.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:impl_public}}
```

#### External functions

External functions are functions that can modify the state of a contract. They are public and can be called by any other contract or externally.
External functions are _public_ functions where the `self: ContractState` is passed as reference with the `ref` keyword, allowing you to modify the state of the contract.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:external}}
```

#### View functions

View functions are read-only functions allowing you to access data from the contract while ensuring that the state of the contract is not modified. They can be called by other contracts or externally.
View functions are _public_ functions where the `self: ContractState` is passed as snapshot, preventing you from modifying the state of the contract.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:view}}
```

> **Note:** It's important to note that both external and view functions are public. To create an internal function in a contract, you will need to define it outside of the implementation block annotated with the `#[external(v0)]` attribute.

### 3. Private functions

Functions that are not defined in a block annotated with the `#[external(v0)]` attribute are private functions (also called internal functions). They can only be called from within the contract.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:state_internal}}
```

> Wait, what is this `#[generate_trait]` attribute? Where is the trait definition for this implementation? Well, the `#[generate_trait]` attribute is a special attribute that tells the compiler to generate a trait definition for the implementation block. This allows you to get rid of the boilerplate code of defining a trait and implementing it for the implementation block. We will see more about this in the [next section](./ch99-01-03-04-reducing-boilerplate.md).

At this point, you might still be wondering if all of this is really necessary if you don't need to access the contract's state in your function (for example, a helper/library function). As a matter of fact, you can also define internal functions outside of implementation blocks. The only reason why we _need_ to define functions inside impl blocks is if we want to access the contract's state.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:stateless_internal}}
```
