use serde::{Deserialize, Serialize};
use std::fs::{create_dir_all, remove_dir_all, File};
use std::io::{self, Write};
use std::path::Path;
use mdbook::renderer::RenderContext;
use mdbook::book::{Book, BookItem, Chapter};
use pulldown_cmark::{Event, Parser, Tag, CodeBlockKind};
use regex::Regex;
use lazy_static::lazy_static;

/// The table header expected in book.toml.
const CAIRO_CONFIG_TABLE_HEADER: &str = "output.cairo";

/// An attribute added to a code block tag to ignore
/// the code extraction.
const CODE_BLOCK_DOES_NOT_COMPILE: &str = "does_not_compile";

/// Main function expected in a code block to be a candidate
/// for the code extraction.
const CODE_BLOCK_MAIN_FUNCTION: &str = "fn main()";

/// Struct mapping fields expected in [output.cairo] from book.toml.
#[derive(Debug, Default, Serialize, Deserialize)]
#[serde(default, rename_all = "kebab-case")]
pub struct CairoConfig {
  pub output_dir: String,
}

// Statically initialize the regex to avoid rebuiling at each loop iteration.
lazy_static! {
    static ref REGEX: Regex = Regex::new(r"^ch(\d{2})-(\d{2})-(.*)$").expect("Failed to create regex");
}

/// Backend entry point, which received the mdbook content directly from stdin.
fn main() {
    let mut stdin = io::stdin();
    let ctx = RenderContext::from_json(&mut stdin)
        .expect("Couldn't get mdbook render context from stdin.");

    // Execute the rendered only on english version.
    if !ctx.destination.as_path().display().to_string().contains("/book/cairo") {
        println!("No default english build, skipping cairo output.");
        return;
    }


    let cfg: CairoConfig = ctx.config
        .get_deserialized_opt(CAIRO_CONFIG_TABLE_HEADER)
        .expect("Couldn't deserialize cairo config from book.toml.")
        .unwrap();    

    let output_path = Path::new(cfg.output_dir.as_str());

    remove_dir_all(output_path)
        .unwrap_or_else(|_| {
            println!("Couldn't clean output directory, skip.")
        });

    create_dir_all(output_path).expect("Couldn't create output directory.");

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
    let mut in_code_block = false;
    let mut is_compilable = false;

    for event in parser {
        match event {
            Event::Start(Tag::CodeBlock(x)) => {
                in_code_block = true;

                if let CodeBlockKind::Fenced(tag_value) = x {
                    is_compilable = !tag_value.to_string().contains(CODE_BLOCK_DOES_NOT_COMPILE);
                }
            }
            Event::Text(text) => {

                if in_code_block && text.contains(CODE_BLOCK_MAIN_FUNCTION) {

                    if is_compilable {
                        let file_name = format!("{}_{}.cairo", prefix, program_counter);
                        let file_dir = &output_dir.join(file_name);
                        let mut file = File::create(file_dir).expect("Failed to create file.");
                        
                        file.write(text.as_bytes()).expect("Can't write to file.");
                    }

                    // To facilitate the debugging, we always increment the counter when a
                    // main function is found in a code block. This helps contributors to
                    // easily locate the code, without having to skip the `does_not_compile` blocks.
                    program_counter += 1;
                }
            }
            Event::End(Tag::CodeBlock(_)) => {
                in_code_block = false;
            }
            _ => {}
        }
    }
}

