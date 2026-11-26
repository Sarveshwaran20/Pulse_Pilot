# wHACKiest 2026 • OFFICIAL PRE-FLIGHT CHECKLIST & ROOM PROTOCOL
**Event:** wHACKiest 2026 Online Ideathon (26th & 27th Nov 2026)  
**Slot Format:** 10-Minute Back-to-Back Slot (**Strict 5 Min Presentation + 2 Min Judges' Q&A**)

---

## 🚨 CRITICAL OFFICIAL RULES (FROM ORGANIZER GUIDELINES)

1. **Hard 5-Minute Presentation Cutoff**:
   - Organizers enforce a zero-tolerance hard cutoff. If you hit 5:00, you are stopped immediately.
   - Our script is calibrated to finish at **4:45**, giving you a 15-second safe margin.
2. **Mandatory Cameras ON**:
   - Every presenting member **must keep their webcam turned ON** throughout the presentation and Q&A.
3. **Valid College ID Card Ready**:
   - Have your physical college student ID card placed on your desk. Judges/coordinators will verify identities.
4. **Registered Devnovate Email ID Only**:
   - Join the meeting strictly using the exact email address registered on Devnovate.
   - Set your display name to your **Real Full Name** (e.g., `Sarveshwaran K`), never nicknames or device names. Unregistered accounts will be rejected at the waiting room.
5. **Single Point of Contact**:
   - Only the Team Leader (Sarveshwaran K) communicates with the assigned panel coordinator. No multi-member DMs.
6. **No Tech Delays**:
   - Any time spent fixing your mic, testing screen share, or loading browser tabs **counts against your 5-minute presentation time**.

---

## 🖥 10 MINUTES BEFORE YOUR SLOT: BROWSER & DAEMON SETUP

### Step 1: Start All Background Daemons
Ensure all 3 backend services are live in the background:

```bash
# In Terminal / Workspace:
# 1. Start Vault Daemon (Port 8000)
./.venv/bin/uvicorn vault.app.main:app --host 127.0.0.1 --port 8000

# 2. Start MCP Bridge Daemon (Port 8002)
./.venv/bin/python mcp-server/server.py

# 3. Start Cockpit Web Server (Port 3000)
cd web && npm run start
```

### Step 2: Pre-Open Exactly 3 Browser Tabs in Order
Keep one dedicated Chrome browser window open with these 3 tabs already loaded:

- **Tab 1: Presentation Slides**
  - Open `PulsePilot_wHACKiest2026.pptx` (in Google Slides, PowerPoint, or PDF preview). Have Slide 1 full-screened.
- **Tab 2: Cockpit HUD**
  - URL: `http://localhost:3000/cockpit`
  - Ensure the 3D Pulse Orb is breathing and gauges are live.
- **Tab 3: E-commerce Stimulant Test Shop**
  - URL: `http://localhost:3000/test-pages/cluttered-shop.html` (or open the local file `test-pages/cluttered-shop.html`)
  - Ensure the Chrome Sentinel extension is active with the Cognitive Load button visible.

### Step 3: Audio & Video Checks
- [ ] Webcam angle clean, face well-lit.
- [ ] Microphone tested and default input verified in meeting settings.
- [ ] College ID card placed right beside your keyboard.
- [ ] Phone on silent / Do Not Disturb enabled on your laptop.

---

## ⏱ DURING THE 5-MINUTE PRESENTATION: KEYBOARD SHORTCUTS

- Press **`D`** on the Cockpit HUD to toggle the **Demo Director** automated overlay.
- Use **`Ctrl + Tab`** (or `Cmd + Option + Right Arrow`) to switch seamlessly between your Slides, Cockpit HUD, and Web Store tabs.
- When clicking the `$149.00 Buy Now` button on the web store, **hold your mouse down firmly** to show the 1.5s radial ring filling up.

---

## 🎯 DURING THE 2-MINUTE Q&A: WINNING TACTICS

1. **Answer in 15 seconds:** Use the punchlines from `pitch/questions.md`.
2. **Don't over-explain:** Say the core engineering fact, then pause.
3. **Stay composed:** If a judge interrupts, let them speak immediately. 
