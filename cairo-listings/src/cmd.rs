use std::{
    fs::File,
    io::{BufRead, BufReader},
    path::Path,
    process::{Command, Output},
};

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

    fn default_args(&self) -> Vec<String> {
        match self {
            ScarbCmd::Format() => vec![],
            ScarbCmd::Build() => vec![],
            ScarbCmd::CairoRun() => vec![],
            ScarbCmd::Test() => vec![],
        }
    }

    pub fn test(&self, manifest_path: &str, args: Vec<String>) -> Result<Output, String> {
        let manifest_dir = Path::new(manifest_path)
            .parent()
            .ok_or("Invalid manifest path")?;

        let scarb_path = self.get_scarb_path(manifest_dir)?;

        let mut command = Command::new(scarb_path);
        command.args(self.manifest_option(manifest_path));
        command.arg(self.as_str());
        let default_args = self.default_args();
        let all_args = default_args
            .iter()
            .chain(args.iter().filter(|arg| !default_args.contains(arg)));
        command.args(all_args);

        let output = command
            .output()
            .map_err(|e| format!("Failed to execute scarb: {}", e))?;
        if !output.status.success() {
            return Err(String::from_utf8_lossy(&output.stdout).into());
        }
        Ok(output)
    }

    fn get_scarb_path(&self, manifest_dir: &Path) -> Result<String, String> {
        let tool_versions_path = manifest_dir.join(".tool-versions");
        if tool_versions_path.exists() {
            let scarb_version = self.read_scarb_version(&tool_versions_path)?;
            self.resolve_scarb_path(&scarb_version)
        } else {
            Ok("scarb".to_string())
        }
    }

    fn read_scarb_version(&self, tool_versions_path: &Path) -> Result<String, String> {
        let file = File::open(tool_versions_path)
            .map_err(|e| format!("Failed to open .tool-versions: {}", e))?;
        let reader = BufReader::new(file);

        for line in reader.lines() {
            let line =
                line.map_err(|e| format!("Failed to read line from .tool-versions: {}", e))?;
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.first() == Some(&"scarb") {
                return parts
                    .get(1)
                    .map(|&v| v.to_string())
                    .ok_or_else(|| "Invalid scarb version in .tool-versions".to_string());
            }
        }

        Err("Scarb version not found in .tool-versions".to_string())
    }

    fn resolve_scarb_path(&self, version: &str) -> Result<String, String> {
        let output = Command::new("asdf")
            .args(["where", "scarb", version])
            .output()
            .map_err(|e| format!("Failed to execute asdf: {}", e))?;

        if output.status.success() {
            let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
            Ok(format!("{}/bin/scarb", path))
        } else {
            Err(format!(
                "Failed to resolve scarb path: {}",
                String::from_utf8_lossy(&output.stderr)
            ))
        }
    }
}
