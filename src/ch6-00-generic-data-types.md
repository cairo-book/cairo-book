# Generic Data Types

Every programming language has tools for effectively handling the duplication of concepts. In Cairo, one such tool is generics: abstract stand-ins for concrete types or other properties. We can express the behaviour of generics or how they relate to other generics without knowing what will be in their place when compiling and running the code.

Functions, structs, enums and traits can incorporate generic types as part of their definition instead of a concrete types like `u32` or `ContractAddress`.

Generics allow us to replace specific types with a placeholder that represents multiple types with a placeholder that represents multiple types to remove code duplication. For each concrete type that replaces a generic type the compiler creates a new definition, saving time to the programmer, but code duplication at low level still exists. Note that if you are writing Starknet contracts and using a generic for multiple types, size will increase somehow, somewhat.

## Todo

On this chapter:

1. Give the why of generic data types

On functions

1. Give the syntaxis

2. Put an example using a Cairo array looking for it's length

3. Put an example looking for the largest element in the array (The need the partial eq trait)

On Structs:

1. Show structs with generic data types as well

2. Show structs with multiple generic data types

On enums:

1. Show the syntaxis

2. Probably merge this with structs

Finally Methods:

1. Show traits and the use of generics

2. How the impl handle those traits
