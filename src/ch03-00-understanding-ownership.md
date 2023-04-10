# Understanding Cairo's linear type system

Cairo is a language built around a linear type system that allows us to
statically ensure that in every Cairo program, a value is used exactly once.
This is achieved by implementing an ownership system
and forbidding copying and dropping values by default. In this chapter, we’ll
talk about Cairo's ownership system as well as references and snapshots.
