# Component Dependencies

A component can use another component as a dependency. It's for example possible to create
the `OwnableCounter` component that will use the `Ownable` component as a dependency.

The component structure is very similar to a regular component.

Here is the full implementation that we'll break down right after

```rust
{{#include ../listings/ch99-starknet-smart-contracts/components/listing_01_component_dep/src/counter.cairo:full}}
```

## Specificities

### Component signature

```rust
{{#include ../listings/ch99-starknet-smart-contracts/components/listing_01_component_dep/src/counter.cairo:component_signature}}
```

This is the first difference in our component implementation. In addition to the
regular generics declared in a component we must declare another one that is our
dependency. In our case it is `impl Owner: ownable_component::HasComponent<TContractState>`,
we declare an `impl` called `Owner` which is an implementation of the trait `HasComponent`
for the `ownable_component`. This essentially means that the type `TContractState` has access
to the `ownable_component` ([See here for more information](./ch99-01-05-01-components-under-the-hood.md#a-primer-on-embeddable-impls)).

### Implementation

Now that our component depends on the `Ownable` component we'll see how to call it from our `OwnableCounter` component.

```rust
{{#include ../listings/ch99-starknet-smart-contracts/components/listing_01_component_dep/src/counter.cairo:increment}}
```

In this function we want to make sure that only the owner can call the `increment` function so we need to call
`assert_only_owner` from the `Ownable` component. We'll use the `get_dep_component!` macro which returns the
requested component state from a snapshot of the state. Now that we have our component state we can call
the function we like `assert_only_owner`.

In the case of `transfer_ownership` we want to mutate that state so we need to use `get_dep_component_mut!`

```rust
{{#include ../listings/ch99-starknet-smart-contracts/components/listing_01_component_dep/src/counter.cairo:transfer_ownership}}
```

It works exactly the same as `get_dep_component!` except that we need to pass the state as a `ref` so we can
mutate it to transfer the ownership.

## `get_dep_component!` macro

The `get_dep_component!` and `get_dep_component_mut!` are two macros which are
used to get a component given a contract state that has it. It goes up to the
contract state and down again to the requested component state
This macro takes 2 arguments:

- a component state (`@self` for `get_dep_component!` and `ref self` for `get_dep_component!`)
- the target component embeddable name
