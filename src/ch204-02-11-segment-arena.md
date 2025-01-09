# Segment Arena Builtin

The _Segment Arena_ extends Cairo VM's memory handling by tracking segment endpoints. This approach simplifies memory operations where segments need to be allocated and finalized.

## Cells Organization

Each Segment Arena builtin instance works with blocks of 3 cells that maintain the state of dictionaries:

- First cell: Contains the base address of the info pointer
- Second cell: Contains the current number of allocated segments
- Third cell: Contains the current number of squashed/finalized segments

This structure works in close conjunction with an Info segment, which is also organized in blocks of 3 cells:

- First cell: Base address of the segment
- Second cell: End address of the segment (when squashed)
- Third cell: Current number of squashed segments (squashing index)

<div align="center">
  <img src="segment-arena.png" alt="segment arena builtin segment"/>
</div>
<div align="center">
  <span class="caption">Segment Arena builtin segment</span>
</div>

Let's take a look at two snapshots of a Segment Arena segment,
during the execution of a dummy program by the Cairo VM.

In the first snapshot, Let's look at first case when a dictionary is allocated:
- `info_ptr` points to new info segment
- `n_dicts` increments to 1
- Info segment created with three cells
- Dictionary gets new segment `<3:0>`

Now, In the second case one more dictionary is allocated:
- Info segment grows by three cells per dictionary
- Squashed dictionaries have end addresses set
- Squashing indices assigned sequentially
- Unfinished dictionaries have `0` end address

<div align="center">
  <img src="segment-arena-valid.png" alt="valid segment arena builtin segment"/>
</div>
<div align="center">
  <span class="caption">Snapshot 1 - Valid Segment Arena builtin segment</span>
</div>

The second snapshot shows two error conditions. In the first case, an invalid state occurs when `info_ptr` contains the _non-relocatable_ value `ABC`. The error is triggered when accessing the info segment. In the second case, the error occurs when there's an inconsistent state as shown in the snapshot, `n_squashed` is greater than `n_segments`.

<div align="center">
  <img src="segment-arena-error.png" alt="invalid segment arena builtin segment"/>
</div>
<div align="center">
  <span class="caption">Snapshot 2 - Invalid Segment Arena builtin segment</span>
</div>

### Key Validation Rules

The builtin enforces several critical rules:

- Each segment must be allocated and finalized exactly once
- All cell values must be valid field elements
- Segment sizes must be non-negative
- Squashing operations must maintain sequential order
- Info segment entries must correspond to segment allocations

## Implementation References

These implementation references of the Segment Arena builtin might not be exhaustive.

- [TypeScript Segment Arena Builtin](https://github.com/kkrt-labs/cairo-vm-ts/blob/58fd07d81cff4a4bb45c30ab99976ba66f0576ad/src/builtins/segmentArena.ts)
- [Rust Segment Arena Builtin](https://github.com/lambdaclass/cairo-vm/blob/41476335884bf600b62995f0c005be7d384eaec5/vm/src/vm/runners/builtin_runner/segment_arena.rs)
- [Zig Segment Arena Builtin](https://github.com/keep-starknet-strange/ziggy-starkdust/blob/55d83e61968336f6be93486d7acf8530ba868d7e/src/vm/builtins/builtin_runner/segment_arena.zig)