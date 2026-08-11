# Tetherics Systems

The production website for Tetherics Systems: a scroll-directed, realtime 3D explanation of the infrastructure between intelligence and the physical world.

## Experience

- Realtime Babylon.js WebGL2 world with physically based materials, dynamic lighting, bloom, shadows, depth fog, and procedural system geometry
- Fifteen camera-directed scenes synchronized to scroll position
- Inspectable 3D components with explicit input, output, and evidence boundaries
- Native Apple SceneKit/Metal 4K cinematic fallback for reduced-motion and WebGL-unavailable environments
- Responsive desktop and mobile composition
- Evidence register, SeerFlow system record, claims methodology, security boundary, and downloadable PDF briefs
- No Three.js dependency

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

The main trust routes are:

- `/evidence`
- `/records/seerflow`
- `/methodology`
- `/security`

The native cinematic source can be regenerated on macOS with:

```bash
./scripts/render_cinematic_assets.sh
```

System briefs can be regenerated with:

```bash
python3 scripts/generate_system_briefs.py
```

## Deployment

The application is configured for Vercel. Production domain: `tethericsystems.com`.
