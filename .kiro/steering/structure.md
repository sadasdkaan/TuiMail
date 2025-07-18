# Project Structure

## Organization Principles
- Keep related files grouped together
- Separate source code from configuration and documentation
- Use clear, descriptive folder names
- Maintain consistent naming conventions

## Standard Directories
When the project develops, consider this structure:

```
/
├── src/                 # Source code
├── tests/              # Test files
├── docs/               # Documentation
├── config/             # Configuration files
├── scripts/            # Build and utility scripts
├── assets/             # Static assets (images, fonts, etc.)
└── .kiro/              # Kiro configuration and steering
    └── steering/       # AI assistant guidance files
```

## File Naming Conventions
- Use lowercase with hyphens for directories: `user-service/`
- Use descriptive names that indicate purpose
- Group related functionality in modules/packages
- Keep file names concise but meaningful

## Code Organization
- Separate concerns into different modules
- Use index files for clean imports
- Keep configuration separate from business logic
- Organize tests to mirror source structure

## Documentation
- README.md in root for project overview
- API documentation alongside code
- Architecture decisions in docs/ folder
- Keep steering rules updated as project evolves