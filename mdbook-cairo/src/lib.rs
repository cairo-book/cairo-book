use lazy_static::lazy_static;
use mdbook::book::{Book, BookItem};
use mdbook::errors::Error;
use mdbook::preprocess::{Preprocessor, PreprocessorContext};
use regex::Regex;

const TAG_REGEX_PATTERN: &str = r"^//\s*TAG";

lazy_static! {
    static ref RE: Regex = Regex::new(TAG_REGEX_PATTERN).unwrap();
}

/// The actual implementation of the `Cairo` preprocessor.
pub struct Cairo;

impl Cairo {
    pub fn new() -> Cairo {
        Cairo
    }
}

impl Preprocessor for Cairo {
    fn name(&self) -> &str {
        "cairo-preprocessor"
    }

    fn run(&self, _ctx: &PreprocessorContext, mut book: Book) -> Result<Book, Error> {
        book.for_each_mut(|item: &mut BookItem| {
            if let BookItem::Chapter(ref mut chapter) = *item {
                let mut new_content = String::new();
                let mut lines = chapter.content.split_terminator('\n').peekable();
                let mut in_code_block = false;

                while let Some(line) = lines.next() {
                    in_code_block = in_code_block ^ line.starts_with("```");

                    if in_code_block {
                        if RE.is_match(line) {
                            // delete this line
                            continue;
                        }
                    }

                    new_content.push_str(line);
                    new_content.push('\n');
                }

                chapter.content = new_content;
            }
        });

        // Return updated version of the book
        Ok(book)
    }

    fn supports_renderer(&self, renderer: &str) -> bool {
        renderer != "not-supported"
    }
}
