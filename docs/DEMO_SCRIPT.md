# 60-Second Demo Script: PulsePilot "Circadian Cockpit"

This script details the second-by-second demo walkthrough. The flow runs automatically via the **Demo Director** overlay (Hotkey `D`), or can be walked through manually.

---

## Demo Timeline Overview

```
[00:00 - 00:15] TRIGGER: Degraded Biometric Ingestion & UI State Morph
[00:15 - 00:38] ADAPT: Browser Cognitive Load Mode & Impulse Purchase Shield
[00:38 - 01:00] ACT: "Protect My Morning" MCP Gated Tool Dispatch
```

---

## Detailed Step-by-Step Breakdown

### 1. [00:00 - 00:15] TRIGGER: The Biological Wake-up
- **Context**: User launches the **Command Center Dashboard** (`http://localhost:5173`).
- **Visuals**:
  - Initial **Boot Sequence**: Needles sweep from 0 to 100 in self-test calibration, status text scrambles in, and the central **Pulse Orb** ignites from a phosphor cyan point.
  - User presses `D` to open the **Demo Director** and clicks **"RUN 60-SECOND DEMO"** (or toggles `COGNITIVE_FATIGUE`).
  - **The State Morph**:
    - The Vault flags `COGNITIVE_FATIGUE` (derived from 4.5h sleep, sleep debt of 4.8h, 74 bpm elevated RHR, 6.8h screen time).
    - A radial amber wipe expands outward from the Pulse Orb.
    - CSS variables smoothly interpolate across all surfaces: cold deep-ocean `#07131B` shifts to warm charcoal `#181413` with dimmed amber phosphor accents (`#E08838`).
    - The dual arc needles sweep with spring overshoot and settle at 84% Fatigue and 28% Focus.
    - The Pulse Orb rhythm turns heavy and turbulent (Simplex noise perturbations increase).

### 2. [00:15 - 00:38] ADAPT: Beyond the Browser
- **Context**: The demo shifts to the bundled test e-commerce page (`http://127.0.0.1:8000/test/shop`).
- **Visuals**:
  - The page initially loads with noisy flashing top banner ads, a busy promotional sidebar, long walls of technical keyboard specs, and a prominent `$289.00 Buy Now` button.
  - **Cognitive Load Mode Activates**:
    - Choreographed fade & blur: The top banner ad and promo sidebar smoothly dim to 6% opacity with `blur(4px)`.
    - Text walls fold into high-contrast **"COGNITIVE TL;DR // KEY TAKEAWAYS"** cards with 3 scannable bullet points.
    - A radial spotlight vignette dims peripheral clutter and spotlights the primary action.
    - A `[RESTORE ORIGINAL VIEW]` pill appears in the top right.
  - **Smart Decision Filter (Late-Night Impulse Shield)**:
    - User clicks the `$289.00 Buy Now` button.
    - Instead of instant execution, a tactile **"HOLD TO CONFIRM (1.5S)"** dialog appears, with a filling progress ring and gentle physical button vibration.
    - Releasing early cancels cleanly; holding down for 1.5s unlocks conscious purchase.

### 3. [00:38 - 01:00] ACT: "Protect My Morning" MCP Action Flow
- **Context**: The user returns to the Dashboard (or clicks the floating HUD pill).
- **Visuals**:
  - User clicks **"Protect My Morning"** (or Demo Director triggers phase 3).
  - The MCP Action Server creates two gated approval cards with spring physics:
    - **Card 1: Reschedule Event (1-Click Confirmation)**:
      - Displays meeting diff: `Engineering Sprint Planning: 09:30 AM ➔ 14:00 PM (+4.5h)`.
      - User clicks **"CONFIRM & EXECUTE"**; execution ring fills, side effect applies to mock calendar, and the card morphs into a sealed digital receipt (`0x4F8B...`).
    - **Card 2: Draft Status Email (Editable Preview)**:
      - The drafted explanatory email body types itself out on screen in real time.
      - User can edit or confirm; upon click, draft is committed to mock Gmail and docks into the **Executed Dispatch Receipts** history rail.
- **Outcome**: The user's morning is shielded, cognitive load is lowered, and zero unapproved side effects touched the system.
