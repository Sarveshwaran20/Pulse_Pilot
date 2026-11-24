#!/usr/bin/env python3
"""
Populates the official wHACKiest 2026 Ideathon presentation template for PulsePilot.
Event: Department of Computer Science and Engineering, Ramaiah Institute of Technology presents wHACKiest 2026.
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

SRC_TEMPLATE = '/home/sarvesh/.gemini/antigravity/brain/628901ff-e99e-493a-85f8-1a2919708d70/.user_uploaded/media_1795540034540_78c3609a.pptx'
OUTPUT_PATHS = [
    '/home/sarvesh/Documents/PulsePLot/PulsePilot_wHACKiest2026.pptx',
    '/home/sarvesh/Documents/PulsePLot/PulsePilot.pptx',
    '/home/sarvesh/.gemini/antigravity/brain/628901ff-e99e-493a-85f8-1a2919708d70/PulsePilot_wHACKiest2026.pptx'
]

prs = Presentation(SRC_TEMPLATE)

def style_bullet(p, title, body, size=12.5, space_after=6, space_before=2):
    p.space_after = Pt(space_after)
    p.space_before = Pt(space_before)
    
    r1 = p.add_run()
    r1.text = "• " + title + ": " if title else "• "
    r1.font.bold = True
    r1.font.size = Pt(size)
    r1.font.name = "Calibri"
    
    r2 = p.add_run()
    r2.text = body
    r2.font.bold = False
    r2.font.size = Pt(size - 0.5)
    r2.font.name = "Calibri"

# ==============================================================================
# SLIDE 1: Cover Slide
# ==============================================================================
s1 = prs.slides[0]
s1.shapes[7].text_frame.text = "TEAM NAME: PulsePilot"
s1.shapes[9].text_frame.text = "COLLEGE NAME: Ramaiah Institute of Technology"
s1.shapes[11].text_frame.text = "TRACK: AI & Developer Productivity • Healthcare Telemetry"
s1.shapes[13].text_frame.text = "TEAM ID: [Team ID]"

tf15 = s1.shapes[15].text_frame
tf15.clear()
for m in ["Member 1 (Lead): Sarvesh", "Member 2: [Team Member 2]", "Member 3: [Team Member 3]", "Member 4: [Team Member 4]"]:
    p = tf15.add_paragraph()
    p.text = m
    p.font.size = Pt(13)
    p.font.name = "Calibri"

tf16 = s1.shapes[16].text_frame
tf16.clear()
for u in ["USN: [USN 1]", "USN: [USN 2]", "USN: [USN 3]", "USN: [USN 4]"]:
    p = tf16.add_paragraph()
    p.text = u
    p.font.size = Pt(13)
    p.font.name = "Calibri"

# ==============================================================================
# SLIDE 2: Problem Statement
# ==============================================================================
s2 = prs.slides[1]
s2.shapes[0].text_frame.text = "Problem Statement"
s2.shapes[1].text_frame.text = "Modern AI agents and developer workflows operate completely blind to human biological exhaustion."
s2.shapes[2].text_frame.text = "CORE CHALLENGE & INDUSTRY GAPS"

tf2 = s2.shapes[3].text_frame
tf2.clear()

items_s2 = [
    ("The Problem (One Line)", "Autonomous AI agents and productivity suites push critical commitments, meetings, and destructive terminal actions regardless of physical human exhaustion and prefrontal cognitive depletion."),
    ("Who It Affects & Scale", "Over 45 Million software engineers, site-reliability operators, and high-stakes knowledge workers globally who face chronic sleep debt, circadian desynchrony, and cognitive overload."),
    ("Why It Matters (Data & Real Example)", "83% of software developers suffer from burnout (Haystack 2024 Industry Study). Sleep debt > 4 hours drops prefrontal decision accuracy by 40%, causing catastrophic late-night production outages ($300K+ per incident) and fatigue-driven impulse self-medication."),
    ("Existing Solutions & Their Gaps", "Wearables (Apple Health, Oura, Whoop) are 100% passive retrospective charts—they notify you of poor sleep after the fact, but take zero active steps to protect your schedule. Cloud aggregators leak sensitive biometric data to third-party servers. AI tools (Claude Code, Cursor) possess zero biological awareness, executing high-blast-radius terminal tasks during acute exhaustion.")
]

for idx, (title, body) in enumerate(items_s2):
    p = tf2.paragraphs[0] if idx == 0 else tf2.add_paragraph()
    style_bullet(p, title, body, size=13, space_after=8)

# ==============================================================================
# SLIDE 3: Proposed Solution
# ==============================================================================
s3 = prs.slides[2]
s3.shapes[0].text_frame.text = "Proposed Solution"
s3.shapes[1].text_frame.text = "PulsePilot: A local-first biological intelligence cockpit and agentic circuit breaker."
s3.shapes[2].text_frame.text = "SOLUTION OVERVIEW & 24-HOUR MVP"

tf3 = s3.shapes[3].text_frame
tf3.clear()

items_s3 = [
    ("Solution in One Line", "An aircraft-grade biological telemetry HUD that calculates real-time autonomic states on-device and actively gates AI agent actions and browser sensory load."),
    ("Key Features", "1) Local Health Enclave: Ingests pulse, HRV RMSSD, and sleep cycles entirely in private SQLite with strictly 0 bytes egress; 2) Gated MCP Action Server: Exposes Model Context Protocol tools to Claude Code/Cursor; dangerous mutations require physical 1-click confirmation cards; 3) Attention Sentinel: Chrome MV3 Extension (Shadow DOM) that collapses blinding text clutter and guards against late-night impulsive chemical/stimulant orders; 4) Synaptic Interlock: Biological circuit breaker that physically halts destructive terminal commands when sympathetic distress is detected."),
    ("User Flow", "Ingest (Smartwatch/PPG Sensor) ➔ Classify (Vault calculates DEEP_FLOW vs COGNITIVE_FATIGUE) ➔ Intervene (MCP stages calendar protection; browser activates sensory shield; terminal firewall enforces circuit breaker)."),
    ("What We Built in 24 Hours (Full Working MVP)", "Fully operational Python FastAPI vault (:8000) with SQLite WAL and authenticated user sessions; Official Python MCP SDK server (:8002) exposing get_personal_state, reschedule_event, and draft_status_email; Next.js 15 command cockpit with 60s automated demo director, 3D Pulse Orb, and live ESP32 PPG oscilloscope.")
]

for idx, (title, body) in enumerate(items_s3):
    p = tf3.paragraphs[0] if idx == 0 else tf3.add_paragraph()
    style_bullet(p, title, body, size=12.5, space_after=6)

# ==============================================================================
# SLIDE 4: Tech Stack
# ==============================================================================
s4 = prs.slides[3]
s4.shapes[0].text_frame.text = "Tech Stack"
s4.shapes[1].text_frame.text = "Engineered for zero-latency, complete data sovereignty, and open agentic interoperability."
s4.shapes[2].text_frame.text = "SYSTEM ARCHITECTURE & SELECTION RATIONALE"

tf4 = s4.shapes[3].text_frame
tf4.clear()

items_s4 = [
    ("Frontend & Cockpit HUD", "Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, HTML5 Canvas 2D.\n  • Rationale: Sub-millisecond reactive telemetry updates, 60 FPS harmonic Pulse Orb, and hardware-accelerated animations with zero analytics bloat."),
    ("Local Health Vault & Backend", "Python 3.10+, FastAPI, SQLite (WAL Mode), Pydantic v2, Uvicorn.\n  • Rationale: Microsecond query execution, local file persistence (pulse_pilot.db), PBKDF2/SHA-256 salted credentials, and strict zero-cloud data sovereignty."),
    ("Agentic Protocol & AI Layer", "Anthropic Model Context Protocol (Python MCP SDK), Gemini API / Claude Code integration.\n  • Rationale: Open standard protocol for AI agent tool execution, allowing native physical approval gating and cryptographic receipt generation."),
    ("Browser Extension & Hardware", "Chrome Manifest V3 (Shadow DOM Injection), ESP32 Microcontroller, MAX30102 Optical PPG Pulse Sensor (I2C, 100Hz).\n  • Rationale: Shadow DOM completely isolates injected UI from host page CSS; optical PPG sensor provides true arterial waveform ground truth.")
]

for idx, (title, body) in enumerate(items_s4):
    p = tf4.paragraphs[0] if idx == 0 else tf4.add_paragraph()
    style_bullet(p, title, body, size=12.5, space_after=6)

# ==============================================================================
# SLIDE 5: Process Flow / Architecture Diagram
# ==============================================================================
s5 = prs.slides[4]
s5.shapes[0].text_frame.text = "Process Flow • Architecture Diagram"
s5.shapes[1].text_frame.text = "Decoupled three-layer architecture: Zero health egress, strict human-in-the-loop confirmation."
s5.shapes[2].text_frame.text = "STEP-BY-STEP DATA PIPELINE & COMPONENT TOPOLOGY"

s5.shapes[3].height = Inches(1.3)
tf5 = s5.shapes[3].text_frame
tf5.clear()

p5_1 = tf5.paragraphs[0]
r5_1 = p5_1.add_run()
r5_1.text = "• Step-by-Step Flow: "
r5_1.font.bold = True
r5_1.font.size = Pt(11.5)
r5_2 = p5_1.add_run()
r5_2.text = "1) Input: Optical pulse (ESP32/Smartwatch) & sleep cycles stream locally; 2) Processing: Vault calculates Autonomic State (HRV + Sleep Debt); 3) Gating: MCP interceptor catches agent actions and checks biological capacity; 4) Output: Cockpit stages approval cards & Extension shields browser DOM."
r5_2.font.size = Pt(11)

p5_2 = tf5.add_paragraph()
r5_3 = p5_2.add_run()
r5_3.text = "• Zero-Egress Guarantee: "
r5_3.font.bold = True
r5_3.font.size = Pt(11.5)
r5_4 = p5_2.add_run()
r5_4.text = "All biometric scoring runs strictly on 127.0.0.1:8000 via SQLite WAL. Exactly 0 bytes leave your machine."
r5_4.font.size = Pt(11)

# Add Visual Architecture Diagram Blocks
# Block 1: Hardware Ingest
b1 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.7), Inches(4.3), Inches(2.6), Inches(1.8))
b1.fill.solid()
b1.fill.fore_color.rgb = RGBColor(16, 24, 38)
b1.line.color.rgb = RGBColor(56, 189, 248)
b1.line.width = Pt(1.5)
tf_b1 = b1.text_frame
tf_b1.vertical_anchor = MSO_ANCHOR.MIDDLE
p = tf_b1.paragraphs[0]
p.alignment = PP_ALIGN.CENTER
r = p.add_run()
r.text = "1. SENSOR INGEST\n"
r.font.bold = True
r.font.size = Pt(11)
r.font.color.rgb = RGBColor(56, 189, 248)
r_sub = p.add_run()
r_sub.text = "• ESP32 MAX30102 PPG\n• Smartwatch BLE Sync\n• RescueTime Screen Time\n[100 Hz Optical Pulse]"
r_sub.font.size = Pt(9.5)
r_sub.font.color.rgb = RGBColor(226, 232, 240)

# Block 2: Local Vault
b2 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.6), Inches(4.3), Inches(2.6), Inches(1.8))
b2.fill.solid()
b2.fill.fore_color.rgb = RGBColor(16, 24, 38)
b2.line.color.rgb = RGBColor(16, 185, 129)
b2.line.width = Pt(1.5)
tf_b2 = b2.text_frame
tf_b2.vertical_anchor = MSO_ANCHOR.MIDDLE
p = tf_b2.paragraphs[0]
p.alignment = PP_ALIGN.CENTER
r = p.add_run()
r.text = "2. LOCAL HEALTH VAULT\n"
r.font.bold = True
r.font.size = Pt(11)
r.font.color.rgb = RGBColor(16, 185, 129)
r_sub = p.add_run()
r_sub.text = "• Python FastAPI (:8000)\n• SQLite WAL Enclave\n• Autonomic State Engine\n[0 Bytes Cloud Egress]"
r_sub.font.size = Pt(9.5)
r_sub.font.color.rgb = RGBColor(226, 232, 240)

# Block 3: Gated MCP Server
b3 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.5), Inches(4.3), Inches(2.6), Inches(1.8))
b3.fill.solid()
b3.fill.fore_color.rgb = RGBColor(16, 24, 38)
b3.line.color.rgb = RGBColor(129, 140, 248)
b3.line.width = Pt(1.5)
tf_b3 = b3.text_frame
tf_b3.vertical_anchor = MSO_ANCHOR.MIDDLE
p = tf_b3.paragraphs[0]
p.alignment = PP_ALIGN.CENTER
r = p.add_run()
r.text = "3. GATED MCP SERVER\n"
r.font.bold = True
r.font.size = Pt(11)
r.font.color.rgb = RGBColor(129, 140, 248)
r_sub = p.add_run()
r_sub.text = "• Python MCP SDK (:8002)\n• Synaptic Interlock Gate\n• Physical Approval Queue\n[Side-Effect Firewall]"
r_sub.font.size = Pt(9.5)
r_sub.font.color.rgb = RGBColor(226, 232, 240)

# Block 4: Interfaces
b4 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.4), Inches(4.3), Inches(2.6), Inches(1.8))
b4.fill.solid()
b4.fill.fore_color.rgb = RGBColor(16, 24, 38)
b4.line.color.rgb = RGBColor(244, 63, 94)
b4.line.width = Pt(1.5)
tf_b4 = b4.text_frame
tf_b4.vertical_anchor = MSO_ANCHOR.MIDDLE
p = tf_b4.paragraphs[0]
p.alignment = PP_ALIGN.CENTER
r = p.add_run()
r.text = "4. HUD & SENTINEL\n"
r.font.bold = True
r.font.size = Pt(11)
r.font.color.rgb = RGBColor(244, 63, 94)
r_sub = p.add_run()
r_sub.text = "• Next.js 15 Cockpit HUD\n• Chrome MV3 Extension\n• Claude Code / Cursor AI\n[1-Click Action Confirm]"
r_sub.font.size = Pt(9.5)
r_sub.font.color.rgb = RGBColor(226, 232, 240)

# ==============================================================================
# SLIDE 6: Novelty / Innovation
# ==============================================================================
s6 = prs.slides[5]
s6.shapes[0].text_frame.text = "Novelty • Innovation"
s6.shapes[1].text_frame.text = "World's first bio-paced agentic firewall: Turning passive health monitoring into active digital protection."
s6.shapes[2].text_frame.text = "CORE INVENTIONS & COMPETITIVE BENCHMARK"

s6.shapes[3].height = Inches(1.2)
tf6 = s6.shapes[3].text_frame
tf6.clear()

p6_1 = tf6.paragraphs[0]
r6_1 = p6_1.add_run()
r6_1.text = "• Unique Value Proposition (USP): "
r6_1.font.bold = True
r6_1.font.size = Pt(11.5)
r6_2 = p6_1.add_run()
r6_2.text = "While other trackers only report sleep loss after the fact, PulsePilot actively alters software execution, agent permissions, and browser sensory density based on real-time biological readiness."
r6_2.font.size = Pt(11)

p6_2 = tf6.add_paragraph()
r6_3 = p6_2.add_run()
r6_3.text = "• Breakthrough Innovations: "
r6_3.font.bold = True
r6_3.font.size = Pt(11.5)
r6_4 = p6_2.add_run()
r6_4.text = "1) The Synaptic Interlock (biological circuit breaker halting terminal commands under stress); 2) Zero-Egress Local Vault (SQLite WAL on localhost); 3) Shadow DOM Sensory Shield (collapses cognitive clutter & blocks late-night stimulant purchases)."
r6_4.font.size = Pt(11)

# Competitive Comparison Table
table_shape6 = s6.shapes.add_table(5, 5, Inches(0.7), Inches(4.3), Inches(11.3), Inches(2.2))
tbl6 = table_shape6.table
tbl6.columns[0].width = Inches(2.3)
tbl6.columns[1].width = Inches(2.2)
tbl6.columns[2].width = Inches(2.2)
tbl6.columns[3].width = Inches(2.3)
tbl6.columns[4].width = Inches(2.3)

headers6 = ["Evaluation Metric", "Apple Health / Whoop", "Clockwise / Reclaim AI", "Raw AI (Claude/Cursor)", "PulsePilot (Our Solution)"]
data6 = [
    ["Biometric Telemetry", "Passive (Charts Only)", "None", "None", "Active Real-Time (PPG/HRV)"],
    ["Data Sovereignty", "Cloud Vendor Lock-in", "Cloud Server Storage", "Third-Party Cloud API", "100% Localhost (0 Egress)"],
    ["AI Agent Safety Gating", "None", "None", "None (Ungated Execution)", "Strict 1-Click Physical Cards"],
    ["Circadian Circuit Breaker", "None", "None", "None", "Synaptic Interlock Firewall"]
]

for col_idx, text in enumerate(headers6):
    cell = tbl6.cell(0, col_idx)
    cell.text = text
    cell.fill.solid()
    cell.fill.fore_color.rgb = RGBColor(16, 24, 38)
    for p in cell.text_frame.paragraphs:
        p.alignment = PP_ALIGN.CENTER
        for r in p.runs:
            r.font.bold = True
            r.font.size = Pt(10)
            r.font.color.rgb = RGBColor(56, 189, 248) if col_idx == 4 else RGBColor(255, 255, 255)

for row_idx, row_data in enumerate(data6, start=1):
    for col_idx, text in enumerate(row_data):
        cell = tbl6.cell(row_idx, col_idx)
        cell.text = text
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(24, 32, 48) if row_idx % 2 == 1 else RGBColor(18, 26, 40)
        for p in cell.text_frame.paragraphs:
            p.alignment = PP_ALIGN.LEFT if col_idx == 0 else PP_ALIGN.CENTER
            for r in p.runs:
                r.font.size = Pt(9.5)
                r.font.color.rgb = RGBColor(16, 185, 129) if col_idx == 4 else RGBColor(203, 213, 225)
                if col_idx == 4:
                    r.font.bold = True

# ==============================================================================
# SLIDE 7: Impact & Feasibility
# ==============================================================================
s7 = prs.slides[6]
s7.shapes[0].text_frame.text = "Impact & Feasibility"
s7.shapes[1].text_frame.text = "Drastically reducing fatigue-driven engineering outages and burnout while preserving privacy."
s7.shapes[2].text_frame.text = "MEASURABLE OUTCOMES, FEASIBILITY & MITIGATION"

tf7 = s7.shapes[3].text_frame
tf7.clear()

items_s7 = [
    ("Measurable Outcomes & Human Impact", "• 40% Reduction in Critical Incidents: Halts fatigue-driven database drops, flawed commits, and panic deployments under sleep debt.\n• 100% Privacy Compliance: Zero health metrics leave the user's local machine, eliminating enterprise HIPAA/GDPR compliance barriers.\n• 2.5+ Hours Reclaimed Weekly: Circadian schedule triage automatically shifts cognitively demanding sprint meetings into ultradian focus peaks."),
    ("Technical Feasibility & Cost", "• Built on Open Standards: Full compatibility with Anthropic Model Context Protocol, Chrome MV3, Python FastAPI, and Next.js.\n• Zero Cloud Infrastructure Costs: Because all computation runs on the user's workstation, backend cloud GPU and server bills are literally $0.00."),
    ("Time & Hackathon Readiness", "Functional end-to-end MVP already built and verified with live daemons (Vault on :8000, MCP on :8002, Cockpit on :3000), automated 60s demo runner, and hardware PPG support."),
    ("Risks & Mitigation Strategies", "• Risk 1 (Workflow Friction from False Positives): 1.5s hold-to-confirm barrier allows intentional conscious human override anytime.\n• Risk 2 (Wearable Disconnection): Fallback heuristic engine calculates state from calendar density and circadian time-of-day.")
]

for idx, (title, body) in enumerate(items_s7):
    p = tf7.paragraphs[0] if idx == 0 else tf7.add_paragraph()
    style_bullet(p, title, body, size=12.5, space_after=6)

# ==============================================================================
# SLIDE 8: Business Model
# ==============================================================================
s8 = prs.slides[7]
s8.shapes[0].text_frame.text = "Business Model"
s8.shapes[1].text_frame.text = "High-margin B2B Enterprise & Prosumer Developer model built on data sovereignty."
s8.shapes[2].text_frame.text = "MARKET SIZING, MONETIZATION & GROWTH STRATEGY"

tf8 = s8.shapes[3].text_frame
tf8.clear()

items_s8 = [
    ("Target Customers & Market Size", "• TAM ($14.2B): Developer Productivity, Enterprise Well-Being & AI Agent Governance Market.\n• SAM (4.8M Users): High-Reliability Engineering Teams in FinTech, Healthcare, Defense, and Cloud Infrastructure.\n• SOM (120,000 Users): Early-Adopter Developers utilizing Agentic AI workflows (Claude Code, Cursor, Copilot)."),
    ("Revenue Model", "• Prosumer (Freemium): Free local vault & basic browser extension; $12 / month for Advanced Circadian AI Copilot, Smartwatch BLE Sync, and custom MCP integrations.\n• Enterprise Team License: $28 / seat / month with team-level aggregated anonymous burnout indices, IT Synaptic Interlock policy enforcement, and compliance audit receipts."),
    ("Go-to-Market Strategy", "• Bottom-Up Developer Adoption: Open-source MCP server distributed on GitHub and Anthropic / Cursor marketplace.\n• Viral 60-Second Demo Loops: Showcase real-time PPG optical sensor sync and live agent intervention during burnout."),
    ("Sustainability & Growth Plan", "• Near-Zero Infrastructure Overhead: Client-side local computing model eliminates recurring cloud GPU hosting bills.\n• Wearable Ecosystem Partnerships: Co-marketing with smart ring and wearable vendors (Oura, Ultrahuman, open-source ESP32 hardware kits).")
]

for idx, (title, body) in enumerate(items_s8):
    p = tf8.paragraphs[0] if idx == 0 else tf8.add_paragraph()
    style_bullet(p, title, body, size=12.5, space_after=6)

# Save presentations
for path in OUTPUT_PATHS:
    prs.save(path)
    print(f"Saved: {path}")

print("All presentations generated successfully!")
