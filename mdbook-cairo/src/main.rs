use lazy_static::lazy_static;
use mdbook::book::{Book, BookItem, Chapter};
use mdbook::renderer::RenderContext;
use pulldown_cmark::{CodeBlockKind, Event, Parser, Tag};
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::fs::{create_dir_all, remove_dir_all, File};
use std::io::{self, Write};
use std::path::Path;

/// The table header expected in book.toml.
const CAIRO_CONFIG_TABLE_HEADER: &str = "output.cairo";

/// An attribute added to a code block tag to ignore the cairo-compile check.
const TAG_DOES_NOT_COMPILE: &str = "does_not_compile";
/// An attribute added to a code block tag to ignore the cairo-run check.
const TAG_DOES_NOT_RUN: &str = "does_not_run";
/// An attribute added to a code block tag to ignore the cairo-format check.
const TAG_IGNORE_FORMAT: &str = "ignore_format";
/// An attribute added to a code block tag to ignore the cairo-format check.
const TAG_FAILING_TESTS: &str = "test_fails";
// we assume that every rust code block is a cairo block
const CAIRO_TAG: &str = "rust";

/// Expected statement in a code block for it to be runnable.
const CODE_BLOCK_IS_RUNNABLE: &str = "fn main()";
/// Expected statement in a code block for it to be runnable.
const CODE_BLOCK_IS_CONTRACT: &str = "#[contract]";
/// Expected statement in a code block containing tests.
const CODE_BLOCK_IS_TESTABLE: &str = "#[test]";

/// Configurations for the cairo backend.
const COMPILABLE_DIR: &str = "compilable";
const RUNNABLE_DIR: &str = "runnable";
const TESTABLE_DIR: &str = "testable";
const CONTRACTS_DIR: &str = "contracts";
const FORMATS_DIR: &str = "formats";

/// Struct mapping fields expected in [output.cairo] from book.toml.
#[derive(Debug, Default, Serialize, Deserialize)]
#[serde(default, rename_all = "kebab-case")]
pub struct CairoConfig {
    pub output_dir: String,
}

// Statically initialize the regex to avoid rebuilding at each loop iteration.
lazy_static! {
    static ref REGEX: Regex =
        Regex::new(r"^ch(\d{2})-(\d{2})-(.*)$").expect("Failed to create regex");
}

/// Backend entry point, which received the mdbook content directly from stdin.
fn main() {
    let mut stdin = io::stdin();
    let ctx = RenderContext::from_json(&mut stdin)
        .expect("Couldn't get mdbook render context from stdin.");

    // Execute the rendered only on english version.
    if !ctx
        .destination
        .as_path()
        .display()
        .to_string()
        .contains("/book/cairo")
    {
        println!("No default english build, skipping cairo output.");
        return;
    }

    let cfg: CairoConfig = ctx
        .config
        .get_deserialized_opt(CAIRO_CONFIG_TABLE_HEADER)
        .expect("Couldn't deserialize cairo config from book.toml.")
        .unwrap();

    let output_path = Path::new(cfg.output_dir.as_str());

    remove_dir_all(output_path)
        .unwrap_or_else(|_| println!("Couldn't clean output directory, skip."));

    create_dir_all(output_path).expect("Couldn't create output directory.");

    // Create subdirectories for different types of code blocks
    let subdirectories = [COMPILABLE_DIR, RUNNABLE_DIR, TESTABLE_DIR, CONTRACTS_DIR, FORMATS_DIR];
    subdirectories
        .iter()
        .for_each(|subdir| {
            create_dir_all(output_path.join(Path::new(subdir)))
            .expect("Couldn't create output directory.");
        });

    process_chapters(&ctx.book, &output_path);
}

/// Processes all the chapters to search for code block.
fn process_chapters(book: &Book, output_dir: &Path) {
    for item in book.iter() {
        if let BookItem::Chapter(chapter) = item {
            if let Some(chapter_prefix) = chapter_prefix_from_name(chapter) {
                process_chapter(output_dir, &chapter_prefix, &chapter.content);
            }
        }
    }
}

/// Extract the prefix of the chapter from filename string.
fn chapter_prefix_from_name(chapter: &Chapter) -> Option<String> {
    if let Some(p) = &chapter.path {
        let file_name = p.to_string_lossy().to_string();

        if let Some(groups) = REGEX.captures(&file_name) {
            if let (Some(c), Some(s)) = (groups.get(1), groups.get(2)) {
                let c = c.as_str();
                let s = s.as_str();
                return Some(format!("ch{}_{}", c, s));
            }
        }
    }

    None
}

/// Processes the content of a chapter to parse code blocks and write them to a file.
fn process_chapter(output_dir: &Path, prefix: &str, content: &str) {
    let parser = Parser::new(content);

    let mut program_counter = 1;
    let mut is_cairo_block = false;

    // tags
    let mut tag_does_not_compile = false;
    let mut tag_does_not_run = false;
    let mut tag_failing_tests = false;
    let mut tag_ignore_format = false;

    for event in parser {
        match event {
            Event::Start(Tag::CodeBlock(x)) => {
                if let CodeBlockKind::Fenced(tag_value) = x {
                    is_cairo_block = tag_value.to_string().contains(CAIRO_TAG);

                    tag_does_not_compile = tag_value.to_string().contains(TAG_DOES_NOT_COMPILE);
                    tag_does_not_run = tag_value.to_string().contains(TAG_DOES_NOT_RUN);
                    tag_ignore_format = tag_value.to_string().contains(TAG_IGNORE_FORMAT);
                    tag_failing_tests = tag_value.to_string().contains(TAG_FAILING_TESTS);
                }
            }
            Event::Text(text) => {
                if is_cairo_block {
                    let is_contract = text.contains(CODE_BLOCK_IS_CONTRACT);

                    if is_contract {
                        if !tag_does_not_compile {
                            // output to contracts directory
                            write_to_file(&output_dir.join(CONTRACTS_DIR), prefix, &text, program_counter)
                        }
                    } else {
                        let should_be_runnable = text.contains(CODE_BLOCK_IS_RUNNABLE);
                        if !tag_does_not_run && should_be_runnable {
                            // output to runnable directory
                            write_to_file(&output_dir.join(RUNNABLE_DIR), prefix, &text, program_counter)
                        } else if !tag_does_not_compile {
                            // output to compilable directory
                            write_to_file(&output_dir.join(COMPILABLE_DIR), prefix, &text, program_counter)
                        }
                    }

                    let has_tests = text.contains(CODE_BLOCK_IS_TESTABLE);
                    if !tag_failing_tests && has_tests {
                        // output to testable directory
                        write_to_file(&output_dir.join(TESTABLE_DIR), prefix, &text, program_counter)
                    }

                    if !tag_ignore_format {
                        // output to formats directory
                        write_to_file(&output_dir.join(FORMATS_DIR), prefix, &text, program_counter)
                    }

                    // To facilitate the debugging, we always increment the counter when a cairo code block is found.
                    // This helps contributors to easily locate code blocks.
                    program_counter += 1;
                }
            }
            Event::End(Tag::CodeBlock(_)) => {
                is_cairo_block = false;

                // reset tags
                tag_does_not_compile = false;
                tag_does_not_run = false;
                tag_ignore_format = false;
                tag_failing_tests = false;
            }
            _ => {}
        }
    }
}

fn write_to_file(output_dir: &Path, prefix: &str, content: &str, program_counter: i32) {
    let file_name = format!("{}_{}.cairo", prefix, program_counter);
    let file_dir = &output_dir.join(file_name);
    let mut file = File::create(file_dir).expect("Failed to create file.");

    file.write(content.as_bytes()).expect("Can't write to file.");
}
