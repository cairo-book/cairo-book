# Dictionaries

Cairo provides along with its core library a dictionary-like type. The `Felt252Dict<T>` data type represents a collection of key-value pairs where each key is unique and associated with a corresponding value. This type of data structure is known differently across different programming languages such as maps, hash tables, associative array and many others.

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

The first thing we do is import `Felt252DictTrait` which brings to scope all the methods we need to interact with the dictionary. Next we create a new instance of `Felt252Dict<u64>` by using the `new` method.
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

This example we did something similar to the previous one. We created a dictionary, but instead of adding two users, we added the same one twice. Each time we added _Alex_ we used a different balance and each time we checked, its balance has the last value that got inserted, effectively "rewriting" the same memory cells asociated with the user.

It is worth mentioning that once you instantiate a `Fetl252Dict<T>`, behind the scenes all keys have their associated values initialized as zero. This means, for example, that if you tried to get the balance of an inexistent user you will get 0 instead of an error or an undefined value. This also means there is no way to actually delete data from a dictionary. Something to take into account when incorporating dictionaries in your code.

Until this point we have talked about all the basic features of `Felt252Dict<T>` and if you are familiar with other languages you'll notice how everything works pretty much the same, from an outside perspective at least. But if you have been reading this book from the bginning you know that Cairo is at its core a fundamentally different language than any other, which means the inner workings of Dicitionaries is very different as well!

In the following section we are going to give some insights about a Dictionary inner mechanisms and the compromises that were taken to make them work. After that we are going to take a look at how to use dictionaries with other data structures as well as other ways of interacting with it.

## Dictionaries Underneath

In this section we will describe at a high level how Dictionaries get implemented in Cairo Assembly. The following explanation targets giving an overview of how it is implemented, but not how it is actually implemented because for that we would require to explain CASM as well and that is beyond the scope of this book. In CASM there are no such things as high level data structures as `Array<T>` or structs.

As we have mentioned, Cairo posses an inmutbale memory system so in order to simulate mutabilty `Felt252Dict<T>` are implemented using a list of elements underneath. This list behaves the same as an array, were each element is a tuple containing three values:

1. A `key` which identifies the key-value pair of the dictionary.
2. The `previous_value` that that Dictionary at this key held (More on this later).
3. The `current_value` that the Dictionary is holding with this Key.

We can say then that `Felt252Dict<T>` would be implemented in high level way as an `Array<Element<T>>`. Where each `Element<T>` has information about what key it represents and the previous and current value it represented. The defintion of `Element<T>` would be:

```rust
struct Element<T> {
   key: felt252,
   previous_value: T,
   current_value: T,
}
```

Each time we insert an element with data type `T` in a Dictionary, it will create a new `Element<T>` and appends it at the end. If it is the first entry of this key, then the previous value and current value are the same. So each time there is an insertion, there is nothing being rewritten, but a new cell is used to hold the new value. Let's show an example using the `balances` dictionary from the previous section and inserting users 'Alex' and 'Maria':

```rust
balances.insert('Alex', 100_u64);
balances.insert('Maria', 50_u64)
balances.insert('Alex', 200_u64);
```

This instructions would create the list of `Element<T>`:

|  Key  | Prev | New |
| :---: | ---- | --- |
| Alex  | 100  | 100 |
| Maria | 50   | 50  |
| Alex  | 100  | 200 |

Notice that since 'Alex' was inserted twice, it appears twice, the last time with the updated value. This applies to every instance of a dictionary, if `n` elements are inserted, then `n` elements exist, it doesn't matter if they had the same key. This means that insertion have a time complexity of `O(1)` because you only need to add an element at the end of the list while getting an element requires exploring the whole list, have a worst time complexity of `O(n)` where `n` is the amounts of elements inserted.

The `key` and `current_value` use for each element is pretty straightforward. The necesity for a `previosu_value` is not.
You need to remember that all cairo restricitions lays on that it is a proven language, it is executed by sequencer and then generates a proof based on the program which is then sent.
Every time the prover gets a transaction we need to check no invalid values were added and that is done through _squashing_.

### Squashing Dictionaries

`Element<T>` has both `previous_value` and `current_value` fields. You may have wondered why there is need to store the previous value as well. Wouldn't storing the latest value of the key would be enough. The reason behing this lies in the fundations on where Cairo is layed. Cairo is a language which implements a CPU and needs to verify that each computation is correct.

The reason for this is to keep track that each value to make sure no value is wrong.

Squashing: Given a list of `Element<T>`, a dictionary is turned into a squashed dictionary, a dictionary where all the intermediate updates have been summarized an each key appears exactly once with its most recent value.

Example of squshing:
Let's assume that we write a code which constructs the following list of `Element<T>`.

|   Key   | Prev | New |
| :-----: | ---- | --- |
|  Alex   | 100  | 100 |
|  Maria  | 150  | 150 |
| Charles | 70   | 70  |
|  Maria  | 100  | 250 |
|  Alex   | 150  | 40  |
|  Alex   | 40   | 300 |
|  Maria  | 250  | 190 |
|  Alex   | 300  | 90  |

After squashing

|   Key   | Prev | New |
| :-----: | ---- | --- |
|  Alex   | 100  | 90  |
| Charles | 70   | 70  |
|  Maria  | 150  | 190 |

Squashing is essential to verify the correct output of Cairo files. A program that uses `Felt252Dict<T>` operation without squashing can run succesfully even if it contains inconsistent dictionary operations.

### Dictionary Destruction

Contray to normal types, `Felt252Dict<T>` are not dropped but destructed. They do not implement the `Drop<T>` trait but the `Destruct<T>`. The `Drop<T>` is only used to take sure elements can be taken out of scope. `Destruct<T>` instead has some implementatnion. It executes the call to sqush dictionary. Once the dictionary is squashed and we know it is a valid during runtime.

When an element in Cairo is dropped, it means it is taken out of scope, but it is a no-op operation, meaning it does not generate new CASM, meanwhile Destruct does. Dictionaries need to implement the Destruct trait instead of the Drop trait, because the need to be squashed at the end of each execution.

## Advanced Dictionaries

### The `entry` method

by using the entry function you can update the dictionary in a new way

It returns a dict entry according to a key

which is a whole new type. Once you ask for an entry the original dict cannot be modified in any way until you finalize working with this entry

Once you do such_entry.finalize you are given back access to the normal dictionary

There is no performance gain, but it represents another idiomatic way of modifying a dictionary.

### Dictionaries as struct members

Dictionaries can be stored inside structs, the important thing to notice here is that if you use them naively, then you'll get an error about no implementing the drop trait. Dictionaries cannot implement the drop trait as easy because, the need to be squash.

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

## User defined types as a Dictionary value types

Imagine you want a dictionary of dictionaries, how do you guarantee that all dictionaries are squashed, you need to create an implementation to dropping a dictionary of dictionaries.

You need to implement a trait Destruct for a type of dictionaries. It would go for all the keys of the dictionary on a squashing rampage. Returning a squashed dict of squashed dicts.

If you see the implementation of Dictionary they have a generic type `T` and only requires for it to be droppable. We need to do a new implementation which requires there elements to be destructible. But right now there is no way to access the list of elements and squash them all?
