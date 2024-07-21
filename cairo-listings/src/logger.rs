use crate::VerifyArgs;
use env_logger::Env;
use indicatif::ProgressBar;
use log::{LevelFilter, Log, Metadata, Record};
use std::sync::Arc;

struct ProgressBarLogger {
    pb: Arc<ProgressBar>,
}

impl Log for ProgressBarLogger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= log::Level::Info
    }

    fn log(&self, record: &Record) {
        if self.enabled(record.metadata()) {
            let pb = Arc::clone(&self.pb);
            pb.suspend(|| println!("{}", record.args()))
        }
    }

    fn flush(&self) {}
}

pub fn setup(args: &VerifyArgs, pb: Arc<ProgressBar>) {
    let env = Env::default()
        .filter_or("APP_LOG", "info") // Default log level is "info"
        .write_style_or("APP_LOG_STYLE", "always");

    if args.verbose {
        let logger = ProgressBarLogger {
            pb: Arc::clone(&pb),
        };
        log::set_boxed_logger(Box::new(logger)).unwrap();
        log::set_max_level(LevelFilter::max());
    } else if args.quiet {
        env_logger::Builder::from_env(env)
            .filter(None, LevelFilter::Off)
            .init();
    } else {
        let logger = ProgressBarLogger {
            pb: Arc::clone(&pb),
        };
        log::set_boxed_logger(Box::new(logger)).unwrap();
        log::set_max_level(LevelFilter::Error);
    }
}
