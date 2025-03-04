# Segments

When a Cairo program is running, for every new call stack, new memory address are being allocated. However, these memory addresses cannot be reused and more memory addresses has to be allocated as Cairo memory is immutable.  

This leads to Cairo memory utilizing segments which organizes instances of memory addresses into sections with a unique identifiable number and the offset to indicate the memory address falling under each segment. 
- The whitepaper addresses segments as a pair `(s, t)` where `s` is the segment identifier and `t` that specifies the offset within the segment. 

*Every segment except Program Segment has a dynamic address space which means that the used memory address length is unknown until the program has finished executing.*

Cairo contains the following segments:

- Program Segment = Bytecode of the Cairo program resides. Another way to say is it stores the instructions of a cairo program. Program Counter, `PC` starts at the beginning of this segment.  
- Execution Segment = Any data while executing a Cairo program (variables, return pointer to the next unused memory address) is stored here. Allocation pointer, `ap` and frame pointer, `fp` starts on this segment. 
- Builtin Segment = Every builtin receives its own memory and the types of builtins can differ for every program execution. Check out the common builtins in the [Builtin Section](ch204-00-builtins.md) to learn more. 
- User Segment = General purpose segments such as user defined data structures are defined here. 


 Cairo programs can run with different layout configurations depending on the program's builtin requirements however, the general structure remains the same. At a high level, it is arranged like


