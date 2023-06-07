# Security Pitfalls

As smart contracts become more complex, ensuring their security becomes increasingly challenging. However, being aware of common pitfalls can significantly help in preventing the most frequent vulnerabilities.

This section highlights some common security pitfalls and provides guidance on how to avoid them.

## Reentrancy

A reentrancy attack is a type of attack in which a malicious contract repeatedly calls the same contract before the first invocation is finished. This can allow the malicious contract to take control of the victim contract and manipulate its state.

To prevent reentrancy attacks, it is crucial to use a reentrancy guard. A reentrancy guard is a boolean flag that is set to true at the start of a function and then set back to false before the function returns. If the flag is true when the function is called, the function should revert and abort execution.

The following example demonstrates a simple implementation of a reentrancy guard in Starknet:

```rust
#[contract]
mod ReentrancyGuard {
    struct Storage {
        reentrancy_guard: bool,
    }

    #[constructor]
    fn constructor() {
        reentrancy_guard::write(false);
    }

    #[external]
    fn foo() {
        assert(!reentrancy_guard::read(), 'ReentrancyGuard: reentrant call');
        reentrancy_guard::write(true);

        // ...

        reentrancy_guard::write(false);
    }
}

```

<span class="caption">Listing 11-4-1: A simple reentrancy guard</span>
