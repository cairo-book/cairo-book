# Output Builtin

In the Cairo Virtual Machine (VM), the **Output Builtin** is a built-in component that manages the output segment of the memory via the `output_ptr`. It's used as a bridge between a Cairo program's execution and the external world, using **public memory** to produce verifiable outputs.

Represented by the `output_ptr`, the output builtin handles a dedicated memory region where a program writes its outputs. Its primary role is to store any value that must be made available in the proof system for verification, in what we call **public memory**. This segment grows as the program writes values.

## Memory Organization

The output segment is a contiguous block of cells starting at a base address. All cells in the output segment are inherently public, accessible to verifiers. It's interactions are quite simple: it can be written to, and read from, without any specific requirements.

## Role in STARK Proofs

The Output Builtin’s integration with public memory is required for STARK proof construction and verification:

1. **Public Commitment**: Values written to `output_ptr` become part of the public memory, committing the program to those outputs in the proof.
2. **Proof Structure**: The output segment is included in the public input of a trace, with its boundaries tracked (e.g., `begin_addr` and `stop_ptr`) for verification.
3. **Verification Process**: The verifier extracts and hashes the output segment. Typically, all cells in the output segment are hashed together, creating a commitment which allows efficient verification without re-execution.

## Implementation References

These implementation references of the Output Builtin in various Cairo VM implementations:

- [TypeScript Output Builtin](https://github.com/kkrt-labs/cairo-vm-ts/blob/main/src/builtins/output.ts#L4)
- [Python Output Builtin](https://github.com/starkware-libs/cairo-lang/blob/0e4dab8a6065d80d1c726394f5d9d23cb451706a/src/starkware/cairo/lang/vm/output_builtin_runner.py)
