# Poseidon Builtin

The *Poseidon* builtin is dedicated to computing the Poseidon hash in Cairo VM. It is specifically designed for efficient computation in algebraic circuits and is a core component in StarkNet's cryptographic operations.
It uses the Hades permutation strategy, which combines full rounds and partial rounds to achieve both security and efficiency in zero-knowledge STARK proofs. It's use in Cairo is explained on section 11.4 [Working with Hashes](ch12-04-hash.md).

## Hash State Implementation
The Poseidon hash maintains an internal state of three field elements (s0, s1, s2) and a boolean flag (odd):
```cairo
pub struct HashState {
    pub s0: felt252,
    pub s1: felt252,
    pub s2: felt252,
    pub odd: bool,
}
```

The state is initialized with all values set to 0. The s2 field remains constant (0) throughout the hash computation while s0 and s1 are updated based on input values.

## Cells organization

The Poseidon builtin has its own segment during a Cairo VM run. It follows a deduction property where input cells store the values to be hashed, and output cells store the computed hash results. The input cells must store felts, relocatable values are forbidden. It makes sense as you cannot compute the hash of a pointer. The output cell is deduced from the input cells. Once an instruction tries reading the cell, the Poseidon hash is computed using the Hades permutation and written to the cell. 

The Poseidon builtin operates in instances of 6 cells during VM execution. Each instance contains:
- Three input cells [0-2] for the Hades permutation inputs
- Three output cells [3-5] for storing computed hash results

Let's examine two snapshots of a Poseidon segment during the execution of a dummy program by the Cairo VM.

In the first snapshot, we see both single-value and sequence hashing:

<div align="center">
  <img src="poseidon-builtin-valid.png" alt="valid poseidon builtin segment" width="600px"/>
</div>
<div align="center">
  <span class="caption">Snapshot 1 - Poseidon builtin segment with valid inputs</span>
</div>

When hashing a value 42, the computation proceeds as:
1. Value is added to initial state (s0 = 42)
2. During finalization: `hades_permutation(43, 0, 0)` is computed (s0 + 1, s1, s2)
3. First element of permutation result becomes the hash i.e. cell `3:3`

For sequence [73, 91]:
1. First value updates s0 = 73
2. Second value updates s1 = 91
3. During finalization: `hades_permutation(73, 91, 0)` is computed (s0, s1+1, s2)
4. All three output states are stored in respective sequential cells for further rounds

In the second snapshot, we see error conditions:

<div align="center">
  <img src="poseidon-builtin-error.png" alt="invalid poseidon builtin segment" width="300px"/>
</div>
<div align="center">
  <span class="caption">Snapshot 1 - Poseidon builtin segment with invalid input</span>
</div>

When trying to read `3:3`, an error occurs because the input in `3:0` is a relocatable value (pointer to cell `7:1`). The Poseidon builtin cannot hash relocatable values - it only operates on field elements.

The error manifests when the output cell is read. In the case with the relocatable value, this could be caught earlier if the input cells were validated as being felts only.

## Implementation References

These implementation references of the Poseidon builtin might not be exhaustive.

* [Typescript Poseidon Builtin](https://github.com/kkrt-labs/cairo-vm-ts/blob/58fd07d81cff4a4bb45c30ab99976ba66f0576ad/src/builtins/poseidon.ts)
* [Python Poseidon Builtin](https://github.com/starkware-libs/cairo-lang/blob/0e4dab8a6065d80d1c726394f5d9d23cb451706a/src/starkware/cairo/lang/builtins/poseidon/poseidon_builtin_runner.py)
* [Rust Poseidon Builtin](https://github.com/lambdaclass/cairo-vm/blob/052e7cef977b336305c869fccbf24e1794b116ff/vm/src/vm/runners/builtin_runner/poseidon.rs)
* [Go Poseidon Builtin](https://github.com/NethermindEth/cairo-vm-go/blob/dc02d614497f5e59818313e02d2d2f321941cbfa/pkg/vm/builtins/poseidon.go)
* [Zig Poseidon Builtin](https://github.com/keep-starknet-strange/ziggy-starkdust/blob/55d83e61968336f6be93486d7acf8530ba868d7e/src/vm/builtins/builtin_runner/poseidon.zig)

## Resources on Poseidon Hash

If you're interested about the Poseidon hash and its use, take a look at those references:

* StarkNet - [Hash Functions: Poseidon Hash](https://docs.starknet.io/architecture-and-concepts/cryptography/hash-functions/#poseidon-hash)
* StarkWare - [Poseidon](https://github.com/starkware-industries/poseidon/tree/main)
* [Poseidon Journal](https://autoparallel.github.io/overview/index.html)
* [Poseidon: ZK-friendly Hashing](https://www.poseidon-hash.info/)