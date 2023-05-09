# Starknet contracts: Contract Syntax

In this chapter, you are going to learn how to create smart contracts in Cairo, but before we go forward, it's important to clarify the difference between Cairo programs and Starknet contracts.

## Cairo programs and Starknet contracts
Starknet contracts are a special type of Cairo programs, so we are definitely not exploring an entirely different thing from all we've learnt thus far.

Cairo programs consist of a sequence of instructions that specify a set of computations to execute. As you may have already noticed, a Cairo program must always have a `main` entry point:

```rust
fn main() {}
```

Starknet contracts are essentially programs that can run on the Starknet OS, and as such, have access to Starknet's state. For a program to be recognized as a contract by the compiler, it must be annotated with the `#[contract]` attribute:

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

<span class="caption">Listing 9-1: A simple ENS naming service contract</span>

NB: Starknet contracts must be contained within [modules](./ch06-02-defining-modules-to-control-scope.md).

## Starknet Contract Attributes
Attributes are special annotations that modify the behavior of certain functions or methods. They are placed before a function and begin with the `#[]` symbol.

Here are a list of common attributes used in Starknet contracts:
1. `#[contract]`: As explained earlier, this attribute indicates to the compiler that the following code represents a contract. The compiler will automatically expand the code with elements related to contracts.

2. `#[constructor]`:  This attribute marks a function as a constructor. Deploying a contract will run the constructor function with the parameter specified when deploying the contract.

3. `#[external]`: This attribute marks a function as an external function (functions which modifies the state of the blockchain).

4. `#[view]`: This attribute marks a function as a view function (read-only functions that do not modify the state of the blockchain).

5. `#[event]`: This is used to define contract events.

6. `#[l1_handler]`: This attribute is used to mark functions which can receive messages from L1s.

## Storage Variables
Storage variables store data in a contract storage, that can be accessed and modified throughout the lifetime of the contract. 

Storage variables in Starknet contracts are stored in a special struct called `Storage`:

```rust
struct Storage{
    id: u8,
    names: LegacyMap::<ContractAddress, felt252>,
}
```

<span class="caption">Listing 9-2: A Storage Struct</span>

The storage struct is just a [struct](./ch04-00-using-structs-to-structure-related-data.md) like any other, except that you can defined mappings with the `LegacyMap` type.

### Storage Mappings
Mappings are a key-value data structure that you can use to store data within a smart contract. They are essentially hash tables that allow you to associate a unique key with a corresponding value. Mappings are particularly useful for managing large sets of data, as it's impossible to store arrays in storage.

A mapping is a variable of type LegacyMap, inside which the key and value type are specified within angular brackets <>. The syntax for declaring a mapping is as follows in Listing 9-2. 

You can also create more complex mappings than that found in Listing 9-2 like the popular `allowances` storage variable in the ERC20 Standard which maps the `owner` and `spender` to the `allowance` using tuples:

```rust
struct Storage{
    allowances: LegacyMap::<(ContractAddress, ContractAddress), u256>
}
```

In mappings, the address of the value at key `k_1,...,k_n` is `h(...h(h(sn_keccak(variable_name),k_1),k_2),...,k_n)` where ℎ
 is the Pedersen hash and the final value is taken `mod2251−256`.

### Reading from Storage
The values of storage variables can be read and modified using the `read` and `write` methods respectively.

To read the value of the storage variable `names`, we call the `read` method on the `names` storage variable, passing in the key `_address` as a parameter.

```rust
let name = names::read(_address);
```

We call the `read` method on the `names` storage variable, passing in the key `_address` into parentheses.

```rust
fn read(key: felt252) -> felt252;
```

<span class="caption">Listing 9-3: The `read` method function signature</span>

*NB: When the storage variable does not store a mapping, it's value is accessed without passing any parameters to the `read` method*

### Writing to Storage
Writing to storage variables can be done using the `write` StorageAccess method:

```rust
names::write(_address, _name);
```

We call the `write` method on the `names` storage variable, passing in the key and values into the parentheses.

```rust
fn write(value: felt252);
```

<span class="caption">Listing 9-3: The `write` method function signature</span>

## Functions
In this section, we are going to be looking at some popular function types you'd encounter with most contracts:

### 1. Constructors
Constructors are a special type of function that runs when deploying a contract, and can be used to initialize certain storage variables on deployment:

```rust
#[constructor]
fn constructor(_name: felt252, _address: ContractAddress){
    names::write(_address, _name);
}
```

Some important rules to note:
1. Your contract can't have more than one constructor.
3. Your constructor function must be named `constructor`.
4. Finally it should be annotated with the `#[constructor]` decorator.

### 2. External functions
External functions are functions which modifies the state of the blockchain. They are public by default, and can be interacted with by anyone. 
You can create external functions by annotating functions with the `#[external]` attribute:

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
