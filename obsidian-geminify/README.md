# 🤖 Geminify - AI-Powered Note Rewriting for Obsidian

Transform your notes with Google Gemini AI - rewrite, enhance, and improve your content instantly.

## ✨ Features

- **AI-Powered Rewriting**: Use Google's latest Gemini 2.5 AI models to intelligently rewrite and enhance your notes
- **Multiple Writing Styles**: Choose from 7 different writing styles (Professional, Academic, Casual, Blog, Technical, Creative, or Default)
- **Advanced Models**: Choose between Gemini 2.5 Flash Lite (ultra-fast) or Pro (highest quality)
- **Multi-Language Support**: Full Turkish and English interface support
- **Flexible Options**: Rewrite selected text or entire notes
- **Preview Mode**: Review changes before applying them
- **Context Menu Integration**: Right-click to access Geminify features
- **Customizable**: Configure AI behavior with system prompts, temperature, and token limits
- **Keyboard Shortcuts**: Quick access with Ctrl+Shift+G and Ctrl+Alt+G

## 📦 Installation

### Method 1: Manual Installation (Recommended for Testing)

1. **Download the Plugin**
   ```bash
   git clone https://github.com/yourusername/obsidian-geminify.git
   cd obsidian-geminify
   npm install
   npm run build
   ```

2. **Create a Test Vault**
   - Open Obsidian
   - Create a new vault called "Geminify Test"
   - Go to Settings → Community plugins
   - Turn off "Restricted mode"
   - Click "Browse" and then close the browser

3. **Install the Plugin**
   - Copy the entire `obsidian-geminify` folder to:
     - Windows: `%APPDATA%\Obsidian\Vaults\[Your Vault Name]\.obsidian\plugins\`
     - macOS: `~/Library/Application Support/obsidian/Vaults/[Your Vault Name]/.obsidian/plugins/`
     - Linux: `~/.obsidian/Vaults/[Your Vault Name]/.obsidian/plugins/`
   - Restart Obsidian
   - Go to Settings → Community plugins
   - Find "Geminify" and enable it

### Method 2: Development Mode

1. **Clone and Build**
   ```bash
   git clone https://github.com/yourusername/obsidian-geminify.git
   cd obsidian-geminify
   npm install
   npm run dev  # This will watch for changes
   ```

2. **Create Symbolic Link**
   ```bash
   # macOS/Linux
   ln -s /path/to/obsidian-geminify /path/to/vault/.obsidian/plugins/obsidian-geminify

   # Windows (Run as Administrator)
   mklink /D "C:\Path\To\Vault\.obsidian\plugins\obsidian-geminify" "C:\Path\To\obsidian-geminify"
   ```

## 🔑 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key
5. In Obsidian: Settings → Geminify → Paste your API key

**Note**: Google offers free tier with generous limits for personal use.

## 🚀 Usage

### Commands

Access these through Command Palette (Ctrl/Cmd + P):

- **Geminify: Rewrite Selected Text** - Rewrite only the selected text
- **Geminify: Rewrite Entire Note** - Rewrite the complete note
- **Geminify: Quick Rewrite** - Instant rewrite without preview
- **Geminify: Rewrite with Style** - Choose a writing style first
- **Geminify: Append Rewritten Version** - Add rewritten text below original

### Context Menu

Right-click in the editor:
- If text is selected: "🤖 Geminify: Rewrite Selection"
- If no selection: "🤖 Geminify: Rewrite Entire Note"

### Keyboard Shortcuts

You can set custom hotkeys in Settings → Hotkeys. Recommended:
- `Ctrl+Shift+G`: Quick Rewrite
- `Ctrl+Alt+G`: Rewrite with Style

## ⚙️ Configuration

### Settings

- **Interface Language**: Choose between Turkish and English
- **API Key**: Your Google Gemini API key (required)
- **Model**: Choose between Gemini 2.5 Flash Lite (ultra-fast) or Pro (highest quality)
- **System Prompt**: Customize AI behavior
- **Temperature**: Control creativity (0.0 = focused, 1.0 = creative)
- **Max Tokens**: Limit response length

### Writing Styles

1. **🎯 Default**: Clear and understandable rewriting
2. **💼 Professional**: Business-appropriate formal language
3. **🎓 Academic**: Scientific and objective approach
4. **😊 Casual**: Friendly conversational tone
5. **📝 Blog**: Engaging and flowing style
6. **⚙️ Technical**: Precise step-by-step documentation
7. **🎨 Creative**: Imaginative and compelling narrative

## 🧪 Test Scenarios

### Basic Tests

1. **Short Text (50 words)**
   ```markdown
   This is a test paragraph. It contains some basic information that needs to be rewritten. The AI should make it clearer and more engaging while preserving the core message.
   ```

2. **Long Text (1000+ words)**
   - Test with full articles or essays
   - Check token limit handling

3. **Markdown Formatting**
   ```markdown
   # Header
   - Bullet point
   - **Bold text**
   - *Italic text*
   - [Link](https://example.com)
   ```

4. **Special Characters**
   - Test with emojis 😊
   - Special symbols: @#$%^&*()
   - Non-English characters: üöäß

### Edge Cases

- Empty selection
- Empty note
- Very long text (>8000 tokens)
- No internet connection
- Invalid API key
- Rate limit exceeded

## 🔍 Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Go to Settings → Geminify
   - Enter your API key
   - Click "Test" to verify

2. **"Rate limit exceeded"**
   - Wait a few minutes
   - Consider upgrading to Gemini Pro
   - Check your Google AI Studio quotas

3. **"Network error"**
   - Check internet connection
   - Verify firewall settings
   - Try again in a few seconds

4. **"Text too long"**
   - Select smaller portions
   - Increase max tokens in settings
   - Use multiple rewrites for very long texts

### Debug Mode

Enable console logging:
1. Open Developer Tools (Ctrl+Shift+I)
2. Check Console tab for error messages
3. Report issues with console output

## 🛠️ Development

### Building from Source

```bash
# Install dependencies
npm install

# Development build (watches for changes)
npm run dev

# Production build
npm run build

# Version bump
npm version patch
```

### Project Structure

```
obsidian-geminify/
├── src/
│   ├── gemini-client.ts    # API client
│   ├── rewriter.ts         # Rewrite engine
│   ├── modals.ts           # UI components
│   ├── settings.ts         # Settings tab
│   ├── prompts.ts          # AI prompts
│   └── types.ts            # TypeScript types
├── main.ts                 # Plugin entry
├── manifest.json           # Plugin metadata
├── styles.css              # Plugin styles
└── README.md               # Documentation
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🐛 Bug Reports

Please report issues on [GitHub Issues](https://github.com/yourusername/obsidian-geminify/issues) with:
- Obsidian version
- Plugin version
- Error messages
- Steps to reproduce

## 🙏 Acknowledgments

- Built with [Obsidian Plugin API](https://github.com/obsidianmd/obsidian-api)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Inspired by the Obsidian community

---

Made with ❤️ for the Obsidian community