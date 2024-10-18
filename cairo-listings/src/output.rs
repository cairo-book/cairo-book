use std::{
    fs::File,
    io::{BufRead, BufReader, Write},
    path::PathBuf,
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc,
    },
};

use indicatif::{ProgressBar, ProgressStyle};
use rayon::prelude::*;
use regex::Regex;

use crate::{cmd::ScarbCmd, config::OutputArgs, run_command, utils::find_scarb_manifests};

pub fn process_outputs(arg: &OutputArgs) {
    let scarb_packages = find_scarb_manifests(arg.path.as_str());

    let total_packages = scarb_packages.len();
    let pb = Arc::new(ProgressBar::new(total_packages as u64));
    pb.set_style(
        ProgressStyle::default_bar()
            .template("[{elapsed_precise}] {bar:40.cyan/blue} {pos:>7}/{len:7} {msg}")
            .unwrap()
            .progress_chars("##-"),
    );

    let processed_count = Arc::new(AtomicUsize::new(0));

    scarb_packages.par_iter().for_each(|file| {
        process_file(file);

        let current = processed_count.fetch_add(1, Ordering::SeqCst) + 1;
        pb.set_position(current as u64);

        if current == total_packages {
            pb.finish_with_message("Output processing complete");
        }
    });
}

fn process_file(manifest_path: &str) {
    let output_file_path = PathBuf::from(manifest_path)
        .parent()
        .expect("Failed to get parent directory")
        .join("output.txt");

    if let Some(command_with_args) = read_command_from_output_file(&output_file_path) {
        let (command, args) = command_with_args;
        let cmd = match command.as_str() {
            "scarb build" => ScarbCmd::Build(),
            "scarb cairo-run" => ScarbCmd::CairoRun(),
            "scarb test" | "scarb cairo-test" => ScarbCmd::Test(),
            "scarb format" => ScarbCmd::Format(),
            _ => {
                eprintln!("Unknown command in output.txt: {}", command);
                return;
            }
        };

        let mut output = run_command(cmd, manifest_path, manifest_path, args.clone(), false);

        // Remove the part before "listings" after the first parenthesis using regex
        let re = Regex::new(r"\(.*?(listings/.*)").expect("Failed to create regex");
        output = re.replace_all(&output, "($1").to_string();

        let re2 = Regex::new(r"-->\s*.*?(listings/.*)").expect("Failed to create regex");
        output = re2.replace_all(&output, "--> $1").to_string();

        // Remove the `Blocking waiting for file lock on package cache` lines
        output = output
            .lines()
            .filter(|line| !line.contains("Blocking waiting for file lock on package cache"))
            .collect::<Vec<&str>>()
            .join("\n");

        // Keep the command in the first line of the output file
        let to_write = format!("$ {} {}\n{}\n\n", command, args.join(" "), output);

        if let Err(e) = write_output_file(&output_file_path, &to_write) {
            eprintln!("Failed to write output file: {}", e);
        }
    }
}

fn read_command_from_output_file(output_file_path: &PathBuf) -> Option<(String, Vec<String>)> {
    let file = File::open(output_file_path).ok()?;
    let mut reader = BufReader::new(file);
    let mut first_line = String::new();
    reader.read_line(&mut first_line).ok()?;

    if let Some(full_command) = first_line.strip_prefix("$ ") {
        let mut parts = full_command.split_whitespace();
        let command = match (parts.next(), parts.next()) {
            (Some(cmd), Some(subcmd)) => format!("{} {}", cmd, subcmd),
            (Some(cmd), None) => cmd.to_string(),
            _ => return None,
        };

        let args = parts.map(|arg| arg.to_string()).collect();

        Some((command, args))
    } else {
        None
    }
}

fn write_output_file(output_file_path: &PathBuf, content: &str) -> std::io::Result<()> {
    let mut file = File::create(output_file_path)?;
    file.write_all(content.as_bytes())?;
    Ok(())
}
