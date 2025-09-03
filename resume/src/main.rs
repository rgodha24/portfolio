mod compile;

use schemars::{schema_for, JsonSchema};
use serde::{Deserialize, Serialize};
use tiny_http::{Header, Response};

fn main() {
    let schema = schema_for!(Config);
    let schema = serde_json::to_string(&schema).unwrap();

    let html = include_str!("../index.html");
    let html = html.replace("{{schema}}", &schema).replace(
        "{{data}}",
        &serde_json::to_string(&Config::default()).unwrap(),
    );

    let server = tiny_http::Server::http("127.0.0.1:3001").expect("failed to start server");
    println!("listening on port 3001");

    loop {
        let mut req = match server.recv() {
            Ok(req) => req,
            Err(e) => {
                eprintln!("failed to receive request: {}", e);
                continue;
            }
        };

        match req.url() {
            "/" => {
                eprintln!("serving index.html!");
                req.respond(
                    Response::from_string(html.clone())
                        .with_header(Header::from_bytes(b"Content-Type", b"text/html").unwrap()),
                )
                .unwrap();
            }
            "/update" => {
                eprintln!("updating resume!");
                let config: Config = serde_json::from_reader(req.as_reader()).unwrap_or_default();
                println!("{:?}", config);
                let pdf = compile::compile(config);

                std::fs::write(
                    shellexpand::tilde("~/Documents/Resume.pdf").to_string(),
                    &pdf,
                )
                .unwrap();

                req.respond(Response::empty(200)).unwrap();
            }
            "/resume.pdf" => {
                eprintln!("serving resume.pdf!");
                let pdf = std::fs::read(shellexpand::tilde("~/Documents/Resume.pdf").to_string())
                    .unwrap();

                req.respond(
                    Response::from_data(pdf).with_header(
                        Header::from_bytes(b"Content-Type", b"application/pdf").unwrap(),
                    ),
                )
                .unwrap();
            }
            _ => {
                req.respond(Response::empty(404)).unwrap();
            }
        }
    }
}

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct Config {
    #[serde(rename = "includeLocation")]
    /// should it include the location in the top left?
    include_location: bool,
    /// the projects to include in the Resume
    projects: Vec<Projects>,
    /// graduation date as May 26??
    twentysix: bool,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "lowercase")]
enum Projects {
    Aoc,
    Attendance,
    Cryptenv,
    Portfolio,
    Teachtok,
    LockinAI,
    Ecoflare,
    Brainrot,
    AlphaSnake,
}

impl Default for Config {
    fn default() -> Self {
        let config_file = include_str!("../config.toml");
        toml::from_str(config_file).expect("default config file is valid toml")
    }
}
