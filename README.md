# PulsePilot: Circadian Cockpit

> **Local-First Personal Biological Intelligence & MCP Action HUD**
> Built for the Antigravity Multi-Track Challenge: Track 1 (MCP), Track 2 (Browser Agent), Track 3 (Local Vault).
> **Author**: [SARVESHWARAN K (@Sarveshwaran20)](https://github.com/Sarveshwaran20)

```
 ┌─────────────────────────────────────────────────────────────┐
 │  PULSEPILOT • CIRCADIAN COCKPIT [LOCAL-FIRST ENCLAVE]     │
 │  RHR: 74 BPM  •  FATIGUE: 84%  •  STATE: COGNITIVE_FATIGUE │
 └─────────────────────────────────────────────────────────────┘
```

---

## Overview

PulsePilot is an aircraft-grade biological instrument HUD for your body and mind. It operates across three decoupled layers:

1. **Local Vault (Track 3: Know Thyself)**: High-performance Python FastAPI engine with SQLite. Ingests local sleep, resting heart rate, screen time, and calendar exports. Computes a live Personal State (`DEEP_FOCUS` | `NEUTRAL` | `COGNITIVE_FATIGUE` | `HIGH_STRESS`). Zero health data ever leaves localhost.
2. **MCP Action Server (Track 1: Make MCP Matter)**: Official Python MCP SDK server with side-effect approval gating. Safe read-only state tools run auto-approved; all mutations (calendar rescheduling, email drafting, habit logging) require explicit 1-click confirmation or editable preview cards. Includes sandboxed mock fallbacks for Google Calendar, Gmail, and Spotify with zero OAuth dependencies.
3. **Browser Agent (Track 2: Beyond the Browser)**: Manifest V3 Chrome Extension injected via isolated Shadow DOM. Automatically engages **Cognitive Load Mode** (strips noisy ads, collapses text walls into scannable TL;DR cards, spotlights primary CTAs) and **Smart Decision Filter** (intercepts late-night impulse purchases with a 1.5s hold-to-confirm progress ring and physical shake).
4. **Command Center Dashboard**: The hero visual of the demo. An asymmetric bento cockpit featuring the biological **Pulse Orb**, dual precision arc tachometers, 60fps lead-II ECG canvas telemetry, an interactive MCP approval queue, and the **Demo Director** (Hotkey `D`) running a flawless 60-second scripted presentation.

---

## Design System: "Circadian Cockpit"

- **State-Driven Dynamic Theming**: All surface, border, and phosphor colors interpolate dynamically via CSS variables:
  - `DEEP_FOCUS`: Cold deep-ocean ink (`#07131B`) with cyan-mint phosphor (`#2EE6A8`).
  - `NEUTRAL`: Graphite matte (`#121518`) with soft sage (`#8BAA9E`).
  - `COGNITIVE_FATIGUE`: Smoked charcoal (`#181413`) with dimmed amber/ember (`#E08838`), lower contrast, and reduced visual density.
  - `HIGH_STRESS`: Oxblood dark ink (`#1D0B0F`) with coral-red warning (`#FF4B55`).
- **Typography**: Variable **Fraunces** for state titles and HUD headers; **IBM Plex Mono** for all telemetry tickers, odometer counters, and gauges. Strictly zero generic Inter/Roboto.
- **Signature Organism**: The **Pulse Orb**—a canvas organism driven by 3-octave harmonic noise displacement. Breathing rate syncs to resting heart rate, turbulence syncs to stress score, and color flows with biological state.

---

## Quickstart (Single Command)

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Setup & Run
Clone the repository and run:

```bash
# One-time setup
make setup

# Launch everything (Vault on :8000, MCP Server on :8002, Dashboard on :5173)
make dev
```

Or with npm:
```bash
npm run dev
```

### 3. Open the Services
- **Command Center Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Local Vault API & Swagger**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Bundled Cluttered Test Shop**: [http://127.0.0.1:8000/test/shop](http://127.0.0.1:8000/test/shop)
- **MCP Bridge API**: [http://127.0.0.1:8002/health](http://127.0.0.1:8002/health)

---

## Running the 60-Second Demo

1. Open [http://localhost:5173](http://localhost:5173).
2. Press **`D`** on your keyboard to open the **Demo Director** overlay.
3. Click **"RUN 60-SECOND DEMO"**:
   - **0:00 - 0:15 (TRIGGER)**: Vault calculates `COGNITIVE_FATIGUE`. Radial wipe transitions cockpit to warm charcoal/ember; gauges sweep with spring overshoot; orb breathes with turbulence.
   - **0:15 - 0:38 (ADAPT)**: Open [http://127.0.0.1:8000/test/shop](http://127.0.0.1:8000/test/shop). Cognitive Load Mode collapses noisy ads and text walls into scannable summaries; clicking "Buy Now ($289)" triggers the 1.5s Hold-to-Confirm decision safeguard.
   - **0:38 - 0:60 (ACT)**: Dashboard stages the "Protect My Morning" MCP workflow. The meeting reschedule confirmation card and self-typing email draft preview appear. Click to confirm, and watch receipts seal into the audit rail.

---

## Running Automated Tests

```bash
make test
# or
PYTHONPATH=. ./.venv/bin/pytest vault/tests/ mcp-server/tests/ -v
```

All 14 unit tests cover:
- Biometric state scoring mathematics and boundary invariants [0-100].
- State classifications (`DEEP_FOCUS`, `COGNITIVE_FATIGUE`, `HIGH_STRESS`, `NEUTRAL`).
- Vault REST endpoints and simulation overrides.
- MCP side-effect gating (proves **zero** mutation occurs on calendar or drafts without explicit approval token).

---

## Security & Local Privacy Guarantees

- **Localhost Boundary**: Vault binds strictly to `127.0.0.1:8000`. CORS is restricted to localhost frontends and `chrome-extension://*`.
- **Zero Raw Data Egress**: Only high-level state flags and scores are exposed; raw longitudinal health logs stay in local SQLite.
- **Shadow DOM Isolation**: All extension UI elements are injected into an isolated Shadow Root so host page styles never collide.
