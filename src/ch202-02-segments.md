# Introduction to Segments

Cairo ensures that allocated memory remains immutable after being written to,
while allowing dynamic expansion of memory segments at runtime. All this is
possible with organizing memory addresses into **segments**.

The process of organizing memory addresses into segments is as follows:

1. During runtime, It groups allocated memory addresses into segments with a
   unique segment identifier and an offset to indicate the continuation of the
   memory addresses belonging to each segment, `<segment_id>:<offset>`. This
   temporary value that we are marking to each memory address is called a
   **relocatable value**.

2. At the end of execution, the relocatable values are transformed into a
   single, contiguous memory address space and a separate **relocation table**
   is created to give context to the linear memory address space.

## Segment Values

Cairo's memory model contains the following segments:

- **Program Segment** = Stores the bytecode of Cairo program. Another way to say
  is it stores the instructions of a cairo program. Program Counter, `pc` starts
  at the beginning of this segment.
- **Execution Segment** = Stores any data while executing a Cairo program
  (temporary variables, function call frames, and pointers). Allocation pointer,
  `ap` and frame pointer, `fp` starts on this segment.
- **Builtin Segment** = Stores builtins that is actively used by the Cairo
  program. Each Cairo builtin has its own dedicated segment, allocated
  dynamically based on the builtins used in the program. Check out
  [Builtin Section](ch204-00-builtins.md) to learn more about individual
  builtins.
- **User Segment** = Stores program outputs, arrays, and dynamically allocated
  data structures.

_Every segment except Program Segment has a dynamic address space which means
that the length of the allocated memory address space is unknown until the
program has finished executing. The Program Segment is an exception as it is
used to store the bytecode of the Cairo program which has a fixed size during
execution._

## Segment Layout

The layout of Cairo memory is ordered by segments in the following order:

1. **Segment 0** = Program Segment
2. **Segment 1** = Execution Segment
3. **Segment 2 to x** = Builtin Segments
4. **Segment x + 1 to y** = User Segments

_The number of builtin and user segments are dynamic and depends on the type of
program._

# Relocation

To understand the overall process of how memory is handled throughout the
execution of a Cairo program, we will be looking at an example of Cairo Zero
program and how its segments are defined during runtime with relocatable values
and how the memory addresses are relocated to one contiguous memory address
space at the end of execution.

**Cairo Zero program:**

```cairo
%builtins output

func main(output_ptr: felt*) -> (output_ptr: felt*) {

    // We are allocating three different values to segment 1.
    [ap] = 10, ap++;
    [ap] = 100, ap++;
    [ap] = [ap - 2] + [ap - 1], ap++;

    // We set value of output_ptr to the address of where the output will be stored.
    // This is part of the output builtin requirement.
    [ap] = output_ptr, ap++;

    // Asserts that output_ptr equals to 110.
    assert [output_ptr] = 110;

    // Returns the output_ptr + 1 as the next unused memory address.
    return (output_ptr=output_ptr + 1);
}
```

_The output builtin allows the final output to be stored in a new segment._

The Cairo Zero program stores three values which are `10`, `100` and
`110`(addition of `10` and `100`) and these values are stored in three different
memory addresses under Segment 1.

Using the output builtin, the final output is stored in a new segment in
Segment 2.

**The relocatable values are :**

```
Addr  Value
-----------

// Segment 0

0:0   5189976364521848832
0:1   10
0:2   5189976364521848832
0:3   100
0:4   5201798304953696256
0:5   5191102247248822272
0:6   5189976364521848832
0:7   110
0:8   4612389708016484351
0:9   5198983563776458752
0:10  1
0:11  2345108766317314046
⋮
// Segment 1

1:0   2:0
1:1   3:0
1:2   4:0
1:3   10
1:4   100
1:5   110
1:6   2:0
1:7   110
1:8   2:1
⋮
// Segment 2

2:0   110

```

Once the program is finished executing,the relocatable values turn into one
contiguous memory address space with the help of the relocation table to give
context to the linear memory address space.

**From relocation value to one contiguous memory address space:**

```
Addr  Value
-----------
1     5189976364521848832
2     10
3     5189976364521848832
4     100
5     5201798304953696256
6     5191102247248822272
7     5189976364521848832
8     110
9     4612389708016484351
10    5198983563776458752
11    1
12    2345108766317314046
13    22
14    23
15    23
16    10
17    100
18    110
19    22
20    110
21    23
22    110
```

**Relocation table:**

```
segment_id  starting_index
----------------------------
0            1
1            13
2            22
3            23
4            23
```

The relocation table gives context for the prover on which index a new segment
starts by labeling the segment identifier with its own starting index.
