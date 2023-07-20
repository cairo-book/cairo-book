# Appendix B: Operators and Symbols

This appendix includes a glossary of Cairo's syntax.

## Operators

Table B-1 contains the operators in Cairo, an example of how the operator would appear in context, a short explanation, and whether that operator is overloadable. If an operator is overloadable, the relevant trait to use to overload that operator is listed.

<span class="caption">Table B-1: Operators</span>

| Operator | Example | Explanation | Overloadable? |
|----------|---------|-------------|---------------|
| `!` | `!expr` | Bitwise or logical complement | `Not` |
| `!=` | `expr != expr` | Non-equality comparison | `PartialEq` |
| `%` | `expr % expr` | Arithmetic remainder | `Rem` |
| `%=` | `var %= expr` | Arithmetic remainder and assignment | `RemEq` |
| `&` | `expr & expr` | Bitwise AND | `BitAnd` |
| `&&` | `expr && expr` | Short-circuiting logical AND | |
| `*` | `expr * expr` | Arithmetic multiplication | `Mul` |
| `*=` | `var *= expr` | Arithmetic multiplication and assignment | `MulEq` |
| `@` | `@var` | Snapshot | |
| `*` | `*var` | Desnap | |
| `+` | `expr + expr` | Arithmetic addition | `Add` |
| `+=` | `var += expr` | Arithmetic addition and assignment | `AddEq` |
| `,` | `expr, expr` | Argument and element separator | |
| `-` | `-expr` | Arithmetic negation | `Neg` |
| `-` | `expr - expr` | Arithmetic subtraction | `Sub` |
| `-=` | `var -= expr` | Arithmetic subtraction and assignment | `SubEq` |
| `->` | `fn(...) -> type`, <code>&vert;...&vert; -> type</code> | Function and closure return type | |
| `.` | `expr.ident` | Member access | |
| `/` | `expr / expr` | Arithmetic division | `Div` |
| `/=` | `var /= expr` | Arithmetic division and assignment | `DivEq` |
| `:` | `pat: type`, `ident: type` | Constraints | |
| `:` | `ident: expr` | Struct field initializer | |
| `;` | `expr;` | Statement and item terminator | |
| `<` | `expr < expr` | Less than comparison | `PartialOrd` |
| `<=` | `expr <= expr` | Less than or equal to comparison | `PartialOrd` |
| `=` | `var = expr` | Assignment | |
| `==` | `expr == expr` | Equality comparison | `PartialEq` |
| `=>` | `pat => expr` | Part of match arm syntax | |
| `>` | `expr > expr` | Greater than comparison | `PartialOrd` |
| `>=` | `expr >= expr` | Greater than or equal to comparison | `PartialOrd` |
| `^` | `expr ^ expr` | Bitwise exclusive OR | `BitXor` |
| <code>&vert;</code> | <code>expr &vert; expr</code> | Bitwise OR | `BitOr` |
| <code>&vert;&vert;</code> | <code>expr &vert;&vert; expr</code> | Short-circuiting logical OR | |

## Non Operator Symbols

The following list contains all symbols that are not used as operators; that is, they do not have the same behavior as a function or method call.

Table B-2 shows symbols that appear on their own and are valid in a variety of locations.

<span class="caption">Table B-2: Stand-Alone Syntax</span>

| Symbol | Explanation |
|--------|-------------|
| `..._u8`, `..._usize`, etc. | Numeric literal of specific type |
| `'...'` | Short string |
| `_` | “Ignored” pattern binding; also used to make integer literals readable |

Table B-3 shows symbols that are used within the context of a module hierarchy path to access an item.

<span class="caption">Table B-3: Path-Related Syntax</span>

| Symbol | Explanation |
|--------|-------------|
| `ident::ident` | Namespace path |
| `super::path` | Path relative to the parent of the current module |
| `trait::method(...)` | Disambiguating a method call by naming the trait that defines it |

Table B-4 shows symbols that appear in the context of using generic type parameters.

<span class="caption">Table B-4: Generics</span>

| Symbol | Explanation |
|--------|-------------|
| `path<...>` | Specifies parameters to generic type in a type (e.g., `Vec<u8>`) |
| `path::<...>`, `method::<...>` | Specifies parameters to generic type, function, or method in an expression; often referred to as turbofish |
| `fn ident<...> ...` | Define generic function |
| `struct ident<...> ...` | Define generic structure |
| `enum ident<...> ...` | Define generic enumeration |
| `impl<...> ...` | Define generic implementation |

Table B-5 shows symbols that appear in the context of calling or defining macros and specifying attributes on an item.

<span class="caption">Table B-5: Macros and Attributes</span>

| Symbol | Explanation |
|--------|-------------|
| `#[meta]` | Outer attribute |

Table B-6 shows symbols that create comments.

<span class="caption">Table B-6: Comments</span>

| Symbol | Explanation |
|--------|-------------|
| `//` | Line comment |

Table B-7 shows symbols that appear in the context of using tuples.

<span class="caption">Table B-7: Tuples</span>


| Symbol | Explanation |
|--------|-------------|
| `()` | Empty tuple (aka unit), both literal and type |
| `(expr)` | Parenthesized expression |
| `(expr,)` | Single-element tuple expression |
| `(type,)` | Single-element tuple type |
| `(expr, ...)` | Tuple expression |
| `(type, ...)` | Tuple type |
| `expr(expr, ...)` | Function call expression; also used to initialize tuple `struct`s and tuple `enum` variants |

Table B-8 shows the contexts in which curly braces are used.

<span class="caption">Table B-8: Curly Brackets</span>

| Context | Explanation |
|---------|-------------|
| `{...}` | Block expression |
| `Type {...}` | `struct` literal |
