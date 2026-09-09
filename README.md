# 📁 Confidential 3D Engineering Archive Portfolio
### Personnel File: Piyush Tiwari (`PT–001`) — AI/ML Engineer
[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=flat-square&logo=github)](https://30piyush2025.github.io/PORTPOLIO_WEBSITE/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-Procedural%20Sound-orange?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Status](https://img.shields.io/badge/Clearance-DECLASSIFIED-red?style=flat-square)](#)

An interactive, editorial 3D confidential intelligence dossier portfolio built with **Three.js**, **CSS3DRenderer**, **Web Audio API**, and pure web standards. Inspired by the interaction design and brutalist archive aesthetic of **ammarmunir.com**, personalized for **Piyush Tiwari**.

---

## 🌐 Live Access

- **3D Interactive Experience**: [https://30piyush2025.github.io/PORTPOLIO_WEBSITE/](https://30piyush2025.github.io/PORTPOLIO_WEBSITE/)
- **Flat Reading Dossier View**: [https://30piyush2025.github.io/PORTPOLIO_WEBSITE/portfolio/](https://30piyush2025.github.io/PORTPOLIO_WEBSITE/portfolio/)

---

## 👤 Subject Identification & Background

- **Subject**: **Piyush Tiwari** (Initials: `pt.`, Sigil: `p / t`)
- **Designation**: **AI/ML Engineer** (`PT–001`)
- **Base of Operations**: Kanpur, Uttar Pradesh, India (`26.45° N / 80.33° E IN`)
- **Current Assignment**: AI/ML & Data Science Intern at **Coding Blocks School of Technology (CBSOT)**
- **Academic Record**: B.Tech in Artificial Intelligence at **Dr. Ambedkar Institute of Technology for Handicapped (AITD), Kanpur** (2025–2028)
- **GitHub**: [@30Piyush2025](https://github.com/30Piyush2025)
- **Department**: `DEPARTMENT OF INTELLIGENT SYSTEMS`
- **Clearing Stamp**: `DECLASSIFIED` / `FIELD TESTED` / `CHANNEL OPEN`

---

## 🎬 Core Animations & Technical Highlights

### 1. Cinematic 3D WebGL Archive Room
- **Procedural Scene**: Concrete floor grid with canvas noise, atmospheric dark green/olive walls, architectural moldings, and fluorescent ceiling fixtures.
- **Dynamic Lighting**: Warm study desk spotlight casting PCF soft shadows, fill lighting, and drifting 3D atmospheric dust particles.
- **Filing Cabinet**: 4-drawer vertical archive cabinet with chrome pulls. Drawer 3 is custom labeled:
  `PIYUSH TIWARI` / `PT–001 / AI/ML ENGINEER`.
- **Desk Environment**: Textured wooden study desk with brass desk lamp, leather blotter, stationery, and brass tray.

### 2. Choreographed Camera & Dossier Journey
- **Entrance**: Angled panoramic overview with smooth parallax cursor tilt and pulsing HUD target dot.
- **Cabinet (`rack`)**: Clicking *"OPEN THE ARCHIVE"* zooms the camera down into Drawer 3 as it slides open with a mechanical glide sound.
- **Desk (`desk`)**: Clicking *"TAKE THE DOSSIER"* lifts the file folder in a parabolic arc, flying it onto the desk where it lands with a physical impact thump.
- **Reading (`reading`)**: Clicking *"OPEN THE FILE"* pivots overhead into reading perspective, smoothly unfolding the folder into an open binder.
- **Return**: Clicking *"RETURN FILE"* closes the dossier, flies it back into the drawer, slides the drawer shut, and returns the camera to entrance.

### 3. 12-Segment Curved 3D Paper Page Turns
- **Bending Physics**: Realistic curved page bending across the spine built with a 12-segment sliced mesh (`turning-sheet`).
- **Dynamic Shading**: Mathematical spine shade (`--turn-shade`) darkens the paper crease during turning.
- **Crisp Typography**: Full DOM integration via `CSS3DRenderer` — all text is vector crisp, selectable, and responsive.
- **Input Controls**: Keyboard arrows (`←` / `→`), mouse wheel scrolling, touch swipes, Next/Previous buttons, and Chapter Rail jump tabs.
- **Responsive**: Two-page binder spread on desktop; focused single-page layout on mobile (< 700px).

### 4. 100% Procedural Web Audio Synthesizer
Zero external `.mp3` or `.wav` dependencies — synthesized entirely via the browser's **Web Audio API**:
- **Ambient Drone**: Triple low-frequency oscillator hum (50Hz, 100Hz, 150Hz).
- **Drawer Slide**: Bandpass filtered noise (780Hz/620Hz) + downward sine pitch glide.
- **Mechanical Thuds**: Fast pitch-decay tones (180Hz/125Hz) + noise bursts.
- **Folder Impact**: Pitch drop from 95Hz + lowpass noise thump on wood.
- **Paper Rustling**: Lowpass filtered noise (2400Hz) with sine amplitude envelopes.
- **HUD Toggle**: Sound `ON`/`OFF` mute toggle.

### 5. Front Cover Photo Mounting
- Piyush Tiwari's portrait photo (`piyush-portrait.jpg`) is dynamically loaded and embedded directly onto the **3D manila folder cover** canvas texture with an archival mount card, vintage corner brackets, and `SUBJECT / PT–001` caption.
- Featured on **Page 1 (Personnel Record)** with photo corners and red `DECLASSIFIED` rubber stamp.
- Featured in the **Flat Portfolio View** (`/portfolio/`).

---

## 🗂️ Interactive Dossier Chapters (14 Pages)

| Page | Title | Description |
|---|---|---|
| **01** | **Personnel Record** | Subject identification, mounted portrait, designation, base of operations, and assignment. |
| **02** | **Subject Assessment** | Professional philosophy: *"Curiosity guides the math. Precision builds the model."* |
| **03** | **Service Record** | Experience at Coding Blocks (CBSOT), Smart India Hackathon 2026, AITD Research, and Open Source. |
| **04** | **Technical Capabilities** | Generative AI & Agents, Machine Learning & NLP, Systems & Data, and AITD Academic Record. |
| **05–06** | **Operation 01: AI Content Agent** | Autonomous multi-agent pipeline built with **LangGraph** & **Groq API** for LinkedIn & README generation. |
| **07–08** | **Operation 02: Health Predictor** | Clinical NLP platform predicting diagnoses from unstructured doctor notes using **Sentence-BERT** & **Keras**. |
| **09–10** | **Operation 03: YouTube Notes Agent** | Video playlist ingestion & multi-format PDF study note generator (**Gemini API**, **ReportLab**, **Docker**). |
| **11–12** | **Operation 04: KrishiSetu-Q & Churn** | **Smart India Hackathon 2026** farmer procurement queue system & 4-stage customer churn ML pipeline. |
| **13** | **Production Engineering** | Model training & LoRA fine-tuning, agentic workflows, API deployment, and continuous learning roadmaps. |
| **14** | **Communications** | Direct contact channels, GitHub links, personal signature, and `CHANNEL OPEN` stamp. |

---

## 📂 Project Structure

```
PORTPOLIO_WEBSITE/
├── index.html               # Main 3D WebGL Archive Experience
├── PROJECT_MEMORY.md        # Full conversational & architectural record
├── README.md                # This complete documentation file
├── start.sh                 # Local server launch script
├── piyush-portrait.jpg      # High-res portrait photo (1820x1944)
├── PORTPOLIO WEBSITE/       # Original source files (Piyush_Tiwari_CV.pdf & photo)
├── js/
│   ├── config.js            # ✏️ Central configuration for all user info & projects
│   ├── main.js              # DOM controller, page builder & event bindings
│   ├── archive-3d.js        # Three.js 3D room, camera tweens & 12-segment paper bending
│   ├── audio.js             # Web Audio API procedural sound engine
│   └── three-adapter.js     # Clean ES module Three.js export adapter
├── css/
│   ├── archive.css          # Styling for 3D archive, HUD, paper dossier, modals
│   └── portfolio.css        # Clean styling for flat reading view
├── assets/
│   └── three.js             # Local Three.js library bundle (471 KB)
├── portfolio/
│   ├── index.html           # Dedicated flat editorial reading portfolio
│   └── portfolio.js         # Dynamic DOM populator for flat view
├── projects/                # Concept visuals and diagram previews
└── companies/               # Company & institution logos
```

---

## 💻 Running Locally

To run the interactive portfolio on your local machine:

```bash
# Clone the repository
git clone https://github.com/30Piyush2025/PORTPOLIO_WEBSITE.git
cd PORTPOLIO_WEBSITE

# Start the server
./start.sh 8000
```

Open your browser and navigate to:
- **3D Archive**: [http://localhost:8000/](http://localhost:8000/)
- **Flat Reading Portfolio**: [http://localhost:8000/portfolio/](http://localhost:8000/portfolio/)

---

## 🚀 How to Enable GitHub Pages (Free Hosting)

1. Open your repository on GitHub: [github.com/30Piyush2025/PORTPOLIO_WEBSITE](https://github.com/30Piyush2025/PORTPOLIO_WEBSITE)
2. Go to **Settings** → **Pages** (under the "Code and automation" sidebar).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Choose `main` and folder `/ (root)`.
   - Click **Save**.
4. *(If the repository is currently Private, navigate to Settings → General → Danger Zone → Change repository visibility → **Make public**).*
5. Within 1–2 minutes, your website will be live at:
   👉 **`https://30piyush2025.github.io/PORTPOLIO_WEBSITE/`**

---

## ✏️ Customization Guide

All personal info, skills, projects, and career records are decoupled into **[`js/config.js`](js/config.js)**.

To update your info:
1. Open `js/config.js`.
2. Edit your `personal` object (name, role, bio, coordinates, social links).
3. Update `serviceHistory`, `skills`, or `projects`.
4. Commit and push:
   ```bash
   git add js/config.js
   git commit -m "Update portfolio configuration"
   git push origin main
   ```
The 3D folder cover, plaques, dossier pages, and flat portfolio will immediately update!

---

## 📜 Architectural Memory

For the full conversational and development chronology, technical decisions, debugging steps, and mathematical formulas, please see:
👉 **[`PROJECT_MEMORY.md`](PROJECT_MEMORY.md)**

---

*Designed and engineered for Piyush Tiwari — 2026.*
