# Builtins

The Cairo whitepaper defines builtins as "predefined optimized low-level execution units".

In other words, builtins are logic blocks embedded in the Cairo architecture
to significantly enhance performance compared to defining the same logic using
Cairo's instruction set.

Builtins can be compared to Ethereum precompiles, primitive operations implemented
in the client's implementation language rather than using EVM opcodes.

The Cairo architecture does not specify a specific set of builtins,
they can be added or removed depending on our needs, which is why
different layouts exist. Builtins are adding constraints to the CPU AIR,
which will increase the verification time.

In this chapter, we'll see how builtins work, the builtins that exist
and their purposes.
