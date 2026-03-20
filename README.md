<div align="center">

<img src="https://img.shields.io/badge/-%F0%9F%9B%A1%EF%B8%8F%20ELITE%20SURAKSHA-C8102E?style=for-the-badge&labelColor=7F0E1E&color=C8102E" alt="Elite Suraksha" height="40"/>

# EliteSuraksha

### *AI-Powered Real-Time Income Protection for Food Delivery Workers*

<p align="center">
  <img src="https://img.shields.io/badge/Phase-1%20Prototype-C8102E?style=flat-square&logo=rocket&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Team-Elite%20%7C%20KL%20University-C8102E?style=flat-square" />
</p>

<br/>

> **"If a real-world disruption happens → system detects it → payout is triggered automatically."**
> 
> No manual claims. No delays. No human approval. Just instant, intelligent income protection.

<br/>

---

### 📎 Important Links

| Full Technical Documentation | Demo Video |
|:---:|:---:|
| [![Documentation](https://img.shields.io/badge/Google%20Drive-Full%20Docs-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](YOUR_GOOGLE_DRIVE_LINK_HERE) | [![Demo Video](https://img.shields.io/badge/YouTube-Watch%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](YOUR_DEMO_VIDEO_LINK_HERE) |

---

</div>

<br/>

## Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [How It Works](#-how-it-works)
- [Phase 1 — What's Built](#-phase-1--whats-built-now)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Ideas Pipeline](#-ideas-pipeline-between-phases)
- [Team](#-team)

<br/>

---

## The Problem

India has **7 million+** food delivery workers on Swiggy & Zomato. They work outdoors, earn daily wages, and have **zero income protection** when disruptions hit.

<div align="center">

| Disruption Type | Events Per Year | Daily Income Lost |
|---|---|---|
| Heavy Rain (>50mm/hr) | 40–60 days | ₹700–₹1,200 |
| Hazardous AQI (>300) | 20–35 days | ₹600–₹900 |
| Curfews / Bandhs | 5–15 days | ₹800–₹1,200 |
| Extreme Heat (>42°C) | 10–20 days | ₹500–₹800 |
| Platform Outages | 4–8 events | ₹500–₹800 |
| Floods / Waterlogging | 5–15 days | ₹1,000–₹1,500 |

</div>

> **~₹900 Crore** in worker income is lost annually due to these disruptions.
> **91%** of delivery workers have **no insurance** of any kind.

Traditional insurance? Too slow. Too manual. Incompatible with daily-wage realities. **We built something different.**

<br/>

---

## Our Solution

**EliteSuraksha** is a **Parametric Insurance Platform** — meaning payouts are triggered automatically when pre-defined real-world conditions are met. No claims. No paperwork. No waiting.

```
Traditional Insurance:   Event → File Claim → Investigation → Assessment → Payout  [7–30 days]
                                                                                    
EliteSuraksha:           Event → AI Detects → Validates → Payout  [< 2 minutes]
```

### Core Innovation

```
  Rain API detects > 50mm/hr
         ↓
  AI Engine validates conditions + worker location
         ↓
  Fraud Engine runs 4-layer check
         ↓
  UPI payout hits worker's account
         ↓
  Worker gets push notification: "₹600 credited"
```

<br/>

---

##  How It Works

### Parametric Trigger System

Payouts are not based on "what did you lose?" — they're based on **did the trigger condition happen?**

| Trigger | Condition | Payout (Standard) |
|---|---|---|
|  Heavy Rain | Rainfall > 50mm/hr | ₹300–₹600 |
|  Hazardous AQI | AQI Index > 300 | ₹200–₹500 |
|  Extreme Heat | Temperature > 42°C | ₹200–₹400 |
|  Curfew/Bandh | Official order detected | ₹300–₹600 |
|  Platform Outage | Swiggy/Zomato down > 2hrs | ₹200–₹400 |
|  Flood Warning | NDMA official alert | ₹500–₹900 |

### AI Risk Engine

```
Risk Score = Weather(0.40) + AQI(0.25) + Traffic(0.20) + Social(0.10) + Platform(0.05)

Weekly Premium = Base ₹20 × (1 + Risk Score) × Loyalty Discount × Coverage Tier
```

Real-time data from: **OpenWeatherMap · CPCB AQI · Google Maps · NDMA · NewsAPI**

<br/>

---

##  Phase 1 — What's Built Now

>  **This is a Phase 1 Prototype.** It demonstrates the complete user journey and core concepts. Backend infrastructure, production APIs, and real payment processing will be added in Phase 2 and 3. See [Roadmap](#-roadmap) for full details.

### Screens Built 

| Screen | What It Does |
|---|---|
|  **Splash Screen** | Brand intro, stats, feature highlights |
|  **Login Screen** | Phone + 6-digit OTP authentication flow |
|  **Verification Screen** | Aadhaar eKYC + employment screenshot upload with AI OCR simulation |
|  **Dashboard** | Live risk meter, coverage card, real weather data, recent payouts |
|  **Monitoring Screen** | Live metric bars for all 5 risk signals, alert feed, platform status |
|  **Simulate Screen** | Select event type + severity → watch the full AI pipeline → payout confirmation |
|  **Payout History** | Complete history with filter by type, expandable claim details |

### Demo Credentials

```
Phone:    Any 10-digit number (e.g., 9876543210)
OTP:      1 2 3 4 5 6
Aadhaar:  1234 5678 9012
```

### What's Real vs Simulated in Phase 1

| Feature | Phase 1 Status |
|---|---|
| UI/UX — All 7 screens |  **Real, fully functional** |
| Weather data (OpenWeatherMap) |  **Real API** (mock fallback if no key) |
| Risk score calculation |  **Real algorithm** |
| OTP flow |  Simulated (real Twilio in Phase 2) |
| Aadhaar eKYC |  Simulated (UIDAI sandbox in Phase 2) |
| UPI Payout |  Simulated (Razorpay integration in Phase 2) |
| Fraud Detection |  Simulated (full ML model in Phase 3) |

<br/>

---

##  Screenshots

<div align="center">

| Splash | Login | Dashboard |
|:---:|:---:|:---:|
| *Welcome screen with brand stats* | *Phone + OTP verification* | *Live risk + coverage card* |

| Monitor | Simulate | Payout |
|:---:|:---:|:---:|
| *Real-time 5-signal monitoring* | *Event trigger pipeline* | *Instant payout confirmation* |

> *Screenshots coming soon — run locally or watch the [Demo Video](YOUR_DEMO_VIDEO_LINK_HERE)*

</div>

<br/>

---

##  Tech Stack

### Frontend (Phase 1)

```
React 18          →  Component framework
Vite 5            →  Build tool & dev server
CSS Variables     →  Design tokens (red/white theme)
Playfair Display  →  Display typography
Plus Jakarta Sans →  Body typography
Context API       →  Global state management
```

### Services & APIs

```
OpenWeatherMap API  →  Live rainfall, temperature, wind, humidity
Fallback System     →  Realistic mock data when API unavailable
Custom Risk Engine  →  Weighted risk score calculation (pure JS)
```

### Planned Stack (Phase 2+)

```
FastAPI (Python)    →  Backend REST API
PostgreSQL          →  Primary database
Redis               →  Caching & session store
Apache Kafka        →  Event streaming
Razorpay            →  UPI payouts & AutoPay
Twilio              →  OTP SMS delivery
UIDAI eKYC API      →  Aadhaar verification
CPCB AQI API        →  Air quality data
NDMA API            →  Flood & disaster alerts
```

<br/>

---

##  Getting Started

### Prerequisites

- **Node.js 18+** — [Download here](https://nodejs.org/en/download)
- **VS Code** — [Download here](https://code.visualstudio.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/elite-suraksha.git

# 2. Enter the project directory
cd elite-suraksha

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev

# App opens at http://localhost:3000
```

> **Windows Users:** If you get an `EPERM` error, run this first:
> ```
> npm config set prefix "%APPDATA%\npm"
> ```
> Then try `npm install` again.

### Optional — Live Weather Data

The app works without an API key using realistic mock data. To enable live weather:

```bash
# 1. Copy the env template
cp .env.example .env

# 2. Get a FREE key at https://openweathermap.org/api
# 3. Add your key to .env:
VITE_WEATHER_API_KEY=your_key_here

# 4. Restart the server
npm run dev
```

The dashboard will show **🟢 Live API** instead of **🟡 Simulated** when the real key is active.

<br/>

---

##  Project Structure

```
elite-suraksha/
│
├── index.html                        # App entry point
├── vite.config.js                    # Vite configuration
├── package.json                      # Dependencies & scripts
├── .env.example                      # Environment variable template
│
└── src/
    ├── main.jsx                      # React DOM root
    ├── App.jsx                       # Screen router
    │
    ├── styles/
    │   └── globals.css               # Design tokens, animations, components
    │
    ├── components/
    │   ├── Shell.jsx                 # Page wrapper (red accent bar + background)
    │   └── BottomNav.jsx             # Bottom navigation bar
    │
    ├── services/
    │   ├── AppContext.jsx            # Global state (user profile, payouts)
    │   └── weatherService.js        # OpenWeatherMap API + mock fallback + risk calculator
    │
    ├── hooks/
    │   └── useWeather.js            # Auto-refreshing weather data hook
    │
    └── screens/
        ├── SplashScreen.jsx          # Welcome / brand screen
        ├── LoginScreen.jsx           # Phone input + OTP verification
        ├── VerificationScreen.jsx    # Aadhaar KYC + employment upload
        ├── DashboardScreen.jsx       # Main home — risk, coverage, conditions
        ├── MonitoringScreen.jsx      # Live 5-signal environmental monitor
        ├── SimulateScreen.jsx        # Event trigger simulation + payout demo
        └── HistoryScreen.jsx         # Payout history with filters
```

<br/>

---

##  Roadmap

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PHASE 1 — Foundation & Prototype         ← YOU ARE HERE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅  Complete UI/UX — all 7 screens
  ✅  Real-time weather API integration
  ✅  AI risk score calculation engine
  ✅  Parametric trigger simulation
  ✅  Payout demonstration flow
  ✅  Global state management (payouts persist across screens)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PHASE 2 — Core Product Backend            [Upcoming]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⬜  FastAPI backend (Python)
  ⬜  PostgreSQL + PostGIS database
  ⬜  Twilio OTP (real SMS delivery)
  ⬜  Aadhaar eKYC via UIDAI sandbox
  ⬜  Razorpay UPI payout integration
  ⬜  Real-time monitoring microservice (Kafka)
  ⬜  Parametric trigger engine (live API conditions)
  ⬜  Claim automation pipeline
  ⬜  CPCB AQI API integration
  ⬜  NDMA flood alert integration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PHASE 3 — Production Hardening           [Upcoming]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⬜  ML fraud detection (GPS validation, behavioral AI)
  ⬜  Admin dashboard (risk heatmaps, analytics)
  ⬜  Kubernetes deployment (GCP/AWS)
  ⬜  Security audit + VAPT
  ⬜  IRDAI regulatory sandbox filing
  ⬜  DPDP Act 2023 compliance review
  ⬜  Beta launch — 100 workers in Hyderabad
  ⬜  Performance testing at 10k concurrent users

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PHASE 4 — Scale & Expansion              [Future]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⬜  Expand to 5 cities (Bangalore, Mumbai, Chennai, Pune, Delhi)
  ⬜  B2B partnerships with Swiggy / Zomato corporate
  ⬜  Telugu, Tamil, Kannada, Marathi language support
  ⬜  Auto-rickshaw & hyperlocal delivery worker coverage
  ⬜  Annual coverage option
  ⬜  API licensing to partner insurance companies
```

<br/>

---

##  Ideas Pipeline (Between Phases)

> These are features and innovations that emerged **during the build process** — ideas that came up between Phase 1 and Phase 2/3 that we plan to evaluate and implement as they mature.

### 🔬 Under Exploration

| Idea | Status | Target Phase |
|---|---|---|
| **WhatsApp Bot Integration** — Workers receive payout alerts & claim status via WhatsApp (no app needed) | Exploring | Phase 2 |
| **USSD / SMS Interface** — Feature phone support for workers without smartphones | Exploring | Phase 2 |
| **Micro-zone H3 Mapping** — 500m×500m hexagonal risk cells instead of city-level averages | In design | Phase 2 |
| **Compound Event Payouts** — If 2+ triggers fire simultaneously (e.g., rain + curfew), combined payout formula | In design | Phase 2 |
| **Community Ambassador Program** — Trusted delivery partners onboard others, earn referral reward | Exploring | Phase 2 |
| **Predictive Pre-coverage** — LSTM model predicts triggers 3–6 hrs in advance; coverage auto-escalates | Research | Phase 3 |
| **Voice-based IVR Claims Checking** — Worker calls a number to hear claim status in their language | Exploring | Phase 3 |
| **Worker Savings Wallet** — Unused premium reserve after low-risk months credited back as savings | Concept | Phase 3 |
| **Telematics-based Premium** — Reward workers who ride safely (fewer hard brakes, safe speeds) with lower premiums | Concept | Phase 3 |
| **Group Coverage for Delivery Hubs** — Fleet-level policies for cloud kitchen delivery fleets | Concept | Phase 4 |
| **Anonymized Risk Data API** — Sell aggregated city disruption trends to urban planners & insurers | Concept | Phase 4 |

> Have an idea? Open an [Issue](../../issues) or reach out to the team directly. We review every suggestion.

<br/>

---

##  Team

<div align="center">

| Name | Role | Responsibilities |
|---|---|---|
| **SK. Gouse Kareem** | 🎯 Team Lead & Product Architect | System design, AI/ML models, product strategy, API architecture |
| **P. Satish Chandra** | ⚙️ Backend Engineer | FastAPI services, database design, payment integration |
| **S. Arun** | 🎨 Frontend Developer | React/Vite UI, mobile-first design, animations, UX |
| **P.V. Sai Sandilya** | 🤖 AI/ML Engineer | Risk models, fraud detection, OCR pipeline, data science |
| **B. Yaswanth** | 🔒 DevOps & Security | Docker/Kubernetes, CI/CD, cloud infra, security |

<br/>

**Institution:** Koneru Lakshmaiah Education Foundation (KL University)  
Vaddeswaram, Guntur, Andhra Pradesh · Deemed University — Est. 1980

</div>

<br/>

---

##  Business Impact

<div align="center">

| Metric | Value |
|---|---|
|  Target Market | 7M+ food delivery workers across India |
|  Avg. Weekly Premium | ₹20–₹55 |
|  Claim Processing Time | < 2 minutes |
|  Projected Loss Ratio | < 70% |
|  Phase 1 Launch Cities | Hyderabad, Bangalore, Mumbai |
|  LTV:CAC Ratio | 7:1 |

</div>

<br/>

---

##  Documentation & Resources

| Resource | Link |
|---|---|
|  **Full Technical Documentation** (20 chapters — system design, API specs, business model, roadmap) | [View on Google Drive](YOUR_GOOGLE_DRIVE_LINK_HERE) |
|  **Demo Video** (Full walkthrough of all 7 screens) | [Watch Demo](YOUR_DEMO_VIDEO_LINK_HERE) |
|  **OpenWeatherMap API** (Free tier for live weather) | [openweathermap.org/api](https://openweathermap.org/api) |
|  **IRDAI Regulatory Sandbox** | [irdai.gov.in](https://irdai.gov.in) |

<br/>

---

##  License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br/>

---

<div align="center">

**Built by Team Elite · KL University**

*EliteSuraksha v1.0 — Phase 1 Prototype — 2024–2025*

<img src="https://img.shields.io/badge/Made%20in-India%20🇮🇳-C8102E?style=flat-square" />
<img src="https://img.shields.io/badge/For-Gig%20Workers-C8102E?style=flat-square" />
<img src="https://img.shields.io/badge/Powered%20by-AI-C8102E?style=flat-square" />

---

*⭐ Star this repo if you believe gig workers deserve better protection*

</div>
