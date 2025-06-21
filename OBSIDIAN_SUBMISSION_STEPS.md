# 🎯 Obsidian Community Plugin Submission Steps

## 📋 Prerequisites (✅ Completed)
- [x] GitHub release created with tag 1.0.0
- [x] Build files ready (main.js, manifest.json, styles.css)
- [x] Correct PR template prepared
- [x] Community plugins entry ready

## 🚀 Submission Process

### Step 1: Fork Obsidian Releases Repository
1. Go to: https://github.com/obsidianmd/obsidian-releases
2. Click **"Fork"** button (top right)
3. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/obsidian-releases.git
cd obsidian-releases
```

### Step 2: Add Plugin Entry
1. Open `community-plugins.json` file
2. Find the correct alphabetical position for "airewrite"
3. Add this entry (copy exactly):

```json
{
  "id": "airewrite",
  "name": "AIRewrite", 
  "author": "kocakli",
  "description": "Transform your notes with AI - rewrite, enhance, and improve your content instantly using Google Gemini",
  "repo": "kocakli/obsidian-airewrite"
},
```

⚠️ **Important**: Add comma after the entry and maintain proper JSON formatting!

### Step 3: Commit Changes
```bash
git add community-plugins.json
git commit -m "Add AIRewrite plugin"
git push origin main
```

### Step 4: Create Pull Request
1. Go to your forked repository on GitHub
2. Click **"Pull Request"** → **"New Pull Request"**
3. **Title**: `Add AIRewrite plugin`
4. **Description**: Copy content from `OBSIDIAN_PR_TEMPLATE.md`:

```markdown
# Add AIRewrite plugin

## I am submitting a new Community Plugin

**Repo URL**
Link to my plugin: https://github.com/kocakli/obsidian-airewrite

## Release Checklist

- [x] I have tested the plugin on Windows
- [x] macOS  
- [x] Linux
- [ ] Android (Desktop only plugin)
- [x] I have read the tips in https://github.com/obsidianmd/obsidian-releases/blob/master/plugin-review.md and have self-reviewed my plugin to avoid these common pitfalls.
- [x] I have added a license in the LICENSE file.
- [x] My project respects and is compatible with the original license of any code from other plugins that I'm using.
- [x] I have given proper attribution to these other projects in my README.md.
```

### Step 5: Submit PR
Click **"Create Pull Request"**

## 🔍 Important Notes

- **Plugin ID**: Must be unique - "airewrite" is available
- **Description**: Must be under 250 characters (current: 115 ✓)
- **Repository**: Must be public with proper release
- **Testing**: Mention desktop platforms only (not mobile)

## 📊 Final Checklist
- [ ] GitHub release exists at: https://github.com/kocakli/obsidian-airewrite/releases/tag/1.0.0
- [ ] Release contains main.js, manifest.json, styles.css
- [ ] Entry added to community-plugins.json in correct alphabetical order
- [ ] PR created with exact template format
- [ ] All checklist items marked correctly

## ⏱️ Timeline
- **Review process**: 1-2 weeks typically
- **Response**: Monitor PR for any feedback
- **Approval**: Plugin will appear in Community Plugins store

Good luck! 🍀