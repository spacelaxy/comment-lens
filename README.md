# Comment Lens

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/spacelaxy/comment-lens)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.60.0+-blue.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)](LICENSE)

**Enhanced comment highlighting and documentation generation for multiple programming languages**

Comment Lens transforms your code comments into a powerful documentation and highlighting system. Whether you're writing JSDoc, JavaDoc, XML documentation, or custom comment patterns, Comment Lens makes your comments more visible, organized, and useful.

## 📋 Table of Contents

- [✨ Features](#-features)
  - [🎨 Smart Comment Highlighting](#-smart-comment-highlighting)
  - [📚 Documentation Generation](#-documentation-generation)
  - [🎯 Comment Organization](#-comment-organization)
  - [🔧 Developer Tools](#-developer-tools)
- [✏️ Showcase](#️-showcase)
- [🚀 Quick Start](#-quick-start)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
- [📖 Supported Languages](#-supported-languages)
  - [Language Examples](#language-examples)
- [⚙️ Configuration](#️-configuration)
  - [Settings](#settings)
  - [Configuration Options](#configuration-options)
- [🎯 Comment Patterns](#-comment-patterns)
  - [Default Patterns](#default-patterns)
  - [Custom Patterns](#custom-patterns)
  - [Pattern Examples](#pattern-examples)
- [📚 Documentation Generation](#-documentation-generation)
- [🎨 Dividers and Comment Boxes](#-dividers-and-comment-boxes)
  - [Divider Styles](#divider-styles)
  - [Comment Boxes](#comment-boxes)
- [🛠️ Commands](#️-commands)
  - [Available Commands](#available-commands)
  - [Command Palette](#command-palette)
- [🔧 Advanced Features](#-advanced-features)
  - [Auto-completion](#auto-completion)
  - [Hover Information](#hover-information)
- [🤝 Contributing](#-contributing)
  - [Development Setup](#development-setup)
  - [Contributing Guidelines](#contributing-guidelines)
  - [Areas for Contribution](#areas-for-contribution)

## ✨ Features

### 🎨 **Smart Comment Highlighting**
- **Multi-language Support**: C#, C++, Java, JavaScript, TypeScript, PHP, Rust
- **Semantic Colors**: Different colors for TODOs, FIXMEs, warnings, and more
- **Custom Patterns**: Define your own comment patterns with regex
- **Real-time Updates**: Instant highlighting as you type

### 📚 **Documentation Generation**
- **Markdown Export**: Convert comments to beautiful Markdown documentation
- **Multiple Formats**: Support for JSDoc, JavaDoc, Doxygen, XML docs, and more
- **Table of Contents**: Automatic generation with customizable templates
- **Code Examples**: Extract and format code examples from comments

### 🎯 **Comment Organization**
- **Divider Creation**: Insert decorative dividers between code sections
- **Comment Boxes**: Create visually appealing comment containers
- **Quick Insert**: Fast access via command palette and context menus
- **Customizable Styles**: Full control over appearance and behavior

### 🔧 **Developer Tools**
- **Auto-completion**: Smart suggestions for comment tags and patterns
- **Hover Information**: Rich hover details for comment patterns
- **Configuration UI**: Easy setup through VS Code settings

## ✏️ Showcase

Classic HTML Comments
<img width="901" height="380" alt="image" src="https://github.com/user-attachments/assets/597edab3-8d1d-4649-aecc-cfbf123ef912" />

Lua lang Autocomplete
<img width="947" height="362" alt="Screenshot 2025-09-12 212643" src="https://github.com/user-attachments/assets/2ef86023-8d66-4e8a-9ebe-15248cffce10" />

Comment Highlight Showcase

<img width="822" height="400" alt="Screenshot 2025-09-12 212807" src="https://github.com/user-attachments/assets/24ab4b21-a7ba-4474-8541-478897633737" />

Comment Box Generator (Ctrl + Shift + B)
<img width="760" height="472" alt="image" src="https://github.com/user-attachments/assets/ada1122f-34bb-4227-977e-50a7ac0b9626" />


## 🚀 Quick Start

### Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "Comment Lens"
4. Click Install
5. Reload VS Code

### Basic Usage

Comment Lens works automatically once installed. Here's how to get started:

#### 1. **Highlight Comments**
Simply write comments with common patterns:

```javascript
// @todo: Implement user authentication
// @bug: Fix memory leak in event listeners
// @note: This function handles complex data processing
// @warn: Performance may be slow with large datasets
```

#### 2. **Generate Documentation**
1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Generate Documentation from File"
3. Enter filename and folder (optional)
4. Get beautiful Markdown documentation

#### 3. **Insert Dividers**
1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Insert Divider"
3. Choose your preferred style
4. Customize length and text position


## 📖 Supported Languages

| Language | Documentation Format | Status |
|----------|---------------------|--------|
| **C#** | XML Documentation | ✅ Full Support |
| **C++** | Doxygen, XML | ✅ Full Support |
| **Java** | JavaDoc | ✅ Full Support |
| **JavaScript** | JSDoc | ✅ Full Support |
| **TypeScript** | TSDoc | ✅ Full Support |
| **PHP** | PHPDoc | ✅ Full Support |
| **Rust** | Rust Doc | ✅ Full Support |

### Language Examples

#### C# XML Documentation
```csharp
/// <summary>
/// Calculates the area of a circle
/// </summary>
/// <param name="radius">The radius of the circle</param>
/// <returns>The area of the circle</returns>
/// <exception cref="ArgumentException">Thrown when radius is negative</exception>
public double CalculateArea(double radius)
{
    // Implementation here
}
```

#### Java JavaDoc
```java
/**
 * Represents a user in the system
 * 
 * @param id The unique identifier
 * @param name The user's full name
 * @return A new User instance
 * @throws IllegalArgumentException if id is negative
 */
public User createUser(int id, String name) {
    // Implementation here
}
```

#### JavaScript JSDoc
```javascript
/**
 * Processes user data with validation
 * @param {Object} user - The user object
 * @param {string} user.name - User's name
 * @param {string} user.email - User's email
 * @returns {Promise<Object>} Processed user data
 * @throws {Error} When user data is invalid
 * @example
 * const result = await processUser({
 *   name: "John Doe",
 *   email: "john@example.com"
 * });
 */
async function processUser(user) {
    // Implementation here
}
```

## ⚙️ Configuration

### Settings

Comment Lens can be configured through VS Code settings. Open Settings (`Ctrl+,` or `Cmd+,`) and search for "Comment Lens":

#### Complete Configuration Example
```json
{
  "commentLens.highlightMode": "onHover",
  "commentLens.commentBoxTextPosition": "center",
  "commentLens.dividerTextPosition": "center",
  "commentLens.patterns": [
    {
      "id": "@something",
      "name": "@something",
      "pattern": "@something:",
      "textColor": "#ff",
      "backgroundColor": "#000",
      "enabled": true,
      "showTextColor": true,
      "showBackgroundColor": true,
      "overrideDefault": false
    }
  ],
  "commentLens.dividers": [
    {
      "id": "space-theme",
      "name": "Space Theme",
      "pattern": "★☆",
      "length": 40,
      "enabled": true,
      "textPosition": "center",
      "textPadding": 2
    }
  ],
  "commentLens.commentBoxes": [
    {
      "id": "custom-box",
      "name": "Custom Box",
      "topLeft": "┌",
      "topRight": "┐",
      "bottomLeft": "└",
      "bottomRight": "┘",
      "horizontal": "─",
      "vertical": "│",
      "enabled": true
    }
  ]
}
```

### Configuration Options

#### Global Settings
- **`commentLens.highlightMode`**: `"always"` | `"onHover"` - When to show comment highlighting
  - `"always"`: Comments are highlighted continuously as you type and view the file
  - `"onHover"`: Comments are only highlighted when you hover your mouse over them
- **`commentLens.dividerTextPosition`**: `"left"` | `"center"` | `"right"` - Default text position for dividers
- **`commentLens.commentBoxTextPosition`**: `"left"` | `"center"` | `"right"` - Default text position for comment boxes

#### Comment Patterns (`commentLens.patterns`)
- **`id`**: `string` - Unique identifier for the pattern
- **`name`**: `string` - Display name for the pattern
- **`pattern`**: `string` - Regex pattern to match comments
- **`textColor`**: `string` - Text color (hex, rgb, rgba)
- **`backgroundColor`**: `string` - Background color (hex, rgb, rgba)
- **`enabled`**: `boolean` - Whether this pattern is active
- **`showTextColor`**: `boolean` - Whether to apply text color
- **`showBackgroundColor`**: `boolean` - Whether to apply background color
- **`overrideDefault`**: `boolean` - Whether this pattern overrides a default one

#### Dividers (`commentLens.dividers`)
- **`id`**: `string` - Unique identifier for the divider style
- **`name`**: `string` - Display name for the divider style
- **`pattern`**: `string` - Character pattern for the divider
- **`length`**: `number` - Default length of the divider
- **`enabled`**: `boolean` - Whether this divider style is active
- **`textPosition`**: `"left"` | `"center"` | `"right"` - Position of text in the divider
- **`textPadding`**: `number` - Number of spaces around the text

#### Comment Boxes (`commentLens.commentBoxes`)
- **`id`**: `string` - Unique identifier for the comment box style
- **`name`**: `string` - Display name for the comment box style
- **`topLeft`**: `string` - Character for top-left corner
- **`topRight`**: `string` - Character for top-right corner
- **`bottomLeft`**: `string` - Character for bottom-left corner
- **`bottomRight`**: `string` - Character for bottom-right corner
- **`horizontal`**: `string` - Character for horizontal lines
- **`vertical`**: `string` - Character for vertical lines
- **`enabled`**: `boolean` - Whether this comment box style is active



## 🎯 Comment Patterns

### Default Patterns

Comment Lens comes with 8 built-in patterns:

| Pattern | Description | Color |
|---------|-------------|-------|
| `@warn` | Warnings and alerts | 🔴 Red |
| `@question` | Questions and doubts | 🔵 Blue |
| `@todo` | Tasks to be completed | 🟡 Yellow |
| `@fixme` | Code that needs fixing | 🟠 Orange |
| `@note` | Important information | 🟢 Green |
| `@highlight` | Code sections to highlight | 🟡 Yellow |
| `@test` | Test-related comments | 🟦 Teal |
| `@status` | Status indicators | 🔵 Blue |

### Custom Patterns

Create your own patterns with regex:

```json
{
  "id": "api-endpoint",
  "name": "API Endpoint",
  "pattern": "@API|@api|@ENDPOINT|@endpoint",
  "textColor": "#2E7D32",
  "backgroundColor": "#E8F5E8",
  "enabled": true
}
```

### Pattern Examples

```javascript
// @todo: Implement user authentication system
// @bug: Fix memory leak in event listeners  
// @note: This function handles complex data processing
// @warn: Performance may be slow with large datasets
// @highlight: 15-20 This section contains critical business logic
// @api: POST /api/users - Create new user
// @security: Validate input to prevent XSS attacks
```

## 📚 Documentation Generation

Comment Lens can generate beautiful Markdown documentation from your code comments. Use the Command Palette to run "Generate Documentation from File" and convert your comments into organized documentation.

**Features:**
- Convert JSDoc, JavaDoc, XML docs, and more to Markdown
- Automatic table of contents generation
- Group by type (functions, classes, methods)
- Extract and format code examples


## 🎨 Dividers and Comment Boxes

### Divider Styles

Create visual separators between code sections with simple lines:

```
--------------------------------------------------
```

Available patterns: `-`, `=`, `*`, `#`, `~`, `>`, `+`, `_`, `^`, `|`, `\`, `/`, `@`, `&`, `%`, `$`, `!`, `?`, `:`, `;`, `.`, `,`

### Comment Boxes

Create visually appealing comment containers:

```
┌─────────────────────────────────────┐
│ This is an important notice         │
│ that needs attention                │
└─────────────────────────────────────┘
```

Available styles: Simple, Double, Rounded, Custom Unicode


## 🛠️ Commands

### Available Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| `Comment Lens: Insert Divider` | Insert a decorative divider | `Ctrl+Shift+D` |
| `Comment Lens: Insert Comment Box` | Insert a comment box | `Ctrl+Shift+B` |
| `Comment Lens: Generate Documentation from File` | Generate Markdown documentation from current file | `Ctrl+Shift+M` |

### Command Palette

Access all Comment Lens features via the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

1. Type "Comment Lens" to see all available commands
2. Select the desired action
3. Follow the prompts or use default settings

## 🔧 Advanced Features

### Auto-completion

Comment Lens provides intelligent auto-completion for comment tags:

```javascript
// Type @ and get suggestions for:
// @todo, @fixme, @note, @warn, @bug, @highlight, @api, @security
```

### Hover Information

Hover over `@highlight` comments to see detailed information:




## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/spacelaxy/comment-lens.git
   cd comment-lens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run compile
   ```

4. **Run tests**
   ```bash
   npm test
   ```

### Contributing Guidelines

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Areas for Contribution

- **New Language Support**: Add parsers for additional languages
- **Documentation**: Improve examples and guides
- **Testing**: Add more comprehensive tests
- **Performance**: Optimize parsing and rendering
- **UI/UX**: Enhance the user experience
---

[![Star History Chart](https://api.star-history.com/svg?repos=spacelaxy/comment-lens&type=Date)](https://star-history.com/#spacelaxy/comment-lens&Date)

---
**Copyright © 2025 Spacelaxy LLC. All rights reserved.**