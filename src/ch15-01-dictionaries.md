# Dictionaries

Cairo provides with its core library a dictionary-like type. The `Felt252Dict<T>` represents a collection of key-value pairs where each key is unique and associated with a corresponding value. This data structure is named differently across different programming languages such as maps, hash tables or associative array.

`Felt252Dict<T>` become useful when you want to organize your data in a certain way for which using indexes with an `Array<T>` would not fit as well. Also they allow to simulate mutable memory over Cairo immutable memory system.

## Using Dictionaries

It is normal in other language when creating a new dictionary to define the data types of both the key and the value. In Cairo the key type is restricted to `felt252` leaving only the possibility to specify the value data type (the `T` in `Felt252Dict<T>`).

In the following example we will create a Dictionary to handle the balance of different users. Our dictionary will use `felt252` as keys.

```rust
use dict::Felt252DictTrait;

fn main() {
    let mut balances: Felt252Dict<u64> = Felt252DictTrait::new();

    balances.insert('Alex', 100_u64);
    balances.insert('Maria', 200_u64);

    let alex_balance = balances.get('Alex');
    assert(alex_balance == 100);
}
```

When using dictionaries in Cairo the first thing we should do is import `Felt252DictTrait` which brings into scope helpful methods to interact with the data structure. In order to create a new `Felt252Dict<T>` we use the `new` method, in this example our values have data types `u64`. Later, using the `insert` method we add two different users and their balances to `balances`. Finally we read from ones of the user using the `get` method.

`Fetl252Dict<T>` brings other important features to the language as well, and that is the ability to simulate the rewriting the same memory cell, something impossible in Cairo by define. In the following example, using the same `balance` dict from the previous example we will insert a user and update it's balance.

```rust
use dict::Felt252DictTrait;

fn main() {
    let mut balances: Felt252Dict<u64> = Felt252DictTrait::new();

    balances.insert('Alex', 100_u64);
    assert(alex_balance == 100);

    balances.insert('Alex', 200_u64);
    let alex_balance_2 = balance.get('Alex');
    assert(alex_balance_2 == 200);
}

```

This code is very similar to the previous example, we create a dictionary and insert the user 'Alex' with a balance of 100. Later we update it's balance. Once we query the dictionary for 'Alex' we get the updated result.

`Fetl252Dict<T>` also do not panic when trying to get does not exist you will get the default value (values should be Zeroable?) which is normally zero! (Can I change the default value?)

Finally Dictionaries allows you to rewrite memory but they don't have an explicit delete mechanism. Since you cannot delete you can write that a certain key get's the default 0 value. This nonetheless creates the issue of when a key is deleted or have the zero address.

## Dictionaries Underneath

Until this point we have seen that `Felt252Dict<T>` behaves in a similar way to analogous collections in other languages, at least externally. If you have been reading this book from the beginning you would know that Cairo is at its core a fundamentally different language from any other. This means that that the inner working of the Dictionaries is quite different too!

`Felt252Dict<T>` are implemented as a an `Array<Element<T>>`. Where each `Element<T>` has information about what key it represents and the previous and current value it represented. The defintion of `Element<T>` would be:

```rust
struct Element<T> {
   key: felt,
   previous_value: T,
   current_value: T,
}
```

Each time we insert an element with data type `T` in a Dictionary, it creates a new `Element<T>` and appends it at the end. If it is the first entry of this key, then the previous value and current value are the same. Using `balances` dictionary from previous examples, when inserting 'Alex' and 'Maria':

```rust
balances.insert('Alex', 100_u64);
balances.insert('Maria', 50_u64)
balances.insert('Alex', 200_u64);
```

Would create the list of `Element<T>`.

|   Key   | Prev | New |
| :-----: | ---- | --- |
| 'Alex'  | 100  | 100 |
| 'Maria' | 50   | 50  |
| 'Alex'  | 100  | 200 |

Notice that since 'Alex' was inserted twice, it appears twice, the last time with the updated value.

It is worth mentioning that this description of dictionry is about the idea behind the implementation of `Felt252Dict<T>` and not the actual implementation. The actual implementation is done in CASM and they generated code goes beyond the objective of this book.

### Squashing Dictionaries

`Element<T>` has both `prevous_value` and `current_value` field. You may have wondered why there is need to store the previous value as well. Wouldn't storing the latest value of the key would be enough.

The reason for this is to keep track that each value to make sure no value is wrong.

Squashing: Given a list of `Element<T>`, a dictionary is turned into a squashed dictionary, a dictionary where all the intermediate updates have been summarized an each key appears exactly once with its most recent value.

Example of squshing:
Let's assume that we write a code which constructs the following list of `Element<T>`.

|    Key    | Prev | New |
| :-------: | ---- | --- |
|  'Alex'   | 0    | 100 |
|  'Maria'  | 0    | 150 |
| 'Charles' | 0    | 70  |
|  'Maria'  | 100  | 250 |
|  'Alex'   | 150  | 40  |
|  'Alex'   | 40   | 300 |
|  'Maria'  | 250  | 190 |
|  'Alex'   | 300  | 90  |

After squashing

|    Key    | Prev | New |
| :-------: | ---- | --- |
|  'Alex'   | 0    | 90  |
| 'Charles' | 0    | 70  |
|  'Maria'  | 0    | 190 |

Squashing is essential to verify the correct output of Cairo files. A program that uses `Felt252Dict<T>` operation without squashing can run succesfully even if it contains inconsistent dictionary operations.

### Dictionary Destruction

Contray to normal types, `Felt252Dict<T>` are not dropped but destructed. They do not implement the `Drop<T>` trait but the `Destruct<T>`. The `Drop<T>` is only used to take sure elements can be taken out of scope. `Destruct<T>` instead has some implementatnion. It executes the call to sqush dictionary. Once the dictionary is squashed and we know it is a valid during runtime.

## Dictionaries inside of a struct

Dictionaries can be stored inside structs, the important thing to notice here is that if you use them naively, then you'll get an error about no implementing the drop trait. Dictionaries cannot implement the drop trait as easy because, the need to be squash.

What is the difference between drop and destruct?.

They need to be squash because if an unsquashed dictionary is returned then the prover can be cheated (how and why).

```rust
struct S {
    dict: Felt252Dict<u8>,
}

impl DestructS of Destruct::<S> {
    fn destruct(self: S) nopanic {
        self.dict.squash();
    }
}

fn using_s() {
    let s = S{dict: Felt252DictTrait::new()};
}
```

## Dictionaries whose values are complex types

Imagine you want a dictionary of dictionaries, how do you guarantee that all dictionaries are squashed, you need to create an implementation to dropping a dictionary of dictionaries.

You need to implement a trait Destruct for a type of dictionaries. It would go for all the keys of the dictionary on a squashing rampage. Returning a squashed dict of squashed dicts.

If you see the implementation of Dictionary they have a generic type `T` and only requires for it to be droppable. We need to do a new implementation which requires there elements to be destructible. But right now there is no way to access the list of elements and squash them all?
