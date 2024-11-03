use anyhow::{bail, Context, Result};
use lazy_static::lazy_static;
use mdbook::book::{Book, BookItem, Chapter};
use mdbook::preprocess::{Preprocessor, PreprocessorContext};
use regex::Regex;
use std::collections::HashMap;

lazy_static! {
    static ref TAG_REGEX: Regex = Regex::new(r"^//\s*TAG").expect("Invalid regex");
    static ref REF_REGEX: Regex = Regex::new(r"\{\{#ref\s*([\w-]+)\s*\}\}").expect("Invalid regex");
    static ref LABEL_REGEX: Regex =
        Regex::new(r"\{\{#label\s*([\w-]+)\s*\}\}").expect("Invalid regex");
    static ref CHAP_REF_REGEX: Regex = Regex::new(r"\{\{#chap\s*([\w-]+)\s*\}\}").expect("Invalid regex");
}

pub struct Cairo;

impl Cairo {
    pub fn new() -> Self {
        Self
    }
}

impl Default for Cairo {
    fn default() -> Self {
        Self::new()
    }
}

impl Preprocessor for Cairo {
    fn name(&self) -> &str {
        "cairo-preprocessor"
    }

    fn run(&self, _ctx: &PreprocessorContext, mut book: Book) -> Result<Book> {
        let mut processor = CairoBookProcessor::new();
        processor.process_book(&mut book)?;
        Ok(book)
    }

    fn supports_renderer(&self, renderer: &str) -> bool {
        renderer != "not-supported"
    }
}

struct CairoBookProcessor {
    labels: HashMap<String, String>,
    current_label: usize,
    current_chapter: u32,
    chapter_numbers: HashMap<String, u32>,
}

impl CairoBookProcessor {
    fn new() -> Self {
        Self {
            labels: HashMap::new(),
            current_label: 1,
            current_chapter: 0,
            chapter_numbers: HashMap::new(),
        }
    }

    fn process_book(&mut self, book: &mut Book) -> Result<()> {
        self.collect(book)?;
        self.process_references(book)?;
        Ok(())
    }

    fn collect(&mut self, book: &mut Book) -> Result<()> {
        book.for_each_mut_parent_first(|item| {
            if let BookItem::Chapter(chapter) = item {
                self.process_chapter_labels(chapter).unwrap_or_else(|e| {
                    eprintln!(
                        "Error processing labels in chapter '{}': {}",
                        chapter.name, e
                    )
                });
                self.collect_chapter_number(chapter, self.current_chapter).unwrap_or_else(|e| {
                    eprintln!(
                        "Error processing chapter number in chapter '{}': {}",
                        chapter.name, e
                    )
                });
            }
        });
        Ok(())
    }

    fn process_chapter_labels(&mut self, chapter: &mut Chapter) -> Result<()> {
        let chapter_number = chapter.number.as_ref().map_or(0, |n| n[0]);

        // Reset current_label when chapter changes
        if chapter_number != self.current_chapter {
            self.current_chapter = chapter_number;
            self.current_label = 1;
        }

        let mut new_content = String::new();

        for line in chapter.content.lines() {
            if let Some(cap) = LABEL_REGEX.captures(line) {
                let label = &cap[1];
                let listing_number = format!("{}-{}", self.current_chapter, self.current_label);
                if self.labels.contains_key(label) {
                    bail!("Duplicate entry for label: {}", label);
                }
                self.labels.insert(label.to_string(), listing_number);
                self.current_label += 1;
                // We don't add this line to new_content, effectively removing it
            } else {
                new_content.push_str(line);
                new_content.push('\n');
            }
        }

        // Remove the last newline if the original content didn't end with one
        if !chapter.content.ends_with('\n') {
            new_content.pop();
        }

        chapter.content = new_content;
        Ok(())
    }

    fn collect_chapter_number(&mut self, chapter: &mut Chapter, chapter_counter: u32) -> Result<()> {
        let chapter_name = chapter.name.to_lowercase().replace(" ", "-");
        self.chapter_numbers.insert(chapter_name, chapter_counter);
        Ok(())
    }

    fn process_references(&self, book: &mut Book) -> Result<()> {
        book.for_each_mut(|item| {
            if let BookItem::Chapter(chapter) = item {
                self.process_chapter_references(chapter)
                    .unwrap_or_else(|e| {
                        eprintln!(
                            "Error processing references in chapter '{}': {}",
                            chapter.name, e
                        )
                    });
            }
        });
        Ok(())
    }

    fn process_chapter_references(&self, chapter: &mut Chapter) -> Result<()> {
        let mut new_content = String::new();
        let mut in_code_block = false;
        let mut skip_next_empty = false;

        for line in chapter.content.lines() {
            let mut processed_line = line.to_string();

            in_code_block ^= line.starts_with("```");

            if in_code_block && TAG_REGEX.is_match(line) {
                // Skip the next empty line
                skip_next_empty = true;
                continue;
            }

            if skip_next_empty && line.is_empty() {
                skip_next_empty = false;
                continue;
            }

            skip_next_empty = false;
            // Process ref
            for cap in REF_REGEX.captures_iter(line) {
                let ref_name = &cap[1];
                let replacement = self
                    .labels
                    .get(ref_name)
                    .with_context(|| format!("Reference to label '{}' not found", ref_name))?;

                processed_line = processed_line.replace(&cap[0], replacement);
            }

            // Process chapter ref
            for cap in CHAP_REF_REGEX.captures_iter(line) {
                let chapter_name = &cap[1];
                let replacement = self
                    .chapter_numbers
                    .get(chapter_name)
                    .with_context(|| format!("Reference to chapter name '{}' not found", chapter_name))?;
                processed_line = processed_line.replace(&cap[0], &replacement.to_string());
            }

            new_content.push_str(&processed_line);
            new_content.push('\n');
        }

        chapter.content = new_content;
        Ok(())
    }
}

trait BookExt {
    fn for_each_mut_parent_first<F>(&mut self, f: F)
    where
        F: FnMut(&mut BookItem);
}

impl BookExt for Book {
    fn for_each_mut_parent_first<F>(&mut self, mut f: F)
    where
        F: FnMut(&mut BookItem),
    {
        fn process_items<F>(items: &mut [BookItem], f: &mut F)
        where
            F: FnMut(&mut BookItem),
        {
            for item in items {
                f(item);
                if let BookItem::Chapter(ch) = item {
                    process_items(&mut ch.sub_items, f);
                }
            }
        }

        process_items(&mut self.sections, &mut f);
    }
}

pub fn for_each_mut_parent_first<'a, F, I>(func: &mut F, items: I)
where
    F: FnMut(&mut BookItem),
    I: IntoIterator<Item = &'a mut BookItem>,
{
    for item in items {
        func(item);
        if let BookItem::Chapter(ch) = item {
            for_each_mut_parent_first(func, &mut ch.sub_items);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process_chapter_labels() {
        let mut processor = CairoBookProcessor::new();

        let mut chapter = Chapter::new("Test Chapter", String::new(), "test.md", Vec::new());
        chapter.content =
            "{{#label label1}}\nSome content\n{{#label label2}}\nMore content".to_string();

        processor.process_chapter_labels(&mut chapter).unwrap();

        assert_eq!(processor.labels.get("label1"), Some(&String::from("0-1")));
        assert_eq!(processor.labels.get("label2"), Some(&String::from("0-2")));
    }

    #[test]
    fn test_process_references() {
        let mut processor = CairoBookProcessor::new();
        processor
            .labels
            .insert("label1".to_string(), "1-1".to_string());
        processor
            .labels
            .insert("label2".to_string(), "1-2".to_string());

        let mut book = Book::new();
        let mut chapter = Chapter::new("Test Chapter", String::new(), "test.md", Vec::new());
        chapter.content =
            "This is a reference {{#ref label1}} in the text. And another one {{#ref label2}}.\n"
                .to_string();
        chapter.content += "This is a line in the text.";
        book.push_item(chapter);

        processor.process_references(&mut book).unwrap();

        if let BookItem::Chapter(processed_chapter) = &book.sections[0] {
            eprintln!("Processed chapter: {}", processed_chapter.content);
            assert_eq!(
                processed_chapter.content,
                "This is a reference 1-1 in the text. And another one 1-2.\n\
                 This is a line in the text.\n"
            );
        } else {
            panic!("Expected chapter");
        }
    }

    #[test]
    fn test_process_references_with_error() {
        let mut processor = CairoBookProcessor::new();
        processor
            .labels
            .insert("label1".to_string(), "1-1".to_string());
        // Intentionally not inserting "label2"

        let mut book = Book::new();
        let mut chapter = Chapter::new("Test Chapter", String::new(), "test.md", Vec::new());
        chapter.content = "This is a reference {{#ref label1}} in the text.\n".to_string();
        chapter.content += "This line has an error {{#ref label2}}.\n";
        chapter.content += "This is another valid line.";
        book.push_item(chapter);

        let result = processor.process_references(&mut book);

        assert!(
            result.is_ok(),
            "process_references should not return an error"
        );

        if let BookItem::Chapter(processed_chapter) = &book.sections[0] {
            assert_eq!(
                processed_chapter.content,
                "This is a reference {{#ref label1}} in the text.\n\
                 This line has an error {{#ref label2}}.\n\
                 This is another valid line.",
                "Chapter content should remain unchanged due to error"
            );
        } else {
            panic!("Expected chapter");
        }
    }

    #[test]
    fn test_collect_chapter_number() {
        let mut processor = CairoBookProcessor::new();

        let mut book = Book::new();
        let mut chapter = Chapter::new("Test Chapter", String::new(), "test.md", Vec::new());
        chapter.content = "This is a valid line.\n".to_string();
        book.push_item(chapter);

        let result = processor.collect(&mut book);

        assert!(
            result.is_ok(),
            "collect should not return an error"
        );

        assert_eq!(*processor.chapter_numbers.get("test-chapter").expect("test-chapter should be in the HashMap"), 0);
    }

    #[test]
    fn test_process_chapter_numbers() {
        let mut processor = CairoBookProcessor::new();

        let mut book = Book::new();
        let mut chapter = Chapter::new("Test Chapter", String::new(), "test.md", Vec::new());
        chapter.content = "This is a chap reference Chapter {{#chap test-chapter}} in the text.\n".to_string();
        chapter.content += "This is another valid line.";
        book.push_item(chapter);

        // Collect chapter numbers and process 
        let result = processor.process_book(&mut book);

        assert!(
            result.is_ok(),
            "process_references should not return an error"
        );

        if let BookItem::Chapter(processed_chapter) = &book.sections[0] {
            println!("content : {}", processed_chapter.content);
            assert_eq!(
                processed_chapter.content,
                "This is a chap reference Chapter 0 in the text.\n\
                 This is another valid line.\n",
            );
        } else {
            panic!("Expected chapter");
        }
    }

    #[test]
    fn test_process_chapter_number_with_error() {
        let mut processor = CairoBookProcessor::new();

        let mut book = Book::new();
        let mut chapter = Chapter::new("Test Chapter", String::new(), "test.md", Vec::new());
        chapter.content = "This is a chap reference Chapter {{#chap test-chapter}} in the text.\n".to_string();
        chapter.content += "This line has an error Chapter {{#chap unknown-chapter}}.\n";
        chapter.content += "This is another valid line.";
        book.push_item(chapter);

        // Collect chapter numbers and process 
        let result = processor.process_book(&mut book);

        assert!(
            result.is_ok(),
            "process_references should not return an error"
        );

        if let BookItem::Chapter(processed_chapter) = &book.sections[0] {
            println!("content : {}", processed_chapter.content);
            assert_eq!(
                processed_chapter.content,
                "This is a chap reference Chapter {{#chap test-chapter}} in the text.\n\
                 This line has an error Chapter {{#chap unknown-chapter}}.\n\
                 This is another valid line.",
                "Chapter content should remain unchanged due to error"
            );
        } else {
            panic!("Expected chapter");
        }
    }
}
