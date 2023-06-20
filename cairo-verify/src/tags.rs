
#[derive(Debug, PartialEq, Eq, Hash)]
pub enum Tags {
    DoesNotCompile,
    DoesNotRun,
    IgnoreFormat,
    FailingTests,
}

impl Tags {
    pub fn from_str(tag: &str) -> Option<Self> {
        match tag {
            "does_not_compile" => Some(Tags::DoesNotCompile),
            "does_not_run" => Some(Tags::DoesNotRun),
            "ignore_format" => Some(Tags::IgnoreFormat),
            "test_fails" => Some(Tags::FailingTests),
            _ => None,
        }
    }
}