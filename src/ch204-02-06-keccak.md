# Keccak Builtin

The _Keccak_ builtin computes the new state `s'` after applying the 24 rounds of the keccak-f1600 block permutation on a given state `s`.

## Cells organization

The Keccak builtin has its own segment during a Cairo VM run which is organized by blocks of 16 cells.

- The 8 first cells are used to store the input state `s`. The state is a 1600-bit array, so each cell stores 200 bits.
- The 8 next cells are used to store the output state `s'`. The state is a 1600-bit array, so each cell stores 200 bits.

Here is the expected hash of the input state `s` [0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]:

<div align="center">
  <img src="keccak-segment.png" alt="keccak builtin segment"/>
</div>
<div align="center">
  <span class="caption">Keccak builtin segment</span>
</div>

## Implementation References

These implementation references of the keccak builtin might not be exhaustive.

- [TypeScript Keccak Builtin](https://github.com/kkrt-labs/cairo-vm-ts/blob/58fd07d81cff4a4bb45c30ab99976ba66f0576ad/src/builtins/keccak.ts)
- [Python Keccak Builtin](https://github.com/starkware-libs/cairo-lang/blob/0e4dab8a6065d80d1c726394f5d9d23cb451706a/src/starkware/cairo/lang/builtins/keccak/keccak_builtin_runner.py)
- [Rust Keccak Builtin](https://github.com/lambdaclass/cairo-vm/blob/41476335884bf600b62995f0c005be7d384eaec5/vm/src/vm/runners/builtin_runner/keccak.rs)
- [Go Keccak Builtin](https://github.com/NethermindEth/cairo-vm-go/blob/dc02d614497f5e59818313e02d2d2f321941cbfa/pkg/vm/builtins/keccak.go)
- [Zig Keccak Builtin](https://github.com/keep-starknet-strange/ziggy-starkdust/blob/55d83e61968336f6be93486d7acf8530ba868d7e/src/vm/builtins/builtin_runner/keccak.zig)

## Resources on Keccak Hash

If you're interested about the Keccak hash and its use, take a look at those references:

- StarkNet, [Hash Functions - Starknet Keccak](https://docs.starknet.io/architecture-and-concepts/cryptography/hash-functions/#starknet_keccak)
- Wikipedia, [SHA-3 (Secure Hash Algorithm 3)](https://en.wikipedia.org/wiki/SHA-3)
