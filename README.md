# Interactive 3D Confidential Engineering Archive Portfolio

An interactive, editorial 3D portfolio inspired by **ammarmunir.com**, built with Three.js, CSS3DRenderer, Web Audio API, and modern responsive web design.

---

## 🌟 Key Features & Animations

1. **Cinematic 3D WebGL Archive Room**:
   - Vintage intelligence archive / study room environment.
   - Textured concrete floor grid, dark atmospheric walls, molding, wall plaques.
   - Drifting floating dust motes illuminated by volumetric overhead light cones.
   - Interactive metal filing cabinets with labeled brass drawers and handles.
   - Heavy wooden desk with study lamp casting dynamic shadows and warmth.

2. **Choreographed Camera Flight**:
   - **Entrance**: Angled panoramic overview with subtle parallax mouse tracking.
   - **Cabinet (`rack`)**: Zoom into drawer 3 ("PERSONNEL ARCHIVE"), drawer automatically slides out on ball bearings.
   - **Desk (`desk`)**: Dossier folder lifts out of the drawer in an arc, flies over to the desk, and settles down with a physical thump.
   - **Reading (`reading`)**: Camera dives into reading view directly above the desk, opening the dossier folder into an interactive two-page spread.
   - **Return**: Clicking "RETURN FILE" or the wordmark smoothly closes the dossier, returns it to the cabinet, slides the drawer shut, and returns camera to entrance.

3. **Curved 3D Paper Flipping Animation**:
   - Built with a 12-segment realistic bending sheet (`turning-sheet`).
   - Mathematically curves across the spine as you turn pages.
   - Dynamic spine shade (`--turn-shade`) simulates light creasing across paper.
   - Supports keyboard arrow keys (Left/Right), mouse wheel scroll, touch swipe, and numbered Chapter Rail navigation.
   - Responsive: 2-page book spread on desktop, 1-page focused dossier on mobile.

4. **100% Procedural Web Audio Synthesizer**:
   - No external `.mp3` or `.wav` dependencies!
   - Low-frequency ambient archive room hum.
   - Metal drawer slide and mechanical latch thump.
   - Folder landing thump on wooden desk.
   - Realistic crisp paper rustling sound.
   - Sound toggle (`ON` / `OFF`) in top HUD.

5. **Complete HUD & Modals**:
   - Wordmark initials sigil with clearance level.
   - Motion toggle (`ON` / `REDUCED`).
   - File Index modal (`☷`) with instant jump to any section.
   - Complete dossier reading view modal with "Print / save as PDF".
   - Evidence image lightbox dialog to enlarge project diagrams and screenshots.

6. **Dual Views**:
   - **3D Interactive Experience**: `/` (`index.html`)
   - **Direct Editorial Dossier View**: `/portfolio/` (`portfolio/index.html`)

---

## 🚀 How to Run Locally

```bash
cd /root/archive-portfolio
./start.sh 8000
```
Open your browser and navigate to:
- `http://localhost:8000/` for the 3D Interactive Archive
- `http://localhost:8000/portfolio/` for the flat Reading View

---

## ⚙️ How to Personalize for Yourself

All portfolio data is centralized in **`js/config.js`**. You don't need to touch complex Three.js or shader code to update your site!

Open `js/config.js` and edit:

```javascript
export const CONFIG = {
  personal: {
    name: "Your Name",
    firstName: "Your",
    lastName: "Name",
    initials: "yn.",
    sigil: { first: "y", second: "n" },
    role: "Senior Software Engineer",
    roleSub: "AI / BACKEND / FULL STACK",
    experienceYears: "04 years",
    fileNo: "FILE NO. YN–001",
    fileCode: "YN–001",
    coordinates: "40.71° N / 74.00° W",
    country: "US",
    baseOfOperations: "New York, USA",
    email: "your.email@example.com",
    linkedin: "https://linkedin.com/in/yourprofile",
    github: "https://github.com/yourusername",
    // ...
  },
  // Add your career history, skills, and projects here:
  serviceHistory: [ ... ],
  skills: [ ... ],
  projects: [ ... ]
};
```

When you update `js/config.js`:
- The 3D folder cover dynamically redraws with your name and credentials.
- The plaques in the 3D room and drawer labels automatically update.
- All 14 dossier pages, chapters, index, and reading views update instantly.

---

## 📁 Directory Structure

```
/root/archive-portfolio/
├── index.html               # Main 3D archive experience
├── start.sh                 # Local server runner
├── README.md                # Documentation
├── css/
│   ├── archive.css          # 3D archive, HUD, and paper styles
│   └── portfolio.css        # Flat portfolio page styles
├── js/
│   ├── config.js            # ✏️ Edit your personal info & projects here
│   ├── main.js              # DOM controller & page generator
│   ├── archive-3d.js        # Three.js 3D room & CSS3D paper bending engine
│   ├── audio.js             # Web Audio API procedural sound engine
│   └── three-adapter.js     # Clean ES module Three.js export adapter
├── assets/
│   └── three.js             # Local Three.js library
├── portfolio/
│   ├── index.html           # Dedicated flat editorial portfolio
│   └── portfolio.js         # Dynamic page populator for flat view
├── projects/                # Project screenshots / concept images
└── companies/               # Company logos
```
