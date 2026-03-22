# 🎵 AuraMusic

A modern music player built with React.  
**Features:** iTunes song search (30s previews) + local MP3/audio file upload.

---

## ✅ What You Need First

Install these on your computer (one time only):

| Tool | Download |
|------|----------|
| **Node.js** | https://nodejs.org → download LTS version |
| **Git** | https://git-scm.com/downloads |
| **VS Code** (optional but recommended) | https://code.visualstudio.com |

---

## 🚀 Step-by-Step Setup

### STEP 1 — Download the code

Put all the files from this project into a folder called `aura-music` on your computer.

Your folder should look like this:
```
aura-music/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── index.css
    ├── App.js
    └── components/
        ├── Sidebar.js
        ├── SearchView.js
        ├── UploadView.js
        ├── TrackCard.js
        └── Player.js
```

---

### STEP 2 — Open terminal in your project folder

- **Windows**: Right-click the `aura-music` folder → "Open in Terminal"
- **Mac**: Right-click → "New Terminal at Folder"

---

### STEP 3 — Install dependencies

Type this and press Enter:
```bash
npm install
```
Wait for it to finish (takes 1-2 minutes).

---

### STEP 4 — Run the app locally

```bash
npm start
```

Your browser will open automatically at **http://localhost:3000**  
The app is now running! Test it before uploading to GitHub.

---

### STEP 5 — Create a GitHub repository

1. Go to **https://github.com** and sign in
2. Click the **+** button → "New repository"
3. Name it: `aura-music`
4. Leave everything else as default
5. Click **"Create repository"**

---

### STEP 6 — Update your GitHub username in package.json

Open `package.json` and find this line:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/aura-music",
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username. Example:
```json
"homepage": "https://john123.github.io/aura-music",
```

Save the file.

---

### STEP 7 — Push your code to GitHub

Run these commands one by one in your terminal:

```bash
git init
git add .
git commit -m "first commit: aura music player"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/aura-music.git
git push -u origin main
```

> ⚠️ Replace `YOUR_GITHUB_USERNAME` with your real GitHub username in the command above.

---

### STEP 8 — Deploy to GitHub Pages

```bash
npm run deploy
```

This will build your app and publish it. Wait about 1-2 minutes, then visit:

**https://YOUR_GITHUB_USERNAME.github.io/aura-music**

🎉 Your music app is now live on the internet!

---

## 🔄 How to Update Your App Later

Whenever you make changes:
```bash
git add .
git commit -m "describe what you changed"
git push
npm run deploy
```

---

## 🎮 How to Use the App

### 🔍 Discover (iTunes Search)
- Type any artist or song name → click **Search**
- Or click a genre button like **Pop**, **Hip-Hop**, **Jazz**
- Click any song card to play a **30-second preview**
- All previews are from Apple's iTunes API (completely free, no signup)

### 📁 My Music (Upload)
- Click **My Music** in the sidebar
- Drag & drop your MP3/WAV/FLAC files OR click "Browse Files"
- Click any song to play it — **full song, no limits**
- Click **▶ Play All** to play your whole library

---

## ❓ Common Problems

**`npm install` fails**
→ Make sure Node.js is installed. Run `node --version` to check.

**`npm run deploy` gives an error**
→ Make sure you updated `homepage` in `package.json` with your real username.

**App shows blank page on GitHub Pages**
→ Wait 5 minutes after deploying. GitHub Pages takes time to update.

**iTunes search doesn't work**
→ Check your internet connection. The iTunes API requires internet access.

**Local files don't play**
→ Make sure the file is a valid audio format (MP3, WAV, FLAC, M4A).

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| iTunes Search API | Free music search (HTTPS, no API key needed) |
| Web Audio API | Local file playback |
| gh-pages | GitHub Pages deployment |

---

## 📝 License

MIT — free to use, share, and modify.
