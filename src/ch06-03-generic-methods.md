# Generic Methods

We can implement methods on structs and enums, and use the generic types in their definition, too. Using our previous definition of `Wallet<T>` struct we define a method `balance` for it:

```rust
struct Wallet<T> {
    balance: T,
}

impl WalletDrop<T, impl TDrop: Drop<T>> of Drop<Wallet<T, U>>;

trait WalletTrait<T> {
    fn balance(self: @Wallet<T>) -> @T;
}

impl WalletImpl<T> of WalletTrait<T> {
    fn balance(self: @Wallet<T>) -> @T{
        return self.balance;
    }
}

fn main() {
    let w = Wallet {balance: 50};
    assert(w.balance() == 50, 0);
}
```

We first define `WalletTrait<T>` trait using a generic type `T` which defines a method that returns a snapshot of the field `address` from `Wallet`. Then we give an implementation for the trait in `WalletImpl<T>`. Notice that you need to include a generic type in both defintions for `trait` and `impl`.

We can also specify constraints on generic types when defining methods on the type. We could, for example, implement methods only for `Wallet<u128>` instances rather than `Wallet<T>`. In the next listing we define an implementation for wallets which have concrete type of `u128` for the `balance` field.

```rust
trait WalletRecieveTrait {
    fn recieve(ref self: Wallet<u128>, value: u128);
}

impl WalletRecieveImpl of WalletRecieveTrait {
    fn recieve(ref self: Wallet<u128>, value: u128) {
        self.balance += value;
    }
}

fn main() {
    let mut w = Wallet {balance: 50_u128};
    assert(w.balance() == 50_u128, 0);

    w.recieve(100_u128)
    assert(w.balance() == 150_u128, 0);
}
```

The new method `recieve` increments the size of the balance of any instance of a `Wallet<u128>`. Notice that we changed the `main` function making `w` a mutable variable in order for it to be able to update it's balance. If we were to change the intialization of `w` by changing the type of `balance` the previous code wouldn't compile.

Cairo allow us to define generic types inside generic traits as well. Using the past implementation from `Wallet<U, V>` we are going to define a trait that picks two wallets of different generic types and create a new one with a generic type of each. First, lets rewrite the struct definiton:

```rust
struct Wallet<T, U> {
    balance: T,
    address: U,
}
```

Next we are going to naively define the mixup trait and implementation:

```rust
// This does not compile!
trait WalletMixTrait<T1, U1> {
    fn mixup<T2, U2>(self: Wallet<T1, U1>, other: Wallet<T2, U2>) -> Wallet<T1, U2>;
}

impl WalletMixImpl<T1,  U1> of WalletMixTrait<T1, U1> {
    fn mixup<T2, U2>(self: Wallet<T1, U1>, other: Wallet<T2, U2>) -> Wallet<T1, U2> {
        Wallet {balance: self.balance, address: other.address}
    }
}
```

We are defining a trait `WalletMixTrait<T1, U1>` with the `mixup<T2, U2>` methods which given an instance of `Wallet<T1, U1>` and `Wallet<T2, U2>` it creates a new `Wallet<T1, U2>`. As `mixup` signature signals, both `self` and `other` are getting dropped at the end of the function, which is the main reason for this code for not to compile. If you have been following this chapter from the start you would know that we must add a requirement for all the generic types specifying that they will implement the `Drop` trait. The code fix is as follow:

```rust
trait WalletMixTrait<T1, U1> {
    fn mixup<T2, impl T2Drop: Drop<T2>, U2, impl U2Drop: Drop<U2>>(self: Wallet<T1, U1>, other: Wallet<T2, U2>) -> Wallet<T1, U2>;
}

impl WalletMixImpl<T1, impl T1Drop: Drop<T1>,  U1, impl U1Drop: Drop<U1>> of WalletMixTrait<T1, U1> {
    fn mixup<T2, impl T2Drop: Drop<T2>, U2, impl U2Drop: Drop<U2>>(self: Wallet<T1, U1>, other: Wallet<T2, U2>) -> Wallet<T1, U2> {
        Wallet {balance: self.balance, address: other.address}
    }
}
```

We add the requirements for `T1` adn `U1` to be droppable on `WalletMixImpl` declaration. Then we do the same for `T2` and `U2`, this time as part of `mixup` signature. We can now try the `mixup` function:

```rs
fn main() {
   let w1 = Wallet{ balance: true, address: 10_u128};
   let w2 = Wallet{ balance: 32, address: 100_u8};

   let w3 = w1.mixup(w2);

   assert(w3.balance == true, 0);
   assert(w3.address == 100_u8, 0);
}
```

We first create two instances, one of `Wallet<bool, u128>` and the other of `Wallet<felt252, u8>`. Then we call `mixup` finally getting a new instance of `Wallet<bool, u8>`.
