## Appendix A: Keywords

The following list contains keywords that are reserved for current or future
use by the Cairo language.

There are three keyword categories:

- strict
- reserved
- contextual

---

### Strict keywords

These keywords can only be used in their correct contexts.
They cannot be used as names of any items.

- `as` - perform primitive casting, disambiguate the specific trait containing
- `const` - define constant items or constant raw pointers
- `false` - Boolean false literal
- `true` - Boolean true literal
- `extern` - link an external function or variable
- `type` - define a type alias or associated type
- `fn` - define a function or the function pointer type
- `trait` - define a trait
- `impl` - implement inherent or trait functionality
- `of` - implement a trait
- `mod` - define a module
- `struct` - define a structure
- `enum` - define an enumeration
- `let` - bind a variable
- `return` - return from function
- `match` - match a value to patterns
- `if` - branch based on the result of a conditional expression
- `loop` - loop unconditionally
- `continue` - continue to the next loop iteration
- `break` - exit a loop immediately
- `else` - fallback for `if` and `if let` control flow constructs
- `use` - bring symbols into scope
- `ref` - bind by reference
- `mut` - denote mutability in references, raw pointers, or pattern bindings
- `nopanic` - Functions marked with this notation, means that the function will never panic.
<!-- need help for impliccit -->
- `implicits`

---

### Reserved keywords

These keywords aren't used yet, but they are reserved for future use.
They have the same restrictions as strict keywords.
The reasoning behind this is to make current programs forward compatible with future versions of
Cairo by forbidding them to use these keywords.

- `as`
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

---

### Contextual keywords

Some grammar productions may make use of new keywords not listed here. Such keywords have special meaning only in these certain contexts. Outside these places, these character sequences are treated as regular identifiers, thus it is possible to declare a function or variable with such names.

### [NOTE]

### No contextual keywords are in use as for now.
