## Appendix A: Keywords

The following list contains keywords that are reserved for current or future
use by the Cairo language.

There are two keyword categories:

- strict
- reserved

There is a third category, which are functions from the core library. While their names are not reserved,
they are not recommended to be used as names of any items to follow good practices.

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
- `of` - Implementation a trait
- `ref` - Parameter passed implicitly returned at the end of a function
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

- `Self`
- `assert`
- `do`
- `dyn`
- `for`
- `hint`
- `in`
- `macro`
- `move`
- `pub`
- `static_assert`
- `self`
- `static`
- `super`
- `try`
- `typeof`
- `unsafe`
- `where`
- `while`
- `with`
- `yield`

---

### Built-in functions

The Cairo programming language provides several specific functions that serve a special purpose. We will not cover all of them in this book, but using the names of these functions as names of other items is not recommended.

-`assert` - This function checks a boolean expression, and if it evaluates to false, it triggers the panic function. -`panic` - This function terminates the program.
