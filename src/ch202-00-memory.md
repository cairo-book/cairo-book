# Memory

In most computing systems, memory is primarily used to store temporary values
during program execution. However, in CairoVM, the memory model also plays a
crucial role in proof generation by defining how memory accesses are recorded in
trace cells. To optimize proof generation, Cairo's memory model is designed to
efficiently represent memory values, streamlining the STARK proving process.

In this chapter, we will explore Cairo's unique memory model and examine how its
structure enhances proof generation process.
