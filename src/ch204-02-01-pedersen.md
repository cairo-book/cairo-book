# Pedersen Builtin

The _Pedersen_ builtin is dedicated to computing the Pedersen hash of two field elements (felts). It provides an efficient, native implementation of this cryptographic hash function within the Cairo VM. For a guide on using hashes in Cairo programs, see section 11.4 [Working with Hashes](ch12-04-hash.md).

## Cells Organization

The Pedersen builtin has its own dedicated segment during a Cairo VM run. It follows a deduction property pattern and is organized in _triplets of cells_ - two input cells and one output cell:

- **Input cells**: Must store field elements (felts); relocatable values (pointers) are forbidden. This restriction makes sense because computing the hash of a memory address is not well-defined in this context.
- **Output cell**: The value is deduced from the input cells. When an instruction tries to read this cell, the VM computes the Pedersen hash of the two input cells and writes the result to the output cell.

Let's examine two snapshots of a Pedersen segment during the execution of a program by the Cairo VM:

In the first snapshot, we see two triplets in different states:

<div align="center">
  <img src="pedersen-builtin-valid.png" alt="valid pedersen builtin segment" width="300px"/>
</div>
<div align="center">
  <span class="caption">Snapshot 1 - Pedersen builtin segment with valid inputs</span>
</div>

- **First triplet** (cells 3:0, 3:1, 3:2): All three cells contain felts. The value in cell 3:2 (output) has been computed because this cell has been read during program execution, which triggered the Pedersen hash computation of inputs 15 and 35.
- **Second triplet** (cells 3:3, 3:4, 3:5): Only the input cells have been filled with values 93 and 5. The output cell 3:5 remains empty because it hasn't been read yet, so the Pedersen hash of 93 and 5 hasn't been computed yet.

In the second snapshot, we see two cases that would cause errors when attempting to read the output cell:

<div align="center">
  <img src="pedersen-builtin-error.png" alt="Invalid pedersen builtin segment" width="300px"/>
</div>
<div align="center">
  <span class="caption">Snapshot 2 - Pedersen builtin segment with invalid inputs</span>
</div>

1. **First triplet**: Reading cell 3:2 would throw an error because one of the input cells (3:0) is empty. The VM cannot compute a hash with missing input data.

2. **Second triplet**: Reading cell 3:5 would throw an error because one of the input cells (3:4) contains a relocatable value pointing to cell 1:7. The Pedersen builtin can only hash field elements, not memory addresses.

Note that these errors only manifest when the output cell is read. For the second case, a more robust implementation could validate the input cells when they're written, rejecting relocatable values immediately rather than waiting until the hash computation is attempted.

## Implementation References

These implementation references of the Pedersen builtin in various Cairo VM implementations:

- [TypeScript Pedersen Builtin](https://github.com/kkrt-labs/cairo-vm-ts/blob/58fd07d81cff4a4bb45c30ab99976ba66f0576ad/src/builtins/pedersen.ts#L4)
- [Python Pedersen Builtin](https://github.com/starkware-libs/cairo-lang/blob/0e4dab8a6065d80d1c726394f5d9d23cb451706a/src/starkware/cairo/lang/builtins/hash/hash_builtin_runner.py)
- [Rust Pedersen Builtin](https://github.com/lambdaclass/cairo-vm/blob/41476335884bf600b62995f0c005be7d384eaec5/vm/src/vm/runners/builtin_runner/hash.rs)
- [Go Pedersen Builtin](https://github.com/NethermindEth/cairo-vm-go/blob/dc02d614497f5e59818313e02d2d2f321941cbfa/pkg/vm/builtins/pedersen.go)
- [Zig Pedersen Builtin](https://github.com/keep-starknet-strange/ziggy-starkdust/blob/55d83e61968336f6be93486d7acf8530ba868d7e/src/vm/builtins/builtin_runner/hash.zig)

## Resources on Pedersen Hash

If you're interested in the Pedersen hash function and its applications in cryptography:

- StarkNet, [Hash Functions - Pedersen Hash](https://docs.starknet.io/architecture-and-concepts/cryptography/hash-functions/#pedersen-hash)
- nccgroup, [Breaking Pedersen Hashes in Practice](https://research.nccgroup.com/2023/03/22/breaking-pedersen-hashes-in-practice/), 2023, March 22
- Ryan S., [Pedersen Hash Function Overview](https://rya-sge.github.io/access-denied/2024/05/07/pedersen-hash-function/), 2024, May 07
