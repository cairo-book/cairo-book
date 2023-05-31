<div align="center">
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
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
4. Install mdbook-cairo [for Cairo code blocks](#work-locally-cairo-programs-verification)
   ```
   cargo install --path mdbook-cairo
   ```

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

The current book has a mdbook backend to extract Cairo programs from the markdown sources.
To run this locally, and test if a Cairo program you have written in the book actually compiled.

The mdbook-cairo backend is working as following:

1. It takes every code blocks in the markdown source and parse all of them.
2. Code blocks with a main function `fn main()` are extracted into Cairo programs.
3. The extracted programs are nammed based on the chapter they belong to, and a consecutive
   number of the `fn main()` found in the chapter.
4. If you have a code block with a `fn main()` function, but you know that is does not compile,
   you can add an attribute to the code block tag value as following:

   ````
   ```rust,does_not_compile
   fn main() {
   }
   ```
   ````

   This main function will still count in the consecutive number of `fn main()` in the chapter file,
   but will not be extracted into a Cairo program.

To run the CI locally, ensure that you are at the root of the repository (same directoy of this `README.md` file),
and run:

`bash mdbook-cairo/scripts/cairo_local_verify.sh`

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.starknet.id/"><img src="https://avatars.githubusercontent.com/u/78437165?v=4?s=100" width="100px;" alt="Fricoben"/><br /><sub><b>Fricoben</b></sub></a><br /><a href="#ideas-fricoben" title="Ideas, Planning, & Feedback">🤔</a> <a href="#fundingFinding-fricoben" title="Funding Finding">🔍</a> <a href="#projectManagement-fricoben" title="Project Management">📆</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/enitrat"><img src="https://avatars.githubusercontent.com/u/60658558?v=4?s=100" width="100px;" alt="Mathieu"/><br /><sub><b>Mathieu</b></sub></a><br /><a href="#ideas-enitrat" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=enitrat" title="Code">💻</a> <a href="#mentoring-enitrat" title="Mentoring">🧑‍🏫</a> <a href="https://github.com/cairo-book/cairo-book.github.io/pulls?q=is%3Apr+reviewed-by%3Aenitrat" title="Reviewed Pull Requests">👀</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
