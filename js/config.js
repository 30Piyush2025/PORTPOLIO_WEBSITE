// ========================================================================
// ARCHIVE DOSSIER CONFIGURATION
// Personalized for Piyush Tiwari — AI/ML Engineer
// ========================================================================

// Site root, computed dynamically so images work at any folder depth
const BASE_URL = new URL("../", import.meta.url).href;
export const CONFIG = {
  personal: {
    name: "Piyush Tiwari",
    firstName: "Piyush",
    lastName: "Tiwari",
    initials: "pt.",
    sigil: { first: "p", second: "t" },
    role: "AI/ML Engineer",
    roleSub: "AGENTIC AI / NLP / ML",
    experienceYears: "B.Tech AI",
    experienceNum: "02",
    department: "DEPARTMENT OF INTELLIGENT SYSTEMS",
    fileNo: "FILE NO. PT–001",
    fileCode: "PT–001",
    coordinates: "26.45° N / 80.33° E",
    country: "IN",
    baseOfOperations: "Kanpur, India",
    currentAssignment: {
      name: "Coding Blocks (CBSOT)",
      url: "https://github.com/30Piyush2025"
    },
    bioShort: "AI/ML Engineer specializing in Agentic AI, NLP, and Deep Learning.\nBuilding practical, intelligent systems from research to code.",
    heroIntro: "Some work deserves a closer look.\nAutonomous agents, clinical NLP, and generative AI systems.\nThe evidence is inside.",
    heroButtonText: "OPEN THE ARCHIVE",
    bioLead: "Building practical AI grounded in real-world context.",
    bioFull: "I’m an AI/ML Engineer and second-year B.Tech student in Artificial Intelligence at Dr. Ambedkar Institute of Technology for Handicapped (AITD), Kanpur. I specialize in building autonomous agents, natural language processing pipelines, and generative AI systems.\n\nCurrently interning at Coding Blocks School of Technology (CBSOT) in AI/ML and Data Science, I focus on transforming cutting-edge LLMs, LangGraph workflows, and deep learning models into reliable, high-impact products.",
    quoteHandwritten: "Curiosity guides the math.\nPrecision builds the model.",
    knownFor: "Agentic AI workflows.\nClinical NLP & End-to-end ML pipelines.",
    sideTitle: "Continuous Engineering Rigor",
    sideDescription: "Completed 100 Days of ML, 60-day AI Engineering roadmap, Google/Coursera AI certifications, and Deloitte Cyber Job Simulation.",
    sideLink: {
      label: "Explore GitHub repositories",
      url: "https://github.com/30Piyush2025"
    },
    contactCallout: "Let’s build something\nworth opening a file for.",
    contactPitch: "Have an interesting AI problem, an agentic system to bring to life, or a team that values relentless curiosity? Let's connect.",
    signature: "Piyush.",
    email: "piyush.tiwari.ai@outlook.com",
    linkedin: "https://github.com/30Piyush2025",
    github: "https://github.com/30Piyush2025",
    portraitUrl: BASE_URL + "piyush-portrait.jpg"
  },

  chapters: [
    "The subject",
    "Service record",
    "AI Content Agent",
    "Health Predictor",
    "YouTube Notes",
    "KrishiSetu & Churn",
    "Open a channel"
  ],

  serviceHistory: [
    {
      company: "Coding Blocks (CBSOT)",
      companyUrl: "https://github.com/30Piyush2025",
      role: "AI/ML & Data Science Intern",
      isCurrent: true,
      period: "JUN 2026 — PRESENT",
      description: "Working on AI/ML and Data Science projects with hands-on experience in training, evaluating, and deploying machine learning models."
    },
    {
      company: "Smart India Hackathon 2026",
      companyUrl: "https://github.com/30Piyush2025",
      role: "Team Yuva Codes · SIH 2026",
      isCurrent: false,
      period: "2026",
      description: "Architected KrishiSetu-Q for Ministry of Consumer Affairs (DoCA, Problem Statement 26032) for farmer procurement queue management."
    },
    {
      company: "AITD Kanpur",
      companyUrl: "https://github.com/30Piyush2025",
      role: "Undergraduate AI Researcher",
      isCurrent: false,
      period: "SEP 2025 — PRESENT",
      description: "Developing deep learning models, Sentence-BERT semantic pipelines, and LLM fine-tuning architectures (LoRA/QLoRA)."
    },
    {
      company: "Open Source Contributor",
      companyUrl: "https://github.com/30Piyush2025",
      role: "Builder in Public",
      isCurrent: false,
      period: "2025 — PRESENT",
      description: "Published and documented multiple agentic AI tools, clinical NLP predictors, and automated educational pipelines on GitHub."
    }
  ],

  skills: [
    {
      num: "01",
      category: "GENERATIVE AI & AGENTS",
      title: "Autonomous reasoning and tool orchestration.",
      items: "LangGraph · Agentic AI · LLM Fine-tuning (LoRA/QLoRA) · Groq API · Gemini API · Prompt Engineering · RAG"
    },
    {
      num: "02",
      category: "MACHINE LEARNING & NLP",
      title: "Semantic embeddings and neural representations.",
      items: "TensorFlow · Keras · Sentence-BERT · Cosine Similarity · Classification · K-Means Clustering · Clinical NLP · Scikit-learn"
    },
    {
      num: "03",
      category: "SYSTEMS & ENGINEERING",
      title: "Data pipelines, APIs & deployment.",
      items: "Python · Flask · Streamlit · Pandas · NumPy · Docker · Firebase · ReportLab · Custom SVG Charts · Git · Linux"
    }
  ],

  academicRecord: {
    degree: "B.Tech in Artificial Intelligence",
    institution: "Dr. Ambedkar Institute of Technology for Handicapped (AITD), Kanpur",
    period: "2025–2028 (Expected)",
    honors: "Second-year AI Engineering student · Focus on Deep Learning & NLP"
  },

  projects: [
    {
      id: "content-agent",
      no: "01",
      title: "AI Content Agent",
      category: "AGENTIC AI / CONTENT OPERATIONS",
      subtitle: "Autonomous generation for technical platforms.",
      description: "An agentic AI system for generating LinkedIn posts, About sections, and GitHub READMEs with intelligent routing and contextual tone adaptation.",
      stack: ["LangGraph", "Groq API", "Python", "Agentic AI"],
      url: "https://github.com/30Piyush2025",
      linkLabel: "View on GitHub",
      role: "Lead Developer",
      roleLabel: "Lead Developer · Building Content Agent",
      context: "Creating high-impact technical documentation, LinkedIn posts, and professional summaries is time-consuming and often lacks consistency across different audience contexts.",
      approach: "Engineered an autonomous multi-agent workflow leveraging LangGraph for decision routing and Groq's high-throughput LPU inference engine for rapid, structured generation.",
      contributions: [
        "Architected an agentic state-machine with LangGraph for dynamic prompt and format routing.",
        "Integrated Groq API for ultra-low latency generation with custom temperature controls.",
        "Engineered specialized templates for READMEs, technical posts, and executive summaries.",
        "Built in collaboration with guidance from mentor Aryesh Rai Sir."
      ],
      outcome: "A deployed agentic pipeline that turns raw project briefs into polished, publish-ready professional content in seconds.",
      visual: "content",
      imageSrc: BASE_URL + "projects/env-concept.png",
      imageWidth: 1536,
      imageHeight: 1024,
      imageAlt: "AI Content Agent concept interface with routing graph",
      imageCaption: "AGENTIC WORKFLOW / ENLARGE ↗",
      imageNote: "AI CONTENT WRITING AGENT · LANGGRAPH & GROQ PIPELINE"
    },
    {
      id: "health-nlp",
      no: "02",
      title: "Health Predictor",
      category: "CLINICAL NLP & HEALTHCARE ML",
      subtitle: "Diagnoses from unstructured text and patient features.",
      description: "A clinical NLP platform predicting medical diagnoses from unstructured doctor notes and demographic features using hybrid deep learning architectures.",
      stack: ["Sentence-BERT", "Keras", "Clinical NLP", "Streamlit"],
      url: "https://github.com/30Piyush2025",
      linkLabel: "Explore Clinical Model",
      role: "ML Engineer · Clinical NLP Research",
      roleLabel: "My contribution",
      context: "Clinical healthcare data combines dense, free-text doctor observations with numerical patient metrics. Traditional models fail to fuse both data modalities effectively.",
      approach: "Developed a hybrid model utilizing Sentence-BERT embeddings for semantic text feature extraction combined with multi-layer neural networks for numerical demographics.",
      contributions: [
        "Extracted 768-dimensional clinical semantic embeddings using fine-tuned Sentence-BERT.",
        "Engineered a multi-input hybrid Keras architecture fusing textual and demographic signals.",
        "Implemented cosine similarity and classification metrics to maximize diagnostic precision.",
        "Built and deployed an interactive Streamlit dashboard for real-time clinician evaluation."
      ],
      outcome: "A published, reproducible clinical NLP diagnostic model with high validation accuracy and an interactive web demo.",
      visual: "health",
      imageSrc: BASE_URL + "projects/joint-concept.png",
      imageWidth: 1536,
      imageHeight: 1024,
      imageAlt: "Health Report Prediction Model interface with diagnostic breakdown",
      imageCaption: "CLINICAL INTERFACE / ENLARGE ↗",
      imageNote: "HEALTH PREDICTOR · HYBRID SENTENCE-BERT & KERAS PIPELINE"
    },
    {
      id: "youtube-notes",
      no: "03",
      title: "YouTube Notes Agent",
      category: "MULTIMODAL SUMMARIZATION",
      subtitle: "Lecture playlists transformed into structured study archives.",
      description: "Converts entire YouTube video playlists into comprehensive multi-format PDF notes including Cornell, bullet, outline, mind map, and Q&A formats.",
      stack: ["Gemini API", "Flask", "ReportLab", "Docker"],
      url: "https://github.com/30Piyush2025",
      linkLabel: "View Repository",
      role: "Full-Stack AI Developer",
      roleLabel: "My contribution",
      context: "Students spend dozens of hours reviewing video lectures and scrubbing timelines to take scattered notes, rather than engaging in deep conceptual learning.",
      approach: "Engineered an automated ingestion pipeline using youtube-transcript-api and Google Gemini API to extract, summarize, and typeset formatted study dossiers.",
      contributions: [
        "Built automated transcript extraction handling single videos and full playlist queues.",
        "Designed structured prompt pipelines for Cornell notes, conceptual mind maps, and Q&A summaries.",
        "Programmatically generated publication-grade printable PDFs with ReportLab typesetting.",
        "Containerized the Flask service with Docker for portable cloud deployment."
      ],
      outcome: "Automated synthesis of entire video lecture series into high-yield, printable study archives within seconds.",
      visual: "youtube",
      imageSrc: BASE_URL + "projects/arq-product-screenshot.png",
      imageWidth: 3024,
      imageHeight: 1720,
      imageAlt: "YouTube Notes Agent generating structured study documents",
      imageCaption: "AGENT PIPELINE / ENLARGE ↗",
      imageNote: "YOUTUBE NOTES AGENT · GEMINI API & REPORTLAB ENGINE"
    },
    {
      id: "krishi-churn",
      no: "04",
      title: "KrishiSetu-Q & Churn",
      category: "SMART INDIA HACKATHON & PREDICTIVE ML",
      subtitle: "Procurement queues and customer churn intelligence.",
      description: "Farmer procurement slot booking platform for Ministry of Consumer Affairs (DoCA, SIH 2026), paired with end-to-end customer churn classification pipelines.",
      stack: ["Scikit-learn", "Pandas", "K-Means", "Flask"],
      url: "https://github.com/30Piyush2025",
      linkLabel: "Explore SIH Project",
      role: "Team Yuva Codes · SIH 2026",
      roleLabel: "My contribution",
      context: "Agricultural procurement centers face chaotic physical queue bottlenecks, while modern consumer platforms struggle with unpredicted subscriber churn.",
      approach: "Engineered digital queuing architectures for SIH Problem Statement 26032, alongside comprehensive 4-stage machine learning pipelines for customer retention analysis.",
      contributions: [
        "Developed slot reservation and queuing algorithms for agricultural distribution centers.",
        "Built a 4-notebook machine learning pipeline in Google Colab covering EDA, scaling, and classification.",
        "Applied K-Means clustering to uncover customer behavioral segments and churn risk profiles.",
        "Engineered interactive dashboards with custom SVG charts and metrics tracking."
      ],
      outcome: "A national hackathon platform for equitable grain procurement and high-accuracy predictive customer churn intelligence.",
      visual: "krishi",
      imageSrc: BASE_URL + "projects/review-concept.png",
      imageWidth: 1536,
      imageHeight: 1024,
      imageAlt: "KrishiSetu-Q and Churn Prediction analytics dashboard",
      imageCaption: "SYSTEM ARCHITECTURE / ENLARGE ↗",
      imageNote: "KRISHISETU-Q & CHURN ANALYTICS · SIH 2026 & ML PIPELINE"
    }
  ],

  productionEngineering: [
    {
      num: "01",
      category: "MODEL TRAINING & FINE-TUNING",
      title: "From raw data to optimized inference.",
      description: "TensorFlow · Keras · Sentence-BERT · LoRA / QLoRA Fine-tuning · Cosine Similarity\nFeature engineering, loss optimization, and efficient model parameter adaptation."
    },
    {
      num: "02",
      category: "AGENTIC WORKFLOWS & LLMS",
      title: "Autonomous reasoning and multi-step routing.",
      description: "LangGraph · Groq API · Gemini API · Prompt Engineering · RAG\nDecision graphs, structured schema outputs, and multi-agent coordination."
    },
    {
      num: "03",
      category: "APIS & DATA PIPELINES",
      title: "Clean delivery and programmatic outputs.",
      description: "Python · Flask · Streamlit · Pandas · NumPy · ReportLab PDF Engine · Firebase\nREST endpoints, reactive analytical apps, and automated document generation."
    },
    {
      num: "04",
      category: "CONTINUOUS LEARNING & RIGOR",
      title: "Disciplined engineering and security awareness.",
      description: "Docker · Git · Google/Coursera AI Certified · Deloitte Cyber Job Simulation\nContainerized releases, structured ML roadmaps, and cybersecurity fundamentals."
    }
  ]
};
