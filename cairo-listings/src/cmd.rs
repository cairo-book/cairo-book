use std::process::{Command, Output};

#[derive(Debug)]
pub enum ScarbCmd {
    Format(),
    Build(),
    CairoRun(),
    Test(),
}

impl ScarbCmd {
    pub fn as_str(&self) -> String {
        let command = match self {
            ScarbCmd::Format() => "fmt",
            ScarbCmd::Build() => "build",
            ScarbCmd::CairoRun() => "cairo-run",
            ScarbCmd::Test() => "test",
        };
        command.into()
    }

    fn manifest_option(&self, manifest_path: &str) -> Vec<String> {
        vec!["--manifest-path".to_string(), manifest_path.to_string()]
    }

    fn default_args(&self) -> Vec<&str> {
        match self {
            ScarbCmd::Format() => vec!["-c"],
            ScarbCmd::Build() => vec![],
            ScarbCmd::CairoRun() => vec![],
            ScarbCmd::Test() => vec![],
        }
    }

    pub fn test(&self, manifest_path: &str, args: Vec<String>) -> Result<Output, String> {
        let mut command = Command::new("scarb");
        command.args(self.manifest_option(manifest_path));
        command.arg(self.as_str());

        let args_not_in_default: Vec<&String> = args
            .iter()
            .filter(|arg| !self.default_args().contains(&arg.as_str()))
            .collect();
        command.args(self.default_args());
        command.args(args_not_in_default);

        let output = command.output().expect("Failed to execute scarb");

        if !output.status.success() {
            return Err(String::from_utf8_lossy(&output.stdout).to_string());
        }

        Ok(output)
    }
}
