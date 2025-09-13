# Comment Lens Extension Customization

This directory contains examples of how to customize the Comment Lens extension for your specific needs.

## Configuration Files

### 1. `extension-settings.json`
Basic customization example with common comment patterns and dividers.

**Features:**
- Custom TODO, Important, Deprecated patterns
- Performance and Security warnings
- Code Review markers
- Basic divider styles

### 2. `advanced-customization.json`
Advanced customization for professional development workflows.

**Features:**
- API Endpoint markers
- Database-related comments
- Testing and Optimization patterns
- Feature Request tracking
- Breaking Change warnings
- Professional divider styles

### 3. `language-specific-patterns.json`
Language-specific patterns for different programming languages.

**Supported Languages:**
- **C#**: XML documentation and C# specific patterns
- **C++**: Doxygen documentation and C++ patterns
- **Java**: JavaDoc tags and Java patterns
- **JavaScript**: JSDoc tags and JavaScript patterns
- **TypeScript**: TSDoc tags and TypeScript patterns
- **PHP**: PHPDoc tags and PHP patterns
- **Rust**: Rust documentation and Rust patterns

## How to Use

### Method 1: VS Code Settings UI
1. Open VS Code Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "Comment Lens"
3. Configure patterns, dividers, and comment boxes
4. Copy patterns from the example files

### Method 2: Settings JSON
1. Open VS Code Settings JSON (`Ctrl+Shift+P` → "Preferences: Open Settings (JSON)")
2. Copy configurations from the example files
3. Paste into your `settings.json`

### Method 3: Workspace Settings
1. Create `.vscode/settings.json` in your project root
2. Add Comment Lens configurations
3. Share with your team

## Configuration Options

### Comment Patterns
```json
{
  "id": "unique-identifier",
  "name": "Display Name",
  "pattern": "regex-pattern",
  "textColor": "#hex-color",
  "backgroundColor": "#hex-color",
  "enabled": true,
  "showTextColor": true,
  "showBackgroundColor": true,
  "overrideDefault": false
}
```

### Divider Styles
```json
{
  "id": "unique-identifier",
  "name": "Display Name",
  "pattern": "character",
  "length": 80,
  "enabled": true,
  "textPosition": "center|left|right",
  "textPadding": 2
}
```

### Comment Boxes
```json
{
  "id": "unique-identifier",
  "name": "Display Name",
  "topLeft": "┌",
  "topRight": "┐",
  "bottomLeft": "└",
  "bottomRight": "┘",
  "horizontal": "─",
  "vertical": "│",
  "enabled": true
}
```

## Color Guidelines

### Text Colors
- **Red (#D32F2F)**: Errors, warnings, breaking changes
- **Orange (#F57C00)**: TODOs, optimizations, performance
- **Blue (#1976D2)**: Information, documentation, APIs
- **Green (#2E7D32)**: Success, completion, positive actions
- **Purple (#7B1FA2)**: Testing, special features, enhancements

### Background Colors
Use lighter shades of text colors for backgrounds to ensure readability.

## Best Practices

1. **Use Semantic Colors**: Choose colors that match the meaning of the comment
2. **Keep Patterns Simple**: Avoid overly complex regex patterns
3. **Test Patterns**: Verify patterns work with your code style
4. **Team Consistency**: Share configurations with your team
5. **Performance**: Limit the number of active patterns for better performance

## Examples

### Basic TODO Pattern
```json
{
  "id": "todo",
  "name": "TODO",
  "pattern": "@TODO|@todo|TODO:|todo:",
  "textColor": "#F57C00",
  "backgroundColor": "#FFF3E0",
  "enabled": true,
  "showTextColor": true,
  "showBackgroundColor": true,
  "overrideDefault": false
}
```

### Custom Divider
```json
{
  "id": "section-divider",
  "name": "Section Divider",
  "pattern": "=",
  "length": 80,
  "enabled": true,
  "textPosition": "center",
  "textPadding": 2
}
```

## Troubleshooting

### Pattern Not Working
1. Check regex syntax
2. Verify the pattern matches your comment style
3. Ensure the pattern is enabled
4. Test with a simple pattern first

### Colors Not Showing
1. Verify hex color format (#RRGGBB)
2. Check VS Code theme compatibility
3. Ensure both text and background colors are set
4. Restart VS Code after configuration changes

### Performance Issues
1. Reduce the number of active patterns
2. Simplify complex regex patterns
3. Use specific patterns instead of broad ones
4. Disable unused patterns

## Contributing

Feel free to submit your own customization examples by creating a pull request!
