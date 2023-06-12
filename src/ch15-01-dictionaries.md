# Dictionaries

Cairo provides along with its core library a dictionary-like type. The `Felt252Dict<T>` data type represents a collection of key-value pairs where each key is unique and associated with a corresponding value. This type of data structure is known differently across different programming languages such as maps, hash tables or associative array, among many others.

The `Felt252Dict<T>` type is useful when you want to organize your data in a certain way for which using an `Array<T>` and indexing doesn't suffice. Cairo dictionaries also allows the programmer to easily simulate the existence of mutable memory when there is actually none.

## Using Dictionaries

It is normal in other language when creating a new dictionary to define the data types of both key and value. In Cairo the key type is restricted to `felt252` leaving only the possibility to specify the value data type, represented by `T` in `Felt252Dict<T>`.

The core functionality of a `Felt252Dict<T>` is implemented in the trait `Felt252DictTrait` which includes all basic operations. Among them we can find:

1. `new() -> Felt252Dict<T>`, that creates a new instance of a dictionary,
2. `insert(felt252, T) -> ()` to write values to a dictionary and
3. `get(felt252) -> T` to read values from a dictionary

We can use this functions to manipulate dictionaries the same way we do in any other language. The following example creates a dictionary with the purpose of containing the balance of certain individuals:

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

The first thing we do is import `Felt252DictTrait` which brings to scope all the methods we need to interact with the dictionary. Next we create a new instance by using the `new` method. Notice that we sepcify that our value data types will be `u64`.
To add two new individuals we used the `insert` methods twice, each with its name and its balance. Finally we checked the balance of a new user using the `get` method.

Until this point in the book you should have heard a lot about how Cairo memory systems are inmutable, meaning you can only write a memory cell once, `Felt252Dict<T>` brings a way to overcome this obstacle. The details of how this is achieved are going to be explained later on this chapter.

Lets show with an example:

```rust
use dict::Felt252DictTrait;

fn main() {
    let mut balances: Felt252Dict<u64> = Felt252DictTrait::new();

    // Insert Alex with 100 balance
    balances.insert('Alex', 100_u64);
    // Check that Alex has indeed 100 asociated with him
    let alex_balance_2 = balance.get('Alex');
    assert(alex_balance == 100);

    // Insert Alex again, this time with 200 balance
    balances.insert('Alex', 200_u64);
    // Check the new balance is correct
    let alex_balance_2 = balance.get('Alex');
    assert(alex_balance_2 == 200);
}

```

This example we did something similar to the previous one. We created a dictionary, but instead of adding two users, we added the same one twice. Notice how the user _Alex_ is added twice with different balance each time and each time we check its balance is the latest one that got updated, effectively "rewriting"

It is worth mentioning that once you instantiate a `Fetl252Dict<T>`, behind the scenes all keys are initialized with the default value of the Value type. That is, if you initialze a dictionary of `u64` like in the previous examples, if you tried to get the balance of an inexistent user you will get 0 instead of `panic` like in other languages. Also this means there is no way to actually delete data from a dictionary. Something to take into account when writing your code.

Until this point we have talked about all the basic features of mapping. Next we are going to talk about their inner mechanisms, and the compromises that were taken to accomplish this. Later we will take a more advance look to dictionaries and how can they be used with other data structures as well as another way of updating it's keys.

## Dictionaries Underneath

Until this point we have seen that `Felt252Dict<T>` behaves in a similar way to analogous collections in other languages, at least externally. If you have been reading this book from the beginning you would know that Cairo is at its core a fundamentally different language from any other. This means that that the inner working of the Dictionaries is quite different too!

`Felt252Dict<T>` are implemented as a an `Array<Element<T>>`. Where each `Element<T>` has information about what key it represents and the previous and current value it represented. It is important to clarify that it is not actually implemented this way, but the idea it follows at a low level is. The defintion of `Element<T>` would be:

```rust
struct Element<T> {
   key: felt252,
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

|  Key  | Prev | New |
| :---: | ---- | --- |
| Alex  | 100  | 100 |
| Maria | 50   | 50  |
| Alex  | 100  | 200 |

Notice that since 'Alex' was inserted twice, it appears twice, the last time with the updated value. This applies to every instance of a dictionary, if `n` elements are inserted, then `n` elements exist, without mattering if they have the same key. This means that each time you do a get you have a worst time complexity of `O(n)` where `n` is the amounts of elements inserted.

It is worth mentioning that this description of dictionry is about the idea behind the implementation of `Felt252Dict<T>` and not the actual implementation. The actual implementation is done in CASM and the generated code goes beyond the objective of this book.

### Squashing Dictionaries

`Element<T>` has both `previous_value` and `current_value` fields. You may have wondered why there is need to store the previous value as well. Wouldn't storing the latest value of the key would be enough. The reason behing this lies in the fundations on where Cairo is layed. Cairo is a language which implements a CPU and needs to verify that each computation is correct.

The reason for this is to keep track that each value to make sure no value is wrong.

Squashing: Given a list of `Element<T>`, a dictionary is turned into a squashed dictionary, a dictionary where all the intermediate updates have been summarized an each key appears exactly once with its most recent value.

Example of squshing:
Let's assume that we write a code which constructs the following list of `Element<T>`.

|   Key   | Prev | New |
| :-----: | ---- | --- |
|  Alex   | 0    | 100 |
|  Maria  | 0    | 150 |
| Charles | 0    | 70  |
|  Maria  | 100  | 250 |
|  Alex   | 150  | 40  |
|  Alex   | 40   | 300 |
|  Maria  | 250  | 190 |
|  Alex   | 300  | 90  |

After squashing

|   Key   | Prev | New |
| :-----: | ---- | --- |
|  Alex   | 0    | 90  |
| Charles | 0    | 70  |
|  Maria  | 0    | 190 |

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
