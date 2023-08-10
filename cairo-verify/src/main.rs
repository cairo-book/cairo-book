use clap::Parser;
use colored::Colorize;
use indicatif::ProgressBar;
use log::error;
use std::collections::HashSet;
use std::fs::File;
use std::io::{BufRead, BufReader};
use std::sync::Mutex;

#[macro_use]
extern crate lazy_static;

mod cmd;
mod config;
mod error_sets;
mod logger;
mod tags;
mod utils;

use crate::cmd::Cmd;
use crate::config::Config;
use crate::error_sets::ErrorSets;
use crate::tags::Tags;
use crate::utils::{clickable, find_scarb_manifests, print_error_table};

lazy_static! {
    static ref CFG: Config = Config::parse();
}

lazy_static! {
    static ref ERRORS: Mutex<ErrorSets> = Mutex::new(ErrorSets::new());
}

fn main() {
    let cfg = &*CFG;
    let scarb_packages = find_scarb_manifests(cfg);

    let pb = ProgressBar::new(scarb_packages.len() as u64);
    logger::setup(cfg, pb.clone());

    for file in scarb_packages {
        process_file(&file);
        if !cfg.quiet {
            pb.inc(1);
        }
    }

    pb.finish_and_clear();

    let errors = ERRORS.lock().unwrap();
    let total_errors = errors.compile_errors.len()
        + errors.run_errors.len()
        + errors.test_errors.len()
        + errors.format_errors.len();

    if total_errors > 0 {
        println!("{}\n", "  ==== RESULT ===  ".red().bold());

        print_error_table(&errors.compile_errors, "Compile Errors");
        print_error_table(&errors.run_errors, "Run Errors");
        print_error_table(&errors.test_errors, "Test Errors");
        print_error_table(&errors.format_errors, "Format Errors");

        println!(
            "{}",
            format!("Total errors: {}", total_errors.to_string().red()).bold()
        );

        println!("\n{}", "Please review the errors above. Do not hesitate to ask for help by commenting on the issue on Github.".red().italic());
        std::process::exit(1);
    } else {
        println!("\n{}\n", "ALL TESTS PASSED!".green().bold());
    }
}

fn process_file(manifest_path: &str) {
    let cfg = &*CFG;
    let manifest_path_as_path = std::path::Path::new(manifest_path);
    let file_path = manifest_path_as_path
        .parent()
        .unwrap()
        .join("src/lib.cairo");
    let file_path = file_path.to_str().unwrap();

    let file =
        File::open(file_path).unwrap_or_else(|_| panic!("Failed to open file {}", file_path));
    let reader = BufReader::new(file);

    // Parsed tags (if any)
    let mut tags: HashSet<Tags> = HashSet::new();
    let mut in_tag_block = true;

    // Program info
    let mut should_be_runnable = false;
    let mut should_be_testable = false;
    let mut is_contract = false;

    reader.lines().for_each(|line| {
        if let Ok(line_contents) = line {
            // Parse tags
            if in_tag_block && config::TAG_REGEX.is_match(&line_contents) {
                let line_contents = config::TAG_REGEX.replace(&line_contents, "");
                let tags_in_line: Vec<&str> = line_contents
                    .trim()
                    .split(',')
                    .map(|tag| tag.trim())
                    .collect();

                tags_in_line.iter().for_each(|tag| {
                    if let Some(tag_enum) = tags::Tags::from_str(tag) {
                        tags.insert(tag_enum);
                    }
                });
            } else {
                // Stop parsing tags when we reach the first non-comment line
                in_tag_block = false;
            }

            // Check for statements
            is_contract |= line_contents.contains(config::STATEMENT_IS_CONTRACT);
            should_be_runnable |= line_contents.contains(config::STATEMENT_IS_RUNNABLE);
            should_be_testable |= line_contents.contains(config::STATEMENT_IS_TESTABLE);
        }
    });

    // COMPILE / RUN CHECKS
    if is_contract {
        // This is a contract, it must pass starknet-compile
        if !tags.contains(&Tags::DoesNotCompile) && !cfg.starknet_skip {
            match Cmd::ScarbBuild().test(manifest_path) {
                Ok(_) => {}
                Err(e) => handle_error(e, file_path, Cmd::ScarbBuild()),
            }
        }
    } else if should_be_runnable {
        // This is a cairo program, it must pass cairo-run
        if !tags.contains(&Tags::DoesNotRun)
            && !tags.contains(&Tags::DoesNotCompile)
            && !cfg.run_skip
        {
            match Cmd::ScarbCairoRun().test(manifest_path) {
                Ok(_) => {}
                Err(e) => handle_error(e, file_path, Cmd::ScarbCairoRun()),
            }
        }
    } else {
        // This is a cairo program, it must pass cairo-compile
        if !tags.contains(&Tags::DoesNotCompile) && !cfg.compile_skip {
            match Cmd::ScarbBuild().test(manifest_path) {
                Ok(_) => {}
                Err(e) => handle_error(e, file_path, Cmd::ScarbBuild()),
            }
        }
    }

    // TEST CHECKS
    if should_be_testable && !cfg.test_skip && !tags.contains(&Tags::FailingTests) {
        // This program has tests, it must pass cairo-test
        match Cmd::ScarbTest().test(manifest_path) {
            Ok(_) => {}
            Err(e) => handle_error(e, file_path, Cmd::ScarbTest()),
        }
    }

    // FORMAT CHECKS
    if !tags.contains(&Tags::IgnoreFormat) && !cfg.formats_skip {
        // This program must pass cairo-format
        match Cmd::ScarbFormat().test(manifest_path) {
            Ok(_) => {}
            Err(e) => handle_error(e, file_path, Cmd::ScarbFormat()),
        }
    }
}

fn handle_error(e: String, file_path: &str, cmd: Cmd) {
    let clickable_file = clickable(file_path);
    let msg = match cmd {
        Cmd::ScarbTest() | Cmd::ScarbCairoRun() => {
            format!("{} -> {}: {}", clickable_file, cmd.as_str(), e.as_str())
        }
        _ => format!("{} -> {}", cmd.as_str(), clickable_file),
    };

    error!("{}", msg);

    let mut errors = ERRORS.lock().unwrap();
    errors.get_mut_error_set(&cmd).insert(clickable_file);
}
