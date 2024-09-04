---
title: "Cryptenv"
website: "https://github.com/rgodha24/cryptenv"
repo: "https://github.com/rgodha24/cryptenv"
blurb: an environment variable manager that switches envs per project, built in Rust
order: 20
tech:
 - Rust
---

# cryptenv

A super simple env variable manager.
It encrypts and saves your environment in a JSON file at DATA_DIR/cryptenv/store.json. 
The encryption key is kept in your computers secure store using [keyring](docs.rs/keyring).
Then, by editing your cryptenv.toml file, you can set environment variables for specific projects on your computer, which are automatically changed whenever you `cd` into the project directory.

For example, if you had a directory called `~/Coding/` with this layout
```
.
├── company-project
└── personal-project
```

you would define your `cryptenv.toml` like this
```toml
dirs = ["~/Coding/"]

[projects.company-project]
CLOUDFLARE_API_TOKEN = "COMPANY_CLOUDFLARE_TOKEN"

[projects.personal-project]
CLOUDFLARE_API_TOKEN = "PERSONAL_CLOUDFLARE_TOKEN"

```

and add your variables like this `cryptenv add COMPANY_CLOUDFLARE_TOKEN <token>` and `cryptenv add PERSONAL_CLOUDFLARE_TOKEN <token>`

## installation 
note: this is very much so a work in progress

`cargo install --git github.com/rgodha24/cryptenv`

and edit your .zshrc
```zsh
eval $(cryptenv init zsh)
```

the config file lives in `~/.config/cryptenv.toml`

