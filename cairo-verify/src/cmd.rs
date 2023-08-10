use std::process::Command;

pub enum Cmd {
    ScarbFormat(),
    ScarbBuild(),
    ScarbCairoRun(),
    ScarbTest(),
}

impl Cmd {
    pub fn as_str(&self) -> String {
        let command = match self {
            Cmd::ScarbFormat() => "fmt",
            Cmd::ScarbBuild() => "build",
            Cmd::ScarbCairoRun() => "cairo-run",
            Cmd::ScarbTest() => "test",
        };
        command.into()
    }

    fn manifest_option(&self, manifest_path: &str) -> Vec<String> {
        vec!["--manifest-path".to_string(), manifest_path.to_string()]
    }

    fn args(&self) -> Vec<&str> {
        match self {
            Cmd::ScarbFormat() => vec!["-c"],
            Cmd::ScarbBuild() => vec![],
            Cmd::ScarbCairoRun() => vec!["--available-gas=20000000"],
            Cmd::ScarbTest() => vec![],
        }
    }

    pub fn test(&self, manifest_path: &str) -> Result<(), String> {
        // Temporary workaround that compiles before trying to run
        // Until Scarb does it by default.
        if let Cmd::ScarbCairoRun() = self {
            let mut command = Command::new("scarb");
            command.args(self.manifest_option(manifest_path));
            command.arg("build");

            let _output = command.output().expect("Failed to execute scarb");
        }
        let mut command = Command::new("scarb");
        command.args(self.manifest_option(manifest_path));
        command.arg(self.as_str());
        command.args(self.args());

        let output = command.output().expect("Failed to execute scarb");

        if !output.status.success() {
            return Err(String::from_utf8_lossy(&output.stderr).to_string());
        }

        Ok(())
    }
}
