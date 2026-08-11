#!/bin/zsh
set -euo pipefail

script_dir=${0:A:h}
project_dir=${script_dir:h}
film_dir="$project_dir/public/cinematic"
model_dir="$project_dir/public/models"
build_dir="$project_dir/.build-tools"
render_tmp=$(mktemp -d)

cleanup() {
  rm -rf "$render_tmp"
}
trap cleanup EXIT

mkdir -p "$film_dir" "$model_dir" "$build_dir"

xcrun swiftc -O \
  -framework AppKit \
  -framework SceneKit \
  -framework Metal \
  "$script_dir/render_cinematic_metal.swift" \
  -o "$build_dir/render_cinematic_metal"

"$build_dir/render_cinematic_metal" "$render_tmp"

cp "$render_tmp/tetherics-machine.scn" "$model_dir/tetherics-machine.scn"

ffmpeg -y -hide_banner -loglevel warning \
  -framerate 24 \
  -start_number 1 \
  -i "$render_tmp/frame.%03d.png" \
  -an \
  -c:v libx264 \
  -preset slow \
  -crf 17 \
  -g 1 \
  -profile:v high \
  -level:v 5.2 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  "$film_dir/tetherics-machine-4k.mp4"

ffmpeg -y -hide_banner -loglevel warning \
  -i "$render_tmp/frame.049.png" \
  -frames:v 1 \
  -q:v 1 \
  "$film_dir/tetherics-machine-poster-4k.jpg"

python3 - "$film_dir" "$model_dir/tetherics-machine.scn" <<'PY'
import hashlib
import json
import sys
from pathlib import Path

film_dir = Path(sys.argv[1])
model_path = Path(sys.argv[2])
deliveries = [
    film_dir / "tetherics-machine-4k.mp4",
    film_dir / "tetherics-machine-poster-4k.jpg",
    model_path,
]

manifest = {
    "asset": "Tetherics Autonomous System / TS-MACHINE-01",
    "status": "CONCEPT VISUALIZATION",
    "sourceFormat": "Apple SceneKit scene archive",
    "renderer": "Metal / SceneKit physically based offline renderer",
    "masterResolution": "3840x2160",
    "frames": 96,
    "framesPerSecond": 24,
    "durationSeconds": 4,
    "modeling": [
        "Chamfered parametric CAD geometry",
        "Articulated shoulder, elbow, wrist and gripper rig",
        "Physically based metal, ceramic, rubber, optical and emissive materials",
        "Compute modules, perception stack, direct-drive actuator and service details",
    ],
    "claims": "No physical prototype, deployment, performance or certification claim is implied by this visualization.",
    "deliveries": {},
}

for path in deliveries:
    manifest["deliveries"][path.name] = {
        "bytes": path.stat().st_size,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }

(film_dir / "asset-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
PY

ls -lh \
  "$film_dir/tetherics-machine-4k.mp4" \
  "$film_dir/tetherics-machine-poster-4k.jpg" \
  "$model_dir/tetherics-machine.scn" \
  "$film_dir/asset-manifest.json"
