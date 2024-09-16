mod compile;

use serde::{Deserialize, Serialize};

fn main() {
    let config = Config {
        include_location: true,
    };
    let pdf = compile::compile(config);

    std::fs::write(
        shellexpand::tilde("~/Documents/Resume.pdf").to_string(),
        pdf,
    )
    .unwrap();
}

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Config {
    #[serde(rename = "includeLocation")]
    /// should it include the location in the top left?
    include_location: bool,
}
