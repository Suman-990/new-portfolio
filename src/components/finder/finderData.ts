import type { FinderItem } from "./types";

export const INITIAL_FINDER_ITEMS: FinderItem[] = [
  // --- DOCUMENTS FOLDER ---
  {
    id: "resume-pdf",
    name: "Resume_Suman_Mahanty.pdf",
    type: "pdf",
    size: "215 KB",
    kind: "PDF Document",
    dateModified: "Today at 10:24 AM",
    parentId: "documents",
    content: "/Suman_Mahanty_CV.pdf",
    tags: ["Featured"],
    description: "Full Stack & Backend Software Engineer Resume (Latest 2026 Edition)",
  },
  {
    id: "about-md",
    name: "About_Me.md",
    type: "markdown",
    size: "4 KB",
    kind: "Markdown Document",
    dateModified: "Yesterday at 04:15 PM",
    parentId: "documents",
    content: `# Suman Mahanty
**Software Engineer & System Architect**
*Bangalore, India • Available for High-Impact Roles*

---

### 🚀 Executive Summary
Passionate Full-Stack & Backend Software Engineer with a deep foundation in scalable distributed systems, low-latency microservices, and modern user experiences. Experienced in taking products from zero to production at scale.

### 🛠️ Core Competencies
- **Languages:** Java, TypeScript, JavaScript, Golang, C, SQL
- **Frameworks:** Spring Boot, Node.js, Express, React, Tailwind CSS, Next.js
- **Cloud & DevOps:** Docker, AWS (S3, EC2, RDS), RabbitMQ, Apache Kafka, CI/CD
- **Databases:** PostgreSQL, MongoDB, Redis
- **Architecture:** Microservices, Event-Driven Architecture, RESTful APIs

### 💡 Engineering Philosophy
> "Simplicity, robust test coverage, and defensive architecture enable systems that scale gracefully under pressure."

### 🏆 Recognitions & Accomplishments
- **TechSprint National Hackathon:** 1st Place Winner for intelligent cloud latency optimizer.
- **Problem Solving:** Active competitive programmer on LeetCode with extensive data structure expertise.
`,
    tags: ["Featured"],
    description: "Personal introduction, background, and tech philosophy",
  },
  {
    id: "experience-md",
    name: "Work_Experience.md",
    type: "markdown",
    size: "6 KB",
    kind: "Markdown Document",
    dateModified: "Oct 15, 2026",
    parentId: "documents",
    content: `# Work Experience & Roles

## emissio — Software Engineer
**Period:** October 2026 – Present
**Location:** Bangalore, India
**Role:** Software Engineer (Full-Stack & Backend)
**Stack:** Java, Spring Boot, React, TypeScript, Docker, PostgreSQL, Redis

### 🚀 Key Contributions & Impact
- Architected and deployed high-performance microservices and REST APIs, optimizing system throughput and lowering p99 request latency by 35%.
- Engineered responsive, data-intensive web interfaces with React, TypeScript, and modern component architectures.
- Built automated CI/CD deployment workflows and containerized backend services using Docker for zero-downtime releases.
- Optimized PostgreSQL indexing and query execution plans for mission-critical relational data models.

---

## Mentorquedu — Full-Stack Engineering Intern
**Period:** Earlier Tenure
**Location:** Remote
**Role:** Full-Stack Engineering Intern
**Stack:** Node.js, Express, React, MongoDB, WebSockets

### 🚀 Key Contributions & Impact
- Developed full-stack modules for student engagement and automated code review workflows.
- Implemented real-time messaging pipelines and interactive learning dashboards using WebSockets.
- Built RESTful endpoints for student progress analytics and course curriculum management.
`,
    tags: ["Career"],
    description: "Detailed roles, responsibilities, and achievements at emissio and Mentorquedu",
  },
  {
    id: "contact-vcf",
    name: "Contact_Card.vcf",
    type: "vcard",
    size: "2 KB",
    kind: "vCard Contact",
    dateModified: "Sep 28, 2026",
    parentId: "documents",
    content: `BEGIN:VCARD
VERSION:3.0
FN:Suman Mahanty
TITLE:Software Engineer
EMAIL:sumanmahanty990@gmail.com
URL;TYPE=LinkedIn:https://www.linkedin.com/in/suman990
URL;TYPE=GitHub:https://github.com/Suman-990
URL;TYPE=LeetCode:https://leetcode.com/u/Suman_990/
NOTE:Feel free to reach out for high-impact backend & full-stack opportunities!
END:VCARD`,
    tags: ["Active"],
    description: "Direct email, GitHub, LinkedIn, and developer links",
  },

  // --- PROJECTS ROOT FOLDER ---
  {
    id: "project-codify-folder",
    name: "Codify — Online Judge",
    type: "folder",
    size: "3 items",
    kind: "Folder",
    dateModified: "Oct 20, 2026",
    parentId: "projects",
    tags: ["Featured", "Production"],
    description: "Isolated code execution sandbox & online judge engine",
  },
  {
    id: "project-omniscout-folder",
    name: "OmniScout — Job Aggregator",
    type: "folder",
    size: "3 items",
    kind: "Folder",
    dateModified: "Oct 18, 2026",
    parentId: "projects",
    tags: ["Production"],
    description: "Automated multi-portal job aggregation & notification engine",
  },
  {
    id: "project-fineprint-folder",
    name: "FinePrint — Ingredient Scanner",
    type: "folder",
    size: "3 items",
    kind: "Folder",
    dateModified: "Oct 14, 2026",
    parentId: "projects",
    tags: ["Active"],
    description: "AI-powered product ingredient scanner & health insight tool",
  },
  {
    id: "project-techsprint-folder",
    name: "TechSprint Hackathon",
    type: "folder",
    size: "2 items",
    kind: "Folder",
    dateModified: "Oct 15, 2026",
    parentId: "projects",
    tags: ["Featured"],
    description: "1st Place Winner - TechSprint National Hackathon",
  },

  // --- CODIFY FOLDER CONTENTS ---
  {
    id: "codify-preview-img",
    name: "Codify_Architecture.png",
    type: "image",
    size: "1.4 MB",
    kind: "PNG Image",
    dateModified: "Oct 20, 2026",
    parentId: "project-codify-folder",
    content: "/codify-project1.png",
    thumbnail: "/codify-project1.png",
    tags: ["Featured"],
    description: "System design architecture and execution workflow of Codify",
  },
  {
    id: "codify-readme-md",
    name: "Codify_Overview.md",
    type: "markdown",
    size: "5 KB",
    kind: "Markdown Document",
    dateModified: "Oct 20, 2026",
    parentId: "project-codify-folder",
    content: `# Codify — Online Judge & Code Execution Platform

### 🎯 Key Highlights
- **Secure Sandboxing:** Custom Linux container worker pools with strict cgroups, namespaces, and CPU/memory limits.
- **Multi-Language Support:** Instant evaluation for C++, Java, Python, and Go.
- **High Throughput:** Asynchronous submission queue orchestrated with Redis & RabbitMQ.
- **Live WebSocket Feed:** Instant feedback on test cases (Compilation, Runtime, TLE, MLE, Accepted).

### 🛠️ Architecture
- **Backend:** Node.js, Express, Docker daemon SDK, Redis queue
- **Frontend:** React, TypeScript, Monaco Editor, Tailwind CSS
- **Database:** PostgreSQL for submission logs & problem repository
`,
    tags: ["Featured"],
    description: "Technical deep-dive and features of Codify",
  },
  {
    id: "codify-github-link",
    name: "Codify_Repository.url",
    type: "link",
    size: "1 KB",
    kind: "Web Internet Shortcut",
    dateModified: "Oct 20, 2026",
    parentId: "project-codify-folder",
    externalUrl: "https://github.com/Suman-990/codify",
    description: "github.com/Suman-990/codify",
  },

  // --- OMNISCOUT FOLDER CONTENTS ---
  {
    id: "omniscout-preview-img",
    name: "OmniScout_Platform.png",
    type: "image",
    size: "233 KB",
    kind: "PNG Image",
    dateModified: "Oct 18, 2026",
    parentId: "project-omniscout-folder",
    content: "/omniscout-project2.png",
    thumbnail: "/omniscout-project2.png",
    tags: ["Production"],
    description: "Dashboard view of automated job aggregation platform",
  },
  {
    id: "omniscout-readme-md",
    name: "OmniScout_Overview.md",
    type: "markdown",
    size: "4 KB",
    kind: "Markdown Document",
    dateModified: "Oct 18, 2026",
    parentId: "project-omniscout-folder",
    content: `# OmniScout — Automated Multi-Portal Job Aggregator

### 🎯 Key Highlights
- **Automated Web Scraping:** Scheduled workers scanning LinkedIn, Indeed, Glassdoor, and startup boards.
- **Deduplication Engine:** Fuzzy string matching and company hashing to eliminate duplicate listings.
- **Smart Filtering:** Matches user skills against job descriptions with NLP keyword scoring.
- **Alert Dispatcher:** Discord and email webhook notifications for newly discovered positions.

### 🛠️ Architecture
- **Worker Pipeline:** Python, Playwright, BeautifulSoup, Celery
- **API & DB:** FastAPI, PostgreSQL, Redis cache
`,
    tags: ["Production"],
    description: "Detailed specification of the OmniScout system",
  },
  {
    id: "omniscout-github-link",
    name: "OmniScout_Repository.url",
    type: "link",
    size: "1 KB",
    kind: "Web Internet Shortcut",
    dateModified: "Oct 18, 2026",
    parentId: "project-omniscout-folder",
    externalUrl: "https://github.com/Suman-990/omniscout",
    description: "github.com/Suman-990/omniscout",
  },

  // --- FINEPRINT FOLDER CONTENTS ---
  {
    id: "fineprint-preview-img",
    name: "FinePrint_Showcase.webp",
    type: "image",
    size: "63 KB",
    kind: "WebP Image",
    dateModified: "Oct 14, 2026",
    parentId: "project-fineprint-folder",
    content: "/fineprint-project3.webp",
    thumbnail: "/fineprint-project3.webp",
    description: "Mobile app interface of FinePrint ingredient scanner",
  },
  {
    id: "fineprint-readme-md",
    name: "FinePrint_Overview.md",
    type: "markdown",
    size: "3 KB",
    kind: "Markdown Document",
    dateModified: "Oct 14, 2026",
    parentId: "project-fineprint-folder",
    content: `# FinePrint — AI-Powered Ingredient Scanner

### 🎯 Overview
FinePrint empowers consumers by scanning product ingredient labels using OCR and analyzing them against health databases for allergens, harmful additives, and dietary restrictions.

### 🛠️ Tech Stack
- **Client:** React Native (Expo), Tailwind CSS
- **Vision Model:** Google Cloud Vision OCR + Gemini Flash API for allergen synthesis
- **Backend:** Node.js microservices
`,
    description: "Technical details of FinePrint",
  },
  {
    id: "fineprint-github-link",
    name: "FinePrint_Repository.url",
    type: "link",
    size: "1 KB",
    kind: "Web Internet Shortcut",
    dateModified: "Oct 14, 2026",
    parentId: "project-fineprint-folder",
    externalUrl: "https://github.com/Sharan986/finePrint",
    description: "github.com/Sharan986/finePrint",
  },

  // --- TECHSPRINT FOLDER CONTENTS ---
  {
    id: "techsprint-award-img",
    name: "TechSprint_1st_Place.png",
    type: "image",
    size: "594 KB",
    kind: "PNG Image",
    dateModified: "Oct 15, 2026",
    parentId: "project-techsprint-folder",
    content: "/techsprint-hackathon.png",
    thumbnail: "/techsprint-hackathon.png",
    tags: ["Featured"],
    description: "1st Place Winner Certificate & Hackathon Presentation",
  },
  {
    id: "techsprint-notes-md",
    name: "Hackathon_Victory.md",
    type: "markdown",
    size: "2 KB",
    kind: "Markdown Document",
    dateModified: "Oct 15, 2026",
    parentId: "project-techsprint-folder",
    content: `# TechSprint National Hackathon 2026

🏆 **1st Place Winner**
- Built an intelligent cloud latency optimizer in 36 hours.
- Pitched to industry judges and demonstrated real-world performance gains.
`,
    tags: ["Featured"],
    description: "Hackathon overview and judging criteria",
  },

  // --- DOWNLOADS FOLDER ---
  {
    id: "downloads-resume",
    name: "Suman_Mahanty_CV.pdf",
    type: "pdf",
    size: "215 KB",
    kind: "PDF Document",
    dateModified: "Today at 08:30 AM",
    parentId: "downloads",
    content: "/Suman_Mahanty_CV.pdf",
    tags: ["Featured"],
    description: "Direct download copy of Suman Mahanty's Curriculum Vitae",
  },
  {
    id: "downloads-leetcode",
    name: "LeetCode_Stats.png",
    type: "image",
    size: "20 KB",
    kind: "PNG Image",
    dateModified: "Oct 15, 2026",
    parentId: "downloads",
    content: "/leetcode-stats.png",
    thumbnail: "/leetcode-stats.png",
    description: "LeetCode problem solving statistics & milestone achievements",
  },

  // --- DESKTOP FOLDER ---
  {
    id: "desktop-resume",
    name: "Resume_Suman_Mahanty.pdf",
    type: "pdf",
    size: "215 KB",
    kind: "PDF Document",
    dateModified: "Today at 10:24 AM",
    parentId: "desktop",
    content: "/Suman_Mahanty_CV.pdf",
    tags: ["Featured"],
    description: "Desktop shortcut to PDF resume",
  },
  {
    id: "desktop-projects-shortcut",
    name: "Projects",
    type: "folder",
    size: "4 items",
    kind: "Folder Alias",
    dateModified: "Oct 20, 2026",
    parentId: "desktop",
    description: "Alias to Projects collection",
  },
];

export const SIDEBAR_SECTIONS = [
  {
    id: "favorites",
    title: "Favorites",
    items: [
      { id: "fav-recents", label: "Recents", icon: "Clock", folderId: "recents" },
      { id: "fav-documents", label: "Documents", icon: "FileText", folderId: "documents" },
      { id: "fav-projects", label: "Projects", icon: "FolderGit2", folderId: "projects" },
      { id: "fav-desktop", label: "Desktop", icon: "Laptop", folderId: "desktop" },
      { id: "fav-downloads", label: "Downloads", icon: "ArrowDownCircle", folderId: "downloads" },
    ],
  },
  {
    id: "tags",
    title: "Tags",
    items: [
      { id: "tag-featured", label: "Featured", icon: "Circle", folderId: "tag:Featured", color: "#ef4444" },
      { id: "tag-production", label: "Production", icon: "Circle", folderId: "tag:Production", color: "#10b981" },
      { id: "tag-career", label: "Career", icon: "Circle", folderId: "tag:Career", color: "#3b82f6" },
    ],
  },
];
