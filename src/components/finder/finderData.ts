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
    tags: ["Featured", "Career"],
    description: "Full Stack & Backend Software Engineer Resume (Latest 2026 Edition)",
  },
  {
    id: "about-md",
    name: "About_Me.md",
    type: "markdown",
    size: "5 KB",
    kind: "Markdown Document",
    dateModified: "Today at 09:15 AM",
    parentId: "documents",
    content: `# Suman Mahanty
**Full Stack & Backend Software Engineer**
*Jamshedpur, Jharkhand, India • Open to High-Impact Roles*

**Email:** [sumanmahanty.99@gmail.com](mailto:sumanmahanty.99@gmail.com)
**Portfolio:** [portfolio-suman-44.vercel.app](https://portfolio-suman-44.vercel.app)
**GitHub:** [github.com/Suman-990](https://github.com/Suman-990)
**LinkedIn:** [linkedin.com/in/suman990](https://linkedin.com/in/suman990)
**LeetCode:** [leetcode.com/u/Suman_990](https://leetcode.com/u/Suman_990/)

---

### 🚀 Executive Summary
Passionate Full-Stack & Backend Software Engineer with a deep foundation in scalable distributed systems, low-latency microservices, high-concurrency event-driven architectures, and modern user experiences. Experienced in taking products from zero to production at scale. Competitive programmer holding a **Top 0.02% global ranking on LeetCode with 800+ solved problems**.

> [!NOTE]
> Based in Jamshedpur, Jharkhand, India. Actively architecting robust backend infrastructures and shipping scalable full-stack products from concept to production.

---

### 🎓 Education & Academics
**Institution:** Arka Jain University (AJU)
**Degree:** Bachelor of Computer Application (BCA)
**Tenure:** 2025 – 2028
**Cumulative GPA:** 9.1 / 10.0

---

### 🏆 Key Honors & Recognitions
- **Top 0.02% Global Rank on LeetCode:** Solved 800+ algorithmic problems across advanced data structures, graph algorithms, dynamic programming, and systems design.
- **1st Place Winner — TechSprint National Hackathon:** Championed 36-hour hackathon organized by Google Developer Groups (GDG on Campus AJU) by developing an intelligent cloud latency optimizer.
- **Production Performance Impact:** Engineered a client-side streaming PDF parser at Mentorque that slashed document processing latency from 6–7 seconds down to ~0.5 seconds (92% reduction).

---

### 🛠️ Core Competencies Matrix

| Category | Technologies & Tools |
|---|---|
| **Programming Languages** | Java, Golang, C, TypeScript, JavaScript, HTML5, CSS3, SQL |
| **Backend & Frameworks** | Spring Boot, Node.js, Express.js, Microservices, REST APIs, Gorilla Mux, WebSockets |
| **Frontend & Mobile** | React, React Native, Tailwind CSS, NativeWind, Vite, Next.js |
| **Distributed & Cloud** | Docker, Apache Kafka, RabbitMQ, BullMQ, AWS (S3, EC2, RDS), Redis |
| **Databases** | PostgreSQL, MongoDB, Redis |
| **Core Specializations** | Data Structures & Algorithms, Distributed Systems, Asynchronous Queues, Bot Evasion Web Scraping, Code Sandboxing |

---

### 💡 Engineering Philosophy
> "Simplicity, robust test coverage, defensive distributed architecture, and data-driven optimization under load enable systems that scale gracefully under pressure."

\`\`\`bash
# Clone flagship projects
git clone https://github.com/Suman-990/codify.git
git clone https://github.com/Suman-990/omniscout.git
\`\`\`
`,
    tags: ["Featured"],
    description: "Personal introduction, background, education, and engineering philosophy",
  },
  {
    id: "experience-md",
    name: "Work_Experience.md",
    type: "markdown",
    size: "6 KB",
    kind: "Markdown Document",
    dateModified: "Oct 20, 2026",
    parentId: "documents",
    content: `# Professional Work Experience

Detailed overview of professional software engineering roles, full-stack contributions, and shipped deployments.

---

## emissio — Software Engineer
**Period:** October 2026 – Present
**Location:** India (Remote)
**Role:** Software Engineer (Full-Stack & Backend)
**Stack:** Microservices, REST APIs, React, TypeScript, Docker, CI/CD, PostgreSQL, Redis

### 🚀 Key Contributions & Architectural Impact
- **High-Performance Microservices:** Architected and deployed production microservices and REST APIs, optimizing system throughput and request latency.
- **Responsive Web Applications:** Engineered responsive, data-intensive web interfaces with React, TypeScript, and modern component architectures for real-time dashboards.
- **Containerization & CI/CD Pipelines:** Built automated CI/CD deployment workflows and containerized backend services using Docker for zero-downtime releases.
- **Relational Schema Optimization:** Designed PostgreSQL table indexing, foreign-key constraints, and optimized query execution plans for operational data models.

> [!TIP]
> Emissio focus: Microservices throughput, containerized zero-downtime releases, and low-latency database design.

---

## Mentorque — Full Stack Developer Intern
**Period:** July 2026 – September 2026
**Location:** Remote
**Role:** Full Stack Developer Intern
**Stack:** Node.js, Express, React, TypeScript, Chrome Extension, BullMQ, Redis, Client-side PDF Parser, OmniScout Engine

### 🚀 Key Contributions & Engineering Impact
- **Platform Stability & Bug Resolution:** Resolved multiple critical production issues across frontend and backend services, including the Mentorque Chrome extension, improving platform reliability and user retention.
- **Ultra-Fast PDF Parser (92% Latency Drop):** Implemented a high-performance client-side PDF parser, reducing document processing time from 6–7 seconds to ~0.5 seconds.
- **OmniScout System Integration:** Integrated OmniScout’s asynchronous automated job aggregation system into the Mentorque platform, enabling hands-free ingestion across top job portals.
- **Operational Dashboards:** Engineered 3 dedicated production dashboards for monitoring job ingestion streams, error telemetry, and queue health metrics.

\`\`\`typescript
// Mentorque Client-side PDF Parser Benchmark
// Before: Server round-trip processing (6 - 7 seconds)
// After: In-browser streaming Web Worker parser (~0.5 seconds)
const processingTimeReduction = ((6.5 - 0.5) / 6.5) * 100; // ~92.3% faster!
\`\`\`
`,
    tags: ["Career", "Featured"],
    description: "Detailed roles, responsibilities, and achievements at emissio and Mentorque",
  },
  {
    id: "skills-md",
    name: "Technical_Skills.md",
    type: "markdown",
    size: "5 KB",
    kind: "Markdown Document",
    dateModified: "Oct 18, 2026",
    parentId: "documents",
    content: `# Technical Skills & Architecture Matrix

Comprehensive catalogue of programming languages, libraries, distributed systems tools, databases, and engineering domains.

---

### 💻 Programming Languages
- **Java:** Object-oriented design, multithreading, concurrency utilities, Spring Boot framework ecosystem.
- **Golang:** High-concurrency routines, channels, Gorilla Mux, WebSockets, LiveKit WebRTC integration.
- **TypeScript & JavaScript:** ESNext, modern asynchronous programming, React, React Native, Node.js runtime.
- **C:** Low-level memory management, pointer arithmetic, foundational computer science principles.
- **SQL:** Complex relational joins, schema indexing, performance profiling on PostgreSQL & MySQL.
- **HTML5 & CSS3:** Semantic markup, modern responsive design, Tailwind CSS, NativeWind.

---

### 🌐 Libraries & Frameworks
- **Backend:** Spring Boot (Java), Node.js & Express.js, Gorilla Mux (Go), RESTful API design.
- **Frontend:** React, Tailwind CSS, Monaco Editor, Vite, Next.js.
- **Mobile Development:** React Native, Expo, NativeWind (Tailwind for mobile).
- **Automation & Testing:** Playwright (headless browser scraping & testing), BullMQ, Node-cron.

---

### ☁️ Cloud, DevOps & Message Brokers
- **Containerization:** Docker, Dockerfile authoring, isolated container sandboxing with cgroups & namespaces.
- **Message Brokers & Queues:** Apache Kafka (event streaming), RabbitMQ, BullMQ, Redis Queues.
- **Cloud Infrastructure:** AWS S3 (object storage), AWS EC2 (compute), AWS RDS (managed databases), Cloudinary.
- **Version Control & CI/CD:** Git, GitHub Actions, automated testing & deployment pipelines.
- **Operating Systems:** Linux (Ubuntu/Debian), Bash shell scripting, system-level process monitoring.

---

### 🗄️ Databases & Storage
- **PostgreSQL:** ACID-compliant transactions, indexing strategies (B-Tree, GIN), relational data modeling.
- **MongoDB:** NoSQL document store, aggregation pipelines, flexible schema management.
- **Redis:** High-speed in-memory key-value caching, Pub/Sub, queue backing, rate-limiting counters.

---

### 🧠 Core Engineering Focus
- **Data Structures & Algorithms:** Top 0.02% global rank on LeetCode with 800+ solved problems.
- **Distributed Systems Design:** Event-driven architecture, resilient message brokers, decoupling services.
- **Code Sandbox Execution:** Secure runtime sandboxes with CPU/memory quotas and seccomp filtering.
- **Web Scraping & Anti-Bot Evasion:** Stealth Playwright automation with headless browser evasion.
`,
    tags: ["Career"],
    description: "Comprehensive breakdown of programming languages, frameworks, cloud, and databases",
  },
  {
    id: "leetcode-md",
    name: "LeetCode_Milestones.md",
    type: "markdown",
    size: "4 KB",
    kind: "Markdown Document",
    dateModified: "Today at 10:00 AM",
    parentId: "documents",
    content: `# LeetCode Milestones & Algorithmic Mastery

**Global Ranking:** Top 0.02% Worldwide
**Problems Solved:** 800+ Problems
**Profile Link:** [leetcode.com/u/Suman_990](https://leetcode.com/u/Suman_990/)

---

### 🏆 Milestone Overview
Consistent problem solver with deep algorithmic discipline across Data Structures and Algorithms. Proven ability to evaluate edge cases, optimize asymptotic time/space complexities, and write clean, defensive code under competitive conditions.

> [!NOTE]
> Top 0.02% worldwide places Suman in the elite tier of competitive programmers on LeetCode among millions of active global developers.

---

### 📊 Problem Distribution & Domain Expertise

| Domain / Category | Problems Solved | Key Algorithms & Patterns |
|---|---|---|
| **Dynamic Programming** | 180+ | 1D/2D DP, Knapsack, Longest Common Subsequence, Bitmask DP, Digit DP |
| **Graph Theory** | 140+ | BFS/DFS, Dijkstra, Bellman-Ford, Topological Sort, Disjoint Set Union (DSU) |
| **Trees & BSTs** | 150+ | Lowest Common Ancestor, Morris Traversal, Trie, Segment Tree, Binary Indexed Tree |
| **Arrays & Two Pointers** | 160+ | Sliding Window, Prefix Sum, Kadane's, Dutch National Flag, Two Pointers |
| **Searching & Sorting** | 90+ | Binary Search on Answer, QuickSelect, Monotonic Stack & Monotonic Deque |
| **Backtracking & Recursion** | 80+ | N-Queens, Subsets & Permutations, Sudoku Solver, Branch & Bound |

---

### ⚡ Competitive Highlights
- Sustained high daily submission streaks reflecting rigorous daily practice.
- Successfully applied algorithmic optimizations into real-world production projects (e.g. Codify online judge, OmniScout deduplication engine, and client-side PDF parser).
`,
    tags: ["Featured"],
    description: "Top 0.02% global LeetCode ranking, 800+ solved problems & algorithmic mastery",
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
TITLE:Full Stack & Backend Software Engineer
TEL;TYPE=CELL:+919064961649
EMAIL;TYPE=INTERNET:sumanmahanty.99@gmail.com
ADR;TYPE=HOME:;;Jamshedpur;Jharkhand;;India
URL;TYPE=Portfolio:https://portfolio-suman-44.vercel.app
URL;TYPE=LinkedIn:https://www.linkedin.com/in/suman990
URL;TYPE=GitHub:https://github.com/Suman-990
URL;TYPE=LeetCode:https://leetcode.com/u/Suman_990/
NOTE:Software Engineer specializing in Spring Boot, Node.js, Go, React, and scalable distributed architectures.
END:VCARD`,
    tags: ["Active"],
    description: "Direct developer contact card with verified email, phone, location, and developer links",
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
    description: "Isolated code execution sandbox & online judge built with Spring Boot & Docker",
  },
  {
    id: "project-omniscout-folder",
    name: "OmniScout — Job Aggregator",
    type: "folder",
    size: "3 items",
    kind: "Folder",
    dateModified: "Oct 18, 2026",
    parentId: "projects",
    tags: ["Production", "Featured"],
    description: "Automated multi-portal job aggregation & AI resume parsing engine",
  },
  {
    id: "project-bytefeed-folder",
    name: "ByteFeed — Social Media",
    type: "folder",
    size: "2 items",
    kind: "Folder",
    dateModified: "Oct 16, 2026",
    parentId: "projects",
    tags: ["Featured", "Active"],
    description: "Real-time community platform with LiveKit voice channels built in Go & React Native",
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
    description: "1st Place Winner - Google Developer Groups (GDG) TechSprint Hackathon",
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
    description: "High-level architecture, isolated Docker workers, and Kafka queue pipeline",
  },
  {
    id: "codify-readme-md",
    name: "Codify_Overview.md",
    type: "markdown",
    size: "6 KB",
    kind: "Markdown Document",
    dateModified: "Oct 20, 2026",
    parentId: "project-codify-folder",
    content: `# Codify — Online Judge & Distributed Code Execution Platform

**Repository:** [github.com/Suman-990/codify](https://github.com/Suman-990/codify)
**Status:** Shipped & Load Tested
**Core Tech Stack:** Java, Spring Boot, React, PostgreSQL, Docker, Apache Kafka, Redis, Monaco Editor, Tailwind CSS

---

### 🎯 Overview & Motivation
Codify is a production-grade online judge and code evaluation platform inspired by LeetCode and Codeforces. It securely accepts, compiles, executes, and grades untrusted user code across multiple programming languages inside isolated Docker sandboxes, returning comprehensive verdict metrics (Accepted, Wrong Answer, TLE, MLE, Compilation Error) with consistent sub-3 second execution turnarounds.

> [!IMPORTANT]
> The backend is built natively with **Java and Spring Boot**, architected with an asynchronous **Apache Kafka** event stream to decouple submission ingress from worker container execution.

---

### 🛠️ Architecture & Execution Pipeline

| Layer | Technology | Primary Role |
|---|---|---|
| **API & Business Logic** | Java 17, Spring Boot | REST APIs, Problem curation, Test harness builder, JWT/OAuth2 Auth |
| **Event Bus & Queue** | Apache Kafka, Redis | Decouples burst submission traffic; ensures zero dropped submissions |
| **Execution Sandboxes** | Docker Daemon SDK, Linux cgroups | Transient Linux containers with CPU quotas, memory limits, and seccomp filtering |
| **Frontend UI** | React, TypeScript, Monaco Editor | Browser code editor, live test case runner, interactive result analytics |
| **Data Store** | PostgreSQL, Redis | Persistent storage for problems, test cases, verdicts, and caching |

\`\`\`
[React + Monaco Editor]
         │ (HTTP / WebSocket)
         ▼
[Spring Boot API Gateway] ───(JWT / OAuth2 Auth)
         │
         ▼ (Publish Submission Event)
   [Apache Kafka Queue]
         │
         ▼ (Consume Event)
[Execution Worker Cluster]
         │
         ▼ (Spin Up Locked-Down Sandbox)
┌─────────────────────────────────────────┐
│     Ephemeral Docker Container          │
│  - Memory: 256 MB Hard Limit (cgroups)  │
│  - CPU: 1 Core Quota (namespaces)       │
│  - Network: Disabled                    │
│  - Sub-3s Execution Turnaround          │
└─────────────────────────────────────────┘
         │
         ▼ (Store Verdict & Metrics)
  [PostgreSQL] + [Redis Cache]
         │
         ▼ (Real-Time Result Push)
[Client Test Case Verdict & Daily Heatmap]
\`\`\`

---

### 🚀 Key Engineering Highlights

1. **High-Throughput Asynchronous Kafka Pipeline:**
   - Architected an event-driven submission pipeline using Apache Kafka topics.
   - Sustained concurrent code submissions from **1,000+ virtual users with a 100% execution success rate** during rigorous load testing.

2. **Hardened Docker Sandbox Environment:**
   - Designed isolated Linux container sandboxes enforcing strict kernel cgroups, memory ceiling (256MB), and strict wall-clock timeout limits.
   - Completely disables network access inside worker containers to prevent SSRF and external resource abuse.
   - Supports out-of-the-box multi-language execution (C++, Java, Python, Go) with sub-3s average turnaround.

3. **AI-Driven Complexity Analysis:**
   - Integrated AI evaluation analyzing submitted source code to compute theoretical Time ($O(N)$, $O(N \\log N)$) and Space complexity.
   - Surfaces actionable code refactoring advice and algorithmic performance insights directly to candidates.

4. **Interactive Statistics & Daily Activity Heatmaps:**
   - Designed GitHub/LeetCode-style daily submission heatmaps and streak trackers.
   - Tracks language distribution, difficulty milestones, and average turnaround time to boost user retention.

5. **Role-Based Admin Management Dashboard:**
   - Secure JWT and OAuth2 authentication with role-based access control (RBAC).
   - Dedicated administrative suite to curate coding problems, author hidden test suites, configure time/memory thresholds, and monitor worker node cluster health.
`,
    tags: ["Featured", "Production"],
    description: "Detailed technical specification of Codify: Spring Boot, Kafka, Docker, and AI analysis",
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
    size: "5 KB",
    kind: "Markdown Document",
    dateModified: "Oct 18, 2026",
    parentId: "project-omniscout-folder",
    content: `# OmniScout — Automated Multi-Portal Job Aggregator & AI Engine

**Repository:** [github.com/Suman-990/omniscout](https://github.com/Suman-990/omniscout)
**Status:** Deployed in Production (Integrated into Mentorque)
**Core Tech Stack:** React, Node.js, Express, PostgreSQL, BullMQ, Redis, Playwright, Groq AI API, Cloudinary

---

### 🎯 Overview & Architecture
OmniScout is a scalable, autonomous multi-portal job aggregation engine. It continuously monitors, extracts, dedupes, and indexes job postings across 7+ leading career platforms (LinkedIn, Indeed, Workday, etc.), bypassing aggressive bot detection systems to provide candidate-matched opportunities in real time.

> [!NOTE]
> Integrated directly into Mentorque's live production infrastructure with 3 dedicated dashboards for monitoring ingestion queues, worker states, and portal health.

---

### 🛠️ Architecture Specification

| Component | Technology | Responsibility |
|---|---|---|
| **Frontend & Dashboards** | React, TypeScript, Tailwind CSS | 3 operational dashboards for queue metrics, job views, and manual trigger controls |
| **Backend API** | Node.js, Express.js | Microservices REST API, job search endpoints, authentication, candidate profile management |
| **Scraping Engine** | Playwright (Headless Browser) | Distributed workers executing multi-portal scraping with stealth evasion techniques |
| **Queue & Scheduling** | BullMQ, Redis, Node-cron | Scheduled cron runs, concurrency throttling, worker retry policies, priority queues |
| **AI Resume Parser** | Groq AI API (LLMs) | Parses unstructured resumes into structured candidate skill matrices and search queries |
| **Telemetry & Debugging** | Cloudinary, Winston | Automatic capture and streaming of Playwright error screenshots on scraping anomalies |
| **Database** | PostgreSQL | Relational storage for deduped job listings, salary analytics, and applicant tracking |

---

### 🚀 Key Technical Highlights

1. **Anti-Bot Headless Browser Scraping:**
   - Built with Playwright, configured with dynamic user-agent rotation, viewport randomization, and human mouse-jitter simulation to bypass Cloudflare and portal bot mitigation.
   - Concurrently harvests listings across **7+ major job portals** including LinkedIn, Indeed, and Workday.

2. **Groq AI (LLM) Candidate Matching:**
   - Ingests raw, unstructured PDF/Word resumes and utilizes Groq AI to extract normalized skill graphs, seniority levels, and past roles.
   - Dynamically translates candidate skill sets into hyper-targeted search queries to maximize application hit rates.

3. **Zero-Touch Scheduled Automation:**
   - Managed with Node-cron for autonomous daily data ingestion cycles without manual human intervention.
   - Implemented BullMQ rate-limiting to prevent rate-limit throttling and IP blocking from target portals.

4. **Automated Error Telemetry with Cloudinary:**
   - Scraping exceptions automatically capture DOM snapshots and viewport screenshots, streaming them directly to Cloudinary for instantaneous developer debugging.

5. **Mentorque Production Integration:**
   - Successfully integrated as the core job ingestion service inside Mentorque.
   - Developed 3 customized operational dashboards for system observability and ingestion throughput tracking.
`,
    tags: ["Production"],
    description: "Technical specification: React, Node.js, BullMQ, Redis, Playwright, Groq AI",
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

  // --- BYTEFEED FOLDER CONTENTS ---
  {
    id: "bytefeed-readme-md",
    name: "ByteFeed_Overview.md",
    type: "markdown",
    size: "5 KB",
    kind: "Markdown Document",
    dateModified: "Oct 16, 2026",
    parentId: "project-bytefeed-folder",
    content: `# ByteFeed — Real-Time Community & Voice Platform

**Repository:** [github.com/Suman-990](https://github.com/Suman-990)
**Core Tech Stack:** Golang, Gorilla Mux, WebSockets, LiveKit (WebRTC), React Native, NativeWind, PostgreSQL, Cloudinary

---

### 🎯 Overview & Product Concept
ByteFeed is a modern mobile community application designed for high-concurrency real-time engagement. It combines personalized algorithmic feeds, direct messaging, persistent topic channels, and low-latency group voice and 1-on-1 calls.

> [!TIP]
> Built with **Golang** for exceptional concurrency and memory efficiency, achieving sub-200ms message delivery latencies in concurrent load tests.

---

### 🛠️ Architecture Matrix

| Component | Technology | Role |
|---|---|---|
| **Backend REST API** | Golang, Gorilla Mux | High-throughput endpoints for authentication, social graphs, feed curation, and notifications |
| **Real-Time Messaging** | Gorilla WebSockets | Bi-directional streaming connection pool for instant text chats with <200ms latency |
| **Voice & Video Calling** | LiveKit (WebRTC) | Low-latency audio rooms, room token generation, and adaptive media routing |
| **Mobile Client** | React Native, NativeWind | Cross-platform iOS/Android interface styled with Tailwind CSS, gesture handling, and animations |
| **Database** | PostgreSQL | Relational graph schema modeling followers, friend connections, comments, and post reactions |
| **Media Storage** | Cloudinary | Cloud storage and image CDN optimization for user avatars and media attachments |

---

### 🚀 Key Technical Highlights

1. **Ultra-Low Latency Messaging (<200 ms):**
   - Engineered real-time chat infrastructure using Go channels and Gorilla WebSockets.
   - Achieved <200 ms average end-to-end message delivery latency across multiple simultaneous channel sessions under load testing.

2. **WebRTC Voice & Audio Channels via LiveKit:**
   - Integrated LiveKit WebRTC client and server infrastructure for high-fidelity, low-latency audio channels and private 1-on-1 DM calls.
   - Features automatic gain control, acoustic echo cancellation, and network jitter resilience.

3. **High-Performance Relational Social Graph:**
   - Built a normalized PostgreSQL database schema handling complex social queries (followers, threads, reactions, mentions) with optimized indexing.

4. **Polished Mobile Experience (React Native + NativeWind):**
   - Developed a slick, responsive mobile client with dark mode aesthetics, fluid gesture interactions, and optimistic UI updates for instant feedback.
`,
    tags: ["Featured", "Active"],
    description: "Technical specification: Golang, Gorilla Mux, WebSockets, LiveKit, React Native",
  },
  {
    id: "bytefeed-github-link",
    name: "ByteFeed_Repository.url",
    type: "link",
    size: "1 KB",
    kind: "Web Internet Shortcut",
    dateModified: "Oct 16, 2026",
    parentId: "project-bytefeed-folder",
    externalUrl: "https://github.com/Suman-990",
    description: "github.com/Suman-990",
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
    size: "4 KB",
    kind: "Markdown Document",
    dateModified: "Oct 14, 2026",
    parentId: "project-fineprint-folder",
    content: `# FinePrint — AI-Powered Ingredient Scanner

**Repository:** [github.com/Sharan986/finePrint](https://github.com/Sharan986/finePrint)
**Platform:** Mobile (React Native / Expo)
**Core Tech Stack:** React Native, Expo, Tailwind CSS, Google Cloud Vision OCR, Gemini Flash API, Node.js

---

### 🎯 Overview & Mission
FinePrint is an AI-powered health intelligence tool designed to demystify complex product ingredient labels. Users simply scan any food, beverage, or cosmetic packaging using their phone camera, and FinePrint instantly parses the ingredients, checks them against health databases, and flags harmful additives, allergens, and dietary restrictions.

---

### 🛠️ Technical Architecture

| Layer | Technology | Function |
|---|---|---|
| **Mobile Client** | React Native (Expo) | Camera view, real-time bounding boxes, scanner animations, allergen profiles |
| **OCR Processing** | Google Cloud Vision | Optical Character Recognition extracting small-print ingredient text from photos |
| **AI Nutritionist** | Gemini Flash API | Evaluates parsed ingredients against medical health databases and user preferences |
| **Backend Services** | Node.js, Express | Caching frequent product barcodes, allergen definitions, user profile storage |

---

### 🚀 Key Capabilities
- **Instant Camera OCR:** High-precision text recognition capable of reading distorted, curved, or low-contrast ingredient lists on physical packaging.
- **Contextual Allergen Flagging:** Checks against user-configured dietary profiles (e.g. Celiac / Gluten-free, Lactose intolerance, Nut allergies, Vegan, Diabetic).
- **Harmful Additive Warnings:** Highlights artificial preservatives, endocrine disruptors, and ultra-processed food markers with easy-to-read safety badges.
`,
    description: "Technical details of FinePrint: React Native, Vision OCR, Gemini Flash API",
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
    size: "3 KB",
    kind: "Markdown Document",
    dateModified: "Oct 15, 2026",
    parentId: "project-techsprint-folder",
    content: `# TechSprint National Hackathon 2026 🏆

**Achievement:** 1st Place Champion
**Organized By:** Google Developer Groups (GDG on Campus AJU)
**Project Title:** Intelligent Cloud Latency Optimizer & Edge Routing Engine
**Sprint Duration:** 36-Hour Hackathon

---

### 🎯 The Challenge & Winning Pitch
The GDG TechSprint Hackathon challenged university developers to conceive, architect, and demo a production-viable software solution within an intensive 36-hour sprint.

Our team designed and implemented an intelligent cloud edge routing and latency optimizer:
- Dynamically analyzed incoming user traffic and network conditions across distributed regions.
- Route requests dynamically to the lowest-latency edge worker node using lightweight latency probes.
- Demonstrated a measurable 40%+ reduction in p99 round-trip response times in live simulated traffic tests.

---

### 🎖️ Judging & Victory
- **Judging Criteria:** Technical complexity, system architecture, performance benchmarks, and real-world commercial viability.
- **Result:** Awarded **1st Place Winner** by an esteemed panel of Google Developer Group mentors, software architects, and university department leadership.
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
    tags: ["Featured", "Career"],
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
    tags: ["Featured"],
    description: "LeetCode problem solving statistics: Top 0.02% Global Rank, 800+ Solved",
  },
  {
    id: "downloads-leetcode-md",
    name: "LeetCode_Milestones.md",
    type: "markdown",
    size: "4 KB",
    kind: "Markdown Document",
    dateModified: "Today at 10:00 AM",
    parentId: "downloads",
    content: `# LeetCode Milestones & Algorithmic Mastery

**Global Ranking:** Top 0.02% Worldwide
**Problems Solved:** 800+ Problems
**Profile Link:** [leetcode.com/u/Suman_990](https://leetcode.com/u/Suman_990/)

---

### 🏆 Milestone Overview
Consistent problem solver with deep algorithmic discipline across Data Structures and Algorithms. Proven ability to evaluate edge cases, optimize asymptotic time/space complexities, and write clean, defensive code under competitive conditions.

> [!NOTE]
> Top 0.02% worldwide places Suman in the elite tier of competitive programmers on LeetCode among millions of active global developers.

---

### 📊 Problem Distribution & Domain Expertise

| Domain / Category | Problems Solved | Key Algorithms & Patterns |
|---|---|---|
| **Dynamic Programming** | 180+ | 1D/2D DP, Knapsack, Longest Common Subsequence, Bitmask DP, Digit DP |
| **Graph Theory** | 140+ | BFS/DFS, Dijkstra, Bellman-Ford, Topological Sort, Disjoint Set Union (DSU) |
| **Trees & BSTs** | 150+ | Lowest Common Ancestor, Morris Traversal, Trie, Segment Tree, Binary Indexed Tree |
| **Arrays & Two Pointers** | 160+ | Sliding Window, Prefix Sum, Kadane's, Dutch National Flag, Two Pointers |
| **Searching & Sorting** | 90+ | Binary Search on Answer, QuickSelect, Monotonic Stack & Monotonic Deque |
| **Backtracking & Recursion** | 80+ | N-Queens, Subsets & Permutations, Sudoku Solver, Branch & Bound |
`,
    tags: ["Featured"],
    description: "Comprehensive problem solving breakdown & data structures mastery",
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
    size: "5 items",
    kind: "Folder Alias",
    dateModified: "Oct 20, 2026",
    parentId: "desktop",
    targetFolderId: "projects",
    description: "Alias to Projects collection (Codify, OmniScout, ByteFeed, FinePrint, TechSprint)",
  },
  {
    id: "desktop-about-shortcut",
    name: "About_Me.md",
    type: "markdown",
    size: "5 KB",
    kind: "Markdown Document",
    dateModified: "Today at 09:15 AM",
    parentId: "desktop",
    tags: ["Featured"],
    content: `# Suman Mahanty
**Full Stack & Backend Software Engineer**
*Jamshedpur, Jharkhand, India • Open to High-Impact Roles*

**Email:** [sumanmahanty.99@gmail.com](mailto:sumanmahanty.99@gmail.com)
**Portfolio:** [portfolio-suman-44.vercel.app](https://portfolio-suman-44.vercel.app)
**GitHub:** [github.com/Suman-990](https://github.com/Suman-990)
**LinkedIn:** [linkedin.com/in/suman990](https://linkedin.com/in/suman990)
**LeetCode:** [leetcode.com/u/Suman_990](https://leetcode.com/u/Suman_990/)

---

### 🚀 Executive Summary
Passionate Full-Stack & Backend Software Engineer with a deep foundation in scalable distributed systems, low-latency microservices, high-concurrency event-driven architectures, and modern user experiences. Experienced in taking products from zero to production at scale. Competitive programmer holding a **Top 0.02% global ranking on LeetCode with 800+ solved problems**.

> [!NOTE]
> Based in Jamshedpur, Jharkhand, India. Actively architecting robust backend infrastructures and shipping scalable full-stack products from concept to production.

---

### 🎓 Education & Academics
**Institution:** Arka Jain University (AJU)
**Degree:** Bachelor of Computer Application (BCA)
**Tenure:** 2025 – 2028
**Cumulative GPA:** 9.1 / 10.0

---

### 🏆 Key Honors & Recognitions
- **Top 0.02% Global Rank on LeetCode:** Solved 800+ algorithmic problems across advanced data structures, graph algorithms, dynamic programming, and systems design.
- **1st Place Winner — TechSprint National Hackathon:** Championed 36-hour hackathon organized by Google Developer Groups (GDG on Campus AJU) by developing an intelligent cloud latency optimizer.
- **Production Performance Impact:** Engineered a client-side streaming PDF parser at Mentorque that slashed document processing latency from 6–7 seconds down to ~0.5 seconds (92% reduction).
`,
    description: "Desktop shortcut to personal background, education, and engineering philosophy",
  },
  {
    id: "desktop-contact-shortcut",
    name: "Contact_Card.vcf",
    type: "vcard",
    size: "2 KB",
    kind: "vCard Contact",
    dateModified: "Sep 28, 2026",
    parentId: "desktop",
    tags: ["Active"],
    content: `BEGIN:VCARD
VERSION:3.0
FN:Suman Mahanty
TITLE:Full Stack & Backend Software Engineer
TEL;TYPE=CELL:+919064961649
EMAIL;TYPE=INTERNET:sumanmahanty.99@gmail.com
ADR;TYPE=HOME:;;Jamshedpur;Jharkhand;;India
URL;TYPE=Portfolio:https://portfolio-suman-44.vercel.app
URL;TYPE=LinkedIn:https://www.linkedin.com/in/suman990
URL;TYPE=GitHub:https://github.com/Suman-990
URL;TYPE=LeetCode:https://leetcode.com/u/Suman_990/
NOTE:Software Engineer specializing in Spring Boot, Node.js, Go, React, and scalable distributed architectures.
END:VCARD`,
    description: "Desktop shortcut to developer contact card",
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
