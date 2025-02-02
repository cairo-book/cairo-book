# Output Builtin

The Output builtin is dedicated to writing values to an output segment that can be read after the program execution completes. It serves as a way for Cairo programs to communicate results externally.

## Memory Organization

The Output builtin segment accepts both felt values and relocatable values. The segment's memory cells have no validation or deduction properties - any value that can be stored in Cairo memory can be written to an Output builtin cell.
The segment's memory is organized using a paging system that splits outputs into groups. Each group is identified by a page ID. In Starknet's implementation, this system enforces a maximum page size of 3800 values for on-chain data storage.

## Attribute System

The Output builtin implements an attribute system for memory segment metadata. These attributes, combined with page IDs, define how memory values should be deserialized. The attribute system encodes type information and structural metadata needed for correct interpretation of the segment's contents during proof verification.

Here are some examples of the Output segment during program execution:

### Snapshot 1 - Valid Output Builtin Usage


<div align="center">
  <img src="valid-sequential-output.png" alt="Valid Output Builtin Usage" height="350px"/>
</div>
<div align="center">
  <span class="caption">Snapshot 1 </span>
</div>


In this snapshot, the program has written three values sequentially. The remaining cells are unwritten but available for future outputs.



### Snapshot 2 - Invalid Output Builtin Usage


<div align="center">
  <img src="Invalid-sequential-output.png" alt="Invalid Output Builtin Usage" height="350px"/>
</div>
<div align="center">
  <span class="caption">Snapshot 2 </span>
</div>


This snapshot shows an invalid state where the program attempted to write to offset 2 before writing to offset 1. This will result in an error because outputs must be sequential.


## Implementation References

These implementation references of the Output builtin might not be exhaustive.

* [TypeScript Output Builtin](https://github.com/kkrt-labs/cairo-vm-ts/blob/58fd07d81cff4a4bb45c30ab99976ba66f0576ad/src/builtins/output.ts) 

* [Python Output Builtin](https://github.com/starkware-libs/cairo-lang/blob/0e4dab8a6065d80d1c726394f5d9d23cb451706a/src/starkware/cairo/lang/vm/output_builtin_runner.py)

* [Rust Output Builtin](https://github.com/lambdaclass/cairo-vm/blob/41476335884bf600b62995f0c005be7d384eaec5/vm/src/vm/runners/builtin_runner/output.rs)

* [Go Output Builtin](https://github.com/NethermindEth/cairo-vm-go/blob/dc02d614497f5e59818313e02d2d2f321941cbfa/pkg/vm/builtins/output.go)

* [Zig Output Builtin](https://github.com/keep-starknet-strange/ziggy-starkdust/blob/55d83e61968336f6be93486d7acf8530ba868d7e/src/vm/builtins/builtin_runner/output.zig)