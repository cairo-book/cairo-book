use serde::{Deserialize, Serialize};
use std::fs::{create_dir_all, remove_dir_all, File};
use std::io::{self, Write};
use std::path::Path;
use mdbook::renderer::RenderContext;
use mdbook::book::{Book, BookItem};
use pulldown_cmark::{Event, Parser, Tag, CodeBlockKind};

/// The table header expected in book.toml.
const CAIRO_CONFIG_TABLE_HEADER: &str = "output.cairo";

/// Struct mapping fields expected in [output.cairo] from book.toml.
#[derive(Debug, Default, Serialize, Deserialize)]
#[serde(default, rename_all = "kebab-case")]
pub struct CairoConfig {
  pub output_dir: String,
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
            process_content(output_dir, &chapter.content);
        }
    }
}

/// Processes the content of a chapter to parse code blocks and write them to a file.
fn process_content(output_dir: &Path, content: &str) {
    let parser = Parser::new(content);

    let mut current_file: Option<File> = None;

    for event in parser {
        match event {
            Event::Start(Tag::CodeBlock(x)) => {
                if let CodeBlockKind::Fenced(v) = x {
                    if let Some(file_name) = filename_from_tag_value(v.to_string()) {
                        current_file = Some(
                            File::create(&output_dir.join(file_name))
                                .expect("Failed to create file.")
                        );
                    }
                }
            }
            Event::Text(text) => {
                if let Some(output_file) = &mut current_file {
                    output_file.write(text.as_bytes())
                        .expect("Can't write to file.");
                }
            }
            Event::End(Tag::CodeBlock(_)) => {
                current_file = None;
            }
            _ => {}
        }
    }
}

/// Extracts the `file=` attribute from fenced code block tag value.
/// The `file=` attribute MUST be the last one of the list, withtout
/// trailing comma.
fn filename_from_tag_value(tag_value: String) -> Option<String> {
    // split_once is used as file= is supposed to be the last attribute
    // with at least the language (rust usually) in the attribute list.
    // TODO: rework for something more robust with regexp or similar.
    match tag_value.split_once("file=") {
        None => None,
        Some(t) => Some(String::from(t.1))
    }
}
