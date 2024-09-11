# Contract Events

Events are a way for smart contracts to inform the external world about any changes that happen during their execution. They play a crucial role in the integration of smart contracts in real-world applications.

Technically speaking, an event is a custom data structures emitted by a smart contract during its execution, and stored in the corresponding transaction receipt, allowing any external tools to parse and index them.

## Defining Events

The events of a smart contract are defined in an enum annotated with the attribute `#[event]`. This enum must be named `Event`.

```cairo,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_events_example/src/lib.cairo:event}}
```

Each variant, like `BookAdded` or `FieldUpdated` represents an event that can be emitted by the contract. The variant data represents the data associated to an event. It could be a `struct` or an `enum`.

Each data structure used in events definition (`Event` enum included) must implement the derivable trait `starknet::Event`. This can be simply achieved by adding a `#[derive(starknet::Event)]` attribute on top of our data structure definition.

Each event data field can be annotated with the attribute `#[key]`. Key fields are then stored separately than data fields to be used by external tools to easily filter events on these keys.

TODO `#[flat]`.
TODO `Serde` trait required for event data ?

```cairo,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_events_example/src/lib.cairo:full_events}}
```

In this example:

- There are 3 events: `BookAdded`, `FieldUpdated` and `BookRemoved`,
- `BookAdded` and `BookRemoved` events use a simple `struct` to store their data while the `FieldUpdated` event uses an `enum` of structs,
- In the `BookAdded` event, the `author` field is a key field and will be used outside of the smart contract to filter `BookAdded` events by `author`, while `id` and `title` are data fields.

> The **variant** and its associated data structure can be named differently even if it's a common practice to use the same name. The **variant name** will be used internally as the **first event key** to represent the name of the event and to help filtering events, while the **variant data name** will be used in the smart contract to **build the event** before emitting it.

## Emitting Events

Once you have defined your list of events, you want to emit them in your smart contracts. This can be simply achieved by calling `self.emit()` with an event data structure in parameter.

```cairo,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_events_example/src/lib.cairo:emit_event}}
```

To have a better understanding of what happens under the hood, let's see an example of emitted event and how it is stored in the transaction receipt:

```cairo
    change_book_author(42, 'Stephen King');
```

This `change_book_author` call emits a `FieldUpdated` event with the event data `FieldUpdated::Author(UpdatedAuthorData { id: 42, title: author: 'Stephen King' })`. If you read the "events" section of the transaction receipt, you will get something like:

```json
"events": [
    {
      "from_address": "0xdeadcb856227d67f9a6a811f9c58e4faea3429d8594b6ced361943bf195beef",
      "keys": [
        "0x1b90a4a3fc9e1658a4afcd28ad839182217a69668000c6104560d6db882b0e1",
        "0x5374657068656e204b696e67"
      ],
      "data": [
        "0x2a"
      ]
    }
  ]
```

In this receipt:

- `from_address` is the address of your smart contract,
- `keys` contains the key fields of the emitted `FieldUpdated` event, serialized in an array of `felt252`. The first item `0x1b90a4a3fc9e1658a4afcd28ad839182217a69668000c6104560d6db882b0e1` is [TBD] and the second item `0x5374657068656e204b696e67 = 'Stephen King'` is the `new_author` field of your event as it has been defined using the `#[key]` attribute,
- `data` contains the data fields of the emitted `FieldUpdated` event, serialized in an array of `felt252`. The first and only item `0x2a = 42` is the `id` data field.
