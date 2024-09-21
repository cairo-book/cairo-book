# Contract Events

Events are a way for smart contracts to inform the outside world of any changes that occur during their execution. They play a critical role in the integration of smart contracts into real-world applications.

Technically speaking, an event is a custom data structure emitted by a smart contract during its execution and stored in the corresponding transaction receipt, allowing any external tool to parse and index it.

## Defining Events

The events of a smart contract are defined in an enum annotated with the attribute `#[event]`. This enum must be named `Event`.

```cairo,noplayground
{{#rustdoc_include ../listings/ch14-building-starknet-smart-contracts/listing_events_example/src/lib.cairo:event}}
```

Each variant, like `BookAdded` or `FieldUpdated` represents an event that can be emitted by the contract. The variant data represents the data associated to an event. It can be any `struct` or `enum` that implements the `starknet::Event` trait.
This can be simply achieved by adding a `#[derive(starknet::Event)]` attribute on top of your type definition.

Each event data field can be annotated with the attribute `#[key]`. Key fields are then stored separately than data fields to be used by external tools to easily filter events on these keys.

Let's look at the full event definition of this example to add, update and remove books:

```cairo,noplayground
{{#rustdoc_include ../listings/ch14-building-starknet-smart-contracts/listing_events_example/src/lib.cairo:full_events}}
```

In this example:

- There are 3 events: `BookAdded`, `FieldUpdated` and `BookRemoved`,
- `BookAdded` and `BookRemoved` events use a simple `struct` to store their data while the `FieldUpdated` event uses an `enum` of structs,
- In the `BookAdded` event, the `author` field is a key field and will be used outside of the smart contract to filter `BookAdded` events by `author`, while `id` and `title` are data fields.

> The **variant** and its associated data structure can be named differently, although it's common practice to use the same name. The **variant name** is used internally as the **first event key** to represent the name of the event and to help filter events, while the **variant data name** is used in the smart contract to **build the event** before it is emitted.

### The #[flat] attribute

Sometimes you may have a complex event structure with some nested enums like the `FieldUpdated` event in the previous example. In this case, you can flatten this structure using the `#[flat]` attribute, which means that the inner variant name is used as the event name instead of the variant name of the annotated enum.
In the previous example, because the `FieldUpdated` variant is annotated with `#[flat]`, when you emit a `FieldUpdated::Title` event, its name will be `Title` instead of `FieldUpdated`.
If you have more than 2 nested enums, you can use the `#[flat]` attribute on multiple levels.

## Emitting Events

Once you have defined your list of events, you want to emit them in your smart contracts. This can be simply achieved by calling `self.emit()` with an event data structure in parameter.

```cairo,noplayground
{{#rustdoc_include ../listings/ch14-building-starknet-smart-contracts/listing_events_example/src/lib.cairo:emit_event}}
```

To have a better understanding of what happens under the hood, let's see two examples of emitted events and how they are stored in the transaction receipt:

### Example 1: Add a book

In this example, we send a transaction invoking the `add_book` function with `id` = 42, `title` = 'Misery' and `author` = 'S. King'.

If you read the "events" section of the transaction receipt, you will get something like:

```json
"events": [
    {
      "from_address": "0x27d07155a12554d4fd785d0b6d80c03e433313df03bb57939ec8fb0652dbe79",
      "keys": [
        "0x2d00090ebd741d3a4883f2218bd731a3aaa913083e84fcf363af3db06f235bc",
        "0x532e204b696e67"
      ],
      "data": [
        "0x2a",
        "0x4d6973657279"
      ]
    }
  ]
```

In this receipt:

- `from_address` is the address of your smart contract,
- `keys` contains the key fields of the emitted `BookAdded` event, serialized in an array of `felt252`.
  - The first key `0x2d00090ebd741d3a4883f2218bd731a3aaa913083e84fcf363af3db06f235bc` is the selector of the event name, which is the variant name in the `Event` enum, so `selector!("BookAdded")`,
  - The second key `0x532e204b696e67 = 'S. King'` is the `author` field of your event as it has been defined using the `#[key]` attribute,
- `data` contains the data fields of the emitted `BookAdded` event, serialized in an array of `felt252`. The first item `0x2a = 42` is the `id` data field and `0x4d6973657279 = 'Misery'` is the `title` data field.

### Example 2: Update a book author

Now we want to change the author name of the book, so we send a transaction invoking `change_book_author` with `id` = `42` and `new_author` = 'Stephen King'.

This `change_book_author` call emits a `FieldUpdated` event with the event data `FieldUpdated::Author(UpdatedAuthorData { id: 42, title: author: 'Stephen King' })`. If you read the "events" section of the transaction receipt, you will get something like:

```json
"events": [
    {
      "from_address": "0x27d07155a12554d4fd785d0b6d80c03e433313df03bb57939ec8fb0652dbe79",
      "keys": [
        "0x1b90a4a3fc9e1658a4afcd28ad839182217a69668000c6104560d6db882b0e1",
        "0x2a"
      ],
      "data": [
        "0x5374657068656e204b696e67"
      ]
    }
  ]
```

As the `FieldUpdated` variant in `Event` enum has been annotated with the `#[flat]` attribute, this is the inner variant `Author` that is used as event name, instead of `FieldUpdated`. So:

- the first key is `selector!("Author")`,
- the second key is the `id` field, annotated with `#[key]`,
- the data field is `0x5374657068656e204b696e67 = 'Stephen King'`.
