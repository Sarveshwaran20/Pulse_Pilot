// Side Panel Logic for PulsePilot MV3 Extension
export {};
const VAULT_URL = 'http://127.0.0.1:8000';
const MCP_URL = 'http://127.0.0.1:8002';

const stateBadge = document.getElementById('state-badge');
const stateHeadline = document.getElementById('state-headline');
const statFatigue = document.getElementById('stat-fatigue');
const statFocus = document.getElementById('stat-focus');
const statRhr = document.getElementById('stat-rhr');
const approvalQueue = document.getElementById('approval-queue');
const canvas = document.getElementById('mini-orb') as HTMLCanvasElement;
const ctx = canvas?.getContext('2d');

let orbT = 0;
let currentRHR = 65;
let currentStress = 40;
let currentColor = '#2EE6A8';

function renderMiniOrb() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 28;

  const hrFreq = (currentRHR / 60) * 0.05;
  const pulse = 1 + Math.sin(orbT * hrFreq) * 0.1;

  // Glow
  const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius * 1.8);
  grad.addColorStop(0, currentColor);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Noise ring
  ctx.beginPath();
  const pts = 60;
  for (let i = 0; i <= pts; i++) {
    const angle = (i / pts) * Math.PI * 2;
    const n = Math.sin(angle * 5 + orbT * 0.04) * (1.5 + (currentStress / 100) * 4);
    const r = (radius + n) * pulse;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  orbT++;
  requestAnimationFrame(renderMiniOrb);
}
renderMiniOrb();

async function refreshSidePanel() {
  try {
    const res = await fetch(`${VAULT_URL}/state`);
    if (res.ok) {
      const data = await res.json();
      if (stateBadge) stateBadge.innerText = data.state;
      if (stateHeadline) stateHeadline.innerText = data.headline;
      if (statFatigue) statFatigue.innerText = `${data.fatigue_score}%`;
      if (statFocus) statFocus.innerText = `${data.focus_score}%`;
      if (statRhr) statRhr.innerText = `${data.resting_hr} BPM`;

      currentRHR = data.resting_hr;
      currentStress = data.stress_score;
      if (data.state === 'DEEP_FOCUS') currentColor = '#2EE6A8';
      else if (data.state === 'COGNITIVE_FATIGUE') currentColor = '#E08838';
      else if (data.state === 'HIGH_STRESS') currentColor = '#FF4B55';
      else currentColor = '#8BAA9E';
    }

    const mcpRes = await fetch(`${MCP_URL}/actions/pending`);
    if (mcpRes.ok && approvalQueue) {
      const actions = await mcpRes.json();
      if (actions.length === 0) {
        approvalQueue.innerHTML = `<div style="color: #535E5A; text-align: center; padding: 16px;">Zero pending gated dispatches</div>`;
      } else {
        approvalQueue.innerHTML = actions.map((act: any) => `
          <div class="hud-card">
            <div style="font-size: 11px; font-weight: bold; color: ${currentColor};">${act.title}</div>
            <div style="font-size: 10px; color: #A69288; margin-top: 3px;">${act.summary}</div>
            <div style="font-size: 10px; margin-top: 5px; padding: 4px; background: rgba(0,0,0,0.4);">${act.diff_preview}</div>
            <button class="btn-approve" data-id="${act.action_id}">CONFIRM & EXECUTE</button>
          </div>
        `).join('');

        approvalQueue.querySelectorAll('.btn-approve').forEach((btn) => {
          btn.addEventListener('click', async (e) => {
            const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
            if (id) {
              await fetch(`${MCP_URL}/actions/approve/${id}`, { method: 'POST' });
              refreshSidePanel();
            }
          });
        });
      }
    }
  } catch (err) {
    // vault offline
  }
}

setInterval(refreshSidePanel, 2000);
refreshSidePanel();
