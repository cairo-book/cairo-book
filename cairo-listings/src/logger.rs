use env_logger::Env;
use indicatif::ProgressBar;
use log::{Log, Metadata, Record};

use crate::Config;

struct ProgressBarLogger {
    pb: ProgressBar,
}

impl Log for ProgressBarLogger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= log::Level::Info
    }

    fn log(&self, record: &Record) {
        if self.enabled(record.metadata()) {
            self.pb.suspend(|| println!("{}", record.args()))
        }
    }

    fn flush(&self) {}
}

pub fn setup(cfg: &Config, pb: ProgressBar) {
    let env = Env::default()
        .filter_or("APP_LOG", "info") // Default log level is "info"
        .write_style_or("APP_LOG_STYLE", "always");

    if cfg.verbose {
        let logger = ProgressBarLogger { pb };
        log::set_boxed_logger(Box::new(logger)).unwrap();
        log::set_max_level(log::LevelFilter::max());
    } else if cfg.quiet {
        env_logger::Builder::from_env(env)
            .filter(None, log::LevelFilter::Off)
            .init();
    } else {
        let logger = ProgressBarLogger { pb };
        log::set_boxed_logger(Box::new(logger)).unwrap();
        log::set_max_level(log::LevelFilter::Error);
    }
}
