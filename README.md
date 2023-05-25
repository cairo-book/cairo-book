<div align="center">
  <h1>The Cairo Programming Language Book</h1>
  <h3> Alexandria </h3>
  <img src="assets/alexandria.jpg" height="400" width="400">
</div>

## Description

This repository contains the source of "The Cairo Programming Language" book, a comprehensive documentation of the Cairo 1 programming language. This documentation is your go-to resource for mastering Cairo, created and maintained by the Starknet community. You can read the book [online](https://cairo-book.github.io/).

<div align="center">
  <h3> Created by builders, for builders 📜</h3>
</div>

## Contribute

### Setup

1. Rust related packages:
   - Install toolchain providing `cargo` using [rustup](https://rustup.rs/).
   - Install [mdBook](https://rust-lang.github.io/mdBook/guide/installation.html) and the translation extension:
   ```
   cargo install mdbook mdbook-i18n-helpers
   ```
2. Host machine packages:
   - Install [gettext](https://www.gnu.org/software/gettext/) for translations, usually available with regular package manager:
   `sudo apt install gettext`.

3. Clone this repository.

### Work locally (english, main language)

All the Markdown files **MUST** be edited in english. To work locally in english:

   - Start a local server with `mdbook serve` and visit [localhost:3000](http://localhost:3000) to view the book.
   You can use the `--open` flag to open the browser automatically: `mdbook serve --open`.

   - Make changes to the book and refresh the browser to see the changes.

   - Open a PR with your changes.

### Work locally (translations)

This book is targetting international audience, and aims at being gradually translated in several languages.

**All files in the `src` directory MUST be written in english**. This ensures that all the translation files can be
auto-generated and updated by translators.

To work with translations, those are the steps to update the translated content:

   - Run a local server for the language you want to edit: `./translations.sh es` for instance. If no language is provided, the script will only extract translations from english.

   - Open the translation file you are interested in `po/es.po` for instance. You can also use editors like [poedit](https://poedit.net/) to help you on this task.

   - When you are done, you should only have changes into the `po/xx.po` file. Commit them and open a PR.
   The PR must stars with `i18n` to let the maintainers know that the PR is only changing translation.

The translation work is inspired from [Comprehensive Rust repository](https://github.com/google/comprehensive-rust/blob/main/TRANSLATIONS.md).


### Work locally (Cairo programs verification)

The current book has a mdbook backend to extract Cairo programs from the markdown sources. Currently, for each program it test two things: if it compiles and if it adheres to the `cairo-format` coding style. You can run this locally and test if a Cairo program you have written in the book passes these tests.

The mdbook-cairo backend is working as following:
1. It takes every code blocks in the markdown source and parse all of them.
2. Code blocks with a main function `fn main()` are extracted into Cairo programs.
3. The extracted programs are named based on the chapter they belong to, and a consecutive
   number of the `fn main()` found in the chapter.
4. If you have a code block with a `fn main()` function that you know does not compile,
   you can indicate it by adding the `does_not_compile` attribute to the code block, like this:
   
   ````
   ```rust,does_not_compile
   fn main() {
   }
   ```
   ````
   
   This main function will still count in the consecutive number of `fn main()` in the chapter file,
   but will not be extracted into a Cairo program.

5. Alternatively, if you want to disable the format check using `cairo-format`,
   you can add the `ignore_format` attribute to the code block, like this:   

   ````
   ```rust,ignore_format
   fn main() {
   }
   ```
   ````

To run the CI locally, ensure that you are at the root of the repository (same directory of this `README.md` file), and run:

`bash mdbook-cairo/scripts/cairo_local_verify.sh`

