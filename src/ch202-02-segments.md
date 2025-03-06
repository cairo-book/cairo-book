# Segments

When a Cairo program is running, for every new call stack, new memory address are being allocated. However, as used memory addresses cannot be reused, more memory addresses has to be allocated as Cairo memory is immutable.

During program execution, Cairo structures used memory addresses into segments which groups memory addresses into sections with the starting address having a unique identifiable number and a offset to list memory addresses belonging to each segment. In this process, we are temporary marking the memory addresses as *relocatable* segments.  Once the program has finished executing, the marked addresses will be used to relocate all the segments to a single, contiguous memory address space. We will have a separate section to understand how relocation works. For now, let's understand each individual segment and its general layout. 

Cairo supports the following segments:

- **Program Segment** = Stores the bytecode of Cairo program. Another way to say is it stores the instructions of a cairo program. Program Counter, `pc` starts at the beginning of this segment.  
- **Execution Segment** = Stores any data while executing a Cairo program (variables, return pointer to the next unused memory address). Allocation pointer, `ap` and frame pointer, `fp` starts on this segment. 
- **Builtin Segment** = Stores builtins that is actively used by the Cairo program. Each builtin has its own segment and the type of program determines which builtins to be used. Check out the common builtins in the [Builtin Section](ch204-00-builtins.md) to learn individual builtins. 
- **User Segment** = Stores general purpose segments such as user defined data structures. 

*Every segment except Program segment has a dynamic address space which means that the length of the used memory address space is unknown until the program has finished executing. The Program segment is an exception as it is used to store the bytecode of the Cairo program which has a known fixed size during execution.*

# Segment Layout


