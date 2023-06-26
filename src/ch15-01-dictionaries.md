# Dictionaries

Cairo provides along with its core library a dictionary-like type. The `Felt252Dict<T>` data type represents a collection of key-value pairs where each key is unique and associated with a corresponding value. This type of data structure is known differently across different programming languages such as maps, hash tables, associative array and many others.

The `Felt252Dict<T>` type is useful when you want to organize your data in a certain way for which using an `Array<T>` and indexing doesn't suffice. Cairo dictionaries also allows the programmer to easily simulate the existence of mutable memory when there is actually none.

## Basic use of Dictionaries

It is normal in other language when creating a new dictionary to define the data types of both key and value. In Cairo the key type is restricted to `felt252` leaving only the possibility to specify the value data type, represented by `T` in `Felt252Dict<T>`.

The core functionality of a `Felt252Dict<T>` is implemented in the trait `Felt252DictTrait` which includes all basic operations. Among them we can find:

1. `new() -> Felt252Dict<T>`, that creates a new instance of a dictionary,
2. `insert(felt252, T) -> ()` to write values to a dictionary instance and
3. `get(felt252) -> T` to read values from it.

These functions allow us to manipulate dictionaries like in any other language. In the following example we create a dictionary with the purpose of having a mapping between individuals and their balance:

```rust
use dict::Felt252DictTrait;

fn main() {
    let mut balances: Felt252Dict<u64> = Felt252DictTrait::new();

    balances.insert('Alex', 100_u64);
    balances.insert('Maria', 200_u64);

    let alex_balance = balances.get('Alex');
    assert(alex_balance == 100);

    let maria_balance = balances.get('Maria');
    assert(maria_balance == 200);
}
```

The first thing we do is import `Felt252DictTrait` which brings to scope all the methods we need to interact with the dictionary. Next we create a new instance of `Felt252Dict<u64>` by using the `new` method and added two individuals, each one with their own balance, using the`insert` method. Finally, we checked the balance of our users with the `get` method.

Until this point in the book we have talked about how Cairo memory systems are inmutable, meaning you can only write to a memory cell once but the `Felt252Dict<T>` type represents a way to overcome this obstacle. We will explained how this is actually implemented later on [Dictionaries Underneath](##Dictionaries Underneath).

With the same tone of our previous example, lets show a code example where the balance of the same user changes:

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

Notice how in this example we added the _Alex_ user twice, each time using a different balance and each time we checked for its balance it had the last value inserted! `Felt252Dict<T>` effectively allow us to "rewrite" the memory value for any given key.

Before heading on and explaining how dictionaries are implemented it is worth mentioning that once you instantiate a `Fetl252Dict<T>`, behind the scenes all keys have their associated values initialized as zero. This means that if for example you tried to get the balance of an inexistent user you will get 0 instead of an error or an undefined value. This also means there is no way to actually delete data from a dictionary. Something to take into account when incorporating this structure into your code.

Until this point we have seen all the basic features of `Felt252Dict<T>` and how its behaviour mimics the same behaviour as the corresponding data structures in any other language, that is, externally of course. Cairo is at its core a non-deterministic Turing-complete programming language, very different from any other popular language in existence, which as a consequence means that dictionaries are implemented very different as well!

In the following sections we are going to give some insights about a Dictionary inner mechanisms and the compromises that were taken to make them work. After that we are going to take a look at how to use dictionaries with other data structures as well as other ways of interacting with it.

## Dictionaries Underneath

One of the constraints of being a non-deterministic language is that the memory system is inmutable, so in order to simulate mutability, the team decided to implement `Felt252Dict<T>` as list of entries. Each of the entries represent a time where a dictionary was accessed for reading/updating/writing purposes. An entry have three fields:

1. A `key` field which identifies the value for this key-value pair of the dictionary.
2. A `previous_value` field which indicates which was previous value was hold at `key`.
3. A `new_value` field which indicates the new value that is hold at `key`.

If we'd implemented `Felt252Dict<T>` using high level structures we would internally define it as `Array<Entry<T>>` where each `Entry<T>` has information about what key-value pair it represents and the previous and new values it holds. The defintion of `Entry<T>` would be:

```rust
struct Entry<T> {
   key: felt252,
   previous_value: T,
   new_value: T,
}
```

For each time we interact with a `Felt252Dict<T>` a new `Entry<T>` will be registered:

- A `get` would register an entry where there is no change in state, and previous and new values are stored with the same value.
- An `insert` would register new `Entry<T>` where the `new_value` would be the element being inserted, and the `previous_value` the last element inserted before this. In case it is the first entry for certain key, then the previous and current value will be the same.

The use of this entry list shows how there isn't any rewriting, just the creation of new memory cells per `Felt252Dict<T>` interaction. Let's show an example of this using the `balances` dictionary from the previous section and inserting the users 'Alex' and 'Maria':

```rust
balances.insert('Alex', 100_u64);
balances.insert('Maria', 50_u64)
balances.insert('Alex', 200_u64);
balances.get('Maria')
```

This instructions would then produce the following list of entries:

|  key  | previous | current |
| :---: | -------- | ------- |
| Alex  | 100      | 100     |
| Maria | 50       | 50      |
| Alex  | 100      | 200     |
| Maria | 50       | 50      |

Notice that since 'Alex' was inserted twice, it appears twice and the `previous` and `current` values are set properly. Also reading from 'Maria' registered an entry with no change from previous to current values.

This approach to implement `Felt252Dict<T>` means that for each reading/writing operations there is a scan for the whole entry list in search the last entry with the same `key`. Once the entry have been found, its `new_value` is extacted and used on the new entry to be added as the `previous_value`. This means that interacting with `Felt252Dict<T>` has a worst time complexity of `O(n)` where `n` is the amount of entries in the list.

If you pour some thought on alternate ways of implementing `Felt252Dict<T>` you'd probably find them, probably even ditching completely the need for a `previous_value` field, nonetheless since Cairo is not your normal language this won't work.

One of the purposes of Cairo is, with the STARK proof system, to generate proofs of computational integrity. This means that you need to verify that program execution is correct and inside the boundries of Cairo restrictions. One of those boundries checks consist on dictionary "squashing" and that requires information of both previous and new values for every entry.

### Squashing Dictionaries

In order to verify that the proof generated by a Cairo program execution which used a `Felt252Dict<T>` is correct we need to check that there wasn't any illegal tampering with the dictionary. This done through a method called `squash_dict` that reviews each entry of the entry list and checks that access to the dictionary remains coherent throughout the execution.

Given all entries with key `k`, you'll take them in the same order that they were found originally and for all of them, you'll take the `i` with the `i + 1` and compare that `new_i == previous_i+1`.

For example, given an entry list like this one:

|   key   | previous | current |
| :-----: | -------- | ------- |
|  Alex   | 100      | 100     |
|  Maria  | 150      | 150     |
| Charles | 70       | 70      |
|  Maria  | 100      | 250     |
|  Alex   | 150      | 40      |
|  Alex   | 40       | 300     |
|  Maria  | 250      | 190     |
|  Alex   | 300      | 90      |

After squashing the entry list would be reduced to:

|   key   | previous | current |
| :-----: | -------- | ------- |
|  Alex   | 100      | 90      |
|  Maria  | 150      | 190     |
| Charles | 70       | 70      |

In case of a change on any of the values of the first table, squashing would have failed during runtime.

### Dictionary Destruction

If you ran the examples from [Basic use of Dictionaries](##Basic use of Dictionaries) you'd probably notice that you never did a call to squash dictionary, but program compiled succesfully nonetheless. What happened behind the scene was that squash was called automatically via the `Felt252Dict<T>` implementation of the `Destruct<T>` trait. This call ocurred just before `balance` went out of scope.

The `Destruct<T>` trait represents another way of removing instances out of scope apart from `Drop<T>`. The main difference between these two is that `Drop<T>` is treated as a no-op operation, meaning it does not generate new CASM while `Destruct<T>` does not have this restriction. The only type which actively uses the `Destruct<T>` trait is `Felt252Dict<T>`, for every other type `Destruct<T>` and `Drop<T>` are synonims.

On the following section we will have a hands on example using the `Destruct<T>` trait.

## More Dictionaries

Up to this point we have given a comprehensive overview of the functionality of `Felt252Dict<T>` as well as how and why it is implemented in this way. If you haven't understood all of it, don't worry because in this section we will have some hands on examples using dictionaries in non-trivial ways.

We will begin explaining the `entry` method which is part of a dictionary basic functionality included `Felt252DictTrait<T>` which we didn't mentioned at the beginning. After that we will see examples of how `Felt252Dict<T>` interacts with other types such as structs and enums.

### The `entry` method

Remember when we mentioned

by using the entry function you can update the dictionary in a new way

It returns a dict entry according to a key

which is a whole new type. Once you ask for an entry the original dict cannot be modified in any way until you finalize working with this entry

Once you do such entry.finalize you are given back access to the normal dictionary

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

### Dictionaries of structs

## Dictionaries of Dictionaries??

Imagine you want a dictionary of dictionaries, how do you guarantee that all dictionaries are squashed, you need to create an implementation to dropping a dictionary of dictionaries.

You need to implement a trait Destruct for a type of dictionaries. It would go for all the keys of the dictionary on a squashing rampage. Returning a squashed dict of squashed dicts.

If you see the implementation of Dictionary they have a generic type `T` and only requires for it to be droppable. We need to do a new implementation which requires there elements to be destructible. But right now there is no way to access the list of elements and squash them all?
