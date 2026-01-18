# Authoring Guide for The Cairo Book

A comprehensive guide to writing high-quality, human-oriented educational
content for people learning Cairo. This guide synthesizes patterns from The
Cairo Book, The Rust Programming Language book, and established technical
writing best practices.

---

## Table of Contents

- [Philosophy](#philosophy)
- [Chapter Architecture](#chapter-architecture)
- [Writing Voice and Tone](#writing-voice-and-tone)
- [Teaching Methodology](#teaching-methodology)
- [Code Examples](#code-examples)
- [Explaining Code](#explaining-code)
- [Quizzes and Assessment](#quizzes-and-assessment)
- [Formatting Standards](#formatting-standards)
- [Chapter Checklist](#chapter-checklist)

---

## Philosophy

### The Reader Comes First

Every word, example, and explanation exists to serve the learner. Before writing
anything, ask:

- **"Will this help the reader understand?"** — Not "Is this technically
  complete?"
- **"Does this build on what they know?"** — Not "Does this cover every edge
  case?"
- **"Is this the right time for this concept?"** — Not "Should I mention this
  now?"

### Constructivist Learning

Readers learn best when they construct understanding through guided discovery
rather than passive reading. This means:

1. **Show before tell** — Present examples that create questions, then answer
   them
2. **Build incrementally** — Each concept connects to the previous one
3. **Normalize struggle** — Errors and confusion are part of learning
4. **Encourage experimentation** — Invite readers to modify and break code

### The "Campfire" Mentality

Imagine you're explaining Cairo to a colleague around a campfire. You wouldn't:

- Read from a specification
- Cover every edge case upfront
- Use formal academic language
- Assume they'll remember everything from page 1

You would:

- Tell stories about problems and solutions
- Use analogies and concrete examples
- Check understanding before moving on
- Circle back to reinforce important points

---

## Chapter Architecture

### Three-Part Book Structure

The Cairo Book uses a deliberate progression across three conceptual areas:

| Part                | Chapters  | Focus                  | Reader Level            |
| ------------------- | --------- | ---------------------- | ----------------------- |
| **Core Language**   | ch01-12   | Cairo fundamentals     | Beginner → Intermediate |
| **Smart Contracts** | ch100-104 | Starknet applications  | Intermediate            |
| **VM Internals**    | ch200-206 | Implementation details | Advanced                |

### Chapter Introduction Pattern

Every chapter (and major section) should open with:

1. **Context** — What is this topic and why does it matter?
2. **Connection** — How does it relate to what the reader already knows?
3. **Preview** — What will they learn and be able to do?

**Example from ch05:**

```markdown
A struct, or structure, is a custom data type that lets you package together and
name multiple related values that make up a meaningful group. If you're familiar
with an object-oriented language, a struct is like an object's data attributes.
In this chapter, we'll compare and contrast tuples with structs to build on what
you already know and demonstrate when structs are a better way to group data.

We'll demonstrate how to define and instantiate structs. We'll discuss how to
define associated functions...
```

Notice:

- Defines the term immediately
- Connects to prior knowledge (OOP, tuples)
- Previews what's coming

### Section Flow

Within each chapter, sections should follow a rhythm:

```
┌─────────────────────────────────────────────────────┐
│  CONCEPT INTRODUCTION                               │
│  ├── High-level definition                          │
│  ├── Analogy or real-world connection               │
│  └── Why this matters                               │
├─────────────────────────────────────────────────────┤
│  BASIC EXAMPLE                                      │
│  ├── Simple code showing the concept                │
│  ├── Line-by-line explanation                       │
│  └── Output (if applicable)                         │
├─────────────────────────────────────────────────────┤
│  DEEPER EXPLORATION                                 │
│  ├── More complex examples                          │
│  ├── Variations and alternatives                    │
│  └── Common patterns                                │
├─────────────────────────────────────────────────────┤
│  EDGE CASES AND GOTCHAS                             │
│  ├── What can go wrong?                             │
│  ├── Error messages and how to read them            │
│  └── How to fix common mistakes                     │
├─────────────────────────────────────────────────────┤
│  QUIZ (embedded)                                    │
│  └── Tests understanding of this section            │
└─────────────────────────────────────────────────────┘
```

### Knowledge Scaffolding

**Forward references** — When mentioning concepts not yet covered:

> "We'll use generics here; don't worry if the `<T>` syntax is unfamiliar—we'll
> cover it in detail in Chapter 8."

**Backward references** — Reinforce connections to prior learning:

> "Remember how tuples let us group multiple values? Structs do something
> similar, but with names."

**Explicit deferral** — Reduce cognitive load:

> "There's more to error handling than we'll cover here. For now, just know that
> `unwrap()` will panic if something goes wrong. We'll see better approaches in
> Chapter 9."

---

## Writing Voice and Tone

### Person and Voice

| Mode                    | Use When                                       | Example                                 |
| ----------------------- | ---------------------------------------------- | --------------------------------------- |
| **First person (we)**   | Introducing tutorials, explaining reasoning    | "Let's explore how structs work."       |
| **Second person (you)** | Giving instructions, describing reader actions | "When you run this code, you'll see..." |
| **Third person (it)**   | Describing language/system behavior            | "Cairo uses an immutable memory model." |
| **Imperative mood**     | Step-by-step procedures                        | "Create a new file named `lib.cairo`."  |

### Examples

**Good — Collaborative exploration:**

> We can transform the tuple we're using into a struct. Structs are more
> flexible because you name each piece of data.

**Good — Direct instruction:**

> Add the following code to your `lib.cairo` file. You'll see a compiler
> error—we'll fix it in a moment.

**Good — Technical description:**

> Cairo's ownership system ensures memory safety without a garbage collector.
> When a variable goes out of scope, its resources are automatically cleaned up.

**Avoid — Passive and distant:**

> ~~The struct will be defined and instantiated by the programmer.~~

**Avoid — Overly casual:**

> ~~So structs are basically just like tuples but cooler lol~~

### Tone Principles

1. **Friendly but not frivolous** — Maintain warmth without sacrificing
   precision
2. **Confident but not arrogant** — State things clearly, acknowledge complexity
3. **Patient but not condescending** — Repeat when helpful, never talk down
4. **Encouraging but honest** — Celebrate progress, don't minimize challenges

### Psychological Safety

Normalize errors and struggle:

> "If you got a compiler error here, you're in good company. Even experienced
> Caironautes encounter this message regularly."

> "This concept takes time to internalize. Don't worry if it doesn't click
> immediately—we'll see it many more times throughout the book."

---

## Teaching Methodology

### Example-First Approach

**Don't** start with theory and definitions. **Do** start with a concrete
problem:

````markdown
❌ BAD: Starting with definition ───────────────────────────────── A struct is
an aggregate data type that groups related fields under a single name. Fields
are accessed using dot notation. Structs can derive traits using the #[derive]
attribute...

✅ GOOD: Starting with a problem ───────────────────────────────── Imagine
you're building a program that tracks user accounts. You need to store each
user's email, username, and whether they're active. You could use separate
variables:

```cairo
let email = "user@example.com";
let username = "cairo_lover";
let active = true;
```
````

But what if you have 100 users? This approach quickly becomes unmanageable.
That's where structs come in...

```

### Iterative Refinement Pattern

Show the evolution of code from naive → better → best:

1. **Version 1: Naive approach** — Works but has problems
2. **Version 2: First improvement** — Addresses obvious issue
3. **Version 3: Idiomatic solution** — Cairo best practice

This teaches _why_ patterns exist, not just _what_ they are.

**Example progression (from ch05):**
```

Attempt 1: Separate variables → "This doesn't scale" Attempt 2: Use tuples →
"Hard to remember which index is what" Attempt 3: Use structs → "Now it's clear
and maintainable"

````

### Deliberate Error Teaching

Show code that doesn't compile, display the error, then fix it:

```markdown
Let's see what happens if we try to modify an immutable variable:

<span class="filename">Filename: src/lib.cairo</span>

```cairo
// TAG: does_not_compile
fn main() {
    let x = 5;
    x = 6; // This line causes an error
}
````

If you try to compile this, you'll see:

```text
error: Cannot assign to an immutable variable.
 --> src/lib.cairo:3:5
  |
3 |     x = 6;
  |     ^^^^
```

The compiler is protecting us from unexpected changes. To allow mutation, we
need to declare the variable with `mut`:

```cairo
fn main() {
    let mut x = 5;
    x = 6; // Now this works
}
```

```

**Why this works:**
- Normalizes encountering errors
- Teaches how to read error messages
- Shows the fix immediately
- Builds debugging intuition

### Powerful Analogies

Use analogies to connect new concepts to familiar ones:

| Concept | Analogy |
|---------|---------|
| Match expressions | "Like a coin-sorting machine that routes each coin to the right slot" |
| Ownership | "Like passing a physical book—only one person can hold it" |
| References | "Like showing someone your book—they can read but not keep it" |
| Components | "Like Lego blocks that snap together" |
| Traits | "Like job requirements—different types can fulfill the same interface" |

**Guidelines for analogies:**
- Keep them brief (1-2 sentences)
- Use familiar, everyday objects
- Acknowledge where the analogy breaks down
- Don't overuse—one good analogy per major concept

### The "Magic Moment" Early

Give readers an early win that demonstrates Cairo's unique value:

> In Chapter 1.3, readers prove a computation generates valid zero-knowledge proofs _before_ they understand Cairo's syntax. This creates a "wow" moment that motivates deeper learning.

For any chapter introducing a significant feature, ask: "What's the earliest I can show this actually working?"

---

## Code Examples

### File Organization

All code lives in `listings/` as self-contained Scarb packages:

```

listings/ ├── ch05-using-structs-to-structure-related-data/ │ ├──
listing_01_user_struct/ │ │ ├── Scarb.toml │ │ └── src/ │ │ └── lib.cairo │ ├──
listing_02_mut_struct/ │ └── no_listing_01_simple_example/

````

**Never inline code in markdown.** Always use `{{#include}}`.

### Naming Conventions

| Pattern | Use Case | Example |
|---------|----------|---------|
| `listing_XX_name` | Formally numbered, referenced in text | `listing_01_user_struct` |
| `no_listing_NN_name` | Inline examples, not numbered | `no_listing_02_adding_mut` |
| Descriptive suffix | Clarifies what the listing demonstrates | `listing_05_pattern_matching` |

### ANCHOR System

Use anchors to show specific parts of larger files:

```cairo
// ANCHOR: user_definition
#[derive(Drop)]
struct User {
    email: ByteArray,
    username: ByteArray,
    active: bool,
}
// ANCHOR_END: user_definition

// ANCHOR: main
fn main() {
    let user = User { /* ... */ };
}
// ANCHOR_END: main
````

Reference in markdown:

```markdown
{{#rustdoc_include ../listings/ch05/listing_01/src/lib.cairo:user_definition}}
```

### Code Tags

Use tags to control verification behavior:

| Tag                        | Effect                                |
| -------------------------- | ------------------------------------- |
| `// TAG: does_not_compile` | Skip compilation (for error examples) |
| `// TAG: does_not_run`     | Compile but don't execute             |
| `// TAG: ignore_fmt`       | Skip formatting check                 |
| `// TAG: tests_fail`       | Skip test verification                |

### Listing Labels and References

Use the label/ref system for numbered listings:

````markdown
Listing {{#ref user-struct}} shows a struct definition.

```cairo
{{#include ../listings/ch05/.../lib.cairo:user}}
```
````

{{#label user-struct}} <span class="caption">Listing {{#ref user-struct}}: A
`User` struct definition</span>

```

### Progressive Examples

Within a chapter, examples should build on each other:

```

Example 1: Define a simple struct Example 2: Create instances of that struct
Example 3: Add a method to the struct Example 4: Handle edge cases

````

Don't introduce completely unrelated code in each example—show evolution.

---

## Explaining Code

### Line-by-Line Walkthrough

For important code, explain each significant part:

```markdown
Let's break down what's happening:

```cairo
#[derive(Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}
````

- **Line 1:** `#[derive(Drop)]` automatically implements the `Drop` trait,
  allowing Cairo to clean up the struct when it goes out of scope.
- **Line 2:** We declare a struct named `Rectangle` using the `struct` keyword.
- **Lines 3-4:** We define two fields, both of type `u64`, to store dimensions.

````

### Highlight What's New

When showing modified code, point out what changed:

> In this version, we've added `mut` before the variable name. This single keyword tells Cairo that we intend to modify this value later.

### Connect to Prior Knowledge

Reference concepts the reader has already learned:

> Notice how we're using the same dot notation we saw with tuples in Chapter 2—`point.x` works just like `tuple.0`, but with a meaningful name instead of an index.

### Explain the "Why"

Don't just show _what_ the code does—explain _why_ we write it this way:

```markdown
❌ Just the what:
"Use `#[derive(Debug)]` to print structs."

✅ Include the why:
"By default, `println!` doesn't know how to display a struct—it could show the
fields, memory addresses, or something else entirely. The `#[derive(Debug)]`
attribute tells Cairo to generate a sensible text representation, which is
invaluable when debugging."
````

---

## Quizzes and Assessment

### Quiz Types

The Cairo Book uses three quiz types:

| Type                | Purpose                       | Format                            |
| ------------------- | ----------------------------- | --------------------------------- |
| **Multiple Choice** | Test conceptual understanding | Select one answer                 |
| **Tracing**         | Test code comprehension       | "What does this output?"          |
| **Compilation**     | Test language rules           | "Does this compile? Why/why not?" |

### Quiz Structure (TOML format)

```toml
[[questions]]
id = "unique-uuid-here"
type = "Tracing"  # or "MultipleChoice"
prompt.program = """
fn main() {
    let x = 5;
    let y = x;
    println!("{}", x + y);
}
"""
answer.doesCompile = true
answer.stdout = "10"
context = """
Both `x` and `y` hold copies of the value 5 because integers implement
the `Copy` trait. Adding them gives 10.
"""
```

### Quiz Design Principles

1. **Test one concept** — Each question should focus on a single idea
2. **Provide explanatory context** — The `context` field teaches, not just
   judges
3. **Include distractors thoughtfully** — Wrong answers should reflect real
   misconceptions
4. **Vary difficulty** — Mix straightforward and challenging questions

### Placement

Embed quizzes at natural checkpoints:

- After introducing a new concept (immediate reinforcement)
- At section ends (consolidation)
- Before moving to advanced topics (ensure readiness)

```markdown
{{#quiz ../quizzes/ch05-01-defining-and-instantiating-structs.toml}}
```

---

## Formatting Standards

### Headings

**Capitalization rules:**

- Capitalize all words **except**:
  - Articles (a, an, the) unless first word
  - Coordinating conjunctions (and, but, for, or, nor)
  - Prepositions of 4 letters or less (to, for, with)
- Capitalize prepositions of 5+ letters (Before, Through, Without)
- Keep code in backticks lowercase: `Using the match Keyword`

### Text Formatting

| Element               | Format                    | Example                 |
| --------------------- | ------------------------- | ----------------------- |
| New terms (first use) | _Italics_                 | _ownership_, _trait_    |
| Code/commands         | `Backticks`               | `struct`, `scarb build` |
| Emphasis              | **Bold**                  | **important**           |
| File names            | `<span class="filename">` | Filename: src/lib.cairo |

### Lists

- Use **bullet lists** for unordered items
- Use **numbered lists** for sequential steps
- Capitalize first letter of each item
- End items with periods if any item is a full sentence

### Admonitions

```markdown
> **Note**: Important information that clarifies a concept.

> ⚠️ **Warning**: Critical information about potential issues.
```

Use sparingly—if everything is a note, nothing is.

### Links

- Use relative paths for internal links: `[Chapter 5](./ch05-00-structs.md)`
- Define link variables near their usage:

  ```markdown
  See the [`scarb` documentation][scarb-docs] for details.

  [scarb-docs]: https://docs.swmansion.com/scarb/
  ```

---

## Chapter Checklist

Before submitting a chapter, verify:

### Structure

- [ ] Opens with context, connection, and preview
- [ ] Sections follow logical progression
- [ ] Forward/backward references link concepts
- [ ] Concludes with summary or "what's next"

### Content

- [ ] Examples come before theory
- [ ] Code shows naive → improved → idiomatic evolution
- [ ] Error cases are demonstrated and explained
- [ ] Analogies clarify (not confuse)
- [ ] "Why" is explained, not just "what"

### Code

- [ ] All code lives in `listings/` as Scarb packages
- [ ] ANCHOR tags mark includable sections
- [ ] Appropriate TAG comments (does_not_compile, etc.)
- [ ] `cairo-listings verify` passes
- [ ] Code is formatted (`cairo-listings format`)

### Assessment

- [ ] Quiz questions test key concepts
- [ ] Context explains correct and incorrect answers
- [ ] Questions are placed at natural checkpoints

### Polish

- [ ] Voice is consistent (we/you/it used appropriately)
- [ ] New terms are italicized on first use
- [ ] Code elements use backticks
- [ ] Headings follow capitalization rules
- [ ] Links work (internal and external)
- [ ] No spelling errors (`typos` passes)

---

## Further Reading

- [Cairo Documentation Style Guide](./cairo-documentation-style-guide.md) —
  Detailed formatting rules
- [Contributing Guide](./CONTRIBUTING.md) — Technical contribution process
- [Development Guide](./development.md) — Local setup and tooling
- [The Rust Programming Language](https://doc.rust-lang.org/book/) — Inspiration
  for structure and pedagogy

---

_This guide is a living document. If you discover patterns that work well,
please contribute them back._
