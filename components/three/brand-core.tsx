"use client";

import type { Vector3 as Vec3 } from "@babylonjs/core/Maths/math.vector";
import { useEffect, useRef } from "react";

type CoreState = { progress: number; burst: number; pointerX: number; pointerY: number; assembled: number; energy: number };

/** Logo-space shapes of the monogram (the first E of TETHERIC), in wordmark units. */
const SHAPES = {
  top: [[0, 0], [125, 0], [125, 20], [0, 20]],
  accent: [[0, 50], [124, 50], [111, 70], [0, 70]],
  bottom: [[0, 100], [125, 100], [125, 120], [0, 120]],
} as const;

/**
 * The monogram as a realtime 3D object. Porcelain structure bars with a cyan rim, a glowing
 * blue → cyan signal bar, and two particle streams: information flowing in from the left,
 * possibility fanning out to the right. Driven by pointer, clicks and (optionally) a progress event.
 */
export function BrandCore({ className = "", anchor = "right", progressEvent }: { className?: string; anchor?: "right" | "center"; progressEvent?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    let teardown = () => {};

    (async () => {
      const [{ Engine }, { Scene }, { ArcRotateCamera }, { HemisphericLight }, { DirectionalLight }, { PointLight }, { Color3, Color4 }, { Vector3, Matrix, Quaternion }, { MeshBuilder }, { Mesh }, { VertexData }, { StandardMaterial }, { FresnelParameters }, { GlowLayer }, { DynamicTexture }, { TransformNode }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("@babylonjs/core/Engines/engine"),
        import("@babylonjs/core/scene"),
        import("@babylonjs/core/Cameras/arcRotateCamera"),
        import("@babylonjs/core/Lights/hemisphericLight"),
        import("@babylonjs/core/Lights/directionalLight"),
        import("@babylonjs/core/Lights/pointLight"),
        import("@babylonjs/core/Maths/math.color"),
        import("@babylonjs/core/Maths/math.vector"),
        import("@babylonjs/core/Meshes/meshBuilder"),
        import("@babylonjs/core/Meshes/mesh"),
        import("@babylonjs/core/Meshes/mesh.vertexData"),
        import("@babylonjs/core/Materials/standardMaterial"),
        import("@babylonjs/core/Materials/fresnelParameters"),
        import("@babylonjs/core/Layers/glowLayer"),
        import("@babylonjs/core/Materials/Textures/dynamicTexture"),
        import("@babylonjs/core/Meshes/transformNode"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("@babylonjs/core/Meshes/thinInstanceMesh"),
        import("@babylonjs/core/Rendering/edgesRenderer"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      const narrow = window.innerWidth < 900;
      const engine = new Engine(canvas, true, { alpha: true, antialias: true, premultipliedAlpha: false, preserveDrawingBuffer: false, stencil: true }, true);
      engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2));
      const scene = new Scene(engine);
      scene.clearColor = new Color4(0, 0, 0, 0);
      scene.fogMode = Scene.FOGMODE_EXP2;
      scene.fogDensity = 0.035;
      scene.fogColor = new Color3(0.024, 0.05, 0.086);

      const baseRadius = narrow ? 19 : 15.5;
      const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, baseRadius, Vector3.Zero(), scene);
      camera.fov = 0.7;
      camera.minZ = 0.1;

      const sky = new HemisphericLight("sky", new Vector3(0, 1, -0.3), scene);
      sky.intensity = 0.55;
      sky.diffuse = Color3.FromHexString("#d6e6f5");
      sky.groundColor = Color3.FromHexString("#0b1a2a");
      sky.specular = Color3.Black();
      const key = new DirectionalLight("key", new Vector3(0.45, -0.55, 1), scene);
      key.intensity = 0.95;
      key.diffuse = Color3.FromHexString("#f2f7ff");
      const sweep = new PointLight("sweep", new Vector3(-8, 1.5, -3.5), scene);
      sweep.diffuse = Color3.FromHexString("#7fe3f4");
      sweep.specular = Color3.FromHexString("#bff4ff");
      sweep.intensity = 0.9;
      sweep.range = 9;

      const core = new TransformNode("core", scene);
      const home = anchor === "center" || narrow ? new Vector3(0, narrow ? 3 : 0, 0) : new Vector3(4.3, 0.1, 0);
      core.position.copyFrom(home);
      const tilt = new TransformNode("tilt", scene);
      tilt.parent = core;

      const unit = (narrow ? 4.4 : 5.6) / 125;
      const prism = (name: string, shape: readonly (readonly number[])[], depth: number) => {
        const points = shape.map(([x, y]) => [(x - 62.5) * unit, (60 - y) * unit]);
        const xs = points.map(([x]) => x), ys = points.map(([, y]) => y);
        const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
        const positions: number[] = [], indices: number[] = [], uvs: number[] = [];
        const vertex = (x: number, y: number, z: number) => { positions.push(x, y, z); uvs.push((x - minX) / (maxX - minX), (y - minY) / (maxY - minY)); return positions.length / 3 - 1; };
        const face = (corners: number[][]) => {
          const ids = corners.map(([x, y, z]) => vertex(x, y, z));
          for (let index = 1; index < ids.length - 1; index += 1) indices.push(ids[0], ids[index], ids[index + 1]);
        };
        const half = depth / 2;
        face(points.map(([x, y]) => [x, y, -half]));
        face([...points].reverse().map(([x, y]) => [x, y, half]));
        points.forEach(([x, y], index) => {
          const [nx, ny] = points[(index + 1) % points.length];
          face([[x, y, -half], [x, y, half], [nx, ny, half], [nx, ny, -half]]);
        });
        const normals: number[] = [];
        VertexData.ComputeNormals(positions, indices, normals);
        const data = new VertexData();
        Object.assign(data, { positions, indices, normals, uvs });
        const mesh = new Mesh(name, scene);
        data.applyToMesh(mesh);
        return mesh;
      };

      const porcelain = new StandardMaterial("porcelain", scene);
      porcelain.diffuseColor = Color3.FromHexString("#dbe6f1");
      porcelain.specularColor = new Color3(0.55, 0.62, 0.7);
      porcelain.specularPower = 80;
      porcelain.emissiveColor = Color3.FromHexString("#0d1a28");
      porcelain.backFaceCulling = false;
      porcelain.twoSidedLighting = true;
      const rim = new FresnelParameters();
      rim.leftColor = Color3.FromHexString("#2bd8f0");
      rim.rightColor = Color3.Black();
      rim.bias = 0.18;
      rim.power = 2.4;
      porcelain.emissiveFresnelParameters = rim;

      const ramp = new DynamicTexture("signal-ramp", { width: 512, height: 16 }, scene, false);
      const paint = ramp.getContext() as CanvasRenderingContext2D;
      const gradient = paint.createLinearGradient(0, 0, 512, 0);
      gradient.addColorStop(0, "#1a5fc0");
      gradient.addColorStop(0.52, "#1a9ae0");
      gradient.addColorStop(1, "#3be3f7");
      paint.fillStyle = gradient;
      paint.fillRect(0, 0, 512, 16);
      ramp.update();
      const signal = new StandardMaterial("signal", scene);
      signal.diffuseColor = Color3.Black();
      signal.specularColor = Color3.Black();
      signal.emissiveTexture = ramp;
      signal.emissiveColor = new Color3(0.78, 0.8, 0.82);
      signal.backFaceCulling = false;

      const barSpecs = [
        { name: "top", shape: SHAPES.top, material: porcelain, from: new Vector3(-2, 7, 4), spin: 0.9 },
        { name: "accent", shape: SHAPES.accent, material: signal, from: new Vector3(-14, 0, -2), spin: 0 },
        { name: "bottom", shape: SHAPES.bottom, material: porcelain, from: new Vector3(2, -7, 4), spin: -0.9 },
      ];
      const bars = barSpecs.map((spec) => {
        const mesh = prism(spec.name, spec.shape, 0.95);
        mesh.material = spec.material;
        mesh.parent = tilt;
        mesh.position.copyFrom(spec.from);
        mesh.rotation.z = spec.spin;
        if (spec.material === porcelain) {
          mesh.enableEdgesRendering(0.95);
          mesh.edgesWidth = 0.8;
          mesh.edgesColor = new Color4(0.55, 0.9, 1, 0.3);
        }
        return { mesh, spec };
      });
      const accent = bars[1].mesh;

      const emissive = (hex: string) => {
        const material = new StandardMaterial(`emissive-${hex}`, scene);
        material.emissiveColor = Color3.FromHexString(hex);
        material.diffuseColor = Color3.Black();
        material.specularColor = Color3.Black();
        material.disableLighting = true;
        return material;
      };
      const rings = [
        { diameter: 8.2, thickness: 0.016, color: "#2bd8f0", tilt: new Vector3(0.34, 0, 0.16), speed: 0.2 },
        { diameter: 9.6, thickness: 0.011, color: "#3a92ee", tilt: new Vector3(-0.26, 0, -0.2), speed: -0.13 },
      ].map((spec) => {
        const pivot = new TransformNode(`ring-${spec.diameter}`, scene);
        pivot.parent = core;
        pivot.rotation.copyFrom(spec.tilt);
        const ring = MeshBuilder.CreateTorus(`ring-${spec.diameter}`, { diameter: spec.diameter, thickness: spec.thickness, tessellation: 180 }, scene);
        ring.material = emissive(spec.color);
        ring.parent = pivot;
        ring.scaling.setAll(0.001);
        return { pivot, ring, spec };
      });
      const satellites = [
        { mesh: MeshBuilder.CreateSphere("seerflow", { diameter: 0.24, segments: 24 }, scene), color: "#3ddcf2", ring: 0, speed: 0.5 },
        { mesh: MeshBuilder.CreatePolyhedron("foundry", { type: 1, size: 0.15 }, scene), color: "#6fb2ff", ring: 1, speed: -0.34 },
      ].map((satellite, index) => {
        satellite.mesh.material = emissive(satellite.color);
        satellite.mesh.parent = rings[satellite.ring].pivot;
        return { ...satellite, angle: index * Math.PI + 0.6 };
      });

      const leftEnd = new Vector3(-62.5 * unit, 0.05, 0);
      const rightEnd = new Vector3(61.5 * unit, 0.05, 0);
      type Traveller = { from: Vec3; control: Vec3; to: Vec3; t: number; speed: number; size: number };
      const random = (min: number, max: number) => min + Math.random() * (max - min);
      const makeInput = (): Traveller => {
        const from = new Vector3(random(-9.5, -6), random(-3.6, 3.6), random(-2.5, 5));
        return { from, control: new Vector3(random(-5, -3.6), from.y * 0.25, from.z * 0.3), to: leftEnd, t: Math.random(), speed: random(0.16, 0.34), size: random(0.6, 1.2) };
      };
      const makeOutput = (): Traveller => {
        const to = new Vector3(random(8.5, 13), random(-5, 5), random(-3, 4));
        return { from: rightEnd, control: new Vector3(random(4.2, 5.8), to.y * 0.2, to.z * 0.2), to, t: Math.random(), speed: random(0.14, 0.3), size: random(0.6, 1.4) };
      };
      const streamCount = narrow ? 34 : 70;
      const orbitCount = narrow ? 160 : 380;
      const makeField = (name: string, hex: string, size: number, total: number) => {
        const mesh = MeshBuilder.CreateSphere(name, { diameter: size, segments: 4 }, scene);
        mesh.material = emissive(hex);
        mesh.parent = tilt;
        const matrices = new Float32Array(total * 16);
        mesh.thinInstanceSetBuffer("matrix", matrices, 16, false);
        return { mesh, matrices };
      };
      const inputs = { ...makeField("inputs", "#3a92ee", 0.07, streamCount), items: Array.from({ length: streamCount }, makeInput) };
      const outputs = { ...makeField("outputs", "#3be3f7", 0.07, streamCount), items: Array.from({ length: streamCount }, makeOutput) };
      const dust = makeField("dust", "#cfe6fb", 0.035, orbitCount);
      const dustSeeds = Array.from({ length: orbitCount }, () => ({ radius: random(4.2, 8.5), angle: random(0, Math.PI * 2), height: random(-0.9, 0.9), speed: random(0.05, 0.16) * (Math.random() > 0.85 ? -1 : 1), scale: random(0.5, 1.6) }));

      const glow = new GlowLayer("glow", scene, { mainTextureSamples: narrow ? 1 : 4, blurKernelSize: 40 });
      glow.intensity = 0.75;
      [accent, ...rings.map(({ ring }) => ring), ...satellites.map(({ mesh }) => mesh), inputs.mesh, outputs.mesh].forEach((mesh) => glow.addIncludedOnlyMesh(mesh));

      const state: CoreState = { progress: 0, burst: 0, pointerX: 0, pointerY: 0, assembled: 0, energy: 1 };
      const pointer = { x: 0, y: 0 };
      const assemble = gsap.timeline({ paused: true });
      bars.forEach(({ mesh }, index) => {
        assemble.to(mesh.position, { x: 0, y: 0, z: 0, duration: 1.7, ease: "expo.out" }, index * 0.14);
        assemble.to(mesh.rotation, { z: 0, duration: 1.7, ease: "expo.out" }, index * 0.14);
      });
      rings.forEach(({ ring }, index) => assemble.to(ring.scaling, { x: 1, y: 1, z: 1, duration: 1.6, ease: "expo.out" }, 0.5 + index * 0.15));
      assemble.to(state, { assembled: 1, duration: 1.8, ease: "power2.out" }, 0.2);
      const start = () => assemble.play();
      if (document.documentElement.classList.contains("intro-done") || !document.querySelector(".brand-intro")) start();
      else window.addEventListener("tetheric:intro-done", start, { once: true });
      const fallback = window.setTimeout(start, 4500);

      const host = canvas.closest<HTMLElement>("[data-core-host]") ?? canvas.parentElement!;
      const onProgress = (event: Event) => { state.progress = (event as CustomEvent<number>).detail; };
      let trigger: { kill: () => void } | null = null;
      if (progressEvent) window.addEventListener(progressEvent, onProgress);
      else trigger = ScrollTrigger.create({ trigger: host, start: "top top", end: "bottom top", scrub: true, onUpdate: (self) => { state.progress = self.progress; } });
      const move = (event: PointerEvent) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
      };
      const burst = (event: PointerEvent) => {
        if (event.target instanceof Element && event.target.closest("a,button")) return;
        gsap.fromTo(state, { burst: 1, energy: 3.5 }, { burst: 0, energy: 1, duration: 1.8, ease: "elastic.out(1,0.5)" });
      };
      window.addEventListener("pointermove", move, { passive: true });
      host.addEventListener("pointerdown", burst);

      const matrix = new Matrix();
      const scale = new Vector3();
      const rotation = Quaternion.Identity();
      const position = new Vector3();
      const bezier = (item: Traveller, out: Vec3) => {
        const t = item.t, u = 1 - t;
        out.set(u * u * item.from.x + 2 * u * t * item.control.x + t * t * item.to.x, u * u * item.from.y + 2 * u * t * item.control.y + t * t * item.to.y, u * u * item.from.z + 2 * u * t * item.control.z + t * t * item.to.z);
      };
      let time = 0;
      scene.onBeforeRenderObservable.add(() => {
        const delta = Math.min(engine.getDeltaTime() / 1000, 0.05);
        time += delta;
        const { progress: p, burst: pulse, assembled, energy } = state;
        state.pointerX += (pointer.x - state.pointerX) * 0.05;
        state.pointerY += (pointer.y - state.pointerY) * 0.05;

        const dive = Math.min(1, p * 1.4);
        core.position.x = home.x * (1 - dive);
        core.position.y = home.y * (1 - dive) + Math.sin(time * 0.7) * 0.1;
        tilt.rotation.y = Math.sin(time * 0.4) * 0.22 + state.pointerX * 0.45 - dive * 0.2;
        tilt.rotation.x = Math.sin(time * 0.33) * 0.06 + state.pointerY * 0.22;
        camera.radius = baseRadius - dive * (baseRadius - 5.2);
        accent.scaling.x = 1 + Math.max(0, p - 0.45) * 6;
        glow.intensity = 0.45 + dive * 0.9 + pulse * 0.6;
        sweep.position.x = Math.sin(time * 0.55) * 7;

        if (assembled > 0.98) {
          bars.forEach(({ mesh }, index) => {
            const offset = index - 1;
            mesh.position.y = offset * (pulse * 1.6 + dive * 2.2);
            mesh.position.z = offset * pulse * 1.2 + Math.sin(time * 1.1 + index) * 0.06;
            mesh.rotation.x = offset * pulse * 0.7;
          });
        }
        rings.forEach(({ pivot, spec }) => { pivot.rotation.y += spec.speed * delta * energy; });
        satellites.forEach((satellite) => {
          satellite.angle += delta * satellite.speed * energy;
          const radius = rings[satellite.ring].spec.diameter / 2;
          satellite.mesh.position.set(Math.cos(satellite.angle) * radius, 0, Math.sin(satellite.angle) * radius);
          satellite.mesh.rotation.y += delta * 1.2;
        });

        [inputs, outputs].forEach((stream, streamIndex) => {
          stream.items.forEach((item, slot) => {
            item.t += delta * item.speed * energy;
            if (item.t >= 1) Object.assign(item, streamIndex ? makeOutput() : makeInput(), { t: 0 });
            bezier(item, position);
            const fade = Math.sin(Math.PI * item.t);
            scale.setAll(item.size * (0.35 + fade * 0.9) * assembled);
            Matrix.ComposeToRef(scale, rotation, position, matrix);
            matrix.copyToArray(stream.matrices, slot * 16);
          });
          stream.mesh.thinInstanceBufferUpdated("matrix");
        });
        dustSeeds.forEach((seed, slot) => {
          seed.angle += delta * seed.speed * energy;
          const radius = seed.radius * (0.35 + assembled * 0.65) * (1 + pulse * 0.2);
          position.set(Math.cos(seed.angle) * radius, seed.height + Math.sin(time * 0.6 + seed.radius) * 0.12, Math.sin(seed.angle) * radius * 0.55);
          scale.setAll(seed.scale * assembled);
          Matrix.ComposeToRef(scale, rotation, position, matrix);
          matrix.copyToArray(dust.matrices, slot * 16);
        });
        dust.mesh.thinInstanceBufferUpdated("matrix");
      });

      let running = true;
      const render = () => scene.render();
      engine.runRenderLoop(render);
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !running) { running = true; engine.runRenderLoop(render); }
        else if (!entry.isIntersecting && running) { running = false; engine.stopRenderLoop(render); }
      });
      observer.observe(host);
      const resize = () => engine.resize();
      window.addEventListener("resize", resize);
      canvas.classList.add("is-ready");

      teardown = () => {
        window.clearTimeout(fallback);
        window.removeEventListener("tetheric:intro-done", start);
        if (progressEvent) window.removeEventListener(progressEvent, onProgress);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("resize", resize);
        host.removeEventListener("pointerdown", burst);
        observer.disconnect();
        trigger?.kill();
        assemble.kill();
        gsap.killTweensOf(state);
        scene.dispose();
        engine.dispose();
      };
    })().catch((error) => console.warn("Brand core unavailable", error));

    return () => { disposed = true; teardown(); };
  }, [anchor, progressEvent]);

  return <canvas ref={canvasRef} className={`brand-core ${className}`} aria-hidden="true" />;
}
