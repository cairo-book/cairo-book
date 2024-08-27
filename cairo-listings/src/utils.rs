use colored::Colorize;
use std::collections::HashSet;
use std::path::Path;
use walkdir::WalkDir;

pub fn find_scarb_manifests(path: &str) -> Vec<String> {
    let path = Path::new(path);
    WalkDir::new(path)
        .into_iter()
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_name() == "Scarb.toml")
        .map(|entry| entry.path().display().to_string())
        .collect()
}

/// Will replace the file path contained in the input string with a clickable format for better output
pub fn clickable(file_path: &str) -> String {
    let path = Path::new(file_path);
    let absolute_path = path.canonicalize().unwrap_or_else(|_| path.to_path_buf());

    // Use OSC 8 hyperlink escape sequences
    format!(
        "\x1B]8;;file://{}\x07{}\x1B]8;;\x07",
        absolute_path.display(),
        file_path
    )
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
