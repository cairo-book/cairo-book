# Contribution Guide for the Cairo Programming Language Book

## 1. Content Structure and Organization

- Organize content into clear sections with descriptive headings and subheadings.
- Use a logical progression of concepts, building on previously introduced ideas.
- Include an introduction for each major topic or chapter.
- Conclude sections or chapters with a summary and, where appropriate, quiz questions to reinforce learning.
- Use cross-references to link related concepts across different sections of the book.

## 2. Code Examples

- Provide practical, runnable code examples to illustrate concepts.
- Use the `rust` syntax highlighting for code blocks, with `noplayground` if the code must not be run in the browser.
- Include comments in code when necessary for clarity, but prefer to explain concepts in words.
- Show both the code and its output when relevant.
- Use meaningful variable and function names in examples.
- Demonstrate multiple approaches to solve a problem when applicable (e.g., different ways of doing loops).
- Use the `{{#include}}` syntax to include code snippets from external files.
- All code examples should come from Scarb packages under the `listings` directory.

## 3. Language and Tone

- Maintain a friendly, instructional tone throughout the book.
- Use clear, concise language to explain concepts.
- Address the reader directly using "you" and "we" to create an inclusive learning experience.
- Avoid jargon without explanation; when introducing new terms, provide clear definitions.
- Use rhetorical questions to engage the reader and prompt thinking.

## 4. Formatting and Layout

- Use markdown for formatting text.
- Use backticks for inline code or command references.
- Use italics or bold for emphasis - new terms should be introduced with italics.
- Use numbered lists for sequential steps and bullet points for non-sequential items.
- Include "filename" labels above code blocks when referencing specific files.
- Use captions for listings, prefixed with "Listing" and a reference number.

## 5. Cairo-Specific Content

- Clearly explain Cairo-specific concepts, especially where they differ from standard Rust.
- Include notes on important considerations.
- Highlight unique features of Cairo, such as its handling of structs, enums, and traits.

## 6. Examples and Exercises

- Provide practical examples that demonstrate real-world usage of concepts.
- Include exercises or challenges at the end of sections to reinforce learning through quizzes.
- Offer suggestions for further exploration or practice.

## 7. Technical Accuracy and Depth

- Ensure all code examples are correct and run without errors.
  - You can use the `cairo-listings` CLI tool to check that all listings are correct.
- Provide in-depth explanations of complex concepts, breaking them down into manageable parts.
- Include edge cases and potential pitfalls when discussing language features.

## 8. Accessibility and Readability

- Break down complex concepts into manageable chunks.
- Use analogies or comparisons to familiar concepts when introducing new ideas.
- Include diagrams or visual aids when they can help clarify a concept.
- Ensure code snippets are not too long; break them into smaller, digestible parts if necessary.
  - Use mdbook's `ANCHOR` system to break up long code snippets into smaller, more manageable ones.

## 9. Consistency

- Maintain consistent terminology throughout the book.
- Use consistent formatting for similar types of content (e.g., code blocks, terminal output).
- Employ a consistent structure across similar sections or chapters.
- Use consistent naming conventions (e.g., PascalCase for enum variants, snake_case for functions).

## 10. Engagement and Interactive Learning

- Encourage experimentation with the language through "try it yourself" sections.
- Include interesting facts or historical context where relevant to maintain reader interest.
- Use progressive examples that build on each other throughout a chapter.

## 11. Documentation and References

- Include references to other parts of the book using the `[link text](./path-to-file.md)` format.
- Use the `{{#label}}` and `{{#ref}}` syntax for internal references within the document.
- Provide links to external resources or documentation when appropriate.

Remember, the goal is to create an educational resource that is both informative and engaging, helping readers learn Cairo programming effectively while maintaining a consistent style and structure throughout the book.
