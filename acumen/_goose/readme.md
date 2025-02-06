# Goose Assistant Configuration

This directory contains configuration and support files for the Goose AI assistant.

## Important Files and Directories

- `goose_config_symlink/` - Contains the main configuration files
  - `config.yaml` - Main configuration file for extensions and settings
  - `.goosehints` - Contains hints and context for more efficient interactions
- `session_notes/` - Records of previous session interactions and important decisions
- `memory/` - Local memory storage for project-specific information

## Session Notes

Session notes should follow this naming convention:
`acumen/_goose/session_notes/YYYY_MM_DD_N_description.md`

Where:
- YYYY_MM_DD = Date in year_month_day format (e.g., 2024_03_20)
- N = Session number for that day (1, 2, 3, etc.)
- description = Brief kebab-case description of main topics (e.g., setup-tavily-extension)

Examples:
- 2024_03_20_1_initial-setup.md
- 2024_03_20_2_test-tavily-search.md

Each session note should include:
1. Summary of changes made
2. Active extensions used
3. Next steps or pending tasks
4. Important decisions or configurations
5. Any issues encountered

## Important Paths

- Config symlink: `acumen/_goose/goose_config_symlink/config.yaml`
- Available extensions: `extensions-site/public/servers.json`