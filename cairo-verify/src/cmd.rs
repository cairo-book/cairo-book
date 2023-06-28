use std::process::Command;

pub enum Cmd {
    CairoFormat,
    CairoCompile,
    CairoRun,
    CairoTest,
    StarknetTest,
    StarknetCompile,
}

impl Cmd {
    pub fn as_str(&self) -> &str {
        match self {
            Cmd::CairoFormat => "cairo-format",
            Cmd::CairoCompile => "cairo-compile",
            Cmd::CairoRun => "cairo-run",
            Cmd::CairoTest => "cairo-test",
            Cmd::StarknetTest => "cairo-test",
            Cmd::StarknetCompile => "starknet-compile",
        }
    }

    fn args(&self) -> Vec<&str> {
        match self {
            Cmd::CairoFormat => vec!["-c"],
            Cmd::CairoCompile => vec![],
            Cmd::CairoRun => vec!["--program"],
            Cmd::CairoTest => vec![],
            Cmd::StarknetTest => vec!["--starknet"],
            Cmd::StarknetCompile => vec![],
        }
    }

    pub fn test(&self, file_path: &str) -> Result<(), String> {
        let output = Command::new(self.as_str())
            .args(self.args())
            .arg(file_path)
            .output()
            .unwrap_or_else(|_| panic!("Failed to run {}", self.as_str()));

        if !output.status.success() {
            return Err(String::from_utf8_lossy(&output.stderr).to_string());
        }

        Ok(())
    }
}
