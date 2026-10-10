*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

# TouchGrass AI 🌿

> **An offline-first, privacy-respecting AI companion powered by open-weight Gemma 4 and Ollama that turns screen fatigue into restorative real-world grounding rituals.**

---

## What I Built
<!-- What does it do, and how does it get people off the screen and into the world? Who is it for? -->

Modern life traps us in endless notification loops, doomscrolling, and digital fatigue. Ironically, most digital wellness apps keep you glued to your phone with gamified streaks, push notifications, and social feeds.

**TouchGrass AI** is built on the opposite philosophy: **AI designed to make you put your device away.**

### 🌿 What it does:
1. **Personalized Offline Ritual Generation**: Tell TouchGrass AI your available time (e.g. *15 minutes*, *30 minutes*, *1 hour*), your immediate environment (*backyard, urban balcony, city park, quiet room*), your current emotional state (*overwhelmed, restless, brain-fogged*), and your preferred activity (*tactile grounding, sky watching, walking barefoot, sensory counting*).
2. **Actionable 3-Step Phone-Free Rituals**: Powered by the local open-weight **Gemma 4** model, it synthesizes a structured offline routine tailored to your setting with exact time allocations and sensory grounding cues (e.g., *"Touch tree bark and feel its texture"*, *"Identify 3 distinct non-mechanical sounds"*).
3. **The Screen-Free Pledge**: Before starting, users make an intentional commitment to pocket their phone or leave it behind on 'Do Not Disturb'.
4. **Zen Ambient Timer**: A distraction-free circular countdown with gentle audio transitions. It includes a built-in **procedural breeze sound synthesizer** powered by the browser's Web Audio API—meaning zero audio downloads or internet bandwidth required.
5. **Mindful Reflection & Anchoring**: Once completed, gentle confetti and grounding reflection prompts help anchor the offline sensory experience before you re-engage with daily tasks.

### 👥 Who is it for?
- **Developers & Tech Workers** experiencing screen burn-out after hours of coding and debugging.
- **Students & Remote Workers** who need guilt-free, restorative micro-breaks without getting trapped in social media rabbit holes.
- **Mindfulness & Digital Detox Seekers** who want personalized, structured grounding rituals without paying subscription fees or surrendering personal data to cloud corporations.

---

## Demo
<!-- Share a deployed link or a video demo. -->

- **Live / Video Demo**: *(https://canva.link/em1rccacq5cmavj)*
- **Local Preview**: Runs locally at `http://localhost:5173` connecting to Ollama at `http://localhost:11434`.

*(Tip: Add a GIF or screenshot of your interface here)*

```
+-----------------------------------------------------------------------+
|  🌿 TouchGrass AI                   [ Gemma 4 - 100% Localhost Ready ]|
|                                                                       |
|  [ Free Time: 20 mins ] [ Location: Balcony ] [ Mood: Stressed ]      |
|  [ Activity: Tactile Grounding ]                                      |
|                                                                       |
|  ================== GENERATE PHONE-FREE PLAN =======================  |
|                                                                       |
|  Step 1: Pocket The Phone (3 min)   -> Feel the temperature shift     |
|  Step 2: Balcony Observation (12 min)-> Spot 3 shades of green        |
|  Step 3: Deep Stillness (5 min)     -> 5 slow diaphragmatic breaths   |
|                                                                       |
|  [ Start Screen-Free Session ] -> [ Ambient Breeze & Zen Timer ]      |
+-----------------------------------------------------------------------+
```

---

## Code
<!-- Show us the code! You can embed a GitHub repo directly into your post. -->

- **GitHub Repository**: [https://github.com/somnathdas9733/touchgrass_ai](https://github.com/somnathdas9733/touchgrass_ai)
- **License**: MIT License (Open Source)

### Project Architecture
```
dev2/
├── backend/
│   ├── main.py              # FastAPI server & Ollama Gemma 4 integration
│   └── requirements.txt     # Python dependencies (fastapi, uvicorn, httpx)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputForm.tsx            # Interactive ritual builder
│   │   │   ├── PlanView.tsx             # Structured 3-step offline ritual card
│   │   │   ├── TimerScreen.tsx          # Zen circular timer & ambient breeze
│   │   │   ├── CompletionScreen.tsx     # Celebration & reflection prompt
│   │   │   └── OllamaStatusBadge.tsx    # Live Ollama & Gemma 4 health badge
│   │   ├── utils/
│   │   │   └── audio.ts                 # Web Audio API wind synthesizer & chime
│   │   ├── App.tsx                      # State machine & view transitions
│   │   ├── index.css                    # Earthy, nature-inspired design system
│   │   └── types.ts                     # TypeScript schemas
│   ├── package.json
│   └── vite.config.ts
└── start.bat                # One-click launcher for backend + frontend
```

---

## How I Built It
<!-- Which open-source AI did you use (open-weight models, agent harnesses, frameworks, local inference), and how is your project built around it? -->

### 1. Open-Weight AI Foundation
TouchGrass AI is built around **Google's Gemma 4** open-weight model executed locally via **Ollama** (`gemma4:latest`). 
- **Zero Cloud Calls**: Inference runs completely on the user's local machine via Ollama's REST API endpoint (`http://localhost:11434/api/generate`).
- **Structured JSON Synthesis**: We guide Gemma 4 with strict temperature (`0.3`) and system formatting constraints to return a validated schema containing chronological steps, time allocations matching the user's exact free minutes, and physical sensory cues.
- **Graceful Fallback**: If Ollama is booting or the model is still downloading, an offline heuristic plan generator ensures the user is never left without an immediate ritual.

### 2. Modern Full-Stack Architecture
- **Backend**: **FastAPI** with asynchronous **HTTPX** client communicates directly with Ollama. It validates durations, parses JSON markdown fences, and exposes health telemetry (`/api/health`) to notify the user if Gemma is loaded in memory.
- **Frontend**: **React 19** + **TypeScript** + **Vite**. Styled with an organic, high-end nature aesthetic featuring Google Fonts (*Fraunces* serif & *Plus Jakarta Sans*), tactile glassmorphic cards, and earth tones (`#2D5A27`, `#8FBC8F`, `#F4F1EA`).
- **Web Audio API Ambient Engine**: Rather than loading heavy external MP3s, TouchGrass AI uses an in-browser white-noise audio node filtered with low-pass resonance to procedurally synthesize a calming, offline ambient breeze.

---

## Why Does Open Innovation Matter?
<!-- Why does open innovation matter for what you built? What did it make possible that a closed API wouldn't? -->

### 1. The Disconnection & Privacy Paradox
An application designed to help people escape digital monitoring should **never** harvest their habits, moods, and GPS coordinates. Closed APIs log user prompts, associate queries with user accounts, and track personal mental health metrics on third-party cloud servers. 
Open innovation enables **complete data sovereignty**: your mood, your location, and your free time never leave your CPU/GPU.

### 2. True Offline Autonomy
The best places to touch grass—national parks, hiking trails, remote beaches, and quiet countryside cabins—rarely have reliable 5G connections. Because Gemma 4 runs locally through Ollama, TouchGrass AI works without an active internet connection. You can close your Wi-Fi, go offline, and generate grounding rituals in the middle of a forest.

### 3. Freedom from Rate Limits and Paywalls
Wellness should not be locked behind $20/month subscription fees or OpenAI credit expirations. Open weights democratize AI, giving every individual equal access to intelligent, personalized guidance forever.

---

## My Agent Session
<!-- Optional, but judges love it. Save your session with DevRelay and embed it with the agent_session tag (see the challenge page), or link to it. -->

<!-- If you recorded or saved your session with DevRelay, embed it here:
{% agent_session SESSION_ID %}
-->
*Built with the assistance of Antigravity AI pair programming session.*

---

## Prize Categories
<!-- Which partner categories are you entering? List every one that applies, or remove this section. -->

- **Main Challenge**: Hacktoberfest Open-Source AI Challenge: Week 1 — *Touch Grass*
- **Local Inference / Open-Weight AI Track**: Powered by Google Gemma 4 via Ollama.
*(If you used partner credits such as Render for web hosting, ElevenLabs, or Backboard, list them here!)*

---

## 🚀 Quickstart & Local Setup

### Prerequisites
1. **Ollama** installed: [ollama.com](https://ollama.com)
2. Pull the Gemma 4 model:
   ```bash
   ollama pull gemma4:latest
   ```
3. Python 3.10+ and Node.js 18+

### 1. Launch Ollama
Make sure Ollama is active:
```bash
ollama run gemma4:latest
```

### 2. Start the Backend
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1
```

Open your browser at **[http://127.0.0.1:5173](http://127.0.0.1:5173)**, unplug from the digital noise, and go touch grass! 🌿
