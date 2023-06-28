use crate::cmd::Cmd;
use std::collections::HashSet;

pub struct ErrorSets {
    pub compile_errors: HashSet<String>,
    pub run_errors: HashSet<String>,
    pub test_errors: HashSet<String>,
    pub format_errors: HashSet<String>,
    pub starknet_errors: HashSet<String>,
}

impl ErrorSets {
    pub fn new() -> Self {
        Self {
            compile_errors: HashSet::new(),
            run_errors: HashSet::new(),
            test_errors: HashSet::new(),
            format_errors: HashSet::new(),
            starknet_errors: HashSet::new(),
        }
    }

    pub fn get_mut_error_set(&mut self, cmd: &Cmd) -> &mut HashSet<String> {
        match cmd {
            Cmd::CairoFormat => &mut self.format_errors,
            Cmd::CairoCompile => &mut self.compile_errors,
            Cmd::CairoRun => &mut self.run_errors,
            Cmd::CairoTest => &mut self.test_errors,
            Cmd::StarknetTest => &mut self.test_errors,
            Cmd::StarknetCompile => &mut self.starknet_errors,
        }
    }
}
