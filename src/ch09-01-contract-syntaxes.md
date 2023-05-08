# Starknet contracts: Contract Syntax

In this chapter, you are going to get acquainted with basic contract syntaxes available in Cairo, but before we go forward, it's important to create a clear distinction between programs and contracts on Starknet!

## Cairo programs vs Starknet contracts
Before we proceed, I'd like to point out that Starknet contracts are a special type of Cairo programs, so we are definitely not exploring an entirely different thing from all we've learnt thus far.

Cairo programs as we've previously defined, are a sequence of instructions that specifies a set of computations to be executed. As you must have already noticed, a Cairo program must always have a `main` entrypoint:

```rust
fn main() {}
```

Starknet contracts are essentially programs that can run on the Starknet Virtual Machine, and as such, have access to Starknet's state. For a program to be recognized as a contract by the compiler, it must be annotated with the `#[contract]` attribute:

```rust
#[contract]
mod Example{
    use starknet::get_caller_address;
    use starknet::ContractAddress;

    struct Storage{
        names: LegacyMap::<ContractAddress, felt252>,
    }

    #[event]
    fn StoredName(caller: ContractAddress, name:felt252){}

    #[constructor]
    fn constructor(_name: felt252, _address: ContractAddress){
        names::write(_address, _name);
    }

    #[external]
    fn store_name(_name: felt252){
        let caller = get_caller_address();
        names::write(caller, _name);
        StoredName(caller,_name);
    }

    #[view]
    fn get_name(_address:ContractAddress) -> felt252{
        let name = names::read(_address);
        return name;
    }
}
```

<span class="caption">Listing 9-1: A simple ENS contract</span>

NB: Starknet contracts must be contained within [modules](./ch06-02-defining-modules-to-control-scope.md).

## Starknet Contract Attributes
Attributes are special annotations that modify the behavior of certain functions or methods. They are placed before a function and begin with the `#[]` symbol.

Here are a list of common attributes used in Starknet contracts:
1. `#[contract]`: This attribute like we explained earlier, instructs the compiler to handle our codes as contracts.

2. `#[constructor]`:  This attribute marks a function as a constructor, allowing the function to be called with any necessary arguments to be initialized on deployment.

3. `#[external]`: This attribute marks a function as an external function.

4. `#[view]`: This attribute marks a function as a view function.

5. `#[event]`: This is used to define contract events.

6. `#[l1_handler]`: This attribute is used to mark functions which can receive messages from L1s.

## State Variables
State variables store data in a contract storage, that can be accessed and modified throughout the lifetime of the contract. 

State variables in Starknet contracts are stored in a special struct called `Storage`:

```rust
struct Storage{
    id: u8,
    names: LegacyMap::<ContractAddress, felt252>,
}
```

<span class="caption">Listing 9-2: A Storage Struct</span>

The `Storage` struct takes in the name of the state variable, and it's data type. You can also create complex mappings using the `LegacyMap` keyword.

### Storage Mappings
Mappings acts as mini hash tables, consisting of key -> value type pairs.

They are created using the `LegacyMap` keyword, passing in the data types of the mapped variables within angular brackets `<>` as can be seen in Listing 9-2. 

You can also create more complex mappings like the popular `allowances` state variable in the ERC20 Standard using tuples:

```rust
struct Storage{
    allowances: LegacyMap::<(ContractAddress, ContractAddress), u256>
}
```

### Reading from Storage
State variables can be read from, and written to. This can be done by calling the `read` and `write` StorageAccess methods on the state variable.

To read from the state variable `names` in our Example contract in Listing 9-1:

```rust
let name = names::read(_address);
```

We call the `read` method on the `names` state variable, passing in the key `_address` into parentheses. 

*NB: In a case where the state variable does not store a mapping, you can access it without needing to pass a key into the parentheses.*

### Writing to Storage
Writing to state variables can be done using the `write` StorageAccess method:

```rust
names::write(_address, _name);
```

We call the `write` method on the `names` state variable, passing in the key and values into the parentheses.

## Functions
Functions in Starknet contracts do not hold a special meaning from what we discussed in [Chapter 02](./ch02-03-functions.md), but can be annotated with attributes for specific functionalities.

In this section, we are going to be looking at three popular function types you'd encounter with most contracts:

### 1. Constructors
Constructors are a special type of function used to initialize certain state variables on deployment.

A constructor must be named `constructor` and annotated with the `#[constructor]` attribute:

```rust
#[constructor]
fn constructor(_name: felt252, _address: ContractAddress){
    names::write(_address, _name);
}
```

Some important rules to note:
1. Your contract shouldn't have more than one constructor.
2. Variables to be intialized should be passed in as arguments to the constructor.
3. Your constructor function must be named `constructor`.
4. Finally it should be annotated with the `#[constructor]` decorator.

### 2. External functions
External functions are functions which modifies the state of the blockchain. They are specified using the `#[external]` attribute, and are public by default:

```rust
#[external]
fn store_name(_name: felt252){
    let caller = get_caller_address();
    names::write(caller, _name);
    StoredName(caller,_name);
}
```

### 3. View functions
View functions are read-only functions, they do not modify the state of the blockchain. They are specified using the `#[view]` attribute, and are public by default:

```rust
#[view]
fn get_name(_address:ContractAddress) -> felt252{
    let name = names::read(_address);
    return name;
}
```

**NB:** It's important to note that, both external and view functions are public by default on Starknet. To create an internal function, you simply need to avoid specifying any attribute for that function.

## Events
Events are custom data structures that are emitted by smart contracts during execution. They provide a way for smart contracts to communicate with the external world by logging information about specific events.

### Defining events
An event is an empty function annotated with the `#[event]` attribute. 

In Listing 9-1, `StoredName` is an event that emits information about names stored in the contract:

```rust
#[event]
fn StoredName(caller: ContractAddress, name:felt252){}
```

we pass in the values to be emitted and their corresponding data types as argument within the parentheses.

### Emitting events
After defining events, we can emit them by simply calling the event name like we'll call functions:

```rust
StoredName(caller,_name);
```