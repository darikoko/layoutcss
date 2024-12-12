use config::LayoutConfig;
use layoutcss_parser::get_css_from_string;
use layoutcss_parser::media_query::MediaQuery;
use notify::{Event, EventKind, RecursiveMode, Result, Watcher};
use std::collections::{HashMap, HashSet};
use std::{fs, path::Path, sync::mpsc};
pub mod config;
use std::io::Write;
use std::time::Instant;
use walkdir::WalkDir;

fn should_be_watch(suffixes: &Vec<String>, filepath: &Path) -> bool {
    suffixes.iter().any(|suffix| {
        if let Some(path) = filepath.to_str() {
            return path.ends_with(suffix.as_str());
        }
        return false;
    })
}

fn write_css(text: &String, file: &String) {
    if let Ok(mut file) = fs::File::create(file) {
        if let Err(e) = writeln!(file, "{}", text) {
            eprint!("Cannot write css to output file {}", e);
        }
    } else {
        println!("Failed to create file: {}", file);
    }
}

fn write_css_at_startup(
    layout_config: &LayoutConfig,
    previous_css_rules: &mut HashSet<String>,
    previous_css_mq_rules: &mut HashMap<MediaQuery, HashSet<String>>,
) {
    let start = Instant::now();
    let mut concatenated_files_content = String::new();
    for entry in WalkDir::new(&layout_config.input.directory)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        if should_be_watch(&layout_config.input.extensions, entry.path()) {
            let text = fs::read_to_string(entry.path()).unwrap_or("".to_string());
            concatenated_files_content.push_str(text.as_str());
        }
    }
    let css = get_css_from_string(
        &concatenated_files_content,
        Some(previous_css_rules),
        Some(previous_css_mq_rules),
        &layout_config.style,
    );
    write_css(&css, &layout_config.output.file);
    let duration = start.elapsed();
    println!("All CSS generated in: {:?}", duration);
}

fn main() -> Result<()> {
    let layout_config = LayoutConfig::new();

    // we create the hashset of css rules and we add it the reset rules
    let mut css_rules: HashSet<String> = HashSet::new();
    let mut css_mq_rules: HashMap<MediaQuery, HashSet<String>> = HashMap::new();
    

    // generate the css for all concerned files, insert it into css_rules
    // and write it to output css file
    write_css_at_startup(&layout_config, &mut css_rules, &mut css_mq_rules);

    let (tx, rx) = mpsc::channel::<Result<Event>>();
    let mut watcher = notify::recommended_watcher(tx)?;

    watcher.watch(
        Path::new(&layout_config.input.directory),
        RecursiveMode::Recursive,
    )?;
    // Block forever
    for res in rx {
        match res {
            Ok(event) => match event.kind {
                EventKind::Create(_) | EventKind::Modify(_) => {
                    if let Some(path) = event.paths.last() {
                        let start = Instant::now();
                        if should_be_watch(&layout_config.input.extensions, path) {
                            let text = fs::read_to_string(path).unwrap_or("".to_string());
                            let css = get_css_from_string(
                                &text,
                                Some(&mut css_rules),
                                Some(&mut css_mq_rules),
                                &layout_config.style,
                            );
                            write_css(&css, &layout_config.output.file);
                            let duration = start.elapsed();
                            println!("CSS updated in: {:?}", duration);
                        }
                    }
                }
                _ => {}
            },
            Err(e) => println!("watch error: {:?}", e),
        }
    }

    Ok(())
}
