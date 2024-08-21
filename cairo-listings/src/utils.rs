use colored::Colorize;
use regex::Regex;
use std::collections::HashSet;
use std::path::Path;
use walkdir::WalkDir;

use crate::config::{Config};

pub fn find_scarb_manifests(cfg: &Config, package: Option<String>) -> Vec<String> {
    let path = Path::new(&cfg.path);

    WalkDir::new(path)
        .into_iter()
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_name() == "Scarb.toml")
        .filter(|entry| {
            package.as_ref().map_or(true, |p| {
                entry.path().to_str().map_or(false, |s| s.contains(p))
            })
        })
        .map(|entry| entry.path().display().to_string())
        .collect()
}

/// Will replace the file path contained in the input string with a clickable format for better output
pub fn clickable(relative_path: &str) -> String {
    let full_path = std::env::current_dir()
        .unwrap()
        .join(relative_path)
        .display()
        .to_string();
    let mut path_parts: Vec<&str> = full_path.split(|c: char| c == '\\' || c == '/').collect();

    let file_listing_path: Vec<&str> = full_path.split("listings").collect();
    let mut filename: String = file_listing_path.last().unwrap_or(&"")[1..].to_string();
    let re = Regex::new(r"([^:]+(:\d+:\d+)?)(:\s|$)").unwrap();
    if let Some(captures) = re.captures(filename.as_str()) {
        filename = captures.get(1).map_or("", |m| m.as_str()).to_string();
    }

    if let Some(parts) = path_parts.last_mut() {
        *parts = &filename;
    }

    let clickable_format = format!(
        "\u{1b}]8;;file://{}\u{1b}\\{}\u{1b}]8;;\u{1b}\\",
        full_path, filename
    )
    .bold()
    .red()
    .to_string();

    full_path.replacen(&full_path, &clickable_format, 1)
}

pub fn print_error_table(errors: &HashSet<String>, section_name: &str) {
    if errors.is_empty() {
        return;
    }

    println!(
        "{}",
        format!("{}: {}", section_name, errors.len())
            .bold()
            .on_red()
    );

    for error in errors {
        println!(" - {}", error);
    }
}