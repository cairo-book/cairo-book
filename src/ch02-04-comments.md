# Comments

In Cairo programs, you can include explanatory text within the code using comments. To create a comment, use the `//` syntax, after which any text on the same line will be ignored by the compiler. This means comments can be placed at the beginning of a new line, or at the end of lines containing code:

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_23_comments/src/lib.cairo}}
```

For comments that extend beyond a single line, you’ll need to include `//` on each line, as follows:

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_23_comments_2/src/lib.cairo}}
```