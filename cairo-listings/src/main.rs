use clap::Parser;
use colored::Colorize;
use indicatif::{ProgressBar, ProgressStyle};
use log::error;
use rayon::prelude::*;
use std::collections::HashSet;
use std::fs::File;
use std::io::{BufRead, BufReader};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Mutex};

#[macro_use]
extern crate lazy_static;

mod cmd;
mod config;
mod error_sets;
mod logger;
mod output;
mod tags;
mod utils;

use crate::cmd::ScarbCmd;
use crate::config::{Commands, Config, VerifyArgs};
use crate::error_sets::ErrorSets;
use crate::tags::Tags;
use crate::utils::{clickable, find_scarb_manifests, print_error_table};

lazy_static! {
    static ref ERRORS: Mutex<ErrorSets> = Mutex::new(ErrorSets::new());
}

lazy_static! {
    static ref CFG: Config = Config::parse();
}

fn main() {
    let cfg = &*CFG;
    let cfg_clone = cfg;
    let empty_arg = VerifyArgs::default();

    match &cfg.command {
        Commands::Verify(args) => run_verification(cfg_clone, args),
        Commands::Output => output::process_outputs(cfg_clone, &empty_arg),
    }
}

fn run_verification(cfg: &Config, args: &VerifyArgs) {
    let scarb_packages = find_scarb_manifests(cfg, args);

    let total_packages = scarb_packages.len();
    let pb = Arc::new(ProgressBar::new(total_packages as u64));
    pb.set_style(
        ProgressStyle::default_bar()
            .template("[{elapsed_precise}] {bar:40.cyan/blue} {pos:>7}/{len:7} {msg}")
            .unwrap()
            .progress_chars("##-"),
    );

    let processed_count = Arc::new(AtomicUsize::new(0));

    logger::setup(args, Arc::clone(&pb));

    let args = Arc::new(args);

    scarb_packages.par_iter().for_each(|file| {
        let args = Arc::clone(&args);
        process_file(file, &args);

        if !args.quiet {
            let current = processed_count.fetch_add(1, Ordering::SeqCst) + 1;
            pb.set_position(current as u64);

            if current == total_packages {
                pb.finish_with_message("Verification complete");
            }
        }
    });

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

fn process_file(manifest_path: &str, args: &VerifyArgs) {
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
        if !tags.contains(&Tags::DoesNotCompile) && !args.starknet_skip {
            run_command(ScarbCmd::Build(), manifest_path, file_path, vec![]);
        }
    } else if should_be_runnable {
        // This is a cairo program, it must pass cairo-run
        if !tags.contains(&Tags::DoesNotRun)
            && !tags.contains(&Tags::DoesNotCompile)
            && !args.run_skip
        {
            run_command(
                ScarbCmd::CairoRun(),
                manifest_path,
                file_path,
                vec!["--available-gas=200000000".to_string()],
            );
        }
    } else {
        // This is a cairo program, it must pass cairo-compile
        if !tags.contains(&Tags::DoesNotCompile) && !args.compile_skip {
            run_command(ScarbCmd::Build(), manifest_path, file_path, vec![]);
        }
    };

    // TEST CHECKS
    if should_be_testable && !args.test_skip && !tags.contains(&Tags::FailingTests) {
        // This program has tests, it must pass cairo-test
        let _ = run_command(ScarbCmd::Test(), manifest_path, file_path, vec![]);
    }

    // FORMAT CHECKS
    if !tags.contains(&Tags::IgnoreFormat) && !args.formats_skip {
        // This program must pass cairo-format
        let _ = run_command(ScarbCmd::Format(), manifest_path, file_path, vec![]);
    }
}

fn run_command(cmd: ScarbCmd, manifest_path: &str, file_path: &str, args: Vec<String>) -> String {
    match cmd.test(manifest_path, args) {
        Ok(output) => String::from_utf8_lossy(&output.stdout).into_owned(),
        Err(e) => handle_error(e, file_path, cmd),
    }
}

fn handle_error(e: String, file_path: &str, cmd: ScarbCmd) -> String {
    let clickable_file = clickable(file_path);
    let msg = match cmd {
        ScarbCmd::Test() | ScarbCmd::CairoRun() => {
            format!("{} -> {}: {}", clickable_file, cmd.as_str(), e.as_str())
        }
        _ => format!("{} -> {}", cmd.as_str(), clickable_file),
    };

    error!("{}", msg);

    let mut errors = ERRORS.lock().unwrap();
    errors.get_mut_error_set(&cmd).insert(clickable_file);

    e
}
