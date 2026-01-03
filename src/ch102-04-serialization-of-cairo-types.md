# Serialization of Cairo types

The field element (`felt252`), which contains 252 bits, is the only actual type
in the Cairo VM, so
[all data types that fit in 252 bits](#data-types-using-at-most-252-bits) are
represented by a single felt and
[all data types that are larger than 252 bits](#data-types-using-more-than-252-bits)
are represented by a list of felts. Therefore, in order to interact with a
contract, you must know how to
[serialize any arguments that are larger than 252 bits to lists of felts](#serialization-of-data-types-using-more-than-252-bits)
so you can correctly formulate the calldata in the transaction.

> Note: For any developers that are not developing a Starknet library or SDK
> developer, using either one of the existing
> [Starknet SDKs](https://docs.starknet.io/tools/overview/) or the
> [`--argument` flag of Starknet Foundry's `sncast`](https://foundry-rs.github.io/starknet-foundry/starknet/calldata-transformation.html#using---arguments)
> is highly recommend to greatly simply the serialization process. From `sncast`
> v0.43.0, results of `sncast call` are also parsed into readable information,
> demonstrated in the following example:
>
> ```
> sncast call \
>   --contract-address=0x00e270c8396d333f88556edf143ac751240f050d907e5190525accbe275f2348 \
>   --function=get_order \
>   --network=sepolia
> response: Order {
>   position_id: PositionId { value: 1_u32 },
>   base_asset_id: AssetId { value: 0x3 },
>   base_amount: -10_i64,
>   quote_asset_id: AssetId { value: 0x2d },
>   fee_asset_id: AssetId { value: 0x4d2 },
>   fee_amount: 0_u64,
>   expiration: Timestamp { seconds: 12341432_u64 },
>   salt: 0x0,
>   name: "This is my order"
> }
> ```

## Data types using at most 252 bits

The following Cairo data types are using at most 252 bits:

- `ContractAddress`
- `EthAddress`
- `StorageAddress`
- `ClassHash`
- Unsigned integers using at most 252 bits: `u8`, `u16`, `u32`, `u64`, `u128`,
  and `usize`
- `bytes31`
- `felt252`
- Signed integers: `i8`, `i16`, `i32`, `i64`, and `i128`
  > Note: A negative value, \\( -x \\), is serialized as \\( P-x \\), where \\(
  > P = 2^{251} + 17\*2^{192} + 1 \\)

For these types, each value is serialized as a single-member list that contains
one `felt252` value.

## Data types using more than 252 bits

The following Cairo data types use more than 252 bits and therefore have
non-trivial serialization:

- Unsigned integers larger than 252 bits: `u256` and `u512`
- Arrays and spans
- Enums
- Structs and tuples
- Byte arrays (which represent strings)

## Serialization of data types using more than 252 bits

### Serialization of `u256`

A `u256` value in Cairo is represented by two `felt252` values, as follows:

- The first `felt252` value contains the 128 least significant bits, usually
  referred to as the low part of the original `u256` value.
- The second `felt252` value contains the 128 most significant bits, usually
  referred to as the high part of the original `u256` value.

For example:

- A `u256` variable whose decimal value is 2 is serialized as `[2,0]`. To
  understand why, examine the binary representation of 2 and split it into two
  128-bit parts, as follows:
  - 128 high bits: \\(0 \cdots 0 \\)
  - 128 low bits: \\( 0 \cdots 10 \\)
- A `u256` variable whose decimal value is \\( 2^{128} \\) is serialized as
  `[0,1]`. To understand why, examine the binary representation of \\( 2^{128}
  \\) and split it into two 128-bit parts, as follows:
  - 128 high bits: \\( 0 \cdots 01 \\)
  - 128 low bits: \\(0 \cdots 0 \\)

- A `u256` variable whose decimal value is \\( 2^{129}+2^{128}+20 \\), is
  serialized as `[20,3]`. To understand why, examine the binary representation
  of the \\( 2^{129}+2^{128}+20 \\) and split it into two 128-bit parts, as
  follows:
  - 128 high bits: \\( 0 \cdots 011 \\)
  - 128 high bits: \\( 0 \cdots 10100 \\)

### Serialization of `u512`

The `u512` type in Cairo is a struct containing four `felt252` members, each
representing a 128-bit limb of the original integer, similar to the `u256` type.

### Serialization of arrays and spans

Arrays and spans are serialized as follows:

`<array/span_length>, <first_serialized_member>,..., <last_serialized_member>`

For example, consider the following array of `u256` values:

```cairo, noplayground
let POW_2_128: u256 = 0x100000000000000000000000000000000
let array: Array<u256> = array![10, 20, POW_2_128]
```

Each `u256` value in the array is represented by two `felt252` values. So the
array above is serialized as follows:

1. `3`: number of array members
2. `10,0`: serialized first member
3. `20,0`: serialized second member
4. `0,1`: serialized third member

Combining the above, the array is serialized as `[3,10,0,20,0,0,1]`.

### Serialization of enums

An enum is serialized as follows:

`<index_of_enum_variant>,<serialized_variant>`

Note that enum variants indices are 0-based, not to confuse with their storage
layout, which is 1-based, to distinguish the first variant from an uninitialized
storage slot.

**Enum serialization example #1**

Consider the following definition of an enum named `Week`:

```cairo,noplayground
enum Week {
    Sunday: (), // Index=0. The variant type is the unit type (0-tuple).
    Monday: u256, // Index=1. The variant type is u256.
}
```

Now consider instantiations of the `Week` enum's variants as shown in the table
below:

| Instance          | Index | Type   | Serialization |
| ----------------- | ----- | ------ | ------------- |
| `Week::Sunday`    | `0`   | unit   | `[0]`         |
| `Week::Monday(5)` | `1`   | `u256` | `[1,5,0]`     |

**Enum serialization example #2**

Consider the following definition of an enum named `MessageType`:

```cairo,noplayground
enum MessageType {
    A,
    #[default]
    B: u128,
    C
}
```

Now consider instantiations of the `MessageType` enum's variants as shown in the
table below:

| Instance            | Index | Type   | Serialization |
| ------------------- | ----- | ------ | ------------- |
| `MessageType::A`    | `1`   | unit   | `[0]`         |
| `MessageType::B(6)` | `0`   | `u128` | `[1,6]`       |
| `MessageType::C`    | `2`   | unit   | `[2]`         |

As you can see about, the `#[default]` attribute does not affect serialization.
It only affects the storage layout of `MessageType`, where the default variant
`B` will be stored as `0`.

### Serialization of structs and tuples

Structs and tuples are serialized by serializing their members one at a time.

A struct's members are serialized in the order in which they appear in its
definition.

For example, consider the following definition of the struct `MyStruct`:

```cairo,noplayground
struct MyStruct {
    a: u256,
    b: felt252,
    c: Array<felt252>
}
```

The serialization is the same for both of the following instantiations of the
struct's members:

```cairo,noplayground
let my_struct = MyStruct {
    a: 2, b: 5, c: [1,2,3]
};

let my_struct = MyStruct {
    b: 5, c: [1,2,3], a: 2
};
```

The serialization of `MyStruct` is determined as shown in the following table:

| Member       | Type                      | Serialization |
| ------------ | ------------------------- | ------------- | -------------------------------------------- |
| `a: 2`       | `u256`                    | `[2,0]`       | For information on serializing `u256` values |
| `b: 5`       | `felt252`                 | `5`           |
| `c: [1,2,3]` | `felt252` array of size 3 | `[3,1,2,3]`   |

Combining the above, the struct is serialized as `[2,0,5,3,1,2,3]`.

### Serialization of byte arrays

A string is represented in Cairo as a `ByteArray` type. A byte array is actually
a struct with the following members:

- `data: Array<felt252>`: Contains 31-byte chunks of the byte array. Each
  `felt252` value has exactly 31 bytes. If the number of bytes in the byte array
  is less than 31, then this array is empty.
- `pending_word: felt252`: The bytes that remain after filling the `data` array
  with full 31-byte chunks. The pending word consists of at most 30 bytes.
- `pending_word_len: usize`: The number of bytes in `pending_word`.

**Example #1: A string shorter than 31 characters**

Consider the string `hello`, whose ASCII encoding is the 5-byte hex value
`0x68656c6c6f`. The resulting byte array is serialized as follows:

```cairo,noplayground
0, // Number of 31-byte words in the data array.
0x68656c6c6f, // Pending word
5 // Length of the pending word, in bytes
```

**Example 2: A string longer than 31 bytes**

Consider the string `Long string, more than 31 characters.`, which is
represented by the following hex values:

- `0x4c6f6e6720737472696e672c206d6f7265207468616e203331206368617261` (31-byte
  word)
- `0x63746572732e` (6-byte pending word)

The resulting byte array is serialized as follows:

```cairo,noplayground
1, // Number of 31-byte words in the array construct.
0x4c6f6e6720737472696e672c206d6f7265207468616e203331206368617261, // 31-byte word.
0x63746572732e, // Pending word
6 // Length of the pending word, in bytes
```
