"use client";

import { useEffect, useRef } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import "@babylonjs/core/Culling/ray";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import "@babylonjs/core/Rendering/edgesRenderer";
import type { RuntimeFrame } from "./runtime";
import { useCinematicRuntime } from "./runtime";

type MaterialSet = {
  obsidian: PBRMaterial;
  graphite: PBRMaterial;
  titanium: PBRMaterial;
  rubber: PBRMaterial;
  board: PBRMaterial;
  signal: PBRMaterial;
  glass: PBRMaterial;
  floor: PBRMaterial;
};

type CameraAnchor = { position: Vector3; target: Vector3 };

const CAMERA_PATH: CameraAnchor[] = [
  { position: new Vector3(0, 2, 19), target: new Vector3(0, 0, 10) },
  { position: new Vector3(7, 4.5, 12), target: new Vector3(0, 0, 2) },
  { position: new Vector3(-2, 6, 5), target: new Vector3(-10, 0, -6) },
  { position: new Vector3(17, 5, -2), target: new Vector3(10, 0, -12) },
  { position: new Vector3(8, 6, -9), target: new Vector3(0, -1, -20) },
  { position: new Vector3(-1, 4.5, -16), target: new Vector3(-9, 0, -28) },
  { position: new Vector3(10, 5.5, -24), target: new Vector3(0, 0, -38) },
  { position: new Vector3(18, 5, -34), target: new Vector3(10, 0, -46) },
  { position: new Vector3(7, 4.5, -28), target: new Vector3(0, 1.3, -38) },
  { position: new Vector3(8, 7, -47), target: new Vector3(0, 0, -58) },
  { position: new Vector3(-7, 4, -29), target: new Vector3(0, 0, -38) },
  { position: new Vector3(9, 9, -59), target: new Vector3(0, 0, -72) },
  { position: new Vector3(14, 11, -44), target: new Vector3(0, 0, -55) },
  { position: new Vector3(-8, 8, -29), target: new Vector3(0, 0, -42) },
  { position: new Vector3(0, 15, -27), target: new Vector3(0, 0, -50) },
];

function smooth(value: number) {
  const x = Math.min(1, Math.max(0, value));
  return x * x * (3 - 2 * x);
}

function pbr(scene: Scene, name: string, color: string, metallic: number, roughness: number, emissive?: string) {
  const material = new PBRMaterial(name, scene);
  material.albedoColor = Color3.FromHexString(color);
  material.metallic = metallic;
  material.roughness = roughness;
  if (emissive) material.emissiveColor = Color3.FromHexString(emissive);
  return material;
}

function materials(scene: Scene): MaterialSet {
  return {
    obsidian: pbr(scene, "Obsidian anodized alloy", "#101315", 0.92, 0.24),
    graphite: pbr(scene, "Graphite ceramic", "#2b3034", 0.62, 0.34),
    titanium: pbr(scene, "Micro-brushed titanium", "#697176", 0.98, 0.20),
    rubber: pbr(scene, "Vibration isolator", "#070808", 0.02, 0.94),
    board: pbr(scene, "Compute substrate", "#154a3c", 0.16, 0.43),
    signal: pbr(scene, "Tetherics signal", "#9c160f", 0.34, 0.18, "#ff2f1f"),
    glass: pbr(scene, "Optical glass", "#06212a", 0.24, 0.06, "#0a4555"),
    floor: pbr(scene, "Studio floor", "#090b0d", 0.54, 0.31),
  };
}

function inspectable(mesh: Mesh, id: string, shadow?: ShadowGenerator) {
  mesh.metadata = { inspectId: id };
  mesh.enableEdgesRendering(0.995);
  mesh.edgesWidth = 0.38;
  mesh.edgesColor = new Color4(0.92, 0.90, 0.86, 0.10);
  shadow?.addShadowCaster(mesh);
  return mesh;
}

function box(scene: Scene, parent: TransformNode, name: string, size: Vector3, position: Vector3, material: PBRMaterial, id?: string, shadow?: ShadowGenerator) {
  const mesh = MeshBuilder.CreateBox(name, { width: size.x, height: size.y, depth: size.z }, scene);
  mesh.position.copyFrom(position);
  mesh.material = material;
  mesh.parent = parent;
  mesh.receiveShadows = true;
  if (id) inspectable(mesh, id, shadow);
  return mesh;
}

function cylinder(scene: Scene, parent: TransformNode, name: string, diameter: number, height: number, position: Vector3, material: PBRMaterial, rotation = Vector3.Zero(), id?: string, shadow?: ShadowGenerator) {
  const mesh = MeshBuilder.CreateCylinder(name, { diameter, height, tessellation: 96, subdivisions: 6 }, scene);
  mesh.position.copyFrom(position);
  mesh.rotation.copyFrom(rotation);
  mesh.material = material;
  mesh.parent = parent;
  if (id) inspectable(mesh, id, shadow);
  return mesh;
}

function sphere(scene: Scene, parent: TransformNode, name: string, diameter: number, position: Vector3, material: PBRMaterial, id?: string, shadow?: ShadowGenerator) {
  const mesh = MeshBuilder.CreateSphere(name, { diameter, segments: 64 }, scene);
  mesh.position.copyFrom(position);
  mesh.material = material;
  mesh.parent = parent;
  if (id) inspectable(mesh, id, shadow);
  return mesh;
}

function tube(scene: Scene, parent: TransformNode, name: string, path: Vector3[], radius: number, material: PBRMaterial, id?: string) {
  const mesh = MeshBuilder.CreateTube(name, { path, radius, tessellation: 32, cap: Mesh.CAP_ALL }, scene);
  mesh.material = material;
  mesh.parent = parent;
  if (id) inspectable(mesh, id);
  return mesh;
}

function buildSignal(scene: Scene, mat: MaterialSet) {
  const root = new TransformNode("Signal station", scene);
  root.position.z = 10;
  sphere(scene, root, "Signal origin", 0.58, Vector3.Zero(), mat.signal, "signal");
  for (let index = 0; index < 5; index += 1) {
    const ring = MeshBuilder.CreateTorus(`Signal orbit ${index}`, { diameter: 1.5 + index * 0.72, thickness: 0.025, tessellation: 128 }, scene);
    ring.material = mat.signal;
    ring.rotation.x = Math.PI / 2;
    ring.rotation.y = index * 0.31;
    ring.parent = root;
    inspectable(ring, "signal");
  }
  return root;
}

function buildPipeline(scene: Scene, mat: MaterialSet) {
  const root = new TransformNode("Software pipeline station", scene);
  root.position.z = 2;
  const ids = ["observe", "model", "reason", "orchestrate", "act"];
  ids.forEach((id, index) => {
    const x = (index - 2) * 2.15;
    box(scene, root, `${id} compute cell`, new Vector3(1.45, 1.05, 1.45), new Vector3(x, 0, 0), index === 4 ? mat.signal : mat.graphite, id);
    sphere(scene, root, `${id} state core`, 0.28, new Vector3(x, 0, 0.82), mat.signal, id);
    if (index < ids.length - 1) tube(scene, root, `${id} command path`, [new Vector3(x + 0.75, 0, 0), new Vector3(x + 1.4, 0.45, 0), new Vector3(x + 2.15 - 0.75, 0, 0)], 0.035, mat.signal, id);
  });
  return root;
}

function buildTopology(scene: Scene, mat: MaterialSet) {
  const root = new TransformNode("Intelligence topology station", scene);
  root.position = new Vector3(-10, 0, -6);
  const roles = ["perception", "state", "memory", "reason", "control", "feedback"];
  const points = Array.from({ length: 24 }, (_, index) => {
    const angle = index * 2.399963;
    const radius = 1.2 + (index % 6) * 0.58;
    return new Vector3(Math.cos(angle) * radius, ((index * 7) % 9 - 4) * 0.32, Math.sin(angle) * radius * 0.62);
  });
  points.forEach((point, index) => {
    sphere(scene, root, `Topology ${roles[index % roles.length]} ${index}`, index % 6 === 0 ? 0.34 : 0.17, point, index % 6 === 0 ? mat.signal : mat.titanium, roles[index % roles.length]);
    if (index > 0) tube(scene, root, `Topology relation ${index}`, [points[index - 1], point], 0.018, index % 4 === 0 ? mat.signal : mat.graphite, roles[index % roles.length]);
  });
  return root;
}

function buildSeerflow(scene: Scene, mat: MaterialSet) {
  const root = new TransformNode("SeerFlow station", scene);
  root.position = new Vector3(10, 0, -12);
  const ids = ["orders", "inventory", "payments", "settlements", "shipments", "forecasting", "alerts", "actions"];
  cylinder(scene, root, "SeerFlow state core", 2.3, 0.72, new Vector3(0, 0, 0), mat.obsidian, Vector3.Zero(), "seerflow");
  sphere(scene, root, "SeerFlow signal core", 0.7, new Vector3(0, 0.62, 0), mat.signal, "seerflow");
  ids.forEach((id, index) => {
    const angle = (index / ids.length) * Math.PI * 2;
    const point = new Vector3(Math.cos(angle) * 3.3, -0.2 + (index % 3) * 0.22, Math.sin(angle) * 3.3);
    cylinder(scene, root, `SeerFlow ${id}`, 0.72, 1.15 + (index % 3) * 0.35, point, index === 6 ? mat.signal : mat.graphite, Vector3.Zero(), id);
    tube(scene, root, `SeerFlow relation ${id}`, [new Vector3(0, 0.2, 0), point], 0.025, index % 3 === 0 ? mat.signal : mat.titanium, "seerflow");
  });
  return root;
}

function buildDatabase(scene: Scene, mat: MaterialSet) {
  const root = new TransformNode("Database chamber station", scene);
  root.position = new Vector3(0, -0.5, -20);
  for (let level = 0; level < 6; level += 1) {
    box(scene, root, `Database slab ${level}`, new Vector3(7.2 - level * 0.35, 0.46, 4.6 - level * 0.15), new Vector3(0, level * 0.72, -level * 0.18), level === 4 ? mat.signal : level % 2 ? mat.graphite : mat.obsidian, "database");
  }
  for (let index = 0; index < 10; index += 1) {
    box(scene, root, `Database index ${index}`, new Vector3(0.10, 3.7, 0.10), new Vector3(-3.2 + index * 0.7, 2.2, 2.1), index % 4 === 0 ? mat.signal : mat.titanium, "database");
  }
  return root;
}

function buildBoard(scene: Scene, mat: MaterialSet) {
  const root = new TransformNode("Physical boundary station", scene);
  root.position = new Vector3(-9, 0, -28);
  box(scene, root, "Physical compute substrate", new Vector3(8.6, 0.34, 5.2), Vector3.Zero(), mat.board, "compute");
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 6; column += 1) {
      const id = column < 2 ? "sensors" : column < 4 ? "compute" : "control";
      box(scene, root, `Boundary module ${row}-${column}`, new Vector3(0.74, 0.36, 0.56), new Vector3(-3.0 + column * 1.2, 0.34, -1.55 + row * 1.52), (row + column) % 8 === 0 ? mat.signal : mat.obsidian, id);
    }
  }
  for (let index = 0; index < 8; index += 1) {
    tube(scene, root, `Circuit trace ${index}`, [new Vector3(-3.6, 0.23, -2.2 + index * 0.62), new Vector3(-0.6 + index * 0.35, 0.23, -2.2 + index * 0.62), new Vector3(3.6, 0.23, 1.9 - index * 0.42)], 0.027, index % 3 === 0 ? mat.signal : mat.titanium, "compute");
  }
  return root;
}

function buildMachine(scene: Scene, mat: MaterialSet, shadow: ShadowGenerator) {
  const root = new TransformNode("TS-MACHINE-01", scene);
  root.position = new Vector3(0, 0, -38);
  box(scene, root, "Isolation plinth", new Vector3(7.1, 0.42, 4.3), new Vector3(0, -1.58, 0), mat.rubber, "machine", shadow);
  box(scene, root, "Structural base", new Vector3(6.55, 0.54, 3.85), new Vector3(0, -1.31, 0), mat.obsidian, "machine", shadow);
  box(scene, root, "Base signal reveal", new Vector3(5.95, 0.08, 3.38), new Vector3(0, -0.98, 0), mat.signal, "machine");
  box(scene, root, "Actuator enclosure", new Vector3(5.05, 1.88, 3.2), new Vector3(-0.38, 0, 0), mat.obsidian, "machine", shadow);
  box(scene, root, "Service face", new Vector3(3.72, 1.08, 0.12), new Vector3(-0.62, -0.12, 1.64), mat.graphite, "actuation", shadow);
  box(scene, root, "Telemetry rail", new Vector3(2.78, 0.045, 0.025), new Vector3(-0.58, 0.20, 1.72), mat.signal, "control");
  cylinder(scene, root, "Direct drive actuator", 1.40, 1.62, new Vector3(-1.53, -0.08, 1.60), mat.titanium, new Vector3(Math.PI / 2, 0, 0), "actuation", shadow);
  cylinder(scene, root, "Actuator end cap", 1.16, 0.10, new Vector3(-1.53, -0.08, 2.42), mat.obsidian, new Vector3(Math.PI / 2, 0, 0), "actuation", shadow);
  sphere(scene, root, "Actuator status", 0.17, new Vector3(-1.53, -0.08, 2.50), mat.signal, "actuation");
  for (let index = 0; index < 8; index += 1) box(scene, root, `Thermal vent ${index}`, new Vector3(0.095, 0.56, 0.055), new Vector3(-1.08 + index * 0.30, -0.22, 1.72), mat.rubber, "actuation");
  box(scene, root, "Compute deck", new Vector3(3.72, 0.38, 2.32), new Vector3(-0.42, 1.13, -0.02), mat.graphite, "compute", shadow);
  box(scene, root, "Compute substrate", new Vector3(3.24, 0.08, 1.86), new Vector3(-0.42, 1.36, -0.02), mat.board, "compute");
  for (let row = 0; row < 2; row += 1) for (let column = 0; column < 5; column += 1) box(scene, root, `Compute module ${row}-${column}`, new Vector3(0.34, 0.13, 0.30), new Vector3(-1.55 + column * 0.56, 1.47, -0.45 + row * 0.72), row === 1 && column === 4 ? mat.signal : mat.obsidian, "compute");
  cylinder(scene, root, "Perception mast", 0.86, 1.18, new Vector3(-0.46, 2.06, 0), mat.graphite, Vector3.Zero(), "perception", shadow);
  box(scene, root, "Sensor crown", new Vector3(1.24, 0.24, 1.05), new Vector3(-0.46, 2.69, 0), mat.obsidian, "perception", shadow);
  cylinder(scene, root, "Optical barrel", 0.68, 0.28, new Vector3(-0.46, 2.12, 0.56), mat.titanium, new Vector3(Math.PI / 2, 0, 0), "perception", shadow);
  sphere(scene, root, "Optical aperture", 0.50, new Vector3(-0.46, 2.12, 0.73), mat.glass, "perception");

  const shoulder = new TransformNode("Shoulder rig", scene);
  shoulder.parent = root;
  shoulder.position = new Vector3(2.28, 0.41, 0);
  shoulder.rotation.z = -0.56;
  cylinder(scene, shoulder, "Shoulder joint", 1.50, 0.82, Vector3.Zero(), mat.obsidian, new Vector3(Math.PI / 2, 0, 0), "control", shadow);
  const upper = MeshBuilder.CreateCapsule("Upper arm", { radius: 0.36, height: 3.52, tessellation: 64, subdivisions: 12 }, scene);
  upper.position.y = 1.88;
  upper.material = mat.graphite;
  upper.parent = shoulder;
  inspectable(upper, "actuation", shadow);
  box(scene, shoulder, "Upper arm spine", new Vector3(0.20, 2.72, 0.80), new Vector3(0.10, 1.88, 0), mat.titanium, "actuation", shadow);
  const elbow = new TransformNode("Elbow rig", scene);
  elbow.parent = shoulder;
  elbow.position.y = 3.58;
  elbow.rotation.z = 1.08;
  cylinder(scene, elbow, "Elbow joint", 1.30, 0.86, Vector3.Zero(), mat.obsidian, new Vector3(Math.PI / 2, 0, 0), "control", shadow);
  const forearm = MeshBuilder.CreateCapsule("Forearm", { radius: 0.31, height: 2.72, tessellation: 64, subdivisions: 12 }, scene);
  forearm.position.y = 1.50;
  forearm.material = mat.titanium;
  forearm.parent = elbow;
  inspectable(forearm, "actuation", shadow);
  cylinder(scene, elbow, "Wrist", 0.96, 0.64, new Vector3(0, 2.85, 0), mat.graphite, new Vector3(Math.PI / 2, 0, 0), "control", shadow);
  box(scene, elbow, "Tool cassette", new Vector3(1.12, 0.72, 0.84), new Vector3(0, 3.36, 0), mat.obsidian, "actuation", shadow);
  box(scene, elbow, "Tool signal", new Vector3(0.52, 0.05, 0.12), new Vector3(0, 3.28, 0.47), mat.signal, "actuation");
  box(scene, elbow, "Left gripper", new Vector3(0.22, 0.86, 0.28), new Vector3(-0.30, 4.12, 0), mat.titanium, "actuation", shadow);
  box(scene, elbow, "Right gripper", new Vector3(0.22, 0.86, 0.28), new Vector3(0.30, 4.12, 0), mat.titanium, "actuation", shadow);
  return { root, shoulder, elbow };
}

function buildPerception(scene: Scene, mat: MaterialSet) {
  const root = new TransformNode("Perception field station", scene);
  root.position = new Vector3(10, 0, -46);
  const cone = MeshBuilder.CreateCylinder("Perception frustum", { diameterTop: 0.3, diameterBottom: 7.4, height: 9, tessellation: 64, subdivisions: 4 }, scene);
  cone.rotation.x = Math.PI / 2;
  cone.position.z = -1.5;
  cone.material = mat.glass;
  (cone.material as PBRMaterial).alpha = 0.15;
  cone.parent = root;
  inspectable(cone, "perception");
  for (let index = 0; index < 48; index += 1) {
    const angle = index * 1.71;
    const depth = 1.2 + (index % 12) * 0.52;
    sphere(scene, root, `Depth sample ${index}`, 0.07 + (index % 4) * 0.025, new Vector3(Math.cos(angle) * depth * 0.45, Math.sin(angle * 1.4) * depth * 0.28, -depth), index % 9 === 0 ? mat.signal : mat.titanium, "perception");
  }
  return root;
}

function buildFeedback(scene: Scene, mat: MaterialSet) {
  const root = new TransformNode("Feedback station", scene);
  root.position = new Vector3(0, 0, -58);
  const ids = ["environment", "sensing", "perception", "state", "decision", "control", "action"];
  ids.forEach((id, index) => {
    const angle = (index / ids.length) * Math.PI * 2;
    const point = new Vector3(Math.cos(angle) * 4.2, Math.sin(angle) * 2.7, Math.sin(angle * 2) * 1.3);
    sphere(scene, root, `Feedback ${id}`, index === 0 ? 0.72 : 0.38, point, index === 0 ? mat.signal : mat.titanium, id);
    const nextAngle = ((index + 1) / ids.length) * Math.PI * 2;
    tube(scene, root, `Feedback path ${id}`, [point, new Vector3(Math.cos(nextAngle) * 4.2, Math.sin(nextAngle) * 2.7, Math.sin(nextAngle * 2) * 1.3)], 0.035, index % 2 ? mat.signal : mat.graphite, id);
  });
  const orbit = MeshBuilder.CreateTorus("Feedback orbit", { diameter: 9.2, thickness: 0.035, tessellation: 192 }, scene);
  orbit.material = mat.signal;
  orbit.rotation.x = Math.PI / 2;
  orbit.parent = root;
  inspectable(orbit, "feedback");
  return root;
}

function buildScale(scene: Scene, mat: MaterialSet) {
  const root = new TransformNode("Recursive scale station", scene);
  root.position = new Vector3(0, -1, -72);
  for (let row = 0; row < 5; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      const scale = 0.34 + ((row + column) % 4) * 0.10;
      const node = box(scene, root, `Scale system ${row}-${column}`, new Vector3(1.8 * scale, 0.8 * scale, 1.25 * scale), new Vector3((column - 3.5) * 1.55, row * 0.36, (row - 2) * 1.35), (row * 8 + column) % 11 === 0 ? mat.signal : mat.obsidian, "scale");
      node.rotation.y = (row + column) * 0.21;
    }
  }
  return root;
}

export function InteractiveSystemWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { inspect } = useCinematicRuntime();
  const inspectRef = useRef(inspect);
  inspectRef.current = inspect;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.dispatchEvent(new Event("tetherics:3d-unavailable"));
      return;
    }

    let engine: Engine | null = null;
    let scene: Scene | null = null;
    let resize: (() => void) | null = null;
    let removeInput: (() => void) | null = null;

    try {
      engine = new Engine(canvas, true, { antialias: true, stencil: true, preserveDrawingBuffer: false, adaptToDeviceRatio: true }, true);
      engine.setHardwareScalingLevel(Math.max(1 / Math.min(window.devicePixelRatio || 1, 2), window.innerWidth < 700 ? 0.72 : 0.5));
      scene = new Scene(engine);
      scene.clearColor = new Color4(0.006, 0.008, 0.009, 1);
      scene.ambientColor = new Color3(0.06, 0.075, 0.09);
      scene.fogMode = Scene.FOGMODE_EXP2;
      scene.fogDensity = 0.012;
      scene.fogColor = new Color3(0.006, 0.008, 0.009);
      const mat = materials(scene);

      const camera = new FreeCamera("Cinematic camera", CAMERA_PATH[0].position.clone(), scene);
      camera.minZ = 0.08;
      camera.maxZ = 220;
      camera.fov = 0.72;
      camera.setTarget(CAMERA_PATH[0].target);
      scene.activeCamera = camera;

      const hemi = new HemisphericLight("Studio ambient", new Vector3(0.2, 1, 0.1), scene);
      hemi.intensity = 0.72;
      hemi.diffuse = new Color3(0.45, 0.55, 0.66);
      hemi.groundColor = new Color3(0.02, 0.025, 0.03);
      const key = new DirectionalLight("Cold key", new Vector3(-0.5, -1, -0.45), scene);
      key.position = new Vector3(12, 18, 12);
      key.intensity = 3.2;
      key.diffuse = new Color3(0.72, 0.82, 0.96);
      const rim = new PointLight("Signal rim", new Vector3(-6, 5, -38), scene);
      rim.diffuse = Color3.FromHexString("#ff2f1f");
      rim.intensity = 420;
      rim.range = 26;
      const shadow = new ShadowGenerator(2048, key);
      shadow.usePercentageCloserFiltering = true;
      shadow.filteringQuality = ShadowGenerator.QUALITY_HIGH;

      const floorRoot = new TransformNode("World floor", scene);
      const worldFloor = box(scene, floorRoot, "World floor", new Vector3(48, 0.12, 102), new Vector3(0, -1.84, -31), mat.floor);
      worldFloor.receiveShadows = true;
      for (let index = -18; index <= 18; index += 1) {
        box(scene, floorRoot, `Grid X ${index}`, new Vector3(0.012, 0.014, 100), new Vector3(index * 1.35, -1.76, -31), index % 5 === 0 ? mat.signal : mat.graphite);
      }
      for (let index = -4; index <= 48; index += 1) {
        box(scene, floorRoot, `Grid Z ${index}`, new Vector3(46, 0.014, 0.012), new Vector3(0, -1.76, 10 - index * 1.55), index % 8 === 0 ? mat.signal : mat.graphite);
      }

      const signalRoot = buildSignal(scene, mat);
      const pipelineRoot = buildPipeline(scene, mat);
      const topologyRoot = buildTopology(scene, mat);
      const seerflowRoot = buildSeerflow(scene, mat);
      const databaseRoot = buildDatabase(scene, mat);
      const boardRoot = buildBoard(scene, mat);
      const machine = buildMachine(scene, mat, shadow);
      const perceptionRoot = buildPerception(scene, mat);
      const feedbackRoot = buildFeedback(scene, mat);
      const scaleRoot = buildScale(scene, mat);
      const stationRoots = [signalRoot, pipelineRoot, topologyRoot, seerflowRoot, databaseRoot, boardRoot, machine.root, perceptionRoot, machine.root, feedbackRoot, machine.root, scaleRoot, topologyRoot, machine.root, scaleRoot];

      const glow = new GlowLayer("Signal bloom", scene, { blurKernelSize: 48 });
      glow.intensity = 0.48;
      const highlight = new HighlightLayer("Inspectable highlight", scene, { blurHorizontalSize: 1.1, blurVerticalSize: 1.1 });
      const pipeline = new DefaultRenderingPipeline("Cinematic PBR", true, scene, [camera]);
      pipeline.samples = window.innerWidth < 700 ? 2 : 4;
      pipeline.fxaaEnabled = true;
      pipeline.bloomEnabled = true;
      pipeline.bloomThreshold = 0.72;
      pipeline.bloomWeight = 0.24;
      pipeline.bloomKernel = 58;
      pipeline.sharpenEnabled = true;
      pipeline.sharpen.edgeAmount = 0.18;
      pipeline.imageProcessingEnabled = true;
      pipeline.imageProcessing.contrast = 1.22;
      pipeline.imageProcessing.exposure = 1.06;
      pipeline.chromaticAberrationEnabled = false;
      pipeline.grainEnabled = true;
      pipeline.grain.intensity = 5;

      let frame: RuntimeFrame = { scene: "signal", sceneIndex: 0, localProgress: 0, globalProgress: 0, velocity: 0, pointerX: 0, pointerY: 0, direction: 1 };
      let target = CAMERA_PATH[0].target.clone();
      const onFrame = (event: WindowEventMap["tetherics:frame"]) => { frame = event.detail; };
      window.addEventListener("tetherics:frame", onFrame);

      let drag: { x: number; y: number; moved: boolean } | null = null;
      let hovered: Mesh | null = null;
      const isInterface = (targetElement: EventTarget | null) => targetElement instanceof Element && Boolean(targetElement.closest("button, a, input, textarea, select, [role='dialog'], [role='button'], .topology-field"));
      const pickAt = (x: number, y: number) => scene?.pick(x, y, (candidate) => Boolean((candidate as Mesh).metadata?.inspectId), false, camera);
      const pointerMove = (event: PointerEvent) => {
        if (drag && (event.buttons & 1) === 1 && !isInterface(event.target)) {
          const dx = event.clientX - drag.x;
          const dy = event.clientY - drag.y;
          if (Math.abs(dx) + Math.abs(dy) > 2) drag.moved = true;
          const root = stationRoots[Math.min(frame.sceneIndex, stationRoots.length - 1)];
          root.rotation.y += dx * 0.0035;
          root.rotation.x = Math.max(-0.16, Math.min(0.16, root.rotation.x + dy * 0.0018));
          drag.x = event.clientX;
          drag.y = event.clientY;
          return;
        }
        if (isInterface(event.target)) return;
        const result = pickAt(event.clientX, event.clientY);
        const mesh = result?.hit ? result.pickedMesh as Mesh : null;
        if (mesh === hovered) return;
        highlight.removeAllMeshes();
        hovered = mesh;
        if (mesh) highlight.addMesh(mesh, Color3.FromHexString("#ef3d29"));
        document.documentElement.style.setProperty("--world-hover", mesh ? "1" : "0");
      };
      const pointerDown = (event: PointerEvent) => {
        if (!isInterface(event.target)) drag = { x: event.clientX, y: event.clientY, moved: false };
      };
      const pointerUp = (event: PointerEvent) => {
        if (!drag || isInterface(event.target)) { drag = null; return; }
        if (!drag.moved) {
          const result = pickAt(event.clientX, event.clientY);
          const id = result?.hit ? (result.pickedMesh as Mesh).metadata?.inspectId as string | undefined : undefined;
          if (id) inspectRef.current(id);
        }
        drag = null;
      };
      window.addEventListener("pointermove", pointerMove, { passive: true });
      window.addEventListener("pointerdown", pointerDown, { passive: true });
      window.addEventListener("pointerup", pointerUp, { passive: true });

      scene.onBeforeRenderObservable.add(() => {
        const index = Math.min(frame.sceneIndex, CAMERA_PATH.length - 1);
        const nextIndex = Math.min(index + 1, CAMERA_PATH.length - 1);
        const time = smooth(frame.localProgress);
        const desiredPosition = Vector3.Lerp(CAMERA_PATH[index].position, CAMERA_PATH[nextIndex].position, time * 0.42);
        const desiredTarget = Vector3.Lerp(CAMERA_PATH[index].target, CAMERA_PATH[nextIndex].target, time * 0.42);
        camera.position = Vector3.Lerp(camera.position, desiredPosition, 0.055);
        target = Vector3.Lerp(target, desiredTarget, 0.065);
        camera.setTarget(target);
        const seconds = performance.now() * 0.001;
        signalRoot.rotation.y = seconds * 0.18;
        topologyRoot.rotation.y += 0.00035;
        seerflowRoot.rotation.y -= 0.0007;
        feedbackRoot.rotation.y += 0.0012;
        machine.shoulder.rotation.z = -0.56 + Math.sin(seconds * 0.45) * 0.14;
        machine.elbow.rotation.z = 1.08 + Math.sin(seconds * 0.58 + 0.8) * 0.22;
        const recovery = frame.sceneIndex === 10;
        rim.intensity = recovery ? 680 + Math.sin(seconds * 9) * 260 : 420;
        rim.position.z = -38 + Math.sin(seconds * 0.25) * 2;
      });

      engine.runRenderLoop(() => scene?.render());
      resize = () => engine?.resize();
      window.addEventListener("resize", resize);
      document.documentElement.classList.add("has-interactive-3d");
      window.dispatchEvent(new Event("tetherics:3d-ready"));

      removeInput = () => {
        window.removeEventListener("tetherics:frame", onFrame);
        window.removeEventListener("pointermove", pointerMove);
        window.removeEventListener("pointerdown", pointerDown);
        window.removeEventListener("pointerup", pointerUp);
      };
    } catch (error) {
      console.error("Interactive 3D world unavailable", error);
      window.dispatchEvent(new Event("tetherics:3d-unavailable"));
    }

    return () => {
      if (resize) window.removeEventListener("resize", resize);
      removeInput?.();
      document.documentElement.classList.remove("has-interactive-3d");
      document.documentElement.style.removeProperty("--world-hover");
      scene?.dispose();
      engine?.dispose();
    };
  }, []);

  return (
    <div className="interactive-system-world" aria-label="Interactive 3D Tetherics system world">
      <canvas ref={canvasRef} />
      <div className="interactive-system-world__grade" />
      <div className="interactive-system-world__help"><span>DRAG / ORBIT</span><span>CLICK COMPONENT / INSPECT</span><strong>REALTIME PBR / NO THREE.JS</strong></div>
    </div>
  );
}
