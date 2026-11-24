#!/usr/bin/env python3
"""
PulsePilot Unified Dev Orchestrator (Next.js Edition)
Runs:
  1. Local Vault (port 8000)
  2. MCP Action Server Bridge (port 8002)
  3. Elevated Next.js Web App (port 3000)
Reuses running services if already active, or launches missing ones.
"""
import subprocess
import sys
import time
import signal
import os
import socket
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VENV_PYTHON = ROOT / ".venv" / "bin" / "python3"
VENV_UVICORN = ROOT / ".venv" / "bin" / "uvicorn"

if not VENV_PYTHON.exists():
    print("Virtual environment not found at .venv. Please run `make setup` first.")
    sys.exit(1)

processes = []

def is_service_healthy(url: str) -> bool:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'PulsePilot-Dev'})
        with urllib.request.urlopen(req, timeout=1.0) as resp:
            return resp.status in [200, 304]
    except Exception:
        return False

def is_port_in_use(port: int) -> bool:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.bind(('127.0.0.1', port))
        s.close()
        return False
    except OSError:
        return True

def cleanup(sig=None, frame=None):
    print("\n[PulsePilot] Terminating spawned services...")
    for p in processes:
        if p.poll() is None:
            try:
                p.terminate()
            except Exception:
                pass
    time.sleep(0.5)
    for p in processes:
        if p.poll() is None:
            try:
                p.kill()
            except Exception:
                pass
    print("[PulsePilot] Done.")
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

def main():
    print("=" * 65)
    print("  PULSEPILOT // ELEVATED CIRCADIAN COCKPIT (NEXT.JS APP ROUTER)")
    print("=" * 65)
    print("Layer 1: Local Vault       --> http://127.0.0.1:8000")
    print("Layer 2: MCP Action Server --> http://127.0.0.1:8002")
    print("Layer 3: Browser Extension --> /extension/dist")
    print("Hero UI: Next.js Experience--> http://localhost:3000")
    print("  • Landing & Story        --> http://localhost:3000/")
    print("  • Command Center         --> http://localhost:3000/command")
    print("  • 60s Demo Director      --> http://localhost:3000/demo")
    print("Test Shop: Cluttered Page  --> http://127.0.0.1:8000/test/shop")
    print("=" * 65)

    env = os.environ.copy()
    env["PYTHONPATH"] = str(ROOT)

    # 1. Start or Reuse Vault
    if is_service_healthy("http://127.0.0.1:8000/health"):
        print("[1/3] Local Vault is already running on http://127.0.0.1:8000 (reusing)")
    else:
        print("[1/3] Starting Local Vault (port 8000)...")
        p_vault = subprocess.Popen(
            [str(VENV_UVICORN), "vault.app.main:app", "--host", "127.0.0.1", "--port", "8000"],
            cwd=ROOT,
            env=env
        )
        processes.append(p_vault)
        time.sleep(0.4)

    # 2. Start or Reuse MCP Bridge
    if is_service_healthy("http://127.0.0.1:8002/health"):
        print("[2/3] MCP Action Server Bridge is already running on http://127.0.0.1:8002 (reusing)")
    else:
        print("[2/3] Starting MCP Action Server Bridge (port 8002)...")
        p_mcp = subprocess.Popen(
            [str(VENV_UVICORN), "mcp_server.server:bridge", "--host", "127.0.0.1", "--port", "8002"],
            cwd=ROOT,
            env=env
        )
        processes.append(p_mcp)
        time.sleep(0.4)

    # 3. Start or Reuse Next.js Web App
    if is_service_healthy("http://localhost:3000"):
        print("[3/3] Next.js Web Experience is already running on http://localhost:3000 (reusing)")
    else:
        print("[3/3] Starting Next.js Web Experience (port 3000)...")
        p_web = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=ROOT / "web"
        )
        processes.append(p_web)

    print("\n✓ All systems operational. Press Ctrl+C to halt.\n")

    try:
        while True:
            time.sleep(1)
            for p in processes:
                if p.poll() is not None:
                    print(f"[PulsePilot] Process {p.args} exited unexpectedly with code {p.returncode}")
                    cleanup()
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
