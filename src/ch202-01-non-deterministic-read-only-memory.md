# Non-Deterministic Read-only Memory

From the Cairo whitepaper, it states that Cairo uses a non-deterministic read-only memory model.

Let's break down the two core properties:

1. **Non-determinism**

- In Cairo, non-determinism refers to the idea that the memory addresses and their values are not determined by a typical memory management system. Instead, the prover asserts the location and the values that are stored at those addresses. For example, instead of manually writing and reading a value at a particular address as in traditional read-write memory models, the prover asserts that at memory address x, the value 7 is stored. This way, we do not need to explicitly check whether the value 7 exists at address x.

2. **Read-only**

- This means that when a Cairo program runs, the value in memory does not change.

These two properties effectively make the memory model a write-once memory model. Once a value is assigned to a memory address, it cannot be overwritten. Subsequent operations are limited to reading or verifying the value at that address. Moreover, the memory address space is contiguous, meaning if the program accesses memory address x and y, it cannot skip an address in between.

This approach differs significantly from other virtual machines, like the Ethereum Virtual Machine (EVM), which uses a read-write memory model. In contrast, Cairo's memory model prioritizes efficiency in proof generation. As a result, it requires only 5 trace cells per memory access.

Another way to think about this is that the effective cost of using Cairo's memory is from the number of memory accesses, rather than the number of memory addresses used. Consequently, rewriting to an existing memory cell incurs a similar cost to writing to a new one.

This memory model is particularly useful for proving the correctness of a program. It's easier to describe constraints on the values of memory when these values can only be set once, rather than expressing the same constraints on a read-write memory model, where the value of a memory cell is dependent on the "execution time".
