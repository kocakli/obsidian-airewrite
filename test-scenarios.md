# Geminify Test Scenarios

## 🧪 Test Environment Setup

1. Create a new Obsidian vault called "Geminify Test"
2. Install the plugin following README instructions
3. Add your Gemini API key in settings
4. Create test notes with the content below

## 📝 Test Scenarios

### 1. Short Text Test (50 words)
Create a note with:
```markdown
# Short Test

This is a test paragraph. It contains some basic information that needs to be rewritten. The AI should make it clearer and more engaging while preserving the core message. This paragraph has exactly fifty words to test the short text handling capabilities of our Geminify plugin.
```

**Expected Result**: Text should be rewritten smoothly without any issues.

### 2. Long Text Test (1000+ words)
Create a note with a full article or essay. You can use Lorem Ipsum or any long-form content.

**Expected Result**: 
- If within token limit: Processes successfully
- If exceeds limit: Shows error with token count

### 3. Markdown Formatting Test
```markdown
# Markdown Test

## Headers Should Be Preserved

This is **bold text** and this is *italic text*.

- Bullet point one
- Bullet point two
  - Nested bullet

1. Numbered list
2. Second item

> This is a blockquote

`inline code` should be preserved

\```javascript
// Code blocks too
function test() {
  return "Hello Geminify!";
}
\```

[Links should work](https://obsidian.md)

![Images too](image.png)
```

**Expected Result**: All markdown formatting should be preserved in the rewritten text.

### 4. Special Characters Test
```markdown
# Special Characters

Emojis: 😊 🚀 🎉 ❤️
Symbols: @#$%^&*()_+-={}[]|\:";'<>?,./
Math: α β γ δ ∑ ∫ ≠ ≤ ≥
International: üöäß ñ ç è é ê ë
Unicode: 你好 مرحبا שלום こんにちは
```

**Expected Result**: All special characters should be handled correctly.

### 5. Empty Selection Test
- Open any note
- Don't select any text
- Try to run "Rewrite Selected Text" command

**Expected Result**: Should show error message asking to select text.

### 6. Empty Note Test
- Create a completely empty note
- Try to run "Rewrite Entire Note" command

**Expected Result**: Should show error "Boş metin yeniden yazılamaz".

### 7. Network Error Test
- Disconnect from internet
- Try to rewrite any text

**Expected Result**: Should show network error message.

### 8. Invalid API Key Test
- Enter an invalid API key in settings
- Try to rewrite text

**Expected Result**: Should show "Geçersiz API anahtarı" error.

### 9. Rate Limit Test
- Make rapid consecutive requests (10+ in quick succession)

**Expected Result**: Should handle rate limiting gracefully with appropriate error message.

### 10. Style Variations Test
Test each writing style with the same text:
```markdown
The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for testing purposes.
```

Try with each style:
- 🎯 Default
- 💼 Professional  
- 🎓 Academic
- 😊 Casual
- 📝 Blog
- ⚙️ Technical
- 🎨 Creative

**Expected Result**: Each style should produce distinctly different rewrites.

### 11. Context Menu Test
- Right-click with text selected
- Right-click without text selected

**Expected Result**: Context menu should show appropriate options.

### 12. Keyboard Shortcuts Test
- `Ctrl+Shift+G`: Should trigger quick rewrite
- `Ctrl+Alt+G`: Should open style selector

**Expected Result**: Shortcuts should work as configured.

### 13. Progress Modal Test
- Select a medium-length text (500+ words)
- Use "Rewrite Selected Text" command

**Expected Result**: Progress modal should show with smooth progress updates.

### 14. Accept/Reject Test
- Rewrite any text
- Test both Accept and Reject buttons

**Expected Result**: 
- Accept: Text should be replaced
- Reject: Original text should remain

### 15. Append Mode Test
- Use "Append Rewritten Version" command

**Expected Result**: Rewritten text should be added below with "### 🤖 Geminified Version" header.

### 16. Multiple Concurrent Requests Test
- Try to trigger multiple rewrites simultaneously

**Expected Result**: Should block with "Bir işlem zaten devam ediyor" message.

### 17. Very Long Token Test
Create a note with 10,000+ words

**Expected Result**: Should show token limit error with estimated token count.

### 18. Status Bar Test
- Watch status bar during operations

**Expected Result**:
- Idle: "🤖 Geminify Ready"
- Processing: "⚙️ Processing..."
- Error: "❌ Geminify Error" (for 3 seconds)

### 19. Settings Test
- Change each setting
- Test if changes take effect

**Expected Result**: All settings should work as expected.

### 20. Memory Leak Test
- Perform 20+ rewrites in succession
- Monitor Obsidian's memory usage

**Expected Result**: Memory should not continuously increase.

## 🐛 Common Issues to Check

1. **API Key Validation**: Test button should work
2. **Model Selection**: Both Flash and Pro should work
3. **Temperature Changes**: Should affect creativity
4. **Token Limit**: Should properly limit response length
5. **Custom System Prompt**: Should change AI behavior

## 📊 Performance Benchmarks

| Text Length | Expected Time |
|------------|---------------|
| 50 words   | 1-3 seconds   |
| 500 words  | 3-5 seconds   |
| 1000 words | 5-8 seconds   |
| 2000 words | 8-12 seconds  |

## ✅ Checklist

- [ ] All commands work
- [ ] Context menu works
- [ ] Keyboard shortcuts work
- [ ] Progress modal displays correctly
- [ ] Error messages are in Turkish
- [ ] Status bar updates properly
- [ ] Settings persist after restart
- [ ] No memory leaks
- [ ] Handles all text types
- [ ] Graceful error handling