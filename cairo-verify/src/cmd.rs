use std::path::PathBuf;
use std::process::Command;

pub enum Cmd {
    CairoFormat(Option<PathBuf>),
    CairoCompile(Option<PathBuf>),
    CairoRun(Option<PathBuf>),
    CairoTest(Option<PathBuf>),
    StarknetTest(Option<PathBuf>),
    StarknetCompile(Option<PathBuf>),
}

impl Cmd {
    pub fn as_str(&self) -> String {
        let (binary, cairo_root) = match self {
            Cmd::CairoFormat(path) => ("cairo-format", path),
            Cmd::CairoCompile(path) => ("cairo-compile", path),
            Cmd::CairoRun(path) => ("cairo-run", path),
            Cmd::CairoTest(path) => ("cairo-test", path),
            Cmd::StarknetTest(path) => ("cairo-test", path),
            Cmd::StarknetCompile(path) => ("starknet-compile", path),
        };

        if let Some(r) = cairo_root {
            let full_path = r.join(PathBuf::from("target/release")).join(binary);
            return full_path.to_string_lossy().to_string();
        }

        binary.into()
    }

    fn args(&self) -> Vec<&str> {
        match self {
            Cmd::CairoFormat(_) => vec!["-c"],
            Cmd::CairoCompile(_) => vec![],
            Cmd::CairoRun(_) => vec!["--available-gas=20000000"],
            Cmd::CairoTest(_) => vec!["--starknet"],
            Cmd::StarknetTest(_) => vec!["--starknet"],
            Cmd::StarknetCompile(_) => vec![],
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
