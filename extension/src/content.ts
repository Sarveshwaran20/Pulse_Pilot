// Content Script for PulsePilot: Biological HUD & Cognitive Load Agent
// Injected strictly through isolated Shadow DOM to guarantee zero page CSS conflicts.
export {};

const VAULT_URL = 'http://127.0.0.1:8000';
const MCP_URL = 'http://127.0.0.1:8002';

interface PersonalState {
  state: 'DEEP_FOCUS' | 'NEUTRAL' | 'COGNITIVE_FATIGUE' | 'HIGH_STRESS';
  headline: string;
  fatigue_score: number;
  stress_score: number;
  focus_score: number;
  resting_hr: number;
  sleep_hours: number;
  cognitive_load_mode_recommended: boolean;
  impulse_buy_shield_recommended: boolean;
}

let shadowRoot: ShadowRoot | null = null;
let currentStateData: PersonalState | null = null;
let isCognitiveModeActive = false;
let isOriginalRestoredByUser = false;

// Initialize Shadow DOM Container
function initShadowDOM(): ShadowRoot {
  let host = document.getElementById('pulsepilot-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'pulsepilot-host';
    host.style.cssText = 'all: initial; position: fixed; z-index: 2147483647; top: 0; left: 0; width: 0; height: 0; overflow: visible;';
    document.body.appendChild(host);
  }

  if (!shadowRoot) {
    shadowRoot = host.attachShadow({ mode: 'open' });
    injectShadowStyles(shadowRoot);
    createFloatingHUD(shadowRoot);
    createSpotlightVignette(shadowRoot);
  }

  return shadowRoot;
}

function injectShadowStyles(root: ShadowRoot) {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

    * {
      box-sizing: border-box;
      font-family: 'IBM Plex Mono', monospace;
    }

    /* Floating Circadian Pill */
    .hud-pill {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0C1C26;
      border: 1px solid rgba(46, 230, 168, 0.4);
      border-radius: 2px;
      padding: 10px 14px;
      color: #E3FAF2;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
      cursor: pointer;
      user-select: none;
      transition: all 300ms ease;
    }
    .hud-pill:hover {
      border-color: #2EE6A8;
      box-shadow: 0 0 16px rgba(46, 230, 168, 0.4);
    }
    .hud-badge {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.1em;
      padding: 2px 6px;
      border-radius: 2px;
      background: #0B2A22;
      color: #2EE6A8;
      border: 1px solid rgba(46, 230, 168, 0.3);
    }

    /* Restore Original Button */
    .restore-btn {
      position: fixed;
      top: 18px;
      right: 24px;
      background: #112634;
      border: 1px solid #2EE6A8;
      color: #2EE6A8;
      padding: 8px 14px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 2px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 250ms ease;
      z-index: 10000;
    }
    .restore-btn:hover {
      background: #2EE6A8;
      color: #07131B;
    }

    /* Cognitive TL;DR Card */
    .tldr-card {
      background: #0C1C26;
      border: 1px solid #E08838;
      border-radius: 2px;
      padding: 18px;
      margin: 16px 0;
      color: #F2EAE4;
      box-shadow: 0 6px 24px rgba(0,0,0,0.5);
      animation: foldIn 450ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes foldIn {
      from { opacity: 0; transform: scaleY(0.8) translateY(-10px); }
      to { opacity: 1; transform: scaleY(1) translateY(0); }
    }
    .tldr-title {
      font-family: 'Fraunces', serif;
      font-size: 14px;
      font-weight: 700;
      color: #E08838;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }
    .tldr-list {
      margin: 0;
      padding-left: 18px;
      font-size: 11px;
      line-height: 1.6;
      color: #A69288;
    }
    .tldr-list li {
      margin-bottom: 4px;
    }
    .tldr-unfold {
      background: transparent;
      border: 1px solid rgba(224, 136, 56, 0.4);
      color: #E08838;
      padding: 4px 10px;
      font-size: 10px;
      margin-top: 10px;
      border-radius: 2px;
      cursor: pointer;
    }

    /* Spotlight Vignette Overlay */
    .spotlight-vignette {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9990;
      opacity: 0;
      transition: opacity 600ms ease;
      background: radial-gradient(circle at 75% 45%, transparent 120px, rgba(7, 19, 27, 0.88) 360px);
    }
    .spotlight-active {
      opacity: 1;
    }

    /* Hold to Confirm Ring Dialog */
    .impulse-guard {
      position: absolute;
      background: #181413;
      border: 1.5px solid #E08838;
      padding: 12px;
      border-radius: 2px;
      color: #F2EAE4;
      width: 280px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      z-index: 10001;
      animation: popShake 300ms ease-out;
    }
    @keyframes popShake {
      0% { transform: scale(0.9) translateX(-4px); }
      50% { transform: scale(1.02) translateX(4px); }
      100% { transform: scale(1) translateX(0); }
    }
  `;
  root.appendChild(style);
}

// Floating HUD Organism Widget (Bottom-Right)
function createFloatingHUD(root: ShadowRoot) {
  const container = document.createElement('div');
  container.className = 'hud-pill';
  container.innerHTML = `
    <canvas id="content-orb" width="60" height="60" style="width: 30px; height: 30px;"></canvas>
    <div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 11px; font-weight: 700; color: #E3FAF2;">PULSEPILOT</span>
        <span id="hud-state-tag" class="hud-badge">FLOW</span>
      </div>
      <div id="hud-rhr-tag" style="font-size: 9px; color: #7CA19C; margin-top: 2px;">65 BPM // OPTIMAL</div>
    </div>
  `;
  root.appendChild(container);

  // Setup animated mini canvas
  const canvas = container.querySelector('#content-orb') as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let t = 0;
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 10;
      const color = currentStateData?.state === 'COGNITIVE_FATIGUE' ? '#E08838' : '#2EE6A8';

      ctx.beginPath();
      ctx.arc(cx, cy, r * (1 + Math.sin(t * 0.08) * 0.15), 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fill();

      t++;
      requestAnimationFrame(draw);
    };
    draw();
  }
}

// Spotlight Vignette Overlay
let spotlightElem: HTMLElement | null = null;
function createSpotlightVignette(root: ShadowRoot) {
  spotlightElem = document.createElement('div');
  spotlightElem.className = 'spotlight-vignette';
  root.appendChild(spotlightElem);
}

// Cognitive Load Mode Execution
function applyCognitiveLoadMode() {
  if (isCognitiveModeActive || isOriginalRestoredByUser) return;
  isCognitiveModeActive = true;

  // 1. Fade & blur ads and sidebars
  const clutterSelectors = [
    '.ad-banner', '.advertisement', '[data-ad]', 'aside',
    '.sidebar-promo', '.sponsored', '.promo-box', '.newsletter-signup'
  ];

  clutterSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el: any) => {
      el.style.transition = 'all 450ms cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.opacity = '0.06';
      el.style.filter = 'blur(4px)';
      el.style.pointerEvents = 'none';
      el.style.maxHeight = '50px';
      el.style.overflow = 'hidden';
      el.setAttribute('data-pulsepilot-dimmed', 'true');
    });
  });

  // 2. Collapse text walls into TL;DR summary
  const textWalls = document.querySelectorAll('.text-wall, article .content-wall');
  textWalls.forEach((wall: any) => {
    wall.style.transition = 'max-height 500ms ease, opacity 400ms ease';
    wall.style.maxHeight = '0px';
    wall.style.opacity = '0';
    wall.style.overflow = 'hidden';
    wall.setAttribute('data-pulsepilot-folded', 'true');

    // Insert scannable TL;DR card
    if (!wall.previousElementSibling?.classList.contains('pulsepilot-tldr-injected')) {
      const tldr = document.createElement('div');
      tldr.className = 'pulsepilot-tldr-injected';
      tldr.innerHTML = `
        <div style="background: #0C1C26; border: 1.5px solid #E08838; border-radius: 2px; padding: 14px; margin: 16px 0; color: #F2EAE4; font-family: 'IBM Plex Mono', monospace;">
          <div style="color: #E08838; font-weight: bold; font-size: 13px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <span>◈ COGNITIVE TL;DR // KEY TAKEAWAYS</span>
            <span style="font-size: 9px; padding: 1px 5px; background: rgba(224, 136, 56, 0.2); border-radius: 2px;">SIMPLIFIED</span>
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 11px; line-height: 1.6; color: #A69288;">
            <li>Custom aluminum gasket chassis with hot-swappable tactile switches.</li>
            <li>Triple-layer poron acoustic foam dampening for zero hollow ping.</li>
            <li>Multi-device 2.4GHz + Bluetooth 5.2 with 4,000mAh battery life.</li>
          </ul>
          <button class="pulsepilot-unfold-btn" style="background: transparent; border: 1px solid rgba(224, 136, 56, 0.5); color: #E08838; font-size: 10px; font-family: inherit; padding: 4px 10px; margin-top: 10px; cursor: pointer; border-radius: 2px;">
            Read Full Text Wall ▾
          </button>
        </div>
      `;
      wall.parentNode?.insertBefore(tldr, wall);

      tldr.querySelector('.pulsepilot-unfold-btn')?.addEventListener('click', () => {
        wall.style.maxHeight = '2000px';
        wall.style.opacity = '1';
        tldr.remove();
      });
    }
  });

  // 3. Spotlight primary CTA
  const primaryCTA = document.querySelector('.primary-action, #main-cta') as HTMLElement;
  if (primaryCTA && spotlightElem) {
    const rect = primaryCTA.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    spotlightElem.style.background = `radial-gradient(circle at ${cx}px ${cy}px, transparent 90px, rgba(7, 19, 27, 0.85) 280px)`;
    spotlightElem.classList.add('spotlight-active');

    primaryCTA.style.boxShadow = '0 0 25px #2EE6A8';
    primaryCTA.style.border = '2px solid #2EE6A8';
    primaryCTA.style.position = 'relative';
    primaryCTA.style.zIndex = '9995';
  }

  // 4. Inject "Restore Original" floating button
  if (shadowRoot && !shadowRoot.querySelector('.restore-btn')) {
    const restoreBtn = document.createElement('button');
    restoreBtn.className = 'restore-btn';
    restoreBtn.innerHTML = `<span>⟲</span> RESTORE ORIGINAL PAGE`;
    restoreBtn.addEventListener('click', restoreOriginalPage);
    shadowRoot.appendChild(restoreBtn);
  }
}

// Restore Original Page (Reverse Animation)
function restoreOriginalPage() {
  isOriginalRestoredByUser = true;
  isCognitiveModeActive = false;

  // Un-dim clutter
  document.querySelectorAll('[data-pulsepilot-dimmed]').forEach((el: any) => {
    el.style.opacity = '1';
    el.style.filter = 'none';
    el.style.pointerEvents = 'auto';
    el.style.maxHeight = 'none';
  });

  // Unfold text walls
  document.querySelectorAll('[data-pulsepilot-folded]').forEach((el: any) => {
    el.style.maxHeight = 'none';
    el.style.opacity = '1';
  });

  // Remove injected TL;DR cards
  document.querySelectorAll('.pulsepilot-tldr-injected').forEach((el) => el.remove());

  // Remove spotlight
  if (spotlightElem) {
    spotlightElem.classList.remove('spotlight-active');
  }

  // Remove restore button
  shadowRoot?.querySelector('.restore-btn')?.remove();
}

// Smart Decision Filter: Intercept Impulse Purchase
function attachImpulseBuySafeguard() {
  const buyButtons = document.querySelectorAll(
    '.checkout-btn, button[data-buy], .buy-now-btn, #buy-now'
  );

  buyButtons.forEach((btn: any) => {
    if (btn.getAttribute('data-pulsepilot-guarded')) return;
    btn.setAttribute('data-pulsepilot-guarded', 'true');

    btn.addEventListener('click', (e: MouseEvent) => {
      if (!currentStateData?.impulse_buy_shield_recommended) return;
      if (btn.getAttribute('data-pulsepilot-confirmed') === 'true') return;

      e.preventDefault();
      e.stopPropagation();

      showHoldToConfirmModal(btn);
    }, true);
  });
}

function showHoldToConfirmModal(targetBtn: HTMLElement) {
  if (!shadowRoot) return;

  const existing = shadowRoot.querySelector('.impulse-guard');
  if (existing) existing.remove();

  const rect = targetBtn.getBoundingClientRect();
  const modal = document.createElement('div');
  modal.className = 'impulse-guard';
  modal.style.top = `${rect.bottom + window.scrollY + 10}px`;
  modal.style.left = `${Math.max(10, rect.left + window.scrollX - 40)}px`;

  modal.innerHTML = `
    <div style="font-size: 10px; font-weight: 700; color: #E08838; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
      <span>⚠ DECISION SHIELD ACTIVE</span>
    </div>
    <div style="font-size: 11px; color: #F2EAE4; margin-bottom: 8px; line-height: 1.4;">
      Severe fatigue detected (4.5h sleep). Hold button for 1.5s to confirm late-night purchase.
    </div>
    <div style="display: flex; items-center; justify-content: center;">
      <button id="hold-confirm-btn" style="width: 100%; background: #221C1A; border: 1.5px solid #E08838; color: #E08838; padding: 8px 12px; font-family: inherit; font-size: 11px; font-weight: bold; border-radius: 2px; cursor: pointer; position: relative; overflow: hidden;">
        <span id="hold-progress" style="position: absolute; left: 0; top: 0; bottom: 0; width: 0%; background: rgba(224, 136, 56, 0.35); transition: width 50ms linear;"></span>
        <span style="position: relative; z-index: 1;">HOLD TO CONFIRM (1.5S)</span>
      </button>
    </div>
  `;

  shadowRoot.appendChild(modal);

  const holdBtn = modal.querySelector('#hold-confirm-btn') as HTMLElement;
  const progress = modal.querySelector('#hold-progress') as HTMLElement;

  let holdTimer: any = null;
  let startTime = 0;
  const HOLD_DURATION = 1500;

  const startHold = () => {
    startTime = Date.now();
    holdTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      progress.style.width = `${pct}%`;

      // Shake animation
      targetBtn.style.transform = `translateX(${Math.sin(elapsed * 0.05) * 2.5}px)`;

      if (elapsed >= HOLD_DURATION) {
        clearInterval(holdTimer);
        targetBtn.style.transform = 'none';
        holdBtn.style.background = '#2EE6A8';
        holdBtn.style.color = '#07131B';
        holdBtn.innerText = '✓ PURCHASE UNLOCKED';
        targetBtn.setAttribute('data-pulsepilot-confirmed', 'true');
        setTimeout(() => {
          modal.remove();
          targetBtn.click();
        }, 500);
      }
    }, 30);
  };

  const cancelHold = () => {
    if (holdTimer) clearInterval(holdTimer);
    progress.style.width = '0%';
    targetBtn.style.transform = 'none';
  };

  holdBtn.addEventListener('mousedown', startHold);
  holdBtn.addEventListener('mouseup', cancelHold);
  holdBtn.addEventListener('mouseleave', cancelHold);
}

// Poll state and sync DOM
async function pollVault() {
  try {
    const res = await fetch(`${VAULT_URL}/state`);
    if (res.ok) {
      const data: PersonalState = await res.json();
      currentStateData = data;

      initShadowDOM();

      // Update Floating HUD labels
      const stateTag = shadowRoot?.querySelector('#hud-state-tag') as HTMLElement;
      const rhrTag = shadowRoot?.querySelector('#hud-rhr-tag') as HTMLElement;

      if (stateTag && rhrTag) {
        stateTag.innerText = data.state;
        rhrTag.innerText = `${data.resting_hr} BPM // ${data.state}`;

        if (data.state === 'COGNITIVE_FATIGUE') {
          stateTag.style.background = '#2B1E17';
          stateTag.style.color = '#E08838';
          stateTag.style.borderColor = 'rgba(224, 136, 56, 0.4)';
        } else if (data.state === 'HIGH_STRESS') {
          stateTag.style.background = '#33141A';
          stateTag.style.color = '#FF4B55';
          stateTag.style.borderColor = 'rgba(255, 75, 85, 0.4)';
        } else if (data.state === 'DEEP_FOCUS') {
          stateTag.style.background = '#0B2A22';
          stateTag.style.color = '#2EE6A8';
          stateTag.style.borderColor = 'rgba(46, 230, 168, 0.4)';
        }
      }

      if (data.cognitive_load_mode_recommended) {
        applyCognitiveLoadMode();
      }

      if (data.impulse_buy_shield_recommended) {
        attachImpulseBuySafeguard();
      }
    }
  } catch (err) {
    // vault offline
  }
}

// Start polling
setInterval(pollVault, 2000);
pollVault();
