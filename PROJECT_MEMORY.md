# 📁 Project Memory & Architectural Record
### Confidential 3D Engineering Archive Portfolio
**Owner:** Piyush Tiwari (`@30Piyush2025`)  
**Repository:** [https://github.com/30Piyush2025/PORTPOLIO_WEBSITE](https://github.com/30Piyush2025/PORTPOLIO_WEBSITE)  
**System Reference:** Modeled after the architectural and interaction design of `ammarmunir.com`  
**Generated Date:** September 2026

---

## 1. Executive Summary & Project Goal
The objective of this project was to construct a bespoke, cinematic 3D engineering portfolio inspired by the confidential intelligence archive aesthetic of `ammarmunir.com`.

The portfolio features:
- A real-time WebGL 3D archive room with procedural lighting, atmospheric dust particles, textured filing cabinets, and a study desk.
- Camera flight choreography (`entrance` → `rack` drawer sliding out → `desk` folder flight → `reading` top-down dossier open).
- 12-segment realistic 3D paper bending physics with dynamic spine shading for page turns.
- 100% synthesized procedural audio using the Web Audio API (zero external `.mp3` or `.wav` dependencies).
- Dual presentation: Interactive 3D WebGL Archive (`/`) and a dedicated flat editorial reading view (`/portfolio/`).
- Full customization based on the owner's real curriculum vitae and portrait photograph.

---

## 2. Complete Conversation & Development Chronology

### Phase 1: Requirement Analysis & Decompilation of Reference Site
- **User Prompt:** `"ammarmunir.com i wamt similar website for me .like this given website use same animation ."`
- **Actions Taken:**
  1. Fetched and reverse-engineered the live assets of `https://ammarmunir.com` and `https://ammarmunir.com/portfolio/`.
  2. Analyzed the core scripts (`archive-BQ9r-W5j.js`, `archive-FZxHFGEO.js`, `three-ve4bjnfY.js`).
  3. Discovered that the reference website utilizes:
     - Pure Three.js geometries for the room, desk, filing cabinets, and props (no external GLTF models needed, ultra-fast initial load < 500KB).
     - `CSS3DRenderer` and `CSS3DObject` to render HTML/DOM elements inside the 3D space, allowing crisp typography, selectable text, and responsive layouts.
     - Custom 12-segment sliced mesh (`turning-sheet`) mathematically curved using sine arcs to simulate real paper elasticity during page turns.
     - A custom Web Audio API synthesizer generating white noise bursts, biquad bandpass/lowpass filters, and downward sine pitch glides for drawer opening, drawer stop thuds, paper rustling, and folder placement impacts.
     - Centralized typography: `DM Mono`, `DM Sans`, and `Instrument Serif`.

### Phase 2: Engine Reconstruction & Local Infrastructure
- **Actions Taken:**
  1. Built the local project repository in `/root/archive-portfolio/`.
  2. Created `js/three-adapter.js` to map Three.js exports to clean, standardized symbols.
  3. Implemented `js/audio.js` with zero-dependency procedural audio synthesis.
  4. Implemented `js/archive-3d.js` containing the 3D room, camera tweens, raycasting, and 12-segment bending physics.
  5. Implemented `js/config.js` to decouple all personal data from the 3D engine.
  6. Implemented `js/main.js` to manage UI states, HUD controls, dialogue modals (File Index, Reader View, Lightbox), and event listeners.
  7. Implemented `portfolio/index.html` and `portfolio/portfolio.js` for the flat reading mode.
  8. Created `start.sh` to launch local HTTP serving.

### Phase 3: Debugging "Local Host Does Not Work"
- **User Feedback:** `"local host does not work"`
- **Diagnosis:**
  - The initial test server script exited when the background subshell terminated.
  - The runtime environment was identified as a Linux container (Termux PRoot on Android).
  - Background processes needed to be kept alive persistently and bound to `0.0.0.0:8000` to be accessible from both the local device (`localhost`, `127.0.0.1`) and external network devices (`10.71.27.94`).
- **Resolution:**
  - Launched a persistent HTTP server task listening on `0.0.0.0:8000`.
  - Provided exact URLs for local device access and LAN access.
  - User verified and confirmed: `"yes this is working"`.

### Phase 4: CV Ingestion & Resume Parsing
- **User Prompt:** `"i will provide my cv in Antigravity folder in my device storage .where in Antigravity folder one folder name portpolio website you will find my cv"`
- **Technical Challenge:**
  - The Linux PRoot container is isolated from Android's `/storage/emulated/0` (internal storage) by default.
  - Guided the user on placing the folder into the workspace.
  - The user successfully placed `PORTPOLIO WEBSITE/Piyush_Tiwari_CV.pdf` into `/root/archive-portfolio/`.
- **Parsing Strategy:**
  - Decoded the PDF's ASCII85 + FlateDecode stream objects using Python's native `base64` and `zlib` modules without requiring external binary tools.
  - Extracted complete professional data for **Piyush Tiwari**:
    - **Current Role:** AI/ML & Data Science Intern at Coding Blocks (CBSOT).
    - **Education:** B.Tech in Artificial Intelligence at Dr. Ambedkar Institute of Technology for Handicapped (AITD), Kanpur (2025–2028).
    - **Skills:** Generative AI & Agents (LangGraph, Groq, LoRA/QLoRA), ML & NLP (TensorFlow, Keras, Sentence-BERT), Systems (Python, Flask, Docker, Streamlit).
    - **Projects:**
      1. *AI Content Writing Agent* (LangGraph, Groq API, Agentic Routing).
      2. *Health Report Prediction Model* (Sentence-BERT clinical embeddings + hybrid Keras model).
      3. *YouTube Notes Agent* (Gemini API + ReportLab PDF generation + Docker).
      4. *KrishiSetu-Q & Customer Churn ML* (Smart India Hackathon 2026, Ministry of Consumer Affairs DoCA Problem Statement 26032, and 4-stage churn pipeline).
    - **Certifications & Learning:** 100 Days of ML, 60-Day AI Engineering roadmap, Google/Coursera AI, Deloitte Cyber simulation.

### Phase 5: Complete Personalization
- **Actions Taken:**
  1. Updated `js/config.js` with all extracted data.
  2. Updated 3D Room Cabinet:
     - Drawer 3 labeled: `PIYUSH TIWARI` / `PT–001 / AI/ML ENGINEER`.
     - Cabinet top plaque: `PT / 001` `ENGINEERING DIVISION`.
     - HUD coordinates: `26.45° N / 80.33° E IN` (Kanpur, India).
  3. Re-generated all 14 dossier pages and chapters to reflect Piyush's engineering background.

### Phase 6: Portrait Integration
- **User Prompt:** `"use my photo in front cover i will provide it portpolio website folder"`
- **User Action:** Provided `IMG_20251016_212658 (1).jpg` (440 KB, 1820×1944).
- **Actions Taken:**
  1. Copied and normalized the image to `/root/archive-portfolio/piyush-portrait.jpg`.
  2. Updated `archive-3d.js` to preload the image and draw it directly onto the 3D manila folder cover canvas texture with an archival mount card, vintage photo corners, and `SUBJECT / PT–001` label.
  3. Mounted the photo into Page 1 (Personnel Record) and the flat portfolio view (`/portfolio/`).
  4. User verified and confirmed: `"haa"`.

### Phase 7: GitHub Preparation & Memory Archival
- **User Prompt:** `"https://github.com/30Piyush2025/PORTPOLIO_WEBSITE this is my github repo where you should put all code files and made one memory file where you store all the conversation between us here to making this project"`
- **Actions Taken:**
  1. Installed `git` in the Linux container.
  2. Created this comprehensive `PROJECT_MEMORY.md` file.
  3. Initialized the Git repository, configured remotes, prepared `.gitignore`, committed all files, and generated step-by-step instructions for pushing with a GitHub Personal Access Token.

---

## 3. Technical Architecture & File Map

```
/root/archive-portfolio/
├── index.html               # Main 3D WebGL Archive Experience
├── PROJECT_MEMORY.md        # This comprehensive project record & memory
├── README.md                # General documentation & setup guide
├── start.sh                 # Local server runner (port 8000)
├── piyush-portrait.jpg      # High-res portrait photo (1820x1944)
├── css/
│   ├── archive.css          # Styling for 3D archive, HUD, paper dossier, modals
│   └── portfolio.css        # Clean styling for flat reading portfolio
├── js/
│   ├── config.js            # Central configuration file for all user data
│   ├── main.js              # DOM controller, page builder, interaction listener
│   ├── archive-3d.js        # Three.js 3D room, camera tweens, CSS3D paper bending
│   ├── audio.js             # Web Audio API procedural sound synthesizer
│   └── three-adapter.js     # Clean ES module export adapter for Three.js
├── assets/
│   └── three.js             # Three.js bundle (self-contained, 471 KB)
├── portfolio/
│   ├── index.html           # Dedicated flat reading mode page
│   └── portfolio.js         # Dynamic DOM populator for flat view
├── projects/                # Concept visuals and diagram previews
├── companies/               # Company / institution logos
└── PORTPOLIO WEBSITE/       # Original source files (CV PDF + Portrait JPG)
```

---

## 4. Key Engineering Equations & Mechanics

### Camera State Interpolation
Smooth camera flight between archive states uses cubic easing:
$$E(t) = \begin{cases} 4t^3 & \text{if } t < 0.5 \\ 1 - \frac{(-2t + 2)^3}{2} & \text{otherwise} \end{cases}$$

### 12-Segment Curved Paper Bending Physics
Page turns mathematically deform 12 vertical slices across the spine:
- Arch height: $\text{bendArch} = 0.58 \times \sin(\pi \times p)$
- Angle per slice: $\theta_i = \text{bendArch} \times \frac{i + 0.5}{N}$
- Slice rotation: $R_y = \text{direction} \times \theta_i + (180^\circ \text{ if back})$
- Spine shading: $\text{opacity} = \sin(\pi \times p) \times \text{depthFactor}$

### Web Audio API Synthesis Parameters
- **Archive Room Hum:** Concurrent sine oscillators at 50 Hz (gain 0.002), 100 Hz (gain 0.0028), and 150 Hz triangle wave (gain 0.00065).
- **Drawer Glide:** Bandpass filtered white noise at 780 Hz (open) / 620 Hz (close) + downward sine slide from 165 Hz.
- **Drawer Stop Latch:** Fast pitch-decay sine tone at 180 Hz / 125 Hz + noise burst at 1100 Hz.
- **Book Drop Impact:** Pitch drop from 95 Hz over 0.24s + filtered noise burst at 950 Hz.
- **Paper Rustle:** Filtered white noise burst (lowpass 2400 Hz, duration 0.2s, soft gain 0.18).

---

## 5. Deployment Instructions

### Pushing to GitHub
```bash
cd /root/archive-portfolio
git remote add origin https://github.com/30Piyush2025/PORTPOLIO_WEBSITE.git
git branch -M main
git push -u origin main
```
*(When prompted, enter your GitHub username `30Piyush2025` and your GitHub Personal Access Token as the password).*

### Enabling GitHub Pages (Free Hosting)
1. In your GitHub repository, go to **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
3. Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
4. Your website will be live in 1–2 minutes at:
   `https://30piyush2025.github.io/PORTPOLIO_WEBSITE/`

---
*Maintained and documented for Piyush Tiwari.*
