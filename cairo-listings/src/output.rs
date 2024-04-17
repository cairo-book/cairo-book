use std::{
    fs::File,
    io::{BufRead, BufReader, Write},
    path::PathBuf,
};

use regex::Regex;

use crate::{cmd::ScarbCmd, run_command, utils::find_scarb_manifests, CFG};

pub fn process_outputs() {
    let scarb_packages = find_scarb_manifests(&CFG);

    for file in scarb_packages {
        process_file(&file);
    }
}

fn process_file(manifest_path: &str) {
    let output_file_path = PathBuf::from(manifest_path)
        .parent()
        .expect("Failed to get parent directory")
        .join("output.txt");

    if let Some(command) = read_command_from_output_file(&output_file_path) {
        let cmd = match command.as_str() {
            "scarb build" => ScarbCmd::Build(),
            "scarb cairo-run" => ScarbCmd::CairoRun(),
            "scarb test" => ScarbCmd::Test(),
            "scarb format" => ScarbCmd::Format(),
            _ => {
                eprintln!("Unknown command in output.txt: {}", command);
                return;
            }
        };

        let mut output = run_command(cmd, manifest_path, manifest_path);

        // Remove the part before "listings" after the first parenthesis using regex
        let re = Regex::new(r"\(.*?(listings/.*)").expect("Failed to create regex");
        output = re.replace_all(&output, "($1").to_string();

        let re2 = Regex::new(r"-->\s*.*?(listings/.*)").expect("Failed to create regex");
        output = re2.replace_all(&output, "--> $1").to_string();

        // Keep the command in the first line of the output file
        let to_write = format!("$ {}\n{}\n", command, output);

        if let Err(e) = write_output_file(&output_file_path, &to_write) {
            eprintln!("Failed to write output file: {}", e);
        } else {
            println!("Processed output.txt for {:?}", output_file_path);
        }
    }
}

fn read_command_from_output_file(output_file_path: &PathBuf) -> Option<String> {
    if let Ok(file) = File::open(output_file_path) {
        let mut reader = BufReader::new(file);
        let mut first_line = String::new();

        if reader.read_line(&mut first_line).is_ok() && first_line.starts_with("$ ") {
            return Some(first_line[2..].trim().to_string());
        }
    }

    None
}

fn write_output_file(output_file_path: &PathBuf, content: &str) -> std::io::Result<()> {
    let mut file = File::create(output_file_path)?;
    file.write_all(content.as_bytes())?;
    Ok(())
}
