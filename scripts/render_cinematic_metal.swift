import AppKit
import SceneKit
import Metal

private let frameCount = 96
private let fps = 24.0

private func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> NSColor {
    NSColor(
        calibratedRed: CGFloat((hex >> 16) & 0xff) / 255,
        green: CGFloat((hex >> 8) & 0xff) / 255,
        blue: CGFloat(hex & 0xff) / 255,
        alpha: alpha
    )
}

private func material(
    _ name: String,
    color value: NSColor,
    metalness: CGFloat,
    roughness: CGFloat,
    emission: NSColor? = nil
) -> SCNMaterial {
    let result = SCNMaterial()
    result.name = name
    result.lightingModel = .physicallyBased
    result.diffuse.contents = value
    result.metalness.contents = metalness
    result.roughness.contents = roughness
    result.emission.contents = emission ?? NSColor.black
    return result
}

private let obsidian = material("Obsidian anodized alloy", color: color(0x111315), metalness: 0.92, roughness: 0.27)
private let graphite = material("Graphite ceramic", color: color(0x25292c), metalness: 0.60, roughness: 0.36)
private let titanium = material("Micro-brushed titanium", color: color(0x545b5f), metalness: 0.96, roughness: 0.22)
private let deepRubber = material("Vibration isolation", color: color(0x080909), metalness: 0.0, roughness: 0.92)
private let pcb = material("Compute substrate", color: color(0x12382f), metalness: 0.18, roughness: 0.46)
private let signal = material("Tetherics signal", color: color(0x8f120d), metalness: 0.35, roughness: 0.21, emission: color(0xff180f))
private let glass = material("Optical glass", color: color(0x07151b, 0.78), metalness: 0.1, roughness: 0.08, emission: color(0x092a34))
private let whiteInk = material("Industrial marking", color: color(0xd8d8d2), metalness: 0.2, roughness: 0.46)

private func box(
    _ name: String,
    _ width: CGFloat,
    _ height: CGFloat,
    _ length: CGFloat,
    radius: CGFloat,
    material: SCNMaterial,
    position: SCNVector3
) -> SCNNode {
    let geometry = SCNBox(width: width, height: height, length: length, chamferRadius: radius)
    geometry.chamferSegmentCount = 8
    geometry.materials = [material]
    let node = SCNNode(geometry: geometry)
    node.name = name
    node.position = position
    node.castsShadow = true
    return node
}

private func cylinder(
    _ name: String,
    radius: CGFloat,
    height: CGFloat,
    material: SCNMaterial,
    position: SCNVector3,
    rotation: SCNVector4 = SCNVector4(0, 0, 0, 0)
) -> SCNNode {
    let geometry = SCNCylinder(radius: radius, height: height)
    geometry.radialSegmentCount = 96
    geometry.heightSegmentCount = 8
    geometry.materials = [material]
    let node = SCNNode(geometry: geometry)
    node.name = name
    node.position = position
    node.rotation = rotation
    node.castsShadow = true
    return node
}

private func sphere(_ name: String, radius: CGFloat, material: SCNMaterial, position: SCNVector3) -> SCNNode {
    let geometry = SCNSphere(radius: radius)
    geometry.segmentCount = 128
    geometry.materials = [material]
    let node = SCNNode(geometry: geometry)
    node.name = name
    node.position = position
    node.castsShadow = true
    return node
}

private func label(_ string: String, size: CGFloat, position: SCNVector3) -> SCNNode {
    let geometry = SCNText(string: string, extrusionDepth: 0.008)
    geometry.font = NSFont.monospacedSystemFont(ofSize: size, weight: .semibold)
    geometry.flatness = 0.08
    geometry.chamferRadius = 0.002
    geometry.materials = [whiteInk]
    let node = SCNNode(geometry: geometry)
    let bounds = node.boundingBox
    node.pivot = SCNMatrix4MakeTranslation((bounds.max.x - bounds.min.x) / 2, 0, 0)
    node.scale = SCNVector3(0.14, 0.14, 0.14)
    node.position = position
    return node
}

struct Rig {
    let machine: SCNNode
    let shoulder: SCNNode
    let elbow: SCNNode
    let gripperLeft: SCNNode
    let gripperRight: SCNNode
    let signalCore: SCNNode
    let scaleField: SCNNode
    let camera: SCNNode
    let keyLight: SCNNode
}

private func makeScene() -> (SCNScene, Rig) {
    let scene = SCNScene()
    scene.background.contents = color(0x020303)
    scene.fogColor = color(0x030405)
    scene.fogStartDistance = 19
    scene.fogEndDistance = 42
    scene.fogDensityExponent = 1.2

    let floor = SCNFloor()
    floor.reflectivity = 0.09
    floor.reflectionFalloffStart = 3
    floor.reflectionFalloffEnd = 16
    floor.firstMaterial = material("Studio floor", color: color(0x090a0b), metalness: 0.5, roughness: 0.31)
    let floorNode = SCNNode(geometry: floor)
    floorNode.position.y = -1.84
    scene.rootNode.addChildNode(floorNode)

    let machine = SCNNode()
    machine.name = "TS-MACHINE-01"
    scene.rootNode.addChildNode(machine)

    machine.addChildNode(box("Isolation plinth", 7.1, 0.42, 4.3, radius: 0.16, material: deepRubber, position: SCNVector3(0, -1.58, 0)))
    machine.addChildNode(box("Structural base", 6.55, 0.54, 3.85, radius: 0.19, material: obsidian, position: SCNVector3(0, -1.31, 0)))
    machine.addChildNode(box("Base reveal", 5.95, 0.10, 3.38, radius: 0.04, material: signal, position: SCNVector3(0, -0.99, 0)))
    machine.addChildNode(box("Actuator enclosure", 5.05, 1.88, 3.20, radius: 0.31, material: obsidian, position: SCNVector3(-0.38, 0.00, 0)))
    machine.addChildNode(box("Service face", 3.72, 1.08, 0.12, radius: 0.08, material: graphite, position: SCNVector3(-0.62, -0.12, 1.64)))
    machine.addChildNode(box("Telemetry rail", 2.78, 0.045, 0.025, radius: 0.012, material: signal, position: SCNVector3(-0.58, 0.20, 1.72)))

    let motor = cylinder("Direct-drive actuator", radius: 0.70, height: 1.62, material: titanium, position: SCNVector3(-1.53, -0.08, 1.60), rotation: SCNVector4(1, 0, 0, CGFloat.pi / 2))
    machine.addChildNode(motor)
    machine.addChildNode(cylinder("Actuator end cap", radius: 0.58, height: 0.08, material: obsidian, position: SCNVector3(-1.53, -0.08, 2.42), rotation: SCNVector4(1, 0, 0, CGFloat.pi / 2)))
    machine.addChildNode(sphere("Actuator status", radius: 0.085, material: signal, position: SCNVector3(-1.53, -0.08, 2.48)))

    for index in 0..<8 {
        let x = -1.08 + Float(index) * 0.30
        machine.addChildNode(box("Thermal vent \(index)", 0.095, 0.56, 0.055, radius: 0.018, material: deepRubber, position: SCNVector3(x, -0.22, 1.72)))
    }
    for x in [-2.12 as Float, 0.88] {
        machine.addChildNode(cylinder("Service fastener", radius: 0.07, height: 0.035, material: titanium, position: SCNVector3(x, -0.51, 1.72), rotation: SCNVector4(1, 0, 0, CGFloat.pi / 2)))
    }

    let deck = box("Compute deck", 3.72, 0.38, 2.32, radius: 0.16, material: graphite, position: SCNVector3(-0.42, 1.13, -0.02))
    machine.addChildNode(deck)
    machine.addChildNode(box("Compute substrate", 3.24, 0.08, 1.86, radius: 0.035, material: pcb, position: SCNVector3(-0.42, 1.36, -0.02)))
    for row in 0..<2 {
        for column in 0..<5 {
            let chip = box("Compute module \(row)-\(column)", 0.34, 0.13, 0.30, radius: 0.035, material: (row == 1 && column == 4) ? signal : obsidian, position: SCNVector3(-1.55 + Float(column) * 0.56, 1.46, -0.45 + Float(row) * 0.72))
            machine.addChildNode(chip)
        }
    }

    let mast = cylinder("Perception mast", radius: 0.43, height: 1.18, material: graphite, position: SCNVector3(-0.46, 2.06, 0))
    machine.addChildNode(mast)
    machine.addChildNode(box("Sensor crown", 1.24, 0.24, 1.05, radius: 0.12, material: obsidian, position: SCNVector3(-0.46, 2.69, 0)))
    machine.addChildNode(cylinder("Optical barrel", radius: 0.34, height: 0.28, material: titanium, position: SCNVector3(-0.46, 2.12, 0.56), rotation: SCNVector4(1, 0, 0, CGFloat.pi / 2)))
    machine.addChildNode(sphere("Optical aperture", radius: 0.25, material: glass, position: SCNVector3(-0.46, 2.12, 0.73)))
    machine.addChildNode(sphere("Sensor tally", radius: 0.055, material: signal, position: SCNVector3(-0.08, 2.49, 0.53)))

    let shoulder = cylinder("Shoulder joint", radius: 0.75, height: 0.82, material: obsidian, position: SCNVector3(2.28, 0.41, 0), rotation: SCNVector4(1, 0, 0, CGFloat.pi / 2))
    machine.addChildNode(shoulder)
    let upperArm = box("Upper arm", 0.66, 3.52, 0.80, radius: 0.29, material: graphite, position: SCNVector3(0, 1.88, 0))
    shoulder.addChildNode(upperArm)
    upperArm.addChildNode(box("Upper arm spine", 0.22, 2.74, 0.84, radius: 0.10, material: titanium, position: SCNVector3(0.10, 0, 0)))
    let elbow = cylinder("Elbow joint", radius: 0.66, height: 0.86, material: obsidian, position: SCNVector3(0, 3.58, 0), rotation: SCNVector4(1, 0, 0, CGFloat.pi / 2))
    shoulder.addChildNode(elbow)
    let forearm = box("Forearm", 0.58, 2.72, 0.70, radius: 0.25, material: titanium, position: SCNVector3(0, 1.52, 0))
    elbow.addChildNode(forearm)
    forearm.addChildNode(box("Forearm inset", 0.32, 2.06, 0.73, radius: 0.12, material: obsidian, position: SCNVector3(-0.07, 0, 0)))
    let wrist = cylinder("Wrist", radius: 0.48, height: 0.64, material: graphite, position: SCNVector3(0, 2.88, 0), rotation: SCNVector4(1, 0, 0, CGFloat.pi / 2))
    elbow.addChildNode(wrist)
    wrist.addChildNode(box("Tool cassette", 1.12, 0.72, 0.84, radius: 0.20, material: obsidian, position: SCNVector3(0, 0.55, 0)))
    wrist.addChildNode(box("Tool status", 0.52, 0.05, 0.12, radius: 0.025, material: signal, position: SCNVector3(0, 0.48, 0.47)))
    let gripperLeft = box("Left gripper", 0.22, 0.86, 0.28, radius: 0.08, material: titanium, position: SCNVector3(-0.28, 1.16, 0))
    let gripperRight = box("Right gripper", 0.22, 0.86, 0.28, radius: 0.08, material: titanium, position: SCNVector3(0.28, 1.16, 0))
    wrist.addChildNode(gripperLeft)
    wrist.addChildNode(gripperRight)

    machine.addChildNode(label("TETHERICS / TS-01", size: 1.0, position: SCNVector3(-0.55, 0.54, 1.72)))
    machine.addChildNode(label("AUTONOMOUS SYSTEM", size: 0.42, position: SCNVector3(-0.55, 0.38, 1.72)))

    let signalCore = SCNNode()
    signalCore.name = "Signal origin"
    signalCore.addChildNode(sphere("Signal core", radius: 0.30, material: signal, position: SCNVector3Zero))
    for index in 0..<4 {
        let torus = SCNTorus(ringRadius: 0.62 + CGFloat(index) * 0.34, pipeRadius: 0.012)
        torus.ringSegmentCount = 160
        torus.pipeSegmentCount = 24
        torus.materials = [signal]
        let ring = SCNNode(geometry: torus)
        ring.eulerAngles = SCNVector3(Float.pi / 2, Float(index) * 0.28, 0)
        signalCore.addChildNode(ring)
    }
    signalCore.position = SCNVector3(0, 0.2, 2.5)
    scene.rootNode.addChildNode(signalCore)

    let scaleField = SCNNode()
    scaleField.name = "Recursive scale field"
    for row in 0..<4 {
        for column in 0..<7 {
            let index = row * 7 + column
            let node = box("Scale node \(index)", 0.74, 0.34, 0.54, radius: 0.10, material: index % 9 == 0 ? signal : obsidian, position: SCNVector3(Float(column - 3) * 1.25, -1.50 + Float(index % 3) * 0.10, -4.2 - Float(row) * 1.45))
            scaleField.addChildNode(node)
        }
    }
    scene.rootNode.addChildNode(scaleField)

    let camera = SCNNode()
    let cameraObject = SCNCamera()
    cameraObject.fieldOfView = 58
    cameraObject.focalLength = 43
    cameraObject.sensorHeight = 24
    cameraObject.wantsHDR = true
    cameraObject.exposureOffset = 0.15
    cameraObject.minimumExposure = -2.2
    cameraObject.maximumExposure = 2.2
    cameraObject.bloomIntensity = 0.52
    cameraObject.bloomThreshold = 0.74
    cameraObject.bloomBlurRadius = 13
    cameraObject.vignettingIntensity = 0.72
    cameraObject.vignettingPower = 1.35
    cameraObject.wantsDepthOfField = true
    cameraObject.focusDistance = 18
    cameraObject.fStop = 5.6
    camera.camera = cameraObject
    camera.position = SCNVector3(10.2, 5.8, 21.5)
    scene.rootNode.addChildNode(camera)
    camera.look(at: SCNVector3(-0.1, 0.2, 0))

    let ambient = SCNLight()
    ambient.type = .ambient
    ambient.color = color(0x1a2330)
    ambient.intensity = 285
    let ambientNode = SCNNode()
    ambientNode.light = ambient
    scene.rootNode.addChildNode(ambientNode)

    let key = SCNLight()
    key.type = .spot
    key.color = color(0xd8e4f2)
    key.intensity = 1_250
    key.spotInnerAngle = 32
    key.spotOuterAngle = 78
    key.castsShadow = true
    key.shadowRadius = 18
    key.shadowSampleCount = 64
    let keyNode = SCNNode()
    keyNode.light = key
    keyNode.position = SCNVector3(-5, 8, 7)
    keyNode.look(at: SCNVector3(0, 0, 0))
    scene.rootNode.addChildNode(keyNode)

    let rim = SCNLight()
    rim.type = .spot
    rim.color = color(0xff2418)
    rim.intensity = 1_180
    rim.spotInnerAngle = 38
    rim.spotOuterAngle = 88
    let rimNode = SCNNode()
    rimNode.light = rim
    rimNode.position = SCNVector3(6, 5, -5)
    rimNode.look(at: SCNVector3(0, 0, 0))
    scene.rootNode.addChildNode(rimNode)

    let fill = SCNLight()
    fill.type = .omni
    fill.color = color(0x47627c)
    fill.intensity = 620
    let fillNode = SCNNode()
    fillNode.light = fill
    fillNode.position = SCNVector3(-5, 1, 3)
    scene.rootNode.addChildNode(fillNode)

    return (scene, Rig(machine: machine, shoulder: shoulder, elbow: elbow, gripperLeft: gripperLeft, gripperRight: gripperRight, signalCore: signalCore, scaleField: scaleField, camera: camera, keyLight: keyNode))
}

private func smooth(_ value: Double) -> Double {
    let x = min(max(value, 0), 1)
    return x * x * (3 - 2 * x)
}

private func mix(_ a: CGFloat, _ b: CGFloat, _ t: Double) -> CGFloat {
    a + (b - a) * CGFloat(smooth(t))
}

private func mix(_ a: SCNVector3, _ b: SCNVector3, _ t: Double) -> SCNVector3 {
    SCNVector3(mix(a.x, b.x, t), mix(a.y, b.y, t), mix(a.z, b.z, t))
}

private func animate(_ rig: Rig, progress: Double) {
    let reveal = smooth((progress - 0.08) / 0.18)
    rig.machine.opacity = CGFloat(reveal)
    rig.machine.position.y = CGFloat((1 - reveal) * -0.65)
    rig.signalCore.opacity = CGFloat(1 - smooth((progress - 0.12) / 0.20))
    rig.signalCore.scale = SCNVector3(CGFloat(0.7 + progress * 0.8), CGFloat(0.7 + progress * 0.8), CGFloat(0.7 + progress * 0.8))
    rig.signalCore.eulerAngles.y = CGFloat(progress * .pi * 3.2)

    let arm = smooth((progress - 0.37) / 0.34)
    rig.shoulder.eulerAngles.z = mix(-0.56, -0.16, arm)
    rig.elbow.eulerAngles.z = mix(1.18, 0.56, arm)
    let grip = CGFloat(0.28 + 0.10 * sin(progress * .pi * 5))
    rig.gripperLeft.position.x = -grip
    rig.gripperRight.position.x = grip

    let scaleReveal = smooth((progress - 0.68) / 0.22)
    rig.scaleField.opacity = CGFloat(scaleReveal)
    rig.scaleField.position.z = CGFloat((1 - scaleReveal) * -2.2)

    let cameraA = SCNVector3(8.2, 4.7, 18.0)
    let cameraB = SCNVector3(-8.1, 5.2, 19.3)
    let cameraC = SCNVector3(8.4, 6.7, 22.0)
    if progress < 0.52 {
        rig.camera.position = mix(cameraA, cameraB, progress / 0.52)
    } else {
        rig.camera.position = mix(cameraB, cameraC, (progress - 0.52) / 0.48)
    }
    let target = SCNVector3(0, mix(0.15, 0.55, progress), mix(0.1, -1.0, progress))
    rig.camera.look(at: target)
    rig.keyLight.position.x = mix(-5.0, -2.5, progress)
}

private func save(_ image: NSImage, to url: URL) throws {
    guard let tiff = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: tiff),
          let data = bitmap.representation(using: .png, properties: [.compressionFactor: 0.86]) else {
        throw NSError(domain: "TethericsRender", code: 1, userInfo: [NSLocalizedDescriptionKey: "Unable to encode frame"])
    }
    try data.write(to: url, options: .atomic)
}

let arguments = CommandLine.arguments
guard arguments.count >= 2 else {
    fputs("Usage: render_cinematic_metal <output-directory> [frame]\n", stderr)
    exit(64)
}

let output = URL(fileURLWithPath: arguments[1], isDirectory: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
let selectedFrame = arguments.count >= 3 ? Int(arguments[2]) : nil
let frames = selectedFrame.map { [$0] } ?? Array(0..<frameCount)

guard let device = MTLCreateSystemDefaultDevice() else {
    fputs("No Metal device is available.\n", stderr)
    exit(69)
}

let (scene, rig) = makeScene()
let renderer = SCNRenderer(device: device, options: nil)
renderer.scene = scene
renderer.pointOfView = rig.camera
renderer.autoenablesDefaultLighting = false

if selectedFrame == nil {
    let modelURL = output.appendingPathComponent("tetherics-machine.scn")
    let wroteModel = scene.write(to: modelURL, options: nil, delegate: nil, progressHandler: nil)
    if !wroteModel {
        fputs("Unable to export the SceneKit model.\n", stderr)
        exit(74)
    }
    print("Exported \(modelURL.lastPathComponent)")
}

for frame in frames {
    let progress = Double(frame) / Double(frameCount - 1)
    animate(rig, progress: progress)
    let image = renderer.snapshot(atTime: Double(frame) / fps, with: CGSize(width: 3840, height: 2160), antialiasingMode: SCNAntialiasingMode.multisampling4X)
    let url = output.appendingPathComponent(String(format: "frame.%03d.png", frame + 1))
    try save(image, to: url)
    print("Rendered \(url.lastPathComponent) [3840x2160]")
}
