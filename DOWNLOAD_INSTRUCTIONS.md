# CORTEX-SHELL Reusable Package - Download Instructions

## 📦 Available Download Packages

All packages are ready to download. Choose what you need:

### Complete Package (Recommended)
**`cortex-shell-reusable.zip`** (553 KB)
- ✅ Everything you need
- ✅ All templates, schemas, vendor libs, documentation
- ✅ Ready to use immediately

**Contents:**
- `templates/` - HTML, cortex-app.js, service worker
- `vendor-libs/` - React, ReactDOM, Marked (local copies)
- `schemas/` - All AI schemas for content generation
- `documentation/` - Setup, architecture, customization guides
- `INDEX.md` - Package overview
- `SETUP_GUIDE.md` - Quick start

**👉 DOWNLOAD THIS if unsure - it's all-in-one**

---

### Individual Packages (Pick and Choose)

#### 1. **cortex-shell-templates-only.zip** (128 KB)
Just the application files - perfect if you already have schemas elsewhere
- `index.html` - Main template
- `cortex-app.js` - Pre-compiled React app
- `sw.js` - Service Worker
- `manifest.webmanifest` - PWA manifest
- `404.html` - Error page

**Use when:** You only want the app template

---

#### 2. **cortex-shell-vendor-libs.zip** (379 KB)
Local copies of React, ReactDOM, Marked, and all assets
- `assets/vendor/react.min.js`
- `assets/vendor/react-dom.min.js`
- `assets/vendor/marked.min.js`
- All PNG, SVG, and other assets

**Use when:** You have templates but need vendor libraries

---

#### 3. **cortex-shell-schemas-only.zip** (28 KB)
All schemas for AI content generation
- `CONTENT_SCHEMA_MASTER.md`
- `DOMAIN_SCHEMA_DESIGN.md`
- `DOMAIN_CONTENT_GUIDE.md`
- `RESOURCE_ARCHITECTURE.md`
- `PROMPT_MATERI_REFINED.md`
- `PROMPT_SOAL_REFINED.md`

**Use when:** You're building content and want AI to follow schemas

---

#### 4. **cortex-shell-documentation.zip** (18 KB)
Just the documentation and guides
- `INDEX.md` - Package index
- `SETUP_GUIDE.md` - Quick start
- `documentation/ARCHITECTURE.md`
- `documentation/CUSTOMIZATION.md`
- `documentation/AI_AGENT_GUIDE.md`

**Use when:** You want to read docs without other files

---

## 🌐 Download Links & Instructions

### Option A: Direct Download from Cloud Storage

**Files are located at:**
```
/tmp/cortex-shell-reusable.zip
/tmp/cortex-shell-templates-only.zip
/tmp/cortex-shell-schemas-only.zip
/tmp/cortex-shell-vendor-libs.zip
/tmp/cortex-shell-documentation.zip
```

**To download from cloud terminal:**
```bash
# Using curl (works from anywhere)
curl -O /tmp/cortex-shell-reusable.zip
scp user@cloud:/tmp/cortex-shell-reusable.zip .

# Or check if files are in public bucket/CDN
# (Your cloud provider may have direct download links)
```

### Option B: GitHub Release (Recommended)

**For direct access**, files should be committed to GitHub:

```bash
# In your cloud shell, commit and push to GitHub
cd /home/user/CORTEX-SHELL/dist/packages/

# Copy package files here
cp /tmp/cortex-shell-*.zip ./

# Commit
git add cortex-shell-*.zip
git commit -m "release: add reusable package downloads"
git push origin main

# Then download from GitHub Releases
# https://github.com/arsyhabib/CORTEX-SHELL/releases
```

### Option C: Manual Assembly

If you have cloud terminal access, assemble manually:

```bash
# Copy files from /tmp/cortex-shell-reusable/ to your local machine
# Using your terminal or file manager

# Example: if using SSH
scp -r cloud-user@your-cloud:/tmp/cortex-shell-reusable ~/your-local-path/
```

---

## 📥 What to Do After Download

### Step 1: Extract Package
```bash
unzip cortex-shell-reusable.zip
# Creates: cortex-shell-reusable/ directory
```

### Step 2: View Contents
```bash
cd cortex-shell-reusable/
ls -la
# Shows: templates/, schemas/, vendor-libs/, documentation/, INDEX.md, etc
```

### Step 3: Read Getting Started
```bash
# Open in text editor or markdown viewer
cat INDEX.md           # Start here - 5 minute overview
cat SETUP_GUIDE.md     # Step-by-step setup
```

### Step 4: Setup Your Project
```bash
# Create new project directory
mkdir my-new-app
cd my-new-app

# Copy files from package
cp -r ../cortex-shell-reusable/templates/* .
cp -r ../cortex-shell-reusable/vendor-libs/assets .

# Optionally copy schemas for reference
cp -r ../cortex-shell-reusable/schemas ./docs/

# Test locally
python3 -m http.server 8000
# Open http://localhost:8000
```

---

## 📋 File Listing with Sizes

```
cortex-shell-reusable/
├── INDEX.md                          (5 KB)
├── SETUP_GUIDE.md                    (12 KB)
├── templates/
│   ├── index.html                    (131 KB)
│   ├── cortex-app.js                 (426 KB)
│   ├── sw.js                         (2 KB)
│   ├── manifest.webmanifest          (1 KB)
│   └── 404.html                      (1 KB)
├── vendor-libs/
│   └── assets/
│       └── vendor/
│           ├── react.min.js          (11 KB)
│           ├── react-dom.min.js      (129 KB)
│           └── marked.min.js         (36 KB)
├── schemas/
│   ├── CONTENT_SCHEMA_MASTER.md      (17 KB)
│   ├── DOMAIN_SCHEMA_DESIGN.md       (19 KB)
│   ├── DOMAIN_CONTENT_GUIDE.md       (13 KB)
│   ├── RESOURCE_ARCHITECTURE.md      (10 KB)
│   ├── PROMPT_MATERI_REFINED.md      (8 KB)
│   └── PROMPT_SOAL_REFINED.md        (8 KB)
├── documentation/
│   ├── ARCHITECTURE.md               (20 KB)
│   ├── CUSTOMIZATION.md              (25 KB)
│   └── AI_AGENT_GUIDE.md             (20 KB)
└── config/                           (structure for your configs)

Total: 553 KB (compressed), ~880 KB (uncompressed)
24 files, highly usable and documented
```

---

## ✅ Checklist After Setup

- [ ] Downloaded package
- [ ] Extracted to local directory
- [ ] Read INDEX.md (overview)
- [ ] Read SETUP_GUIDE.md (instructions)
- [ ] Copied templates/ to your project
- [ ] Copied vendor-libs/assets to your project
- [ ] Tested locally with http server
- [ ] Opened http://localhost:8000 in browser
- [ ] Checked browser console (no 404 errors)
- [ ] Customized index.html (title, colors)
- [ ] Ready to deploy

---

## 🤔 Troubleshooting Downloads

### "Permission Denied" when copying files
```bash
# Check file permissions
ls -la /tmp/cortex-shell-reusable.zip

# If needed, change permissions
chmod 644 /tmp/cortex-shell-reusable.zip
chmod -R 755 /tmp/cortex-shell-reusable/
```

### ZIP extraction fails
```bash
# Verify ZIP integrity
unzip -t cortex-shell-reusable.zip

# Try with different tool
tar xzf cortex-shell-reusable.tar.gz  # if tar available
```

### Large file (553 KB) won't transfer
```bash
# Download in parts using smaller individual packages:
# - cortex-shell-templates-only.zip (128 KB)
# - cortex-shell-vendor-libs.zip (379 KB)
# - cortex-shell-schemas-only.zip (28 KB)
# - cortex-shell-documentation.zip (18 KB)

# Combine manually in your project
```

### Can't find /tmp files
```bash
# List available downloads
ls /tmp/cortex-shell*.zip

# If not there, they may be in another directory
find ~ -name "cortex-shell*.zip" 2>/dev/null
```

---

## 🚀 Next Steps

1. **Download** the package(s)
2. **Extract** to your working directory
3. **Read** INDEX.md and SETUP_GUIDE.md
4. **Customize** index.html for your app
5. **Test** locally
6. **Deploy** to GitHub Pages, Netlify, or your server

---

## 💡 Pro Tips

### Tip 1: Use individual packages for CI/CD
```bash
# In your build process, download only what you need
curl https://your-storage/cortex-shell-templates-only.zip -O
unzip cortex-shell-templates-only.zip
```

### Tip 2: Version control
```bash
# Add to your git repo
git add cortex-shell-reusable/
git commit -m "feat: add CORTEX-SHELL reusable template"
git push
```

### Tip 3: Create template repo from this
```bash
# Use as base for new projects
git init new-app
cd new-app
# Copy cortex-shell-reusable contents
cp -r ../cortex-shell-reusable/* .
git add .
git commit -m "initial: cortex-shell template"
```

### Tip 4: Share with team
```bash
# Create shared folder for schemas
mkdir team-resources
cp cortex-shell-reusable/schemas/ team-resources/

# Share with AI agents, team members
# Everyone uses same schemas for consistency
```

---

## 📞 Support

If you encounter issues:

1. **Check docs first**
   - INDEX.md - Overview
   - SETUP_GUIDE.md - Getting started
   - ARCHITECTURE.md - Understanding the system

2. **Check browser console**
   - F12 → Console tab
   - Look for 404 errors (missing files)
   - Check for JavaScript errors

3. **Test offline**
   - DevTools → Application → Service Workers
   - Verify it's registered
   - Check cache storage

4. **Hard reload**
   - Ctrl+Shift+R (clear cache and reload)
   - Cmd+Shift+R (Mac)

---

**Happy building! 🚀**

For more information, see the documentation/ folder after extraction.
