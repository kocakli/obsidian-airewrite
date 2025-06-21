# Changelog

All notable changes to the AIRewrite plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2025-06-21

### Added
- 🌍 Multi-language rewrite support (14 languages + custom)
- 📱 Mobile-optimized language dropdown
- 🔐 Enhanced security education system
- 🎨 Clean UI for language selection
- ⚡ Dynamic prompt generation

### Fixed
- 📱 Mobile icon display issues
- 🎨 Language dropdown styling
- 🔧 Cross-platform compatibility

### Changed
- 📝 Enhanced settings interface
- 🚀 Improved mobile performance
- 🛡️ Better security awareness

---

## [1.1.1] - 2025-06-21
### Added
- 🔐 Security education layer
- 📱 Enhanced mobile support

## [1.1.0] - 2025-06-21
### Added
- 📱 Full mobile support
- 🎯 Touch-optimized interface

## [1.0.0] - 2025-06-21
### Added
- 🚀 Initial release
- 🤖 Gemini AI integration

## [1.1.0] - 2024-06-21

### 🎉 Major Update: Full Mobile Support Added!

### Added

#### 📱 Mobile Platform Support
- **Full iOS Support**: Native support for iPhone and iPad
- **Full Android Support**: Native support for Android phones and tablets
- **Platform Detection System**: Automatic detection of mobile vs desktop platforms
- **Adaptive UI**: Interface automatically adapts to touch vs mouse interaction

#### 🎯 Mobile-Specific Features
- **Floating Action Button**: Quick access button appears when text is selected on mobile
- **Touch-Optimized Commands**:
  - `📱 Quick Mobile Rewrite` - Instant style selector for mobile
  - `🎨 Mobile Style Selector` - Touch-friendly style selection
  - `👆 Touch Preview & Rewrite` - Optimized for touch interaction
  - `🧠 Smart Selection Rewrite` - Intelligent text selection for mobile
- **Swipe Gestures**: Swipe left to reject, swipe right to accept changes
- **Long Press Support**: Long press to trigger rewrite actions
- **Touch-Friendly Modals**: Larger buttons and touch targets for mobile

#### 🎨 Mobile-Responsive UI
- **Fullscreen Modals**: Optimized modal sizes for mobile screens
- **Large Touch Targets**: All buttons meet accessibility standards (48px minimum)
- **iOS Safe Area Support**: Proper spacing for iPhone notch and home indicator
- **Android Navigation**: Optimized for Android gesture navigation
- **High Contrast Support**: Better accessibility for vision-impaired users
- **Reduced Motion Support**: Respects user accessibility preferences

#### ⚡ Mobile Performance Optimizations
- **Battery-Friendly API Calls**: Optimized network usage for mobile
- **Smaller Processing Chunks**: Better memory management on mobile devices
- **Extended Timeouts**: Longer timeouts for slower mobile networks
- **Smart Caching**: Reduced API calls through intelligent caching

#### 🎮 Enhanced User Experience
- **Smart Text Selection**: Automatically selects sentences or paragraphs when no text is selected
- **Context-Aware Actions**: Different behaviors based on platform capabilities
- **Progressive Enhancement**: Desktop users keep existing functionality unchanged
- **Cross-Platform Sync**: Settings sync across all devices via Obsidian

### Changed
- **manifest.json**: Updated `isDesktopOnly` from `true` to `false`
- **Plugin Description**: Updated to highlight mobile support
- **API Configuration**: Platform-specific timeout and processing settings
- **UI Layout**: Responsive design adapts to screen size and input method

### Technical Improvements
- **New Architecture**: Modular platform detection system
- **Backward Compatibility**: Zero breaking changes for existing desktop users
- **Performance**: Mobile-optimized rendering and processing
- **Accessibility**: Enhanced support for screen readers and assistive technology

### Files Added
- `src/platform-detector.ts` - Cross-platform detection and configuration
- `src/mobile-ui.ts` - Mobile-specific UI components and interactions
- `src/mobile-commands.ts` - Touch-optimized commands and gestures
- `styles/mobile.css` - Mobile-responsive styles and animations

---

## [1.0.0] - 2024-06-20

### 🎉 Initial Release

### Added
- **AI-Powered Text Rewriting**: Transform text using Google Gemini AI
- **6 Writing Styles**: Academic, Casual, Business, Creative, Technical, Simple
- **Live Preview**: See changes before applying them
- **Custom Instructions**: Add specific requirements for AI rewriting
- **Smart Selection**: Process selected text or entire documents
- **Multi-Language Support**: Works with any language
- **Secure API Key Storage**: Local storage of Google Gemini API key
- **Context Menu Integration**: Right-click to rewrite selected text
- **Command Palette Support**: Access via Obsidian command palette
- **Settings Panel**: Configurable API settings and preferences

### Technical Details
- **Desktop Only**: Initial release focused on desktop platforms
- **Google Gemini Integration**: Uses latest @google/generative-ai library
- **TypeScript**: Full type safety and modern development practices
- **Obsidian API**: Native integration with Obsidian's plugin system
- **Error Handling**: Comprehensive error handling and user feedback

---

## Upcoming Features 🚀

### [1.2.0] - Planned
- **Voice-to-Text Rewriting**: Speak your rewrite instructions
- **Batch Processing**: Rewrite multiple selections at once
- **Custom Style Templates**: Create and save your own writing styles
- **Collaboration Features**: Share rewrite templates with team
- **Advanced AI Models**: Support for additional AI providers

### [1.3.0] - Planned
- **Real-time Suggestions**: AI suggestions as you type
- **Writing Analytics**: Track your writing improvements
- **Integration Plugins**: Connect with other Obsidian plugins
- **Offline Mode**: Basic rewriting without internet connection

---

## Support & Feedback

- 🐛 **Report Issues**: [GitHub Issues](https://github.com/kocakli/obsidian-airewrite/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/kocakli/obsidian-airewrite/discussions)
- ⭐ **Show Support**: [Star on GitHub](https://github.com/kocakli/obsidian-airewrite)
- 📖 **Documentation**: [Full Guide](https://github.com/kocakli/obsidian-airewrite#readme)

**Created with ❤️ by [@kocakli](https://github.com/kocakli)**
