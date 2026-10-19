"""
DriveGuard AI — Production Bridge Runner
Runs the local FastAPI + OpenCV/MediaPipe backend and Cloudflare Secure Tunnel simultaneously.
Automatically extracts and displays the public HTTPS/WSS URL for your Vercel deployment.
"""

import os
import re
import signal
import subprocess
import sys
import threading
import time
import urllib.request
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
BIN_DIR = BACKEND_DIR / "bin"
CLOUDFLARED_EXE = BIN_DIR / "cloudflared.exe"


def verify_prerequisites():
    if not CLOUDFLARED_EXE.exists():
        print(f"[ERROR] cloudflared.exe not found at: {CLOUDFLARED_EXE}")
        print("Please ensure cloudflared is present in backend/bin/cloudflared.exe")
        sys.exit(1)


def drain_pipe(proc):
    """Continuously drains process output to prevent OS pipe buffer deadlocks."""
    try:
        for _ in iter(proc.stdout.readline, ""):
            pass
    except Exception:
        pass


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)
        except Exception:
            pass

    verify_prerequisites()

    print("=" * 72)
    print(" DRIVEGUARD AI // LOCAL AI ENGINE & CLOUD TUNNEL BRIDGE ")
    print("=" * 72)
    print("1. Initializing Python FastAPI & MediaPipe optical engine on port 8000...")

    # Start FastAPI server running server.py directly
    server_process = subprocess.Popen(
        [sys.executable, "-u", "server.py"],
        cwd=str(BACKEND_DIR),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    # Wait for FastAPI to become ready
    server_ready = False
    for _ in range(40):
        try:
            with urllib.request.urlopen("http://127.0.0.1:8000/health", timeout=1) as resp:
                if resp.status == 200:
                    server_ready = True
                    break
        except Exception:
            time.sleep(0.5)

    if not server_ready:
        print("[ERROR] FastAPI server failed to start on http://127.0.0.1:8000")
        server_process.terminate()
        sys.exit(1)

    print("   [OK] Python optical engine is ONLINE at http://127.0.0.1:8000")
    print("2. Launching Cloudflare HTTPS / WSS secure tunnel...")

    # Start Cloudflare Tunnel
    tunnel_cmd = [str(CLOUDFLARED_EXE), "tunnel", "--url", "http://127.0.0.1:8000"]
    tunnel_process = subprocess.Popen(
        tunnel_cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    tunnel_url = None
    url_regex = re.compile(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com")

    # Read tunnel output to extract the assigned public URL
    start_time = time.time()
    while time.time() - start_time < 30:
        line = tunnel_process.stdout.readline()
        if not line:
            if tunnel_process.poll() is not None:
                break
            time.sleep(0.1)
            continue

        match = url_regex.search(line)
        if match:
            tunnel_url = match.group(0)
            break

    # Start thread to drain remaining tunnel output so it doesn't block
    drain_thread = threading.Thread(target=drain_pipe, args=(tunnel_process,), daemon=True)
    drain_thread.start()

    if not tunnel_url:
        print("[WARNING] Could not auto-detect public tunnel URL within 30 seconds.")
        print(f"Run manually: backend\\bin\\cloudflared.exe tunnel --url http://127.0.0.1:8000")
    else:
        ws_url = tunnel_url.replace("https://", "wss://") + "/ws/telemetry"
        print("\n" + "=" * 72)
        print(" [READY] PRODUCTION BRIDGE IS LIVE! ")
        print("=" * 72)
        print(f" * Local Backend:      http://localhost:8000")
        print(f" * Public Tunnel URL:  {tunnel_url}")
        print(f" * WebSocket URL:      {ws_url}")
        print("=" * 72)
        print("\n>> TO CONNECT YOUR DEPLOYED VERCEL WEBSITE:")
        print("   Method A (Instant — Zero Redeployment Required):")
        print("     1. Open your live website on Vercel.")
        print("     2. In the top navigation bar, click 'ENGINE OFFLINE'.")
        print(f"     3. Paste this Tunnel URL:  {tunnel_url}")
        print("     4. Click 'Save & Connect'. The optical feed will appear immediately!")
        print("\n   Method B (Permanent Vercel Setting):")
        print("     In Vercel Project Settings -> Environment Variables, set:")
        print(f"     VITE_API_BASE_URL = {tunnel_url}")
        print("=" * 72)
        print("\n[Press Ctrl+C at any time to cleanly stop the server and tunnel]\n")

    def shutdown(sig, frame):
        print("\n[INFO] Shutting down Cloudflare Tunnel and Python Backend...")
        try:
            tunnel_process.terminate()
        except Exception:
            pass
        try:
            server_process.terminate()
        except Exception:
            pass
        print("[INFO] Bridge stopped cleanly.")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        while True:
            time.sleep(1)
            if server_process.poll() is not None:
                print("[WARNING] FastAPI server stopped.")
                break
            if tunnel_process.poll() is not None:
                print("[WARNING] Cloudflare Tunnel stopped.")
                break
    except KeyboardInterrupt:
        shutdown(None, None)


if __name__ == "__main__":
    main()
