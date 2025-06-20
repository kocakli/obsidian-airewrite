# AIRewrite - Obsidian Community Plugin Submission Instructions

## 📋 Pre-Submission Steps

### 1. Prepare Your Repository
```bash
# Commit all changes
git add .
git commit -m "Prepare AIRewrite v1.0.0 for Obsidian Community Store submission"

# Push to GitHub
git push origin main

# Create and push tag
git tag v1.0.0
git push origin v1.0.0
```

### 2. Verify GitHub Release
After pushing the tag, the GitHub Actions workflow will automatically create a release with:
- main.js
- manifest.json
- styles.css

Wait for the workflow to complete at: https://github.com/kocakli/obsidian-airewrite/actions

## 🚀 Submission Process

### Step 1: Fork the Obsidian Releases Repository
1. Go to https://github.com/obsidianmd/obsidian-releases
2. Click "Fork" button
3. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/obsidian-releases.git
cd obsidian-releases
```

### Step 2: Add Your Plugin Entry
1. Open `community-plugins.json`
2. Find the correct alphabetical position for "airewrite"
3. Add this entry (already formatted):

```json
{
    "id": "airewrite",
    "name": "AIRewrite",
    "author": "kocakli",
    "description": "Transform your notes with AI - rewrite, enhance, and improve your content instantly using Google Gemini",
    "repo": "kocakli/obsidian-airewrite"
},
```

### Step 3: Create Pull Request
1. Commit your changes:
```bash
git add community-plugins.json
git commit -m "Add AIRewrite plugin"
git push origin main
```

2. Go to your fork on GitHub
3. Click "Pull Request" → "New Pull Request"
4. Use this PR template:

```markdown
## Plugin Description

**AIRewrite** transforms your notes using Google Gemini AI. Select any text and instantly rewrite it in different styles (Academic, Business, Creative, etc.) with custom instructions. Features live preview, multi-language support, and secure local API key storage.

## Checklist

- [x] I have read the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- [x] My plugin repo includes all required files (manifest.json, main.js, README.md, LICENSE)
- [x] My plugin has a unique ID not already in use
- [x] My plugin does not access user data outside of Obsidian
- [x] I have tested my plugin on desktop (Windows/Mac/Linux)
- [x] My repo has a release with the required files
- [x] I have added a license to my repo

## Repository

https://github.com/kocakli/obsidian-airewrite

## Release

https://github.com/kocakli/obsidian-airewrite/releases/tag/v1.0.0
```

## ✅ Final Verification Checklist

Before submitting, ensure:
- [ ] GitHub repository is public
- [ ] Release v1.0.0 is published with main.js, manifest.json, styles.css
- [ ] README.md has clear installation and usage instructions
- [ ] No console.log statements in production code
- [ ] API key is handled securely
- [ ] Plugin tested on latest Obsidian version

## 📧 Submission Message Template

If you need to contact Obsidian team:

```
Subject: New Plugin Submission - AIRewrite

Hello Obsidian Team,

I would like to submit AIRewrite for inclusion in the Obsidian Community Plugins.

Plugin: AIRewrite
Repository: https://github.com/kocakli/obsidian-airewrite
Description: Transform your notes with AI - rewrite, enhance, and improve your content instantly using Google Gemini

The plugin allows users to rewrite their text using Google Gemini AI with multiple writing styles and custom instructions. It includes live preview, secure API key storage, and seamless Obsidian integration.

I have submitted a PR to the obsidian-releases repository and confirmed all guidelines are met.

Thank you for your consideration!

Best regards,
kocakli
```

## 🎯 After Submission

1. **Monitor PR**: Check for any feedback on your pull request
2. **Be Patient**: Review process typically takes 1-2 weeks
3. **Stay Active**: Respond promptly to any questions or requested changes
4. **Prepare Updates**: Have bug fixes ready if issues are found

## 📝 Notes

- Entry must be in alphabetical order by plugin ID
- Description should be under 250 characters
- Ensure your GitHub release is not a pre-release
- Your plugin will be automatically checked for compliance

Good luck with your submission! 🚀