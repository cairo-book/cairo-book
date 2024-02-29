# Comments

All programmers strive to make their code easy to understand, but sometimes extra explanation is warranted. In these cases, programmers leave comments in their source code that the compiler will ignore but people reading the source code may find useful.

Here’s a simple comment:

```rust
// hello, world
```

In Cairo, the idiomatic comment style starts a comment with two slashes, and the comment continues until the end of the line. For comments that extend beyond a single line, you’ll need to include `//` on each line, like this:

```rust
// So we’re doing something complicated here, long enough that we need
// multiple lines of comments to do it! Whew! Hopefully, this comment will
// explain what’s going on.
```

Comments can also be placed at the end of lines containing code:

<span class="filename">Filename: src/lib.cairo</span>

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_23_comments/src/lib.cairo}}
```

But you’ll more often see them used in this format, with the comment on a separate line above the code it’s annotating:

<span class="filename">Filename: src/lib.cairo</span>

```rust
{{#include ../listings/ch02-common-programming-concepts/no_listing_23_comments_2/src/lib.cairo}}
```
