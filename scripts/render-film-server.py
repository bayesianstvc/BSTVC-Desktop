"""Loopback-only static server and WebCodecs H.264 sink for the BSTVC film."""
from datetime import datetime, timezone
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Lock
import hashlib
import json
import secrets

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / ".render"
OUTPUT = OUTPUT_DIR / "BSTVC-4K-30fps.h264"
META = OUTPUT_DIR / "BSTVC-4K-30fps.json"
LOCK = Lock()
STATE = {"active": False}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def reply(self, code, data):
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        try:
            self.wfile.write(payload)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass

    def do_POST(self):
        origin = self.headers.get("Origin")
        if origin not in ("http://127.0.0.1:4182", "http://localhost:4182"):
            return self.reply(403, {"error": "Only this loopback render page may write exports."})
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length < 1 or length > 32 * 1024 * 1024:
                return self.reply(413, {"error": "Invalid request size."})
            raw = self.rfile.read(length)
            if len(raw) != length:
                return self.reply(400, {"error": "Incomplete request body."})
            with LOCK:
                if self.path == "/export/start":
                    if STATE["active"]:
                        return self.reply(409, {"error": "An export is already active."})
                    config = json.loads(raw)
                    frames = int(config.get("totalFrames", 0))
                    if config.get("width") != 3840 or config.get("height") != 2160 or config.get("fps") != 30 or not 1 <= frames <= 2700:
                        return self.reply(400, {"error": "Only 3840x2160, 30 fps, 1-2700 frames are accepted."})
                    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
                    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
                    for path in (OUTPUT, META):
                        if path.exists():
                            path.rename(path.with_name(f"{path.stem}-previous-{stamp}{path.suffix}"))
                    OUTPUT.touch(exist_ok=False)
                    STATE.clear()
                    STATE.update(active=True, token=secrets.token_urlsafe(24), sequence=0, frames=0, bytes=0, config=config, started=datetime.now(timezone.utc).isoformat())
                    return self.reply(200, {"token": STATE["token"], "output": str(OUTPUT)})

                data = None if self.path == "/export/chunk" else json.loads(raw)
                token = self.headers.get("X-Export-Token") if data is None else data.get("token")
                if not STATE["active"] or token != STATE.get("token"):
                    return self.reply(409, {"error": "No matching active export."})
                if self.path == "/export/chunk":
                    sequence = int(self.headers.get("X-Export-Sequence", "-1"))
                    frames = int(self.headers.get("X-Export-Frames", "0"))
                    digest = hashlib.sha256(raw).hexdigest()
                    receipt = STATE.get("last_receipt")
                    if sequence < STATE["sequence"]:
                        if receipt and sequence == receipt["sequence"] and frames == receipt["frames"] and digest == receipt["sha256"]:
                            return self.reply(200, receipt["response"])
                        return self.reply(409, {"error": "Old chunk does not match the latest receipt."})
                    if sequence != STATE["sequence"] or frames < 1 or STATE["frames"] + frames > STATE["config"]["totalFrames"]:
                        return self.reply(409, {"error": "Out-of-order chunk or invalid frame count."})
                    with OUTPUT.open("ab") as stream:
                        stream.write(raw)
                    STATE["sequence"] += 1
                    STATE["frames"] += frames
                    STATE["bytes"] += length
                    response = {"sequence": sequence, "frames": STATE["frames"], "bytes": STATE["bytes"]}
                    STATE["last_receipt"] = {"sequence": sequence, "frames": frames, "sha256": digest, "response": response}
                    return self.reply(200, response)
                if self.path == "/export/finish":
                    expected = STATE["config"]["totalFrames"]
                    if STATE["frames"] != expected or int(data.get("encodedFrames", -1)) != expected:
                        return self.reply(409, {"error": "Export frame count mismatch."})
                    STATE["active"] = False
                    record = {key: value for key, value in STATE.items() if key not in ("token", "last_receipt")}
                    record.update(complete=True, output=str(OUTPUT), finished=datetime.now(timezone.utc).isoformat())
                    META.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
                    return self.reply(200, {"complete": True, "output": str(OUTPUT), "frames": STATE["frames"], "bytes": STATE["bytes"]})
                if self.path == "/export/abort":
                    STATE["active"] = False
                    return self.reply(200, {"aborted": True, "partialFilePreserved": True})
                return self.reply(404, {"error": "Unknown export endpoint."})
        except (ValueError, TypeError, OSError, json.JSONDecodeError) as error:
            return self.reply(400, {"error": str(error)})

if __name__ == "__main__":
    print("BSTVC render server: http://127.0.0.1:4182/zh/film/?render=4k&quality=4k", flush=True)
    print(f"Output: {OUTPUT}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", 4182), Handler).serve_forever()
