<div align="center">
<!-- Remember: Keep a span between the HTML tag and the markdown tag.  -->

  <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-15-orange.svg?style=flat-square)](#contributors)
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

#### Initiate a new translation for your language
If you wish to initiate a new translation for your language without running a local server, consider the following tips:
- Execute the command `./translations.sh new xx` (replace `xx` with your language code). This method can generate the `xx.po` file of your language for you.
- To update your `xx.po` file, execute the command `./translations.sh xx` (replace `xx` with your language code), as mentioned in the previous chapter.
- If the `xx.po` file already exists (which means you are not initiating a new translation), you should not run this command.

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

<!-- To run the `cairo-verify` helper tool, ensure that you are at the root of the repository (same directory of this `README.md` file), and run:
```
cargo run --bin cairo-verify
```

In CI, it's preferable to reduce output, so run `cairo-verify` with the `--quiet` flag.
```
cargo run --bin cairo-verify -- --quiet
```

There's other flags available to disable specific tests, run `cargo run --bin cairo-verify -- --help` to see them. -->

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.starknet.id/"><img src="https://avatars.githubusercontent.com/u/78437165?v=4?s=100" width="100px;" alt="Fricoben"/><br /><sub><b>Fricoben</b></sub></a><br /><a href="#ideas-fricoben" title="Ideas, Planning, & Feedback">🤔</a> <a href="#fundingFinding-fricoben" title="Funding Finding">🔍</a> <a href="#projectManagement-fricoben" title="Project Management">📆</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/enitrat"><img src="https://avatars.githubusercontent.com/u/60658558?v=4?s=100" width="100px;" alt="Mathieu"/><br /><sub><b>Mathieu</b></sub></a><br /><a href="#ideas-enitrat" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=enitrat" title="Code">💻</a> <a href="#mentoring-enitrat" title="Mentoring">🧑‍🏫</a> <a href="https://github.com/cairo-book/cairo-book.github.io/pulls?q=is%3Apr+reviewed-by%3Aenitrat" title="Reviewed Pull Requests">👀</a> <a href="#projectManagement-enitrat" title="Project Management">📆</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Nadai2010"><img src="https://avatars.githubusercontent.com/u/112663528?v=4?s=100" width="100px;" alt="Nadai"/><br /><sub><b>Nadai</b></sub></a><br /><a href="#translation-Nadai2010" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/glihm"><img src="https://avatars.githubusercontent.com/u/7962849?v=4?s=100" width="100px;" alt="glihm"/><br /><sub><b>glihm</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=glihm" title="Code">💻</a> <a href="#tool-glihm" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/clementwalter/"><img src="https://avatars.githubusercontent.com/u/18620296?v=4?s=100" width="100px;" alt="Clément Walter"/><br /><sub><b>Clément Walter</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/pulls?q=is%3Apr+reviewed-by%3AClementWalter" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/makluganteng"><img src="https://avatars.githubusercontent.com/u/74396818?v=4?s=100" width="100px;" alt="V.O.T"/><br /><sub><b>V.O.T</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=makluganteng" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rkdud007"><img src="https://avatars.githubusercontent.com/u/76558220?v=4?s=100" width="100px;" alt="Pia"/><br /><sub><b>Pia</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=rkdud007" title="Code">💻</a> <a href="#blog-rkdud007" title="Blogposts">📝</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/cryptonerdcn"><img src="https://avatars.githubusercontent.com/u/97042744?v=4?s=100" width="100px;" alt="cryptonerdcn"/><br /><sub><b>cryptonerdcn</b></sub></a><br /><a href="#translation-cryptonerdcn" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/MathiasTELITSINE"><img src="https://avatars.githubusercontent.com/u/95372106?v=4?s=100" width="100px;" alt="Argetlames"/><br /><sub><b>Argetlames</b></sub></a><br /><a href="#translation-MathiasTELITSINE" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://julio4.com"><img src="https://avatars.githubusercontent.com/u/30329843?v=4?s=100" width="100px;" alt="julio4"/><br /><sub><b>julio4</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=julio4" title="Code">💻</a> <a href="#tool-julio4" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/hgedia"><img src="https://avatars.githubusercontent.com/u/32969555?v=4?s=100" width="100px;" alt="Haresh Gedia"/><br /><sub><b>Haresh Gedia</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=hgedia" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://0xdarlington.disha.page"><img src="https://avatars.githubusercontent.com/u/75126961?v=4?s=100" width="100px;" alt="Darlington Nnam"/><br /><sub><b>Darlington Nnam</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=Darlington02" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tiagofneto"><img src="https://avatars.githubusercontent.com/u/46165861?v=4?s=100" width="100px;" alt="Tiago Neto"/><br /><sub><b>Tiago Neto</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/pulls?q=is%3Apr+reviewed-by%3Atiagofneto" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/omahs"><img src="https://avatars.githubusercontent.com/u/73983677?v=4?s=100" width="100px;" alt="omahs"/><br /><sub><b>omahs</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=omahs" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://shramee.me"><img src="https://avatars.githubusercontent.com/u/11048263?v=4?s=100" width="100px;" alt="Shramee Srivastav"/><br /><sub><b>Shramee Srivastav</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=shramee" title="Code">💻</a></td>
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
