# AIRewrite for Obsidian

Transform your notes with AI - rewrite, enhance, and improve your content instantly using Google Gemini.

![AIRewrite Demo](https://raw.githubusercontent.com/kocakli/obsidian-airewrite/main/demo.gif)

## Features

- 🤖 **AI-Powered Rewriting**: Transform your text with Google Gemini AI
- 🎨 **Multiple Writing Styles**: Choose from Academic, Casual, Business, Creative, Technical, or Simple styles
- 🌍 **Multi-Language Support**: Works seamlessly with any language
- 👁️ **Live Preview**: See the transformed text before applying changes
- ⚡ **Smart Selection**: Process selected text or entire documents
- 🎯 **Custom Instructions**: Add specific requirements for your rewrites
- 🔒 **Privacy First**: Your API key is stored locally and securely

## Installation

### From Obsidian Community Plugins
1. Open Settings → Community plugins
2. Search for "AIRewrite"
3. Click Install and then Enable

### Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/kocakli/obsidian-airewrite/releases)
2. Extract the files to your vault's `.obsidian/plugins/airewrite/` folder
3. Reload Obsidian
4. Enable the plugin in Settings → Community plugins

## Setup

1. Get your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open AIRewrite settings in Obsidian
3. Enter your API key
4. Choose your preferred AI model (Gemini 1.5 Flash recommended for speed)

## Usage

### Rewrite Selected Text
1. Select the text you want to transform
2. Right-click and choose "Rewrite with AI" or use the command palette
3. Choose your writing style
4. Add any custom instructions (optional)
5. Preview the result and apply if satisfied

### Rewrite Entire Document
1. Open the document you want to transform
2. Use the command palette: "AIRewrite: Rewrite entire document"
3. Follow the same steps as above

### Available Writing Styles

- **Academic**: Formal, well-researched tone with proper citations format
- **Casual**: Friendly, conversational tone
- **Business**: Professional, clear, and concise
- **Creative**: Imaginative and expressive writing
- **Technical**: Precise, detailed explanations
- **Simple**: Easy to understand, clear language

## Commands

- `AIRewrite: Rewrite selected text` - Transform the currently selected text
- `AIRewrite: Rewrite entire document` - Transform the complete active document
- `AIRewrite: Validate API key` - Check if your API key is working

## Settings

- **API Key**: Your Google Gemini API key
- **Model**: Choose between Gemini models (1.5 Flash, 1.5 Pro, etc.)
- **Max Tokens**: Control the output length
- **Temperature**: Adjust creativity (0 = focused, 1 = creative)
- **Default Style**: Set your preferred writing style

## Privacy & Security

- Your API key is stored locally in your vault
- No data is sent to any servers except Google's Gemini API
- All processing happens directly between your vault and Google's API

## Troubleshooting

### API Key Issues
- Ensure your API key is valid and has the necessary permissions
- Check your internet connection
- Verify you haven't exceeded your API quota

### Performance
- For faster responses, use Gemini 1.5 Flash model
- Reduce max tokens for quicker processing
- Process smaller text selections when possible

## Support

- Report issues on [GitHub](https://github.com/kocakli/obsidian-airewrite/issues)
- Join the discussion in [Obsidian Forums](https://forum.obsidian.md)

## License

MIT License - see [LICENSE](LICENSE) for details

## Credits

Created by [kocakli](https://github.com/kocakli)

---

If you find AIRewrite helpful, consider giving it a star on [GitHub](https://github.com/kocakli/obsidian-airewrite) ⭐