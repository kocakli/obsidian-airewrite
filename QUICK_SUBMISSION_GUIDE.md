# 🚀 AIRewrite Submission Quick Reference

## 1️⃣ Immediate Actions Required

```bash
# 1. Commit and push everything
git add .
git commit -m "Prepare AIRewrite v1.0.0 for Obsidian Community Store submission"
git push origin main

# 2. Create GitHub repository (if not exists)
# Go to: https://github.com/new
# Name: obsidian-airewrite
# Make it PUBLIC

# 3. Create and push release tag
git tag v1.0.0
git push origin v1.0.0

# 4. Wait for GitHub Actions to create release
# Check: https://github.com/kocakli/obsidian-airewrite/actions
```

## 2️⃣ Community Plugin Entry (Copy This Exactly)

```json
{
    "id": "airewrite",
    "name": "AIRewrite",
    "author": "kocakli",
    "description": "Transform your notes with AI - rewrite, enhance, and improve your content instantly using Google Gemini",
    "repo": "kocakli/obsidian-airewrite"
},
```

## 3️⃣ Submission Steps

1. **Fork**: https://github.com/obsidianmd/obsidian-releases
2. **Edit**: community-plugins.json (add entry alphabetically)
3. **Commit**: "Add AIRewrite plugin"
4. **PR Title**: "Add AIRewrite plugin"
5. **PR Body**: Use content from PR_TEMPLATE.md

## 4️⃣ Important URLs

- Your Repo: https://github.com/kocakli/obsidian-airewrite
- Your Release: https://github.com/kocakli/obsidian-airewrite/releases/tag/v1.0.0
- Submit PR to: https://github.com/obsidianmd/obsidian-releases
- Plugin Guidelines: https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines

## ✅ Pre-flight Checklist

- [ ] Repository is PUBLIC
- [ ] Release v1.0.0 exists with main.js, manifest.json, styles.css
- [ ] No console.log in code
- [ ] README.md is comprehensive
- [ ] Plugin ID "airewrite" is unique
- [ ] Description is under 250 characters (current: 115)

## 📊 Submission Stats

- Plugin ID: `airewrite`
- Version: `1.0.0`
- Min Obsidian Version: `0.15.0`
- Description Length: 115 characters ✓
- License: MIT ✓
- Desktop Only: Yes ✓

Ready to submit! 🎉