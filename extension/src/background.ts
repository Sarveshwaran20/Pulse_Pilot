// Background Service Worker for PulsePilot MV3 Extension
export {};
const VAULT_URL = 'http://127.0.0.1:8000';

async function updateStateBadge() {
  try {
    const res = await fetch(`${VAULT_URL}/state`);
    if (res.ok) {
      const data = await res.json();
      const state = data.state;
      let badgeText = 'NORM';
      let badgeColor = '#8BAA9E';

      if (state === 'DEEP_FOCUS') {
        badgeText = 'FLOW';
        badgeColor = '#2EE6A8';
      } else if (state === 'COGNITIVE_FATIGUE') {
        badgeText = 'TIRED';
        badgeColor = '#E08838';
      } else if (state === 'HIGH_STRESS') {
        badgeText = 'ALRM';
        badgeColor = '#FF4B55';
      }

      chrome.action.setBadgeText({ text: badgeText });
      chrome.action.setBadgeBackgroundColor({ color: badgeColor });
    }
  } catch (err) {
    chrome.action.setBadgeText({ text: '' });
  }
}

// Poll state every 3 seconds
setInterval(updateStateBadge, 3000);
updateStateBadge();

// Open side panel on extension action click
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    (chrome as any).sidePanel?.open({ tabId: tab.id });
  }
});
