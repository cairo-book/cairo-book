# Builtins

The Cairo whitepaper defines builtins as "predefined optimized low-level execution units".

In other words, builtins are logic blocks embedded in the Cairo architecture
to significantly enhance performance compared to defining the same logic in Cairo.

Builtins can be compared to Ethereum precompiles, which are part
of the Ethereum client specification rather than deployed smart contracts.

By embedded, we mean that a specific AIR for each builtin has been added to
the Cairo architecture to verify its correct usage within the proof.

In this chapter, we'll see how builtins work, the builtins that exist
and their purposes.
