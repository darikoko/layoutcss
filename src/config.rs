use layoutcss_parser::config::LayoutStyleConfig;
use serde::{Deserialize, Serialize};
use std::{fs, io::Write};
use toml;

#[derive(Debug, Deserialize, Serialize)]
pub struct LayoutConfig {
    pub input: Input,
    pub style: LayoutStyleConfig,
    pub output: Output,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Input {
    pub directory: String,
    pub extensions: Vec<String>,
}


#[derive(Debug, Deserialize, Serialize)]
pub struct Output {
    pub file: String,
}

impl LayoutConfig {
    fn default() -> LayoutConfig {
        LayoutConfig {
            input: Input {
                directory: ".".to_string(),
                extensions: vec![".html".to_string()],
            },
            style: LayoutStyleConfig {
                harmonic_ratio: 1.618,
                min_screen: "600px".to_string(),
                max_screen: "1200px".to_string(),
                base_value: "16.5px".to_string(),
                resizing_ratio: 1.1,
                dev: true,
            },
            output: Output {
                file: "./layout.css".to_string(),
            },
        }
    }

    pub fn new() -> Self {
        let layout_conf_file = fs::read_to_string("./layout.toml");
        // if we have found and read the config file
        if let Ok(text) = layout_conf_file {
            // if we have convert the text into a LayoutConfig struct
            if let Ok(config) = toml::from_str(text.as_str()) {
                println!("Config Loaded successfully.");
                return config;
            }
            println!("Im here");
        }
        // if layout.toml is not found
        else {
            println!("Cannot found ./layout.toml, let's create a default one...");
            // if we have created layout.toml successfully
            if let Ok(mut file) = fs::File::create("./layout.toml") {
                let conf = LayoutConfig::default();
                let text = toml::to_string(&conf).unwrap();
                file.write_all(text.as_bytes()).unwrap();
                println!("New default config file created.");
            } else {
                println!("Cannot create ./layout.toml, fallback to the default config");
            }
        }
        return Self::default();
    }
}
