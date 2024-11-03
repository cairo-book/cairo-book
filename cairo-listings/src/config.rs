use clap::{Parser, Subcommand};
use regex::Regex;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Config {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand, Debug)]
pub enum Commands {
    /// Run the verification process
    Verify(VerifyArgs),

    /// Process the output.txt file in listings
    Output(OutputArgs),

    /// Run the format process
    Format(VerifyArgs),
}

#[derive(Parser, Debug, Default)]
pub struct VerifyArgs {
    /// Print more information.
    #[arg(short, long)]
    pub verbose: bool,

    /// Only print final results.
    #[arg(short, long)]
    pub quiet: bool,

    /// Skip cairo-format checks
    #[arg(short, long)]
    pub formats_skip: bool,

    /// Skip starknet-compile checks
    #[arg(short, long)]
    pub starknet_skip: bool,

    /// Skip cairo-compile checks
    #[arg(short, long)]
    pub compile_skip: bool,

    /// Skip cairo-run checks
    #[arg(short, long)]
    pub run_skip: bool,

    /// Skip cairo-test checks
    #[arg(short, long)]
    pub test_skip: bool,

    /// Specify path to check (file or directory)
    #[arg(long, default_value = "./listings")]
    pub path: String,
}

#[derive(Parser, Debug, Default)]
pub struct OutputArgs {
    /// Specify path to check (file or directory)
    #[arg(long, default_value = "./listings")]
    pub path: String,
}

/// Expected statement in a cairo program for it to be runnable.
pub const STATEMENT_IS_RUNNABLE: &str = "fn main()";
/// Expected statement in a starknet contract for it to compile.
pub const STATEMENT_IS_CONTRACT: &str = "#[starknet::contract]";
/// Expected statement in a cairo program containing tests.
pub const STATEMENT_IS_TESTABLE: &str = "#[test]";
pub const STATEMENT_TEST_MODULE: &str = "#[cfg(test)]";
/// Expected regex for tags
const TAG_REGEX_PATTERN: &str = r"^//\s*TAG(S)?\s*(:)?\s*";

lazy_static! {
    pub static ref TAG_REGEX: Regex =
        Regex::new(TAG_REGEX_PATTERN).expect("Failed to create TAG_REGEX");
}
