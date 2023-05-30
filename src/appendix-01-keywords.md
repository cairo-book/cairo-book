## Appendix A: Keywords

The following list contains keywords that are reserved for current or future
use by the Cairo language.

There are three keyword categories:

- strict
- reserved

---

### Strict keywords

These keywords can only be used in their correct contexts.
They cannot be used as names of any items.

- `as` - Rename import
- `break` - Exit a loop immediately
- `const` - Define constant items
- `continue` - Continue to the next loop iteration
- `else` - Fallback for `if` and `if let` control flow constructs
- `enum` - Define an enumeration
- `extern` - Function defined at the compiler level using hint available at cairo1 level with this declaration
- `false` - Boolean false literal
- `fn` - Define a function
- `if` - Branch based on the result of a conditional expression
- `impl` - Implement inherent or trait functionality
- `implicits` - Special kind of function parameters that are required to perform certain actions
- `let` - Bind a variable
- `loop` - Loop unconditionally
- `match` - Match a value to patterns
- `mod` - Define a module
- `mut` - Denote variable mutability
- `nopanic` - Functions marked with this notation mean that the function will never panic.
- `of` - Implement a trait
- `ref` - Bind by reference
- `return` - Return from function
- `struct` - Define a structure
- `trait` - Define a trait
- `true` - Boolean true literal
- `type` - Define a type alias
- `use` - Bring symbols into scope

---

### Reserved keywords

These keywords aren't used yet, but they are reserved for future use.
They have the same restrictions as strict keywords.
The reasoning behind this is to make current programs forward compatible with future versions of
Cairo by forbidding them to use these keywords.

- `assert`
- `do`
- `dyn`
- `macro`
- `move`
- `Self`
- `self`
- `static_assert`
- `static`
- `super`
- `try`
- `typeof`
- `unsafe`
- `where`
- `while`
- `with`
- `yield`
