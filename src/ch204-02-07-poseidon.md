# Poseidon Builtin

The _Poseidon_ builtin computes cryptographic hashes using the Poseidon hash function, which is specifically optimized for zero-knowledge proofs and efficient computation in algebraic circuits. As a core component in Cairo's cryptographic operations, it uses the Hades permutation strategy that combines full rounds and partial rounds to achieve both security and performance within STARK proofs.

Poseidon is particularly important for Cairo applications because it offers:

- Better performance than Pedersen for multiple inputs
- ZK-friendly design (optimized for constraints in ZK proof systems)
- Strong cryptographic security properties

## Cells Organization

The Poseidon builtin operates with a dedicated memory segment and follows a deduction property pattern:

| Cells              | Purpose                                 |
| ------------------ | --------------------------------------- |
| Input cells [0-2]  | Store input state for Hades permutation |
| Output cells [3-5] | Store computed permutation results      |

Each operation works with 6 consecutive cells - a block of 3 inputs followed by 3 outputs. When a program reads any output cell, the VM applies the Hades permutation to the input cells and populates all three output cells with the results.

### Single Value Hashing Example

<div align="center">
  <img src="poseidon-builtin-valid.png" alt="valid poseidon builtin segment" width="600px"/>
</div>
<div align="center">
  <span class="caption">Poseidon builtin segment with valid inputs</span>
</div>

For hashing a single value (42) in the first instance:

1. The program writes the value to the first input cell (position 3:0)
2. The other input cells remain at their default value (0)
3. When reading the output cell (3:3), the VM:
   - Takes the initial state (42, 0, 0)
   - Applies padding: (42+1, 0, 0) = (43, 0, 0)
   - Computes the Hades permutation
   - Stores the result in output cell 3:3

The permutation result's first component becomes the hash output when hashing a single value.

### Sequence Hashing Example

For hashing a sequence of values (73, 91) in the second instance:

1. The program writes values to the first two input cells (positions 3:6 and 3:7)
2. Upon reading any output cell, the VM:
   - Takes the state (73, 91, 0)
   - Applies appropriate padding: (73, 91+1, 0)
   - Computes the Hades permutation
   - Stores all three results in the output cells (3:9, 3:10, 3:11)

When hashing sequences, all three output state components may be used for further computation or chaining in multi-round hashing.

### Error Condition

<div align="center">
  <img src="poseidon-builtin-error.png" alt="invalid poseidon builtin segment" width="300px"/>
</div>
<div align="center">
  <span class="caption">Poseidon builtin segment with invalid input</span>
</div>

In this error example:

- The program attempts to write a relocatable value (pointer to cell 7:1) to input cell 3:0
- When trying to read output cell 3:3, the VM throws an error
- The error occurs because the Poseidon builtin can only operate on field elements, not memory addresses

Input validation occurs at the time the output is read, rather than when inputs are written, which is consistent with the deduction property pattern.

## Implementation References

These implementation references of the Poseidon builtin in various Cairo VM implementations:

- [TypeScript Poseidon Builtin](https://github.com/kkrt-labs/cairo-vm-ts/blob/58fd07d81cff4a4bb45c30ab99976ba66f0576ad/src/builtins/poseidon.ts)
- [Python Poseidon Builtin](https://github.com/starkware-libs/cairo-lang/blob/0e4dab8a6065d80d1c726394f5d9d23cb451706a/src/starkware/cairo/lang/builtins/poseidon/poseidon_builtin_runner.py)
- [Rust Poseidon Builtin](https://github.com/lambdaclass/cairo-vm/blob/052e7cef977b336305c869fccbf24e1794b116ff/vm/src/vm/runners/builtin_runner/poseidon.rs)
- [Go Poseidon Builtin](https://github.com/NethermindEth/cairo-vm-go/blob/dc02d614497f5e59818313e02d2d2f321941cbfa/pkg/vm/builtins/poseidon.go)
- [Zig Poseidon Builtin](https://github.com/keep-starknet-strange/ziggy-starkdust/blob/55d83e61968336f6be93486d7acf8530ba868d7e/src/vm/builtins/builtin_runner/poseidon.zig)

## Resources on Poseidon Hash

If you're interested in the Poseidon hash function and its applications:

- [StarkNet - Hash Functions: Poseidon Hash](https://docs.starknet.io/architecture-and-concepts/cryptography/hash-functions/#poseidon-hash)
- [StarkWare - Poseidon Implementation](https://github.com/starkware-industries/poseidon/tree/main)
- [Poseidon: A New Hash Function for Zero-Knowledge Proof Systems](https://eprint.iacr.org/2019/458.pdf) (original paper)
- [Poseidon: ZK-friendly Hashing](https://www.poseidon-hash.info/)
- [Poseidon Journal](https://autoparallel.github.io/overview/index.html)
