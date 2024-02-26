use std::collections::HashMap;

use anyhow::anyhow;
use lazy_static::lazy_static;
use log::warn;
use mdbook::book::{Book, BookItem};
use mdbook::errors::Error;
use mdbook::preprocess::{Preprocessor, PreprocessorContext};
use regex::Regex;

const TAG_REGEX_PATTERN: &str = r"^//\s*TAG";

lazy_static! {
    static ref TAG_REGEX: Regex = Regex::new(TAG_REGEX_PATTERN).expect("Invalid regex");
}

lazy_static! {
    static ref REF_REGEX: Regex = Regex::new(r"\{\{#ref\s*([\w-]+)\s*\}\}").expect("Invalid regex");
}

lazy_static! {
    static ref LABEL_REGEX: Regex =
        Regex::new(r"\{\{#label\s*([\w-]+)\s*\}\}").expect("Invalid regex");
}

pub struct LabelsProcessor {
    labels: HashMap<String, String>,
    current_label: usize,
}

impl LabelsProcessor {
    pub fn new() -> LabelsProcessor {
        LabelsProcessor {
            labels: HashMap::new(),
            current_label: 1,
        }
    }

    fn process_labels(&mut self, line: &str, chapter_number: u32) -> Result<bool, Error> {
        let is_label = LABEL_REGEX.is_match(line);
        for cap in LABEL_REGEX.captures_iter(line) {
            let label = &cap[1];
            let listing_number = format!("{}-{}", chapter_number, self.current_label);
            if let Some(_existing) = self.labels.get(&label.to_string()) {
                return Err(anyhow::anyhow!("Duplicate entry for label: {}", label));
            }
            self.labels.insert(label.to_string(), listing_number);
            self.current_label += 1;
        }
        Ok(is_label)
    }

    fn process_references(&mut self, line: &str) -> Result<String, Error> {
        let mut new_line = line.to_string();
        for cap in REF_REGEX.captures_iter(line) {
            let ref_name = &cap[1];
            match self.labels.get(ref_name) {
                Some(label) => {
                    let replacement = label.to_string();
                    new_line = new_line.replace(&cap[0], &replacement);
                }
                None => {
                    return Err(anyhow!("Reference to label '{}' not found", ref_name));
                }
            }
        }
        Ok(new_line)
    }
}

impl Default for LabelsProcessor {
    fn default() -> Self {
        Self::new()
    }
}

/// The actual implementation of the `Cairo` preprocessor.
pub struct Cairo;

impl Cairo {
    pub fn new() -> Cairo {
        Cairo
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

    fn run(&self, _ctx: &PreprocessorContext, mut book: Book) -> Result<Book, Error> {
        let mut label_processor = LabelsProcessor::new();
        // First pass: collect all labels
        book.for_each_mut(|item| {
            if let BookItem::Chapter(ref mut chapter) = *item {
                let chapter_number = chapter.number.as_ref().map_or(0, |s| s[0]);
                let mut new_content = String::new();
                let lines = chapter.content.split_terminator('\n').peekable();

                for line in lines {
                    match label_processor.process_labels(line, chapter_number) {
                        Ok(is_label) => {
                            if is_label {
                                continue;
                            }
                        }
                        Err(e) => {
                            warn!(
                                "Error: {}. In chapter: {}. In line: {}",
                                e, chapter.name, line
                            );
                        }
                    };
                    new_content.push_str(line);
                    new_content.push('\n');
                }

                // Reset label count after each chapter
                label_processor.current_label = 1;
                chapter.content = new_content;
            }
        });

        // Second pass: replace references with correct numbers
        book.for_each_mut(|item| {
            if let BookItem::Chapter(ref mut chapter) = *item {
                let mut new_content = String::new();
                let lines = chapter.content.split_terminator('\n').peekable();
                let mut in_code_block = false;
                let mut skip_empty_lines = false;

                for line in lines {
                    in_code_block ^= line.starts_with("```");

                    if in_code_block && TAG_REGEX.is_match(line) {
                        // skip following empty line
                        skip_empty_lines = true;
                        continue;
                    }

                    if skip_empty_lines && line.is_empty() {
                        // skip empty lines after the tag
                        continue;
                    }
                    skip_empty_lines = false;

                    let maybe_new_line = label_processor.process_references(line);
                    match maybe_new_line {
                        Ok(new_line) => {
                            new_content.push_str(new_line.as_str());
                            new_content.push('\n');
                        }
                        Err(e) => {
                            warn!(
                                "Error: {}. In chapter: {}. In line: {}",
                                e, chapter.name, line
                            );
                        }
                    }
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process_labels() {
        let mut processor = LabelsProcessor::new();

        let line = "{{#label label1}}";
        processor.process_labels(line, 0).unwrap();

        assert_eq!(processor.labels.get("label1"), Some(&String::from("0-1")));
    }

    #[test]
    fn test_process_labels_multiple() {
        let mut processor = LabelsProcessor::new();

        let line = "{{#label label1}}";
        processor.process_labels(line, 0).unwrap();

        let line = "{{#label label2}}";
        processor.process_labels(line, 0).unwrap();

        assert_eq!(processor.labels.get("label1"), Some(&String::from("0-1")));
        assert_eq!(processor.labels.get("label2"), Some(&String::from("0-2")));
    }

    #[test]
    fn test_process_labels_not_label() {
        let mut processor = LabelsProcessor::new();

        let line = "This is not a label";
        processor.process_labels(line, 0).unwrap();

        assert_eq!(processor.labels.get("label1"), None);
    }

    #[test]
    fn test_process_references() {
        let mut processor = LabelsProcessor::new();
        processor
            .labels
            .insert("label1".to_string(), "1-1".to_string());

        let line = "This is a reference {{#ref label1 }} in the text.";
        let processed = processor.process_references(line).unwrap();

        assert_eq!(processed, "This is a reference 1-1 in the text.");
    }

    #[test]
    fn test_process_references_missing_label() {
        let mut processor = LabelsProcessor::new();

        let line = "This is a reference {{#ref label1 }} in the text.";
        let result = processor.process_references(line);

        assert!(result.is_err());
    }

    #[test]
    fn test_process_references_no_reference() {
        let mut processor = LabelsProcessor::new();

        let line = "This is a reference in the text.";
        let processed = processor.process_references(line).unwrap();

        assert_eq!(processed, line);
    }

    #[test]
    fn test_process_references_multiple() {
        let mut processor = LabelsProcessor::new();
        processor
            .labels
            .insert("label1".to_string(), "1-1".to_string());
        processor
            .labels
            .insert("label2".to_string(), "1-2".to_string());

        let line =
            "This is a reference {{#ref label1 }} in the text. And another one {{#ref label2 }}.";
        let processed = processor.process_references(line).unwrap();

        assert_eq!(
            processed,
            "This is a reference 1-1 in the text. And another one 1-2."
        );
    }
}
