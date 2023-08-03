use colored::Colorize;
use regex::Regex;
use std::collections::HashSet;
use walkdir::WalkDir;

use crate::config::Config;

pub fn find_scarb_manifests(cfg: &Config) -> Vec<String> {
    let path = cfg.path.as_str();

    let mut scarb_manifests: Vec<String> = Vec::new();

    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        if let Some(file_name) = entry.file_name().to_str() {
            if file_name.eq("Scarb.toml") {
                if cfg.file.is_some() && !file_name.ends_with(cfg.file.as_ref().unwrap()) {
                    continue;
                }

                scarb_manifests.push(entry.path().display().to_string());
            }
        }
    }

    scarb_manifests
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
