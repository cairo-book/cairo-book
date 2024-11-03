use std::collections::HashSet;

use crate::cmd::ScarbCmd;

pub struct ErrorSets {
    pub compile_errors: HashSet<String>,
    pub run_errors: HashSet<String>,
    pub test_errors: HashSet<String>,
    pub format_errors: HashSet<String>,
}

impl ErrorSets {
    pub fn new() -> Self {
        Self {
            compile_errors: HashSet::new(),
            run_errors: HashSet::new(),
            test_errors: HashSet::new(),
            format_errors: HashSet::new(),
        }
    }

    pub fn get_mut_error_set(&mut self, cmd: &ScarbCmd) -> &mut HashSet<String> {
        match cmd {
            ScarbCmd::Format() => &mut self.format_errors,
            ScarbCmd::Build() => &mut self.compile_errors,
            ScarbCmd::CairoRun() => &mut self.run_errors,
            ScarbCmd::Test() => &mut self.test_errors,
        }
    }
}
