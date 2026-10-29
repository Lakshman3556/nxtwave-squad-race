/**
 * Single source of truth for workshop messaging, copy, and offer flags.
 * Allows uncertain claims (certificates, gifts) to be toggled off instantly.
 */

export const OFFER_CONFIG = {
  // Brand safety flags: set to false unless explicitly confirmed by NxtWave
  CERTIFICATE_CONFIRMED: true, // "Official Workshop Certificate of Completion"
  REGISTRATION_GIFTS_CONFIRMED: true, // "Curated AI toolkit & Student Project Gallery"
  VERIFIED_ATTENDANCE_REQUIRED_FOR_REWARDS: true,
};

export const WORKSHOP_DETAILS = {
  title: "Build Your First AI Project in 60 Minutes",
  duration: "60 Minutes • Hands-on Live Workshop",
  dateText: "Upcoming Live Cohort • Sunday 6:00 PM IST",
  costText: "100% Free for Final-Year Students",
  targetBatch: "2027 Passing Out Batch (Final-Year Engineering)",
  heroHook: "Leave with a working AI project you can demo in your next interview.",
  secondaryHook: "Zero prior AI experience required. Build, deploy, and showcase on your resume.",
  deadlineText: "Registration closes in 7 days (or when cohort capacity is reached).",
  hostName: "NxtWave",
};

export const COLLEGE_LIST = [
  { id: "cbit", name: "Chaitanya Bharathi Institute of Technology (CBIT)", city: "Hyderabad", state: "Telangana" },
  { id: "vnr-vjiet", name: "VNR Vignana Jyothi Institute of Engineering & Technology", city: "Hyderabad", state: "Telangana" },
  { id: "vasavi", name: "Vasavi College of Engineering", city: "Hyderabad", state: "Telangana" },
  { id: "griet", name: "Gokaraju Rangaraju Institute of Engineering & Technology", city: "Hyderabad", state: "Telangana" },
  { id: "cvr", name: "CVR College of Engineering", city: "Hyderabad", state: "Telangana" },
  { id: "mvsr", name: "MVSR Engineering College", city: "Hyderabad", state: "Telangana" },
  { id: "vardhaman", name: "Vardhaman College of Engineering", city: "Hyderabad", state: "Telangana" },
  { id: "snist", name: "Sreenidhi Institute of Science and Technology (SNIST)", city: "Hyderabad", state: "Telangana" },
  { id: "bvrit", name: "BVRIT Hyderabad College of Engineering", city: "Hyderabad", state: "Telangana" },
  { id: "jntuh", name: "JNTUH University College of Engineering", city: "Hyderabad", state: "Telangana" },
  { id: "osmania", name: "University College of Engineering, Osmania University", city: "Hyderabad", state: "Telangana" },
  { id: "anurag", name: "Anurag University", city: "Hyderabad", state: "Telangana" },
  { id: "kits-warangal", name: "Kakatiya Institute of Technology & Science (KITS)", city: "Warangal", state: "Telangana" },
  { id: "sr-uni", name: "SR University", city: "Warangal", state: "Telangana" },
  { id: "nit-warangal", name: "National Institute of Technology (NIT) Warangal", city: "Warangal", state: "Telangana" },
  { id: "iit-hyderabad", name: "Indian Institute of Technology (IIT) Hyderabad", city: "Kandi", state: "Telangana" },
  { id: "iiit-hyderabad", name: "IIIT Hyderabad", city: "Hyderabad", state: "Telangana" },
  { id: "andhra-uni", name: "Andhra University College of Engineering", city: "Visakhapatnam", state: "Andhra Pradesh" },
  { id: "gvpce", name: "Gayatri Vidya Parishad College of Engineering (GVPCE)", city: "Visakhapatnam", state: "Andhra Pradesh" },
  { id: "rvr-jc", name: "RVR & JC College of Engineering", city: "Guntur", state: "Andhra Pradesh" },
  { id: "kl-uni", name: "KL University", city: "Vijayawada", state: "Andhra Pradesh" },
  { id: "vignan", name: "Vignan's Foundation for Science, Technology & Research", city: "Guntur", state: "Andhra Pradesh" },
  { id: "srm-ap", name: "SRM University AP", city: "Amaravati", state: "Andhra Pradesh" },
  { id: "vit-ap", name: "VIT-AP University", city: "Amaravati", state: "Andhra Pradesh" },
  { id: "sri-venkateswara", name: "Sri Venkateswara University College of Engineering", city: "Tirupati", state: "Andhra Pradesh" },
  { id: "jntuk", name: "JNTUK University College of Engineering Kakinada", city: "Kakinada", state: "Andhra Pradesh" },
  { id: "jntua", name: "JNTUA College of Engineering Anantapur", city: "Anantapur", state: "Andhra Pradesh" },
  { id: "psg-tech", name: "PSG College of Technology", city: "Coimbatore", state: "Tamil Nadu" },
  { id: "thiagarajar", name: "Thiagarajar College of Engineering", city: "Madurai", state: "Tamil Nadu" },
  { id: "sastra", name: "SASTRA Deemed University", city: "Thanjavur", state: "Tamil Nadu" },
];

export const BRANCHES = [
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Mechanical Engineering (Mech)",
  "Civil Engineering (Civil)",
  "Data Science / AI / ML Specialization",
  "Other Engineering Branch",
];

export const BRANCH_IDEAS: Record<string, Array<{ title: string; desc: string; resumeLine: string }>> = {
  CSE: [
    {
      title: "RAG-Powered Technical Interview Simulator",
      desc: "Retrieval-Augmented Generation system that conducts mock coding interviews and scores technical answers against company question banks.",
      resumeLine: "Built RAG interview simulator using LangChain & Pinecone with semantic scoring of student explanations.",
    },
    {
      title: "Automated Code Review & Security Auditor",
      desc: "LLM-driven GitHub bot that detects OWASP security vulnerabilities and auto-generates pull request suggestions.",
      resumeLine: "Engineered automated code security reviewer analyzing git diffs with 92% precision against CWE top-25.",
    },
    {
      title: "Smart SQL Query Generator with Schema Context",
      desc: "Natural language interface that converts conversational business prompts into validated, optimized SQL queries.",
      resumeLine: "Developed Text-to-SQL tool with database schema injection reducing analyst report query turnaround by 75%.",
    },
  ],
  ECE: [
    {
      title: "TinyML Edge Audio Keyword Spotter",
      desc: "Ultra-compact neural network model deployed on low-power microcontrollers for real-time acoustic event detection.",
      resumeLine: "Trained and quantized TinyML audio keyword classifier running under 28KB RAM on ESP32.",
    },
    {
      title: "Automated PCB Solder Defect Detector",
      desc: "Computer vision pipeline that inspects surface-mount PCB components and flags bridging, tombstoning, and voids.",
      resumeLine: "Implemented YOLOv8-based PCB solder defect inspection with 96.4% recall on factory test boards.",
    },
    {
      title: "Adaptive RF Signal Noise Filter using Deep Learning",
      desc: "Deep denoising autoencoder that reconstructs clean digital signals from noisy transmission channels.",
      resumeLine: "Created deep denoising autoencoder recovering QPSK signals at -5dB SNR with 4.8dB BER improvement.",
    },
  ],
  EEE: [
    {
      title: "Solar Microgrid Power Load Predictor",
      desc: "LSTM-based time-series forecasting model that optimizes battery charging cycles based on solar irradiance and load patterns.",
      resumeLine: "Built LSTM power load predictor optimizing microgrid battery cycles, reducing peak diesel generator usage by 18%.",
    },
    {
      title: "EV Lithium-Ion Battery Health (SOH) Estimator",
      desc: "Machine learning model predicting remaining useful battery life from charge-discharge voltage profiles.",
      resumeLine: "Developed battery State-of-Health predictor achieving <1.8% RMSE on NASA Li-ion battery degradation data.",
    },
    {
      title: "Electrical Substation Fault Diagnostic Classifier",
      desc: "Transformer anomaly detector analyzing three-phase current waveforms to preemptively catch insulation breakdown.",
      resumeLine: "Trained transient fault classifier identifying partial discharges in transformer telemetry within 2 cycles.",
    },
  ],
  Mech: [
    {
      title: "Predictive CNC Tool Wear Monitor",
      desc: "Vibration spectrogram classifier that detects machining tool degradation before surface finish defects occur.",
      resumeLine: "Built vibration spectrogram CNN model for CNC lathe tooling, preventing unplanned downtime with 94% accuracy.",
    },
    {
      title: "Generative CAD Bracket Topology Optimization",
      desc: "AI assistant that minimizes structural component mass while satisfying FEA stress and factor-of-safety constraints.",
      resumeLine: "Created generative topology optimization script reducing structural bracket mass by 31% while retaining 2.5x safety factor.",
    },
    {
      title: "Autonomous Warehouse AGV Path Planner",
      desc: "Reinforcement learning agent navigating dynamic factory floors with real-time obstacle avoidance.",
      resumeLine: "Engineered deep Q-learning path planning agent for mobile robotics navigating congested warehouse layouts.",
    },
  ],
  Civil: [
    {
      title: "Structural Concrete Crack Severity Scorer",
      desc: "Mobile-ready vision model classifying crack width, depth, and structural risk in bridges and retaining walls.",
      resumeLine: "Deployed computer vision crack detection model measuring width down to 0.2mm on drone-captured bridge imagery.",
    },
    {
      title: "Rainfall-Runoff & Urban Flash Flood Predictor",
      desc: "Hydrological forecasting network integrating catchment topography and precipitation data.",
      resumeLine: "Developed hydrological runoff predictor providing 3-hour lead-time flash flood alerts for urban basins.",
    },
    {
      title: "BIM Architectural Code Compliance Verifier",
      desc: "NLP rule parser that automatically verifies 3D BIM models against municipal building safety bye-laws.",
      resumeLine: "Built automated building code checker parsing municipal regulations against IFC architectural metadata.",
    },
  ],
  Default: [
    {
      title: "Custom LLM Document Research Assistant",
      desc: "Vector-search powered document Q&A system that parses PDF textbooks and technical manuals with citation tracking.",
      resumeLine: "Implemented full-stack document RAG search engine with sub-second vector retrieval and hallucination guardrails.",
    },
    {
      title: "Multi-Modal Visual Search Engine",
      desc: "Embeddings-based semantic image and text similarity search using CLIP models.",
      resumeLine: "Engineered cross-modal search tool indexing 50,000+ items with sub-50ms cosine similarity queries.",
    },
    {
      title: "Smart Task Automation Agent",
      desc: "Autonomous workflow runner that converts natural language commands into orchestrated API actions.",
      resumeLine: "Developed autonomous agent with tool-calling capabilities that automated multi-step administrative workflows.",
    },
  ],
};
