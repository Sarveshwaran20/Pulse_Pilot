import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# Color Palette (Midnight Marble & PulsePilot HUD)
BG_DARK = RGBColor(9, 14, 23)        # #090E17
CARD_BG = RGBColor(14, 21, 32)       # #0E1520
CARD_BORDER = RGBColor(30, 43, 62)   # #1E2B3E
ACCENT_CYAN = RGBColor(56, 189, 248) # #38BDF8
ACCENT_EMERALD = RGBColor(16, 185, 129) # #10B981
ACCENT_AMBER = RGBColor(245, 158, 11)   # #F59E0B
ACCENT_ROSE = RGBColor(244, 63, 94)     # #F43F5E
ACCENT_PURPLE = RGBColor(168, 85, 247)  # #A855F7
TEXT_WHITE = RGBColor(255, 255, 255)
TEXT_MUTED = RGBColor(148, 163, 184)
TEXT_DARK = RGBColor(100, 116, 139)

def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER, shape_type=MSO_SHAPE.ROUNDED_RECTANGLE):
    shape = slide.shapes.add_shape(shape_type, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1)
    else:
        shape.line.fill.background()
    return shape

def add_text_box(slide, left, top, width, height, text, font_size=13, bold=False, color=TEXT_WHITE, font_name="Segoe UI", align=PP_ALIGN.LEFT):
    tx_box = slide.shapes.add_textbox(left, top, width, height)
    tf = tx_box.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.05)
    tf.margin_right = Inches(0.05)
    tf.margin_top = Inches(0.05)
    tf.margin_bottom = Inches(0.05)
    p = tf.paragraphs[0]
    p.text = text
    p.alignment = align
    if p.font:
        p.font.name = font_name
        p.font.size = Pt(font_size)
        p.font.bold = bold
        p.font.color.rgb = color
    return tx_box

def set_slide_title(slide, title_text):
    for shape in slide.shapes:
        if shape.is_placeholder and shape.placeholder_format.idx == 0:
            shape.text_frame.text = title_text
            for p in shape.text_frame.paragraphs:
                p.font.color.rgb = TEXT_WHITE
                p.font.bold = True
            return shape
    # Fallback if no placeholder
    return add_text_box(slide, Inches(0.6), Inches(0.4), Inches(12.1), Inches(0.9), title_text, font_size=24, bold=True)

def build_presentation():
    prs = Presentation('PulsePilot.pptx')
    content_layout = prs.slide_layouts[1]
    
    # -------------------------------------------------------------
    # 1. Update Slide 1 (Title / Presenter)
    # -------------------------------------------------------------
    slide1 = prs.slides[0]
    for s in slide1.shapes:
        if s.has_text_frame:
            for p in s.text_frame.paragraphs:
                if "Presented by" in p.text:
                    p.text = "Presented by Sarvesh K. & Jashwanth Ragav"
                    if p.font:
                        p.font.color.rgb = ACCENT_CYAN

    # -------------------------------------------------------------
    # 2. Update Slide 8 (Circadian AI Copilot)
    # -------------------------------------------------------------
    slide8 = prs.slides[7]
    for s in slide8.shapes:
        if s.has_text_frame:
            for p in s.text_frame.paragraphs:
                if "The On-Device Circadian AI Copilot" in p.text:
                    p.text = "Layer 02+ · On-Device Circadian AI Copilot (Dashboard-Contained)"
                if "CONVERSES" in p.text:
                    # Update next paragraph
                    pass

    # Add enclave badge to Slide 8
    badge8 = add_card(slide8, Inches(0.6), Inches(1.3), Inches(4.5), Inches(0.35), bg_color=RGBColor(16, 23, 33), border_color=ACCENT_CYAN)
    add_text_box(slide8, Inches(0.7), Inches(1.32), Inches(4.3), Inches(0.3), "• STRICTLY ENCLAVED TO COCKPIT // 0 BYTES EGRESS", font_size=9, bold=True, color=ACCENT_CYAN)

    # -------------------------------------------------------------
    # 3. Create NEW Slide: The Synaptic Interlock (Industry First)
    # -------------------------------------------------------------
    slide_interlock = prs.slides.add_slide(content_layout)
    set_slide_title(slide_interlock, "Industry First · The Synaptic Interlock (Bio-Paced Firewall)")

    # Left Column: 3 Concept Cards
    # Card 1: The Bio-Circuit Breaker
    c1 = add_card(slide_interlock, Inches(0.6), Inches(1.5), Inches(5.8), Inches(1.6), bg_color=CARD_BG, border_color=ACCENT_ROSE)
    b1 = add_card(slide_interlock, Inches(0.8), Inches(1.7), Inches(0.6), Inches(0.3), bg_color=RGBColor(38, 15, 23), border_color=ACCENT_ROSE)
    add_text_box(slide_interlock, Inches(0.8), Inches(1.7), Inches(0.6), Inches(0.3), "01", font_size=11, bold=True, color=ACCENT_ROSE, align=PP_ALIGN.CENTER)
    add_text_box(slide_interlock, Inches(1.55), Inches(1.65), Inches(4.6), Inches(0.3), "Prefrontal Error Gating", font_size=13, bold=True, color=TEXT_WHITE)
    add_text_box(slide_interlock, Inches(1.55), Inches(2.0), Inches(4.6), Inches(0.95), "When Autonomic Fatigue > 60%, prefrontal cognitive error detection collapses. The Interlock physically throttles destructive actions (git push --force, DROP DATABASE, terraform destroy).", font_size=10, color=TEXT_MUTED)

    # Card 2: Biological Proof-of-Recovery (PoR)
    c2 = add_card(slide_interlock, Inches(0.6), Inches(3.25), Inches(5.8), Inches(1.6), bg_color=CARD_BG, border_color=ACCENT_CYAN)
    b2 = add_card(slide_interlock, Inches(0.8), Inches(3.45), Inches(0.6), Inches(0.3), bg_color=RGBColor(12, 32, 48), border_color=ACCENT_CYAN)
    add_text_box(slide_interlock, Inches(0.8), Inches(3.45), Inches(0.6), Inches(0.3), "02", font_size=11, bold=True, color=ACCENT_CYAN, align=PP_ALIGN.CENTER)
    add_text_box(slide_interlock, Inches(1.55), Inches(3.4), Inches(4.6), Inches(0.3), "Biological Proof-of-Recovery (PoR)", font_size=13, bold=True, color=TEXT_WHITE)
    add_text_box(slide_interlock, Inches(1.55), Inches(3.75), Inches(4.6), Inches(0.95), "The developer cannot bypass the interlock with a flag. Execution requires verifiable physiological recovery through guided parasympathetic vagal stimulation.", font_size=10, color=TEXT_MUTED)

    # Card 3: 0.1 Hz Mayer Wave Coherence
    c3 = add_card(slide_interlock, Inches(0.6), Inches(5.0), Inches(5.8), Inches(1.6), bg_color=CARD_BG, border_color=ACCENT_EMERALD)
    b3 = add_card(slide_interlock, Inches(0.8), Inches(5.2), Inches(0.6), Inches(0.3), bg_color=RGBColor(12, 38, 28), border_color=ACCENT_EMERALD)
    add_text_box(slide_interlock, Inches(0.8), Inches(5.2), Inches(0.6), Inches(0.3), "03", font_size=11, bold=True, color=ACCENT_EMERALD, align=PP_ALIGN.CENTER)
    add_text_box(slide_interlock, Inches(1.55), Inches(5.15), Inches(4.6), Inches(0.3), "0.1 Hz Mayer Wave Vagal Pacer", font_size=13, bold=True, color=TEXT_WHITE)
    add_text_box(slide_interlock, Inches(1.55), Inches(5.5), Inches(4.6), Inches(0.95), "Synchronizing breathing with the bio-feedback pacer (4s Inhale, 4s Hold, 4s Exhale) restores parasympathetic HRV tone and disengages the execution lock with a cryptographic receipt.", font_size=10, color=TEXT_MUTED)

    # Right Column: Interactive Terminal Mockup
    mock = add_card(slide_interlock, Inches(6.8), Inches(1.5), Inches(5.9), Inches(5.1), bg_color=RGBColor(6, 10, 16), border_color=CARD_BORDER)
    # Window header
    wh = add_card(slide_interlock, Inches(6.8), Inches(1.5), Inches(5.9), Inches(0.45), bg_color=RGBColor(12, 18, 28), border_color=CARD_BORDER)
    add_text_box(slide_interlock, Inches(7.0), Inches(1.55), Inches(3.0), Inches(0.3), "bash — synaptic-interlock-v2.sh", font_size=10, bold=True, color=TEXT_MUTED)
    add_card(slide_interlock, Inches(12.0), Inches(1.62), Inches(0.18), Inches(0.18), bg_color=ACCENT_ROSE, border_color=None, shape_type=MSO_SHAPE.OVAL)
    add_card(slide_interlock, Inches(12.25), Inches(1.62), Inches(0.18), Inches(0.18), bg_color=ACCENT_AMBER, border_color=None, shape_type=MSO_SHAPE.OVAL)
    add_card(slide_interlock, Inches(12.5), Inches(1.62), Inches(0.18), Inches(0.18), bg_color=ACCENT_EMERALD, border_color=None, shape_type=MSO_SHAPE.OVAL)

    # Terminal prompt & locked command
    add_text_box(slide_interlock, Inches(7.1), Inches(2.1), Inches(5.3), Inches(0.3), "$ git push --force origin main", font_size=12, bold=True, color=ACCENT_CYAN, font_name="Consolas")
    
    # Interlock Status Pill
    lp = add_card(slide_interlock, Inches(7.1), Inches(2.55), Inches(5.3), Inches(0.65), bg_color=RGBColor(32, 12, 18), border_color=ACCENT_ROSE)
    add_text_box(slide_interlock, Inches(7.2), Inches(2.6), Inches(5.1), Inches(0.55), "⚠️ SYNAPTIC INTERLOCK ENGAGED\nAutonomic Fatigue: 84% | Prefrontal Error Risk: CRITICAL", font_size=9, bold=True, color=ACCENT_ROSE, font_name="Consolas")

    # Breathing circle visualizer
    bc_out = add_card(slide_interlock, Inches(8.5), Inches(3.4), Inches(2.5), Inches(2.5), bg_color=RGBColor(10, 24, 38), border_color=ACCENT_CYAN, shape_type=MSO_SHAPE.OVAL)
    bc_in = add_card(slide_interlock, Inches(8.95), Inches(3.85), Inches(1.6), Inches(1.6), bg_color=RGBColor(16, 38, 58), border_color=ACCENT_CYAN, shape_type=MSO_SHAPE.OVAL)
    add_text_box(slide_interlock, Inches(8.95), Inches(4.35), Inches(1.6), Inches(0.6), "INHALE\n0.1 Hz Pacer", font_size=10, bold=True, color=ACCENT_CYAN, align=PP_ALIGN.CENTER)

    # Success receipt footer inside terminal
    rf = add_card(slide_interlock, Inches(7.1), Inches(6.05), Inches(5.3), Inches(0.4), bg_color=RGBColor(10, 28, 20), border_color=ACCENT_EMERALD)
    add_text_box(slide_interlock, Inches(7.2), Inches(6.12), Inches(5.1), Inches(0.3), "✓ Proof-of-Recovery Verified · Cryptographic Release 0x9e17b", font_size=9, bold=True, color=ACCENT_EMERALD, font_name="Consolas")

    # -------------------------------------------------------------
    # 4. Create NEW Slide: Hardware Telemetry Lab & Smartwatch Bridge
    # -------------------------------------------------------------
    slide_hardware = prs.slides.add_slide(content_layout)
    set_slide_title(slide_hardware, "Hardware Lab · Optical PPG & Smartwatch Bridge")

    # Left Column: Dual-Wavelength Oscilloscope
    osc_card = add_card(slide_hardware, Inches(0.6), Inches(1.5), Inches(6.2), Inches(5.1), bg_color=RGBColor(6, 10, 16), border_color=CARD_BORDER)
    add_text_box(slide_hardware, Inches(0.9), Inches(1.7), Inches(5.6), Inches(0.3), "RAW PHOTOPLETHYSMOGRAM (PPG) OSCILLOSCOPE", font_size=11, bold=True, color=TEXT_WHITE)
    
    # Trace Box
    trace_box = add_card(slide_hardware, Inches(0.9), Inches(2.1), Inches(5.6), Inches(2.6), bg_color=RGBColor(10, 15, 24), border_color=CARD_BORDER)
    add_text_box(slide_hardware, Inches(1.1), Inches(2.2), Inches(5.2), Inches(0.3), "Trace 1: 525nm Green LED (Capillary Pulse Wave) — 100 Hz", font_size=9, bold=True, color=ACCENT_EMERALD, font_name="Consolas")
    add_text_box(slide_hardware, Inches(1.1), Inches(2.5), Inches(5.2), Inches(0.3), "Trace 2: 880nm Infrared LED (Arterial SpO2 Reflection)", font_size=9, bold=True, color=ACCENT_ROSE, font_name="Consolas")
    add_text_box(slide_hardware, Inches(1.1), Inches(3.0), Inches(5.2), Inches(1.5), 
                 "    _/\_           _/\_           _/\_\n"
                 "  /      \\_      /      \\_      /      \\_\n"
                 "_/__/\____\\___/__/\____\\___/__/\____\\___\n"
                 "      Dicrotic       Dicrotic       Dicrotic\n"
                 "      Notch          Notch          Notch", 
                 font_size=10, bold=True, color=ACCENT_EMERALD, font_name="Consolas")

    # Live Metrics Pills
    add_card(slide_hardware, Inches(0.9), Inches(4.9), Inches(1.75), Inches(0.85), bg_color=CARD_BG, border_color=CARD_BORDER)
    add_text_box(slide_hardware, Inches(1.0), Inches(4.95), Inches(1.55), Inches(0.3), "IBI (PEAK-TO-PEAK)", font_size=8, bold=True, color=TEXT_MUTED)
    add_text_box(slide_hardware, Inches(1.0), Inches(5.25), Inches(1.55), Inches(0.4), "812 ms", font_size=16, bold=True, color=ACCENT_CYAN)

    add_card(slide_hardware, Inches(2.8), Inches(4.9), Inches(1.75), Inches(0.85), bg_color=CARD_BG, border_color=CARD_BORDER)
    add_text_box(slide_hardware, Inches(2.9), Inches(4.95), Inches(1.55), Inches(0.3), "DERIVED RMSSD", font_size=8, bold=True, color=TEXT_MUTED)
    add_text_box(slide_hardware, Inches(2.9), Inches(5.25), Inches(1.55), Inches(0.4), "28 ms", font_size=16, bold=True, color=ACCENT_AMBER)

    add_card(slide_hardware, Inches(4.7), Inches(4.9), Inches(1.8), Inches(0.85), bg_color=CARD_BG, border_color=CARD_BORDER)
    add_text_box(slide_hardware, Inches(4.8), Inches(4.95), Inches(1.6), Inches(0.3), "HARDWARE SAMPLING", font_size=8, bold=True, color=TEXT_MUTED)
    add_text_box(slide_hardware, Inches(4.8), Inches(5.25), Inches(1.6), Inches(0.4), "100 Hz / I2C", font_size=16, bold=True, color=ACCENT_EMERALD)

    # Right Column: 3 Hardware Integration Stages
    # Stage 1: Mathematical Simulation (Current)
    h1 = add_card(slide_hardware, Inches(7.1), Inches(1.5), Inches(5.6), Inches(1.6), bg_color=CARD_BG, border_color=ACCENT_CYAN)
    b_h1 = add_card(slide_hardware, Inches(7.3), Inches(1.7), Inches(0.8), Inches(0.3), bg_color=RGBColor(12, 32, 48), border_color=ACCENT_CYAN)
    add_text_box(slide_hardware, Inches(7.3), Inches(1.7), Inches(0.8), Inches(0.3), "STAGE 1", font_size=9, bold=True, color=ACCENT_CYAN, align=PP_ALIGN.CENTER)
    add_text_box(slide_hardware, Inches(8.25), Inches(1.65), Inches(4.3), Inches(0.3), "Mathematical Simulation (Active)", font_size=13, bold=True, color=TEXT_WHITE)
    add_text_box(slide_hardware, Inches(7.3), Inches(2.05), Inches(5.2), Inches(0.95), "Generates realistic cardiac harmonics with synthetic systolic peaks, dicrotic notches, and adjustable noise/motion artifact sliders for seamless software testing.", font_size=10, color=TEXT_MUTED)

    # Stage 2: ESP32 / MAX30102 Serial Bridge
    h2 = add_card(slide_hardware, Inches(7.1), Inches(3.25), Inches(5.6), Inches(1.6), bg_color=CARD_BG, border_color=ACCENT_EMERALD)
    b_h2 = add_card(slide_hardware, Inches(7.3), Inches(3.45), Inches(0.8), Inches(0.3), bg_color=RGBColor(12, 38, 28), border_color=ACCENT_EMERALD)
    add_text_box(slide_hardware, Inches(7.3), Inches(3.45), Inches(0.8), Inches(0.3), "STAGE 2", font_size=9, bold=True, color=ACCENT_EMERALD, align=PP_ALIGN.CENTER)
    add_text_box(slide_hardware, Inches(8.25), Inches(3.4), Inches(4.3), Inches(0.3), "ESP32 Microcontroller Serial Hook", font_size=13, bold=True, color=TEXT_WHITE)
    add_text_box(slide_hardware, Inches(7.3), Inches(3.8), Inches(5.2), Inches(0.95), "Direct 4-pin optical sensor wiring (VCC 3.3V, GND, SDA GPIO21, SCL GPIO22) streaming raw I2C diode reflections over USB COM port at 115200 baud to local Vault.", font_size=10, color=TEXT_MUTED)

    # Stage 3: Smartwatch WearOS / BLE Bridge
    h3 = add_card(slide_hardware, Inches(7.1), Inches(5.0), Inches(5.6), Inches(1.6), bg_color=CARD_BG, border_color=ACCENT_PURPLE)
    b_h3 = add_card(slide_hardware, Inches(7.3), Inches(5.2), Inches(0.8), Inches(0.3), bg_color=RGBColor(28, 16, 42), border_color=ACCENT_PURPLE)
    add_text_box(slide_hardware, Inches(7.3), Inches(5.2), Inches(0.8), Inches(0.3), "STAGE 3", font_size=9, bold=True, color=ACCENT_PURPLE, align=PP_ALIGN.CENTER)
    add_text_box(slide_hardware, Inches(8.25), Inches(5.15), Inches(4.3), Inches(0.3), "WearOS & BLE Smartwatch Ingest", font_size=13, bold=True, color=TEXT_WHITE)
    add_text_box(slide_hardware, Inches(7.3), Inches(5.55), Inches(5.2), Inches(0.95), "Zero-cloud pairing with old fitness bands or smartwatches via Web Bluetooth GATT Heart Rate Service (0x180D). Telemetry lands strictly on localhost:8000.", font_size=10, color=TEXT_MUTED)

    # -------------------------------------------------------------
    # 5. Create NEW Slide: Data Sovereignty & Legal Architecture
    # -------------------------------------------------------------
    slide_legal = prs.slides.add_slide(content_layout)
    set_slide_title(slide_legal, "Data Sovereignty & Legal Architecture")

    # Left: Privacy Covenant
    priv_card = add_card(slide_legal, Inches(0.6), Inches(1.5), Inches(5.8), Inches(5.1), bg_color=CARD_BG, border_color=ACCENT_EMERALD)
    priv_badge = add_card(slide_legal, Inches(0.9), Inches(1.8), Inches(3.6), Inches(0.35), bg_color=RGBColor(12, 38, 28), border_color=ACCENT_EMERALD)
    add_text_box(slide_legal, Inches(1.0), Inches(1.83), Inches(3.4), Inches(0.3), "ZERO-KNOWLEDGE BIOMETRIC COVENANT (/privacy)", font_size=9, bold=True, color=ACCENT_EMERALD)
    add_text_box(slide_legal, Inches(0.9), Inches(2.3), Inches(5.2), Inches(0.4), "0 Bytes Egress Guaranteed by Design", font_size=16, bold=True, color=TEXT_WHITE)
    
    priv_points = [
        ("No Third-Party Telemetry", "Zero Google Analytics, advertising pixels, or cloud sync daemons. The codebase contains no tracking SDKs."),
        ("On-Device SQLite Storage", "User profiles, biometric logs, and audit receipts reside in local vault/pulse_pilot.db under user ownership."),
        ("Cryptographic Credentials", "Passwords are never written plaintext; protected by SHA-256 hashes and 16-byte random salts."),
        ("Shadow DOM Isolation", "Chrome extension operates entirely in browser runtime memory; does not log URLs or form data.")
    ]
    y_p = 2.85
    for title, desc in priv_points:
        add_text_box(slide_legal, Inches(0.9), Inches(y_p), Inches(5.2), Inches(0.25), f"• {title}", font_size=11, bold=True, color=ACCENT_CYAN)
        add_text_box(slide_legal, Inches(1.1), Inches(y_p + 0.25), Inches(5.0), Inches(0.55), desc, font_size=9, color=TEXT_MUTED)
        y_p += 0.85

    # Right: Terms & Governance
    terms_card = add_card(slide_legal, Inches(6.8), Inches(1.5), Inches(5.9), Inches(5.1), bg_color=CARD_BG, border_color=ACCENT_CYAN)
    terms_badge = add_card(slide_legal, Inches(7.1), Inches(1.8), Inches(3.2), Inches(0.35), bg_color=RGBColor(12, 32, 48), border_color=ACCENT_CYAN)
    add_text_box(slide_legal, Inches(7.2), Inches(1.83), Inches(3.0), Inches(0.3), "TERMS & ENCLAVE GOVERNANCE (/terms)", font_size=9, bold=True, color=ACCENT_CYAN)
    add_text_box(slide_legal, Inches(7.1), Inches(2.3), Inches(5.3), Inches(0.4), "Human Accountability in Agentic AI", font_size=16, bold=True, color=TEXT_WHITE)

    terms_points = [
        ("Non-Medical Informational Tool", "Calculations are heuristic cognitive readiness estimates, not clinical medical diagnoses."),
        ("Physical Approval Gate Liability", "Users retain sole authority and responsibility for all calendar reschedules and status email dispatches."),
        ("Mandatory Cockpit Auth Guard", "Unauthenticated visitors are automatically routed to /auth before entering the Circadian Cockpit."),
        ("Instant Demo Mode Sandbox", "One-click guest bypass (/demo) allows complete evaluation without storing personal information.")
    ]
    y_t = 2.85
    for title, desc in terms_points:
        add_text_box(slide_legal, Inches(7.1), Inches(y_t), Inches(5.3), Inches(0.25), f"• {title}", font_size=11, bold=True, color=ACCENT_EMERALD)
        add_text_box(slide_legal, Inches(7.3), Inches(y_t + 0.25), Inches(5.1), Inches(0.55), desc, font_size=9, color=TEXT_MUTED)
        y_t += 0.85

    # -------------------------------------------------------------
    # 6. Reorder slides to follow narrative arc:
    # -------------------------------------------------------------
    # Current slide order before reorder:
    # 1. Title (HERO)
    # 2. Crisis (CONTENT)
    # 3. Privacy Paradox (CONTENT)
    # 4. Decoupled Architecture (CONTENT)
    # 5. Layer 01 Vault (CONTENT)
    # 6. Layer 02 MCP (CONTENT)
    # 7. Layer 03 Attention Sentinel (CONTENT)
    # 8. Circadian AI Copilot (CONTENT)
    # 9. Midnight Marble UI (CONTENT)
    # 10. 60s Demo (CONTENT)
    # 11. Why PulsePilot Wins (CONTENT)
    # 12. Future / Conclusion (HERO)
    # 13. [NEW] The Synaptic Interlock
    # 14. [NEW] Hardware Lab Optical PPG
    # 15. [NEW] Data Sovereignty & Legal
    #
    # Ideal Logical Order:
    # 1. Title
    # 2. Crisis
    # 3. Privacy Paradox
    # 4. Decoupled Architecture
    # 5. Layer 01: Vault
    # 6. Layer 02: Gated MCP
    # 7. Layer 03: Attention Sentinel
    # 8. [NEW] Industry First: Synaptic Interlock (Move after Layer 3)
    # 9. [NEW] Hardware Lab: Optical PPG (Move after Interlock)
    # 10. Circadian AI Copilot (Dashboard-Contained)
    # 11. Midnight Marble UI & 24h Ultradian Rhythm
    # 12. The 60s Demo & Instant Demo Mode
    # 13. [NEW] Data Sovereignty & Legal Architecture
    # 14. Why PulsePilot Wins
    # 15. The Future of Human-Agent Alignment

    sldIdLst = prs.slides._sldIdLst
    
    # Newly added slides are currently at indices 12, 13, 14 (0-based)
    interlock_elem = sldIdLst[12]
    hardware_elem = sldIdLst[13]
    legal_elem = sldIdLst[14]

    # Move Interlock after Layer 03 (target index 7, right before AI Copilot)
    sldIdLst.insert(7, interlock_elem)
    # Move Hardware Lab right after Interlock (target index 8)
    sldIdLst.insert(8, hardware_elem)
    # Move Legal right before Why PulsePilot Wins (target index 12)
    sldIdLst.insert(12, legal_elem)

    # -------------------------------------------------------------
    # 7. Renumber slide footers sequentially
    # -------------------------------------------------------------
    for idx, slide in enumerate(prs.slides):
        if idx == 0:
            continue
        # Look for slide number placeholder or shape
        for shape in slide.shapes:
            if shape.is_placeholder and shape.placeholder_format.idx == 12: # slide number
                shape.text_frame.text = str(idx + 1)
            elif shape.name.startswith("Slide Number"):
                shape.text_frame.text = str(idx + 1)

    prs.save('PulsePilot.pptx')
    print(f"✓ Presentation updated successfully! Total slides: {len(prs.slides)}")

if __name__ == "__main__":
    build_presentation()
