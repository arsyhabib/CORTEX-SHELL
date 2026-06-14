# CORTEX-SHELL Reusable Package Downloads

All packages needed to create applications based on CORTEX-SHELL template.

## 📦 Quick Download Links

### Main Package (Complete - All-in-One)
**[cortex-shell-reusable.zip](./cortex-shell-reusable.zip)** (553 KB) ⭐ **RECOMMENDED**
- Complete package with everything
- Templates, vendor libs, schemas, documentation
- Ready to use immediately
- Extract and start customizing

### Component Packages (Pick & Choose)

| Package | Size | Contains |
|---------|------|----------|
| [cortex-shell-templates-only.zip](./cortex-shell-templates-only.zip) | 128 KB | HTML, JS, manifest, SW |
| [cortex-shell-vendor-libs.zip](./cortex-shell-vendor-libs.zip) | 379 KB | React, ReactDOM, Marked, assets |
| [cortex-shell-schemas-only.zip](./cortex-shell-schemas-only.zip) | 28 KB | AI content schemas |
| [cortex-shell-documentation.zip](./cortex-shell-documentation.zip) | 18 KB | Setup & customization guides |

---

## 📥 How to Download

### From GitHub
1. Click the `.zip` file name above
2. Browser downloads automatically
3. Extract to your project directory

### From Command Line
```bash
# Download main package
wget https://raw.githubusercontent.com/arsyhabib/CORTEX-SHELL/main/dist/packages/cortex-shell-reusable.zip

# Or using curl
curl -L https://github.com/arsyhabib/CORTEX-SHELL/raw/main/dist/packages/cortex-shell-reusable.zip -O
```

### From Cloud Terminal
```bash
# If files are in /tmp/ or another location
scp cloud-user@cloud-ip:/tmp/cortex-shell-reusable.zip .

# Or direct access if in public storage
```

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Download
wget https://github.com/arsyhabib/CORTEX-SHELL/raw/main/dist/packages/cortex-shell-reusable.zip

# 2. Extract
unzip cortex-shell-reusable.zip

# 3. Setup
cd cortex-shell-reusable
cat INDEX.md          # Read overview
cat SETUP_GUIDE.md    # Follow setup

# 4. Test
mkdir my-app
cp templates/* my-app/
cp -r vendor-libs/assets my-app/
cd my-app

# 5. Run
python3 -m http.server 8000
# Open http://localhost:8000
```

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| **DOWNLOAD_INSTRUCTIONS.md** | Detailed download and setup guide |
| **INDEX.md** (in package) | Package contents overview |
| **SETUP_GUIDE.md** (in package) | Step-by-step setup instructions |
| **ARCHITECTURE.md** (in package) | System design explanation |
| **CUSTOMIZATION.md** (in package) | How to modify for your needs |
| **AI_AGENT_GUIDE.md** (in package) | Guide for AI content generation |

---

## 📊 Package Contents Summary

### `cortex-shell-reusable.zip` Includes:

```
templates/
├── index.html          Main HTML template (131 KB)
├── cortex-app.js       Pre-compiled React app (426 KB)
├── sw.js               Service Worker
├── manifest.webmanifest PWA configuration
└── 404.html            Error page

vendor-libs/assets/
└── vendor/
    ├── react.min.js        React 18.3.1 UMD (11 KB)
    ├── react-dom.min.js    ReactDOM UMD (129 KB)
    └── marked.min.js       Markdown parser (36 KB)

schemas/
├── CONTENT_SCHEMA_MASTER.md      Content structure schema
├── DOMAIN_SCHEMA_DESIGN.md       Data model schema
├── DOMAIN_CONTENT_GUIDE.md       Best practices
├── RESOURCE_ARCHITECTURE.md      Asset management
├── PROMPT_MATERI_REFINED.md      Content generation template
└── PROMPT_SOAL_REFINED.md        Quiz generation template

documentation/
├── ARCHITECTURE.md     Technical overview
├── CUSTOMIZATION.md    How to modify
└── AI_AGENT_GUIDE.md   For content generation

+ INDEX.md and SETUP_GUIDE.md at root
```

**Total: 24 files, ~880 KB uncompressed**

---

## ✅ What You Get

- ✅ Production-ready React application
- ✅ Pre-compiled JavaScript (no build needed)
- ✅ Local vendor libraries (no CDN needed)
- ✅ Service Worker (offline support)
- ✅ PWA-ready (installable app)
- ✅ 6 built-in themes
- ✅ AI-friendly content schemas
- ✅ Complete documentation
- ✅ Customization guides
- ✅ Ready to deploy to any server

---

## 🎯 Use Cases

- Create educational/learning platforms
- Build content delivery systems
- Develop medical/training applications
- Create Progressive Web Apps
- Build offline-first applications
- Rapid prototyping for startups
- Multi-domain learning systems

---

## 🔄 Workflow

1. **Download** - Get `cortex-shell-reusable.zip`
2. **Extract** - Unzip to your working directory
3. **Read** - Review INDEX.md and SETUP_GUIDE.md
4. **Customize** - Modify index.html for your app
5. **Add Content** - Use schemas to generate content with AI
6. **Test** - Run locally with http server
7. **Deploy** - Push to GitHub Pages or your server

---

## 🤖 For AI Content Generation

Use the **schemas/** files to instruct AI agents:

1. Provide `CONTENT_SCHEMA_MASTER.md` → AI learns content structure
2. Provide `PROMPT_MATERI_REFINED.md` → AI generates better educational content
3. Provide `DOMAIN_SCHEMA_DESIGN.md` → AI understands your domain structure
4. AI generates JSON modules that work perfectly with your app

See `AI_AGENT_GUIDE.md` for detailed instructions.

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ iOS Safari 14+
- ✅ Chrome Android

---

## 💡 Technology

- **Framework:** React 18.3.1
- **Deployment:** Static files (no server code)
- **Offline:** Service Worker + Cache API
- **Styling:** CSS-in-JS + CSS variables
- **Content:** JSON-based
- **Size:** ~730 KB total (vs 3.5MB+ with Babel)

---

## 📞 Need Help?

1. **First time?** → Read DOWNLOAD_INSTRUCTIONS.md
2. **Setup issues?** → Check SETUP_GUIDE.md in package
3. **Want to customize?** → See CUSTOMIZATION.md in package
4. **Working with AI?** → See AI_AGENT_GUIDE.md in package
5. **Understanding architecture?** → See ARCHITECTURE.md in package

---

## 📝 Version Info

- **Package Version:** 2.0-reusable
- **React Version:** 18.3.1
- **Update Date:** June 2026
- **License:** ISC

---

## 🎁 What's Included vs What's Not

### ✅ Included
- React application template
- All vendor libraries (local copies)
- Service Worker
- PWA manifest
- 6 themes with customization
- Content schemas
- Setup documentation
- Customization guides

### ❌ Not Included
- Backend server code
- Database setup
- Hosting/deployment (guides provided)
- Content samples (schemas provided to generate with AI)
- Build tools (not needed - pre-compiled)

---

**Ready to build? Download `cortex-shell-reusable.zip` and get started! 🚀**

Questions? Check the documentation after extracting the package.
