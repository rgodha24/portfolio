use chrono::{DateTime, Datelike, FixedOffset, Local, Utc};
use comemo::Prehashed;
use typst::{
    diag::{FileError, FileResult},
    eval::Tracer,
    foundations::{Bytes, Datetime, Smart},
    syntax::{FileId, Source, VirtualPath},
    text::{Font, FontBook},
    Library, World,
};

const NORWESTER: &[u8] = include_bytes!("../fonts/norwester.otf");
const RALEWAY_LIGHT: &[u8] = include_bytes!("../fonts/raleway-Light.ttf");
const RALEWAY_LIGHT_ITALIC: &[u8] = include_bytes!("../fonts/raleway-LightItalic.ttf");
const RALEWAY_MEDIUM: &[u8] = include_bytes!("../fonts/raleway-Medium.ttf");
const RALEWAY_MEDIUM_ITALIC: &[u8] = include_bytes!("../fonts/raleway-MediumItalic.ttf");
const RALEWAY_REGULAR: &[u8] = include_bytes!("../fonts/raleway-Regular.ttf");
const RALEWAY_REGULAR_ITALIC: &[u8] = include_bytes!("../fonts/raleway-Italic.ttf");
const RALEWAY_SEMI_BOLD: &[u8] = include_bytes!("../fonts/raleway-SemiBold.ttf");
const RALEWAY_SEMI_BOLD_ITALIC: &[u8] = include_bytes!("../fonts/raleway-SemiBoldItalic.ttf");
const RALEWAY_BOLD: &[u8] = include_bytes!("../fonts/raleway-Bold.ttf");
const RALEWAY_BOLD_ITALIC: &[u8] = include_bytes!("../fonts/raleway-BoldItalic.ttf");

const FONTS: [&[u8]; 11] = [
    NORWESTER,
    RALEWAY_LIGHT,
    RALEWAY_LIGHT_ITALIC,
    RALEWAY_MEDIUM,
    RALEWAY_MEDIUM_ITALIC,
    RALEWAY_REGULAR,
    RALEWAY_REGULAR_ITALIC,
    RALEWAY_SEMI_BOLD,
    RALEWAY_SEMI_BOLD_ITALIC,
    RALEWAY_BOLD,
    RALEWAY_BOLD_ITALIC,
];

#[derive(Debug, Clone)]
struct Wrld {
    font_book: Prehashed<FontBook>,
    library: Prehashed<Library>,
    srcs: Vec<Source>,
    now: DateTime<Utc>,
    fonts: Vec<Font>,
}

impl World for Wrld {
    fn library(&self) -> &Prehashed<Library> {
        &self.library
    }

    fn book(&self) -> &Prehashed<FontBook> {
        &self.font_book
    }

    fn main(&self) -> Source {
        self.srcs[0].clone()
    }

    fn source(&self, id: FileId) -> FileResult<Source> {
        for s in &self.srcs {
            if id == s.id() {
                return Ok(s.clone());
            }
        }

        Err(FileError::NotFound("File not found".into()))
    }

    fn file(&self, id: FileId) -> FileResult<Bytes> {
        for s in &self.srcs {
            if id == s.id() {
                return Ok(s.text().as_bytes().into());
            }
        }

        Err(FileError::NotFound("File not found".into()))
    }

    fn font(&self, index: usize) -> Option<Font> {
        self.fonts.get(index).cloned()
    }

    fn today(&self, offset: Option<i64>) -> Option<Datetime> {
        // The time with the specified UTC offset, or within the local time zone.
        let with_offset = match offset {
            None => self.now.with_timezone(&Local).fixed_offset(),
            Some(hours) => {
                let seconds = i32::try_from(hours).ok()?.checked_mul(3600)?;
                self.now.with_timezone(&FixedOffset::east_opt(seconds)?)
            }
        };

        Datetime::from_ymd(
            with_offset.year(),
            with_offset.month().try_into().ok()?,
            with_offset.day().try_into().ok()?,
        )
    }
}

const CV: &'static str = include_str!("../cv.typ");
const RESUME: &'static str = include_str!("../resume.typ");
const UTILS: &'static str = include_str!("../utils.typ");
const DATA: &'static str = include_str!("../data.toml");
const EMAIL_ICON: &'static str = include_str!("../icons/email.svg");
const GITHUB_ICON: &'static str = include_str!("../icons/github.svg");
const LINKEDIN_ICON: &'static str = include_str!("../icons/linkedin.svg");
const LOCATION_ICON: &'static str = include_str!("../icons/location.svg");
const WEBSITE_ICON: &'static str = include_str!("../icons/website.svg");

use crate::Config;

/// compiles the resume with the given config. Returns the byte form of the compiled PDF
pub fn compile(config: Config) -> Vec<u8> {
    let fonts: Vec<Font> = FONTS
        .into_iter()
        .flat_map(|data| Font::iter(data.into()))
        .collect();

    let font_book = FontBook::from_fonts(fonts.iter());

    let cv_source = Source::new(
        FileId::new(None, VirtualPath::new("/cv.typ")),
        CV.to_string(),
    );

    let resume_source = Source::new(
        FileId::new(None, VirtualPath::new("/resume.typ")),
        RESUME.to_string(),
    );

    let utils_source = Source::new(
        FileId::new(None, VirtualPath::new("/utils.typ")),
        UTILS.to_string(),
    );

    let data_source = Source::new(
        FileId::new(None, VirtualPath::new("/data.toml")),
        DATA.to_string(),
    );

    let config_source = Source::new(
        FileId::new(None, VirtualPath::new("/config.toml")),
        toml::to_string(&config).expect("Failed to serialize config"),
    );

    let email_source = Source::new(
        FileId::new(None, VirtualPath::new("/icons/email.svg")),
        EMAIL_ICON.to_string(),
    );

    let github_source = Source::new(
        FileId::new(None, VirtualPath::new("/icons/github.svg")),
        GITHUB_ICON.to_string(),
    );

    let linkedin_source = Source::new(
        FileId::new(None, VirtualPath::new("/icons/linkedin.svg")),
        LINKEDIN_ICON.to_string(),
    );

    let location_source = Source::new(
        FileId::new(None, VirtualPath::new("/icons/location.svg")),
        LOCATION_ICON.to_string(),
    );

    let website_source = Source::new(
        FileId::new(None, VirtualPath::new("/icons/website.svg")),
        WEBSITE_ICON.to_string(),
    );

    let world = Wrld {
        font_book: Prehashed::new(font_book),
        library: Prehashed::new(Library::default()),
        srcs: vec![
            resume_source,
            cv_source,
            utils_source,
            data_source,
            config_source,
            email_source,
            github_source,
            linkedin_source,
            location_source,
            website_source,
        ],
        now: Utc::now(),
        fonts,
    };

    let mut tracer = Tracer::new();
    let doc = typst::compile(&world, &mut tracer).unwrap();

    typst_pdf::pdf(&doc, Smart::Auto, None)
}
