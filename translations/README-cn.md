[English](../README.md) | 简体中文

<div align="center">
<!-- Remember: Keep a span between the HTML tag and the markdown tag.  -->

  <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-17-orange.svg?style=flat-square)](#contributors)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

  <h1>Cairo编程语言教程</h1>
  <h3> Alexandria </h3>
  <img src="../assets/alexandria.jpg" height="400" width="400">
</div>

## 描述

该存储库包含了《Cairo 编程语言》书籍的源代码，这是对 Cairo 1 编程语言的全面文档。这份文档是您掌握 Cairo 的首选资源，由 Starknet 社区创建和维护。您可以在线阅读这本书，[链接在这里](https://book.cairo-lang.org/)。

<div align="center">
  <h3> 来源于社区，贡献于社区 📜</h3>
</div>

## 贡献方法

### 设置

1. 安装 Rust 相关包:
   - 使用 [rustup](https://rustup.rs/) 安装`cargo`工具链
   - 安装 [mdBook](https://rust-lang.github.io/mdBook/guide/installation.html) and the required extensions:
   ```
   cargo install mdbook mdbook-i18n-helpers mdbook-last-changed
   ```
2. 安装系统相关依赖包:

   - Install [gettext](https://www.gnu.org/software/gettext/) for translations, usually available with regular package manager:
     `sudo apt install gettext`.

3. Clone 仓库.

4. 安装 mdbook-cairo [for Cairo code blocks](#work-locally-cairo-programs-verification)
   ```
   cargo install --path mdbook-cairo
   ```

### 在本地运行（主要语言, 英语）

所有的 Markdown 文件**必须**以英文进行编辑。要在本地以英文工作：

- 使用命令 `mdbook serve` 开启本地服务，然后访问[localhost:3000](http://localhost:3000) to view the book.
  您可以使用 `--open` 标志来自动打开浏览器: `mdbook serve --open`.

- 对书籍进行修改，并刷新浏览器以查看更改。

- 为你的改变提交 PR。

### 本地工作（翻译）

本书面向国际读者群体，旨在逐步翻译成多种语言。

**`src` 目录下的所有文件必须使用英文编写。**。 这样可以确保所有翻译文件可以被翻译人员自动生成和更新。

如果要进行翻译，以下是进行翻译的步骤：

- 启动要编辑的语言的本地服务器: 执行 `./translations.sh es` 。如果没有提供语言参数，脚本将仅从英语中提取翻译内容。

- 打开您感兴趣的翻译文件，例如 `po/es.po`。您也可以使用类似 [poedit](https://poedit.net/) 的编辑器来帮助您完成这个任务。

- 完成后，您应该只对 `po/xx.po` 文件进行更改。提交更改并提交一个 PR。
  PR 标题必须以 `i18n` 开头，以便让维护者知道该 PR 仅涉及翻译的更改。

翻译工作的灵感来自于 [Comprehensive Rust repository](https://github.com/google/comprehensive-rust/blob/main/TRANSLATIONS.md).

#### 开始一个新的语言翻译

如果您希望在不运行本地服务器的情况下为您的语言启动一个新的翻译，请考虑以下步骤：

- 执行命令 `./translations.sh new xx` (替换 `xx` 为你的语言代码)。 该命令可以生成对应语言的 po 文件 `xx.po`。
- 更新你的 `xx.po` 文件, 执行命令 `./translations.sh xx` (替换 `xx` 为你的语言代码), 如前一章节所述。
- 如果 `xx.po` 已经存在, 则不需要执行该命令。

### 本地工作（验证 Cairo 程序）

`cairo-listings` 工具旨在封装所有 cairo and starknet 插件以便快速验证 Cairo 程序。

#### 设置

首先，您需要将 `scarb` 添加到您的环境变量中，确保它可以在命令行中被调用：

详细的安装说明请参阅[这里](https://cairo-book.github.io/ch01-01-installation.html) for more details.

要运行 `cairo-listings` 辅助工具, 请确保您位于存储库的根目录 (与 `README.md` 同级), 然后运行以下命令：

```sh
cargo run --bin cairo-listings
```

或者，您也可以使用以下命令安装该工具：

```sh
cargo install --path cairo-listings
```

#### 使用

该工具会在指定目录中扫描所有的 `*.cairo` 文件，并执行以下操作：

对于一个 Starknet 合约:

- `scarb build`
- 如果文件包含测试: `scarb test`

Cairo 程序:

- 如果包含 `main` 方法: `scarb cairo-run --available-gas=200000000`
- 否则执行, `scarb build`
- 如果文件包含测试: `scarb test`
- `scarb fmt -c`

要指定要运行的测试，您可以在文件顶部添加以下格式的注释：

```cairo
// TAG: <tag1>
// TAGS: <tag1>, <tag2>
```

以下是可用 tags 的列表：

- `does_not_compile`: 不运行 `scarb build`
- `does_not_run`: 不运行 `scarb cairo-run --available-gas=200000000`
- `ignore_fmt`: 不运行 `scarb fmt`
- `tests_fail`: 不运行 `scarb test`

您可以通过添加相应的 tags 来跳过和忽略特定的测试：

```sh
$ cairo-listings --help

Usage: cairo-listings [OPTIONS]

Options:
  -p, --path <PATH>    The path to explore for *.cairo files [default: ./listings]
  -v, --verbose        Print more information
  -q, --quiet          Only print final results
  -f, --formats-skip   Skip cairo-format checks
  -s, --starknet-skip  Skip starknet-compile checks
  -c, --compile-skip   Skip cairo-compile checks
  -r, --run-skip       Skip cairo-run checks
  -t, --test-skip      Skip cairo-test checks
      --file <FILE>    Specify file to check
  -h, --help           Print help
  -V, --version        Print version
```

在 CI 环境中，为了减少输出信息，建议在运行 `cairo-listings` 时使用 `--quiet` 标志。

mdbook-cairo 是一个 mdbook 预处理器，仅会移除代码块中的 `// TAG` 行。

## 贡献者

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
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dbejarano820"><img src="https://avatars.githubusercontent.com/u/58019353?v=4?s=100" width="100px;" alt="Daniel Bejarano"/><br /><sub><b>Daniel Bejarano</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=dbejarano820" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/TAdev0"><img src="https://avatars.githubusercontent.com/u/122918260?v=4?s=100" width="100px;" alt="Tristan"/><br /><sub><b>Tristan</b></sub></a><br /><a href="https://github.com/cairo-book/cairo-book.github.io/commits?author=TAdev0" title="Code">💻</a></td>
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
