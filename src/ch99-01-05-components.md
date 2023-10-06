# Components: Lego-Like Building Blocks for Smart Contracts

Developing contracts sharing a common logic and storage can be painful and
bug-prone, as this logic can hardly be reused and needs to be reimplemented in
each contract. But what if there was a way to snap in just the extra
functionality you need inside your contract, separating the core logic of your
contract from the rest?

Components provide exactly that. They are modular add-ons encapsulating reusable
logic, storage, and events that can be incorporated into multiple contracts.
They allow you to achieve extensibility by enriching the functionality of your
contracts with a module that you or a third party wrote.

A component is a separate module that can contain storage, events, and
functions. Unlike a contract, a component cannot be declared or deployed. Its
logic will eventually be part of the contract’s bytecode it has been embedded
in.

# Creating Components

To create a component, first define it in its own module decorated with a
`#[starknet::component]` attribute. Within this module, you can declare a `
Storage` struct and `Event` enum, as usually done in
[Contracts](./ch99-01-02-a-simple-contract.md).

The key next step is implementing and exposing the component's logic. You can
define the interface of the component by declaring a trait with the
`#[starknet::interface]` attribute, just as you would with contracts. This
interface will be used to allow external access to the component's functions
from inside a contract using the
[Dispatcher](./ch99-02-02-contract-dispatcher-library-dispatcher-and-system-calls.md)
pattern.

The actual implementation of the component's external logic is done in an `impl`
block marked as `#[embeddable_as(name)]`.

> Note: `name` is the name that we’ll be using in the contract to refer to the
> component. It is different than the name of your impl.

The functions in the impl expect the argument `ref self:
ComponentState<TContractState>` (for external functions) or `self:
@ComponentState<TContractState>` (for view functions). This makes the impl
generic over `TContractState`, allowing us to use this component in any
contract.

## Example: an Ownable compnent

> ⚠️ The example shown below has not been audited and is not intended for
> production use. The authors are not responsible for any damages caused by the
> use of this code.

A component implementing ownership features would look like this:

<!-- TODO -->

```rust
{{#include ../listings/ch99-starknet-smart-contracts/components/listing_01_ownable/src/component.cairo:component}}
```

This syntax is actually quite similar to the syntax used for contracts. The only
differences relate to the `#[embeddable_as]` attribute above the impl and the
genericity of the impl block that we will dissect in details.

## A closer look at the `impl` block

<!-- TODO quote the impl block syntax only -->

```rust
{{#include ../listings/ch99-starknet-smart-contracts/components/listing_01_ownable/src/component.cairo:impl_signature}}
```

The `#[embeddable_as]` attribute is used to mark the impl as embeddable inside a
contract. It allows us to specify the name of the impl that will be used in the
contract to refer to this component. In this case, the component will be
referred to as `Ownable` in contracts embedding it.

The implementation itself is generic over `ComponentState<TContractState>`, with
the added restriction that `TContractState` must implement the `HasComponent<T>`
trait. This allows us to use the component in any contract, as long as the
contract implements the `HasComponent` trait. Understanding this mechanism in
details is not required to use components, but if you're curious about the inner
workings, you can read more in the [Components under the
hood](./ch99-01-05-components.md#components-under-the-hood) section.

One of the major differences from a regular smart contract is that access to
storage and events is done via the generic `ComponentState<TContractState>` type
and not `ContractState`. Note that while the type is different, accessing
storage or emitting events is done similarly via `self.storage_var_name.read()`
or `self.emit(...).`

> Note: To avoid the confusion between the embeddable name and the impl name, we
> recommend keeping the suffix `Impl` in the impl name.

## Migrating a Contract to a Component

Since both contracts and components share a lot of similarities, it's actually
very easy to migrate from a contract to a component. The only changes required
are:

- Adding the `#[starknet::component]` attribute to the module.
- Adding the `#[embeddable_as(name)]` attribute to the `impl` block that will be
  embedded in another contract.
- Adding generic paramters to the `impl` block:
  - Adding `TContractState` as a generic parameter.
  - Adding `+HasComponent<TContractState>` as an impl restriction.
- Changing the type of the `self` argument in the functions inside the `impl`
  block to `ComponentState<TContractState>` instead of `ContractState`.

For traits that do not have an explicit definition and are generated using
`#[generate_trait]`, the logic is the same - but the trait is generic over
`TContractState` instead of `ComponentState<TContractState>`, as demonstrated in
the example with the `InternalTrait`.

# Using components inside a contract

The major strength of components is how it allows reusing already built
primitives inside your contracts with a restricted amount of boilerplate. To
integrate a component into your contract, you need to:

1. Declare it with the `component!()` macro, specifying

   1. The path to the component `path::to::component`.
   2. The name of the variable in your contract's storage referring to this
      component's storage (e.g. `ownable`).
   3. The name of the variant in your contract's event enum referring to this
      component's events (e.g. `OwnableEvent`).

2. Add the path to the component's storage and events to the contract's
   `Storage` and `Event`. They must match the names provided in step 1 (e.g.
   `ownable: ownable_component::Storage` and `OwnableEvent:
ownable_component::Event`).

   The storage variable **MUST** be annotated with the `#[substorage(v0)]`
   attribute

3. Embed the component's logic defined inside your contract, by instantiating
   the component's generic impl with a concrete `ContractState` using an impl
   alias. This alias must be annotated with `#[abi(embed_v0)]` to externally
   expose the component's functions.

<!-- TODO: Add content on impl aliases -->

For example, to embed the `Ownable` component defined above, we would do the
following:

```rust
{{#include ../listings/ch99-starknet-smart-contracts/components/listing_01_ownable/src/contract.cairo}}
```

The component's logic is now seamlessly part of the contract! We can interact
with the components functions by calling them using a `Dispatcher` on the
contract address matching the component's interface.

```rust
{{#include ../listings/ch99-starknet-smart-contracts/components/listing_01_ownable/src/component.cairo:interface}}
```

<!-- TODO ASK whether it's possible to stack traits together to have a single interface instead of N+1 interfaces for N components + 1 contract -->

# Stacking Components for Maximum Composability

The composability of components really shines when combining multiple of them
together. Each adds its features onto the contract. You will be able to rely on [Openzeppelin's](https://github.com/OpenZeppelin/cairo-contracts) future implementation of components to quickly plug-in all the common functionalities you need a contract to have.

Developers can focus on their core contract logic while relying on battle-tested and audited components for everything else.

Components can even depend on other components by restricting the `TContractstate` they're generic on to implement the trait of another component. Before we dive into this mechanism, let's first look at how components work under the hood.

# Components under the hood

The purpose of this section is to explain what exactly is going on in the compiler in the following lines:

```rust
{{#include ../listings/ch99-starknet-smart-contracts/components/listing_01_ownable/src/component.cairo:impl_signature}}
```

Before we zoom into the Upgradable impl, we need to discuss embeddable impls, a new feature introduced in Cairo v2.3.0. An impl of a starknet interface trait (that is, a trait annotated with the #[starknet::interface] attribute) can be embeddable. One can embed embeddable impls in any contract, consequently adding new entry points and changing the ABI. Let’s consider the following example (which is not using components):

```rust
{{#include ../listings/ch99-starknet-smart-contracts/components/listings/ch99-starknet-smart-contracts/components/no_listing_01_embeddable/src/lib.cairo/src/lib.cairo}}
```

<!-- TODO link impl alias section -->

By embedding the impl with the following impl alias we have added MySimpleImpl and SimpleTrait to the ABI of the contract, and can call ret4 externally.

Now that we’re more familiar with the embedding mechanism, we can go back to the Upgradable impl inside our component:

Zooming in, we can notice two component-specific changes:

Upgradable is dependent on an implementation of the HasComponent<TContractState> trait

This dependency allows the compiler to generate an impl that can be used on every contract. That is, the compiler will generate an impl that wraps any function in Upgradeable, replacing the self: ComponentState<TContractState> argument with self: TContractState, where access to the component state is made via get_component function in the HasComponent<TContractState> trait.

To get a more complete picture of what’s being generated behind the scenes, the following trait is being generated by the compiler per a component module:

```rust
// generated per component
trait HasComponent<TContractState> {
    fn get_component(self: @TContractState) -> @ComponentState<TContractState>;
    fn get_component_mut(ref self: TContractState) -> ComponentState<TContractState>;
    fn get_contract(self: @ComponentState<TContractState>) -> @TContractState;
    fn get_contract_mut(ref self: ComponentState<TContractState>) -> TContractState;
    fn emit<S, impl IntoImp: traits::Into<S, Event>>(ref self: ComponentState<TContractState>, event: S);
}
```

In our context ComponentState<TContractState> is a type specific to the upgradable component, i.e. it has members based on the storage variables defined in upgradable_component::Storage. Moving from the generic TContractState to ComponentState<TContractState> will allow us to embed Upgradable in any contract that wants to use it. The opposite direction (ComponentState<TContractState> to ContractState) is useful for dependencies (see the Upgradable component depending on an OwnableTrait implementation example)

To put it briefly, one should think of an implementation of the above HasComponent<T> as saying: “Contract whose state is T has the upgradable component”.

Upgradable is annotated with the embeddable_as(<name>) attribute:

embeddable_as is similar to embeddable; it only applies to impls of starknet interface traits and allows embedding this impl in a contract module. That said,embeddable_as(<name>) has another role in the context of components. Eventually, when embedding Upgradable in some contract, we expect to get an impl with the following function:

`fn upgrade(ref self: ContractState, new_class_hash: ClassHash)`

Note that while starting with a function receiving the generic type ComponentState<TContractState>, we want to end up with a function receiving ContractState. This is where embeddable_as(<name>) comes in. To see the full picture, we need to see what is the impl generated by the compiler due to the embeddable_as(UpgradableImpl) annotation:

```rust
// generated
#[starknet::embeddable]
impl UpgradableImpl<TContractState, +HasComponent<TContractState>> of UpgradableTrait<TContractState> {
    fn upgrade(ref self: TContractState, new_class_hash: ClassHash) {
        let mut component = self.get_component_mut();
        component.upgrade(new_class_hash, )
    }
}
```

Note that thanks to having an impl of HasComponent<TContractState>, the compiler was able to wrap our upgrade function in a new impl that doesn’t directly know about the ComponentState type. UpgradableImpl, whose name we chose when writing embeddable_as(UpgradableImpl), is the impl that we will embed in a contract that wants upgradability.

To complete the picture, we look at the following lines inside counter_contract.cairo

```rust
#[abi(embed_v0)]
impl Upgradable = upgradable_component::UpgradableImpl<ContractSate>;
```

We’ve seen how UpgradableImpl was generated by the compiler inside upgradable.cairo. The above lines use the Cairo v2.3.0 impl embedding mechanism alongside the impl alias syntax. We’re instantiating the generic UpgradableImpl<TContractState> with the concrete type ContractState. Recall that UpgradableImpl<TContractState> has the HasComponent<TContractState> generic impl param. An implementation of this trait is generated by the component! macro. Note that only the using contract could have implemented this trait since only it knows about both the contract state and the component state.

<!-- TODO -->

# Troubleshooting

You might encounter some errors when trying to implement components.
Unfortunately, some of them lack meaningful error messages to help debug. This section
aims to provide you with some pointers to help you debug your code.

- `Trait not found. Not a trait.`

  This error can occur when you're not importing the component's impl block
  correctly in your contract. Make sure to respect the following syntax:

  ```rust
  #[abi(embed_v0)]
  impl IMPL_NAME = upgradable::EMBEDDED_NAME<ContractState>
  ```

  Referring to our previous example, this would be:

  ```rust
  #[abi(embed_v0)]
  impl OwnableImpl = upgradable::Ownable<ContractState>
  ```

- `Plugin diagnostic: name is not a substorage member in the contract's Storage.
Consider adding to Storage: (...)`

  The compiler helps you a lot debugging this by giving you recommendation on
  the action to take. Basically, you forgot to add the component's storage to
  your contract's storage. Make sure to add the path to the component's storage
  annotated with the `#[substorage(v0)]` attribute to your contract's storage.

- `Plugin diagnostic: name is not a nested event in the contract's Event enum.
Consider adding to the Event enum:`

  Similar to the previous error, the compiler, you forgot to add the component's
  events to your contract's events. Make sure to add the path to the component's
  events to your contract's events.

- Components functions are not accessible externally

  This can happen if you forgot to annotate the component's impl block with
  `#[abi(embed_v0)]`. Make sure to add this annotation when embedding the
  component's impl in your contract.
