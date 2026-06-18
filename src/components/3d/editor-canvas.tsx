"use client"

import { Suspense, type ElementRef, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber"
import { ContactShadows, Html, OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei"
import * as THREE from "three"

interface Material {
  id: string
  name: string
  material: string
  color: string
  price: number
  x: number
  y: number
  z: number
  scale: number
  scaleX?: number
  scaleY?: number
  scaleZ?: number
  modelPath?: string
  rotationY?: number
  bounds?: ModelBounds
}

interface TankSize {
  length: number
  width: number
  height: number
}

type TransformMode = "select" | "translate" | "scale" | "rotate"
type ViewPreset = "front" | "back" | "left" | "right" | "top" | "perspective"
type Axis = "x" | "y" | "z"
type ModelBounds = {
  halfX: number
  halfZ: number
  height: number
}

interface Props {
  tankSize: TankSize
  materials: Material[]
  selectedMaterialId: string | null
  selectedMaterialIds?: string[]
  onMaterialSelect: (id: string | null) => void
  onMaterialSelectionChange?: (ids: string[]) => void
  onMaterialUpdate?: (id: string, patch: Partial<Material>, startMaterial?: Material) => void
  onMaterialsUpdate?: (updates: Record<string, Partial<Material>>) => void
  onMaterialBounds?: (id: string, bounds: ModelBounds) => void
  transformMode: TransformMode
  viewPreset?: ViewPreset
  onCameraRotationChange?: (rotation: { x: number; y: number }) => void
}

const SCENE_SCALE = 0.8
const BASE_RADIUS = 4.8
const FLOOR_Y = 1.25

const colorMap: Record<string, string> = {
  暖泥灰: "#9a8f82",
  木纹色: "#8D6E63",
  半透明白: "#dceff4",
  象牙白: "#f4efe4",
  奶油白: "#f5ead2",
  浅暖灰: "#d8d4ca",
  浅粉: "#e7c6cc",
  浅蓝: "#c9dceb",
  浅绿: "#cce2d3",
  灰豆绿: "#9baa95",
  灰蓝: "#8d9fac",
  灰紫: "#aaa0b8",
  灰粉: "#c5a4a9",
  灰棕: "#a4958d",
  灰黄: "#beb48d",
  青灰: "#7f9294",
  冷杉灰: "#697774",
  中灰绿: "#718579",
  中灰蓝: "#6f8190",
  深炭灰: "#343434",
  磨砂黑: "#111111",
  深空灰: "#444a50",
  深咖啡: "#3a2d27",
  深墨绿: "#213a32",
  抹茶绿: "#8da568",
  雾霾蓝: "#88a6b5",
  脏橘色: "#c7774d",
  松石绿: "#3d9d9a",
  苔藓绿: "#5e7446",
  薄荷绿: "#b9ead7",
  樱花粉: "#f5bccb",
  奶油黄: "#f8dfa0",
  蜜桃橙: "#f4b28f",
  薰衣草紫: "#c9b7e8",
  镏金色: "#c99a3d",
  玫瑰金: "#b97868",
  星空银: "#c6ccd2",
  电镀蓝: "#3b6fb6",
}

function stopEditorGesture(event: ThreeEvent<PointerEvent>) {
  event.stopPropagation()
  const nativeEvent = (event as unknown as { nativeEvent?: PointerEvent }).nativeEvent
  nativeEvent?.preventDefault?.()
  nativeEvent?.stopPropagation?.()
  ;(nativeEvent as PointerEvent & { stopImmediatePropagation?: () => void } | undefined)?.stopImmediatePropagation?.()
}

function captureEditorPointer(event: ThreeEvent<PointerEvent>) {
  ;(event.target as unknown as { setPointerCapture?: (pointerId: number) => void }).setPointerCapture?.(event.pointerId)
}

function releaseEditorPointer(event: ThreeEvent<PointerEvent>) {
  ;(event.target as unknown as { releasePointerCapture?: (pointerId: number) => void }).releasePointerCapture?.(event.pointerId)
}

function getModelBounds(material: Material): ModelBounds {
  if (material.bounds) return material.bounds
  if (material.modelPath) return { halfX: 1.6, halfZ: 1.6, height: 7 }
  if (material.name.includes("洞") || material.name.includes("拱门") || material.name.includes("环体")) {
    return { halfX: 5.4, halfZ: 5.4, height: 5.2 }
  }
  if (material.name.includes("墙") || material.name.includes("桥")) {
    return { halfX: 5.8, halfZ: 2.4, height: 4.5 }
  }
  if (material.name.includes("塔") || material.name.includes("柱")) {
    return { halfX: 3.1, halfZ: 3.1, height: 7 }
  }
  if (material.name.includes("枝条") || material.name.includes("珊瑚")) {
    return { halfX: 2.8, halfZ: 2.8, height: 7.5 }
  }
  return { halfX: 4.2, halfZ: 4.2, height: 5.2 }
}

function getProjectedExtents(material: Material) {
  const bounds = getModelBounds(material)
  const scale = material.scale
  const scaleX = material.scaleX ?? 1
  const scaleY = material.scaleY ?? 1
  const scaleZ = material.scaleZ ?? 1
  const rawX = bounds.halfX * scale * scaleX
  const rawZ = bounds.halfZ * scale * scaleZ
  const rotation = material.rotationY ?? 0
  const cos = Math.abs(Math.cos(rotation))
  const sin = Math.abs(Math.sin(rotation))

  return {
    halfX: rawX * cos + rawZ * sin,
    halfZ: rawX * sin + rawZ * cos,
    height: bounds.height * scale * scaleY,
  }
}

function getCollisionBox(material: Material) {
  const bounds = getModelBounds(material)
  const scale = material.scale
  const scaleX = material.scaleX ?? 1
  const scaleY = material.scaleY ?? 1
  const scaleZ = material.scaleZ ?? 1
  const rotation = material.rotationY ?? 0
  const cos = Math.cos(rotation)
  const sin = Math.sin(rotation)

  return {
    centerX: material.x,
    centerZ: material.z,
    halfX: bounds.halfX * scale * scaleX * 0.95,
    halfZ: bounds.halfZ * scale * scaleZ * 0.95,
    height: bounds.height * scale * scaleY * 0.98,
    axisX: new THREE.Vector2(cos, sin),
    axisZ: new THREE.Vector2(-sin, cos),
  }
}

function getCollisionProjectionRadius(box: ReturnType<typeof getCollisionBox>, axis: THREE.Vector2) {
  return box.halfX * Math.abs(axis.dot(box.axisX)) + box.halfZ * Math.abs(axis.dot(box.axisZ))
}

function boxesOverlapXZ(a: ReturnType<typeof getCollisionBox>, b: ReturnType<typeof getCollisionBox>, padding = 0.02) {
  const centerDelta = new THREE.Vector2(b.centerX - a.centerX, b.centerZ - a.centerZ)
  const axes = [a.axisX, a.axisZ, b.axisX, b.axisZ]

  return axes.every((axis) => {
    const distance = Math.abs(centerDelta.dot(axis))
    const radius = getCollisionProjectionRadius(a, axis) + getCollisionProjectionRadius(b, axis) + padding
    return distance < radius
  })
}

function modelsOverlap(a: Material, b: Material, padding = 0.02) {
  const aBox = getCollisionBox(a)
  const bBox = getCollisionBox(b)
  const overlapXZ = boxesOverlapXZ(aBox, bBox, padding)
  const overlapY = a.y < b.y + bBox.height + padding && b.y < a.y + aBox.height + padding

  return overlapXZ && overlapY
}

function collidesWithOtherModels(candidate: Material, materials: Material[]) {
  return materials.some((item) => item.id !== candidate.id && modelsOverlap(candidate, item))
}

function interpolateMaterial(from: Material, to: Material, t: number): Material {
  return {
    ...to,
    x: THREE.MathUtils.lerp(from.x, to.x, t),
    y: THREE.MathUtils.lerp(from.y, to.y, t),
    z: THREE.MathUtils.lerp(from.z, to.z, t),
    scale: THREE.MathUtils.lerp(from.scale, to.scale, t),
    rotationY: THREE.MathUtils.lerp(from.rotationY ?? 0, to.rotationY ?? 0, t),
  }
}

function resolveModelContact(candidate: Material, materials: Material[], fallback: Material) {
  if (collidesWithOtherModels(fallback, materials)) return fallback

  let low = { ...fallback }
  let high = { ...candidate }

  for (let i = 0; i < 14; i += 1) {
    const mid = interpolateMaterial(fallback, high, 0.5)
    if (collidesWithOtherModels(mid, materials)) {
      high = mid
    } else {
      low = mid
    }
  }

  return low
}


function clampMaterial(material: Material, tankSize: TankSize, patch: Partial<Material>, materials: Material[] = [], collisionFallback: Material = material) {
  const next = { ...material, ...patch }
  const l = tankSize.length * SCENE_SCALE
  const w = tankSize.width * SCENE_SCALE
  const h = tankSize.height * SCENE_SCALE
  const bounds = getModelBounds(next)
  const scaleX = next.scaleX ?? 1
  const scaleY = next.scaleY ?? 1
  const scaleZ = next.scaleZ ?? 1
  const maxScale = Math.max(0.36, Math.min(
    (l / 2 - 0.4) / Math.max(0.1, bounds.halfX * scaleX),
    (w / 2 - 0.4) / Math.max(0.1, bounds.halfZ * scaleZ),
    (h - FLOOR_Y - 0.4) / Math.max(0.1, bounds.height * scaleY)
  ))
  const scale = THREE.MathUtils.clamp(next.scale, 0.35, maxScale)
  const withScale = { ...next, scale }
  const extents = getProjectedExtents(withScale)
  const halfX = Math.max(0, l / 2 - extents.halfX)
  const halfZ = Math.max(0, w / 2 - extents.halfZ)
  const topY = Math.max(FLOOR_Y, h - extents.height)
  const constrained = {
    ...withScale,
    x: THREE.MathUtils.clamp(withScale.x, -halfX, halfX),
    y: THREE.MathUtils.clamp(withScale.y, FLOOR_Y, topY),
    z: THREE.MathUtils.clamp(withScale.z, -halfZ, halfZ),
  }

  if (collidesWithOtherModels(constrained, materials)) {
    return resolveModelContact(constrained, materials, collisionFallback)
  }

  return constrained
}


function GlassTank({ length, width, height }: TankSize) {
  const l = length * SCENE_SCALE
  const w = width * SCENE_SCALE
  const h = height * SCENE_SCALE
  const waterHeight = h * 0.72

  const tankEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(l, h, w)), [l, h, w])
  const waterEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(l - 1.6, 0.03, w - 1.6)),
    [l, w]
  )
  const glassPanelMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#eaf7f6",
    transparent: true,
    opacity: 0.2,
    roughness: 0.58,
    metalness: 0,
    transmission: 0.18,
    thickness: 0.45,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), [])
  const frontGlassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#f7ffff",
    transparent: true,
    opacity: 0.04,
    roughness: 0.68,
    transmission: 0.12,
    thickness: 0.25,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), [])

  return (
    <group>
      <mesh position={[0, h / 2, -w / 2 + 0.02]} material={glassPanelMaterial}>
        <planeGeometry args={[l, h]} />
      </mesh>
      <mesh position={[-l / 2 + 0.02, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={glassPanelMaterial}>
        <planeGeometry args={[w, h]} />
      </mesh>
      <mesh position={[l / 2 - 0.02, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={glassPanelMaterial}>
        <planeGeometry args={[w, h]} />
      </mesh>
      <mesh position={[0, h / 2, w / 2 - 0.04]} material={frontGlassMaterial}>
        <planeGeometry args={[l, h]} />
      </mesh>
      <lineSegments position={[0, h / 2, 0]}>
        <primitive object={tankEdges} attach="geometry" />
        <lineBasicMaterial color="#ecffff" transparent opacity={0.72} />
      </lineSegments>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[l - 1.8, 1.2, w - 1.8]} />
        <meshStandardMaterial color="#d2b684" roughness={0.96} />
      </mesh>
      <mesh position={[0, waterHeight + 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[l - 1.4, w - 1.4]} />
        <meshPhysicalMaterial color="#b9dfe1" transparent opacity={0.18} roughness={0.24} transmission={0.1} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments position={[0, waterHeight + 0.72, 0]}>
        <primitive object={waterEdges} attach="geometry" />
        <lineBasicMaterial color="#d9f6f4" transparent opacity={0.36} />
      </lineSegments>
    </group>
  )
}

function ImportedModel({
  id,
  path,
  color,
  material,
  onBounds,
}: {
  id: string
  path: string
  color: string
  material: string
  onBounds?: (id: string, bounds: ModelBounds) => void
}) {
  const { scene } = useGLTF(path)
  const { normalizedScene, bounds } = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.material = new THREE.MeshStandardMaterial({
        color,
        roughness: material.includes("光") ? 0.28 : 0.74,
        metalness: material.includes("金") ? 0.24 : 0.05,
      })
    })

    const box = new THREE.Box3().setFromObject(root)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDimension = Math.max(size.x, size.y, size.z) || 1
    const normalizedScale = 7 / maxDimension
    const group = new THREE.Group()

    root.position.set(-center.x, -box.min.y, -center.z)
    group.scale.setScalar(normalizedScale)
    group.add(root)

    return {
      normalizedScene: group,
      bounds: {
        halfX: Math.max(0.1, (size.x * normalizedScale) / 2),
        halfZ: Math.max(0.1, (size.z * normalizedScale) / 2),
        height: Math.max(0.1, size.y * normalizedScale),
      },
    }
  }, [scene, color, material])

  useEffect(() => {
    onBounds?.(id, bounds)
  }, [bounds, id, onBounds])

  return <primitive object={normalizedScene} />
}

function ModelLoadingPlaceholder() {
  return (
    <group>
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[1.6, 1.2, 4.8, 28]} />
        <meshStandardMaterial color="#7f8f87" roughness={0.85} transparent opacity={0.42} />
      </mesh>
      <mesh position={[0, 4.9, 0]}>
        <sphereGeometry args={[1.05, 24, 16]} />
        <meshStandardMaterial color="#7f8f87" roughness={0.85} transparent opacity={0.28} />
      </mesh>
    </group>
  )
}

function ModelGeometry({ name, color, material }: { name: string; color: string; material: string }) {
  const materialProps = {
    color,
    roughness: material.includes("光") ? 0.26 : 0.72,
    metalness: material.includes("金") ? 0.25 : 0.05,
  }

  if (name.includes("洞") || name.includes("拱门") || name.includes("环体")) {
    return (
      <group>
        <mesh>
          <torusGeometry args={[2.6, 0.9, 24, 48]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, -1.4, 0]} scale={[1.35, 0.45, 1]}>
          <boxGeometry args={[3.8, 1.1, 2.4]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      </group>
    )
  }

  if (name.includes("枝条") || name.includes("珊瑚")) {
    return (
      <group>
        <mesh rotation={[0.3, 0, -0.25]}>
          <cylinderGeometry args={[0.45, 0.8, 6.8, 12]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[1.2, 1.7, 0]} rotation={[0.9, 0.2, -0.85]}>
          <cylinderGeometry args={[0.25, 0.55, 4.2, 10]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      </group>
    )
  }

  if (name.includes("塔") || name.includes("柱")) {
    return (
      <group>
        <mesh>
          <cylinderGeometry args={[1.6, 2.2, 5.8, 8]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 3.2, 0]}>
          <coneGeometry args={[2.1, 2.2, 8]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      </group>
    )
  }

  if (name.includes("墙") || name.includes("桥")) {
    return (
      <group>
        <mesh scale={[2.4, 1.15, 0.35]}>
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.6, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.1, 0.28, 16, 36]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      </group>
    )
  }

  return (
    <group>
      <mesh>
        <dodecahedronGeometry args={[2.8, 1]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[0.9, 0.5, 0.6]} scale={[0.7, 0.55, 0.7]}>
        <sphereGeometry args={[1.8, 24, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  )
}

function MaterialObject({
  material,
  isSelected,
  onClick,
  onPointerDown,
  onBounds,
}: {
  material: Material
  isSelected: boolean
  onClick: () => void
  onPointerDown: (material: Material, event: ThreeEvent<PointerEvent>) => void
  onBounds?: (id: string, bounds: ModelBounds) => void
}) {
  const color = colorMap[material.color] ?? "#8f948b"
  const objectScale: [number, number, number] = [
    material.scale * (material.scaleX ?? 1),
    material.scale * (material.scaleY ?? 1),
    material.scale * (material.scaleZ ?? 1),
  ]

  return (
    <group
      position={[material.x, material.y, material.z]}
      scale={objectScale}
      rotation={[0, material.rotationY ?? 0, 0]}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      onPointerDown={(event) => onPointerDown(material, event)}
    >
      <Suspense fallback={<ModelLoadingPlaceholder />}>
        {material.modelPath ? (
          <ImportedModel id={material.id} path={material.modelPath} color={color} material={material.material} onBounds={onBounds} />
        ) : (
          <ModelGeometry name={material.name} color={color} material={material.material} />
        )}
      </Suspense>
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 0]}>
          <ringGeometry args={[4.9, 5.35, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.72} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

function AxisHandle({
  axis,
  color,
  extents,
  onPointerDown,
}: {
  axis: Axis
  color: string
  extents: ReturnType<typeof getProjectedExtents>
  onPointerDown: (axis: Axis, event: ThreeEvent<PointerEvent>) => void
}) {
  const rotation: [number, number, number] = axis === "x"
    ? [0, 0, -Math.PI / 2]
    : axis === "z"
      ? [Math.PI / 2, 0, 0]
      : [0, 0, 0]
  const handleLength = THREE.MathUtils.clamp(Math.max(extents.halfX, extents.halfZ, extents.height) * 0.34, 2.8, 5.2)
  const handleRadius = THREE.MathUtils.clamp(handleLength * 0.035, 0.12, 0.18)
  const hitRadius = THREE.MathUtils.clamp(handleLength * 0.16, 0.55, 0.95)
  const coneRadius = THREE.MathUtils.clamp(handleLength * 0.12, 0.42, 0.65)
  const coneHeight = THREE.MathUtils.clamp(handleLength * 0.24, 0.85, 1.25)
  const offset: [number, number, number] = axis === "x"
    ? [extents.halfX + 1.2, extents.height * 0.5, 0]
    : axis === "z"
      ? [0, extents.height * 0.5, extents.halfZ + 1.2]
      : [0, extents.height + 0.8, 0]

  return (
    <group
      position={offset}
      rotation={rotation}
      onPointerDown={(event) => onPointerDown(axis, event)}
    >
      <mesh position={[0, handleLength * 0.5, 0]}>
        <cylinderGeometry args={[hitRadius, hitRadius, handleLength + 0.7, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, handleLength * 0.5, 0]}>
        <cylinderGeometry args={[handleRadius, handleRadius, handleLength, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, handleLength + coneHeight * 0.5, 0]}>
        <coneGeometry args={[coneRadius, coneHeight, 18]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

function ScaleHandles({
  material,
  onPointerDown,
}: {
  material: Material
  onPointerDown: (event: ThreeEvent<PointerEvent>) => void
}) {
  const bounds = getModelBounds(material)
  const extents = getProjectedExtents(material)
  const margin = THREE.MathUtils.clamp(Math.max(extents.halfX, extents.halfZ, extents.height) * 0.08, 0.55, 1.4)
  const handleSize = THREE.MathUtils.clamp(Math.max(extents.halfX, extents.halfZ, extents.height) * 0.08, 0.65, 1.15)
  const hitSize = Math.max(2.2, handleSize * 2.6)
  const width = (extents.halfX + margin) * 2
  const depth = (extents.halfZ + margin) * 2
  const height = extents.height + margin * 2
  const halfX = width / 2
  const halfZ = depth / 2
  const midY = height / 2 - margin
  const points: [number, number, number][] = [
    [halfX, midY, halfZ],
    [-halfX, midY, halfZ],
    [halfX, midY, -halfZ],
    [-halfX, midY, -halfZ],
    [0, height - margin, 0],
  ]

  return (
    <group onPointerDown={(event) => event.stopPropagation()}>
      <lineSegments position={[0, midY, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color="#111111" transparent opacity={0.45} />
      </lineSegments>
      {points.map((point) => (
        <group key={point.join(",")} position={point} onPointerDown={onPointerDown}>
          <mesh>
            <boxGeometry args={[hitSize, hitSize, hitSize]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <mesh>
            <boxGeometry args={[handleSize, handleSize, handleSize]} />
            <meshBasicMaterial color="#111111" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function TransformGizmo({
  material,
  mode,
  tankSize,
  materials,
  onMaterialUpdate,
  onDragStateChange,
  onTransformStart,
}: {
  material: Material
  mode: TransformMode
  tankSize: TankSize
  materials: Material[]
  onMaterialUpdate?: (id: string, patch: Partial<Material>, startMaterial?: Material) => void
  onDragStateChange: (dragging: boolean) => void
  onTransformStart?: (material: Material) => void
}) {
  const { camera, gl, pointer, raycaster } = useThree()
  const [drag, setDrag] = useState<null | {
    axis: Axis | "scale" | "rotate"
    startPoint: THREE.Vector3
    startMaterial: Material
    startClientY?: number
    startDistance?: number
  }>(null)
  const plane = useMemo(() => new THREE.Plane(), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const position = [material.x, material.y, material.z] as [number, number, number]
  const extents = getProjectedExtents(material)
  const rotateRadius = THREE.MathUtils.clamp(Math.max(extents.halfX, extents.halfZ) + 0.9, 3.2, 15)
  const rotateTube = THREE.MathUtils.clamp(rotateRadius * 0.026, 0.12, 0.28)
  const rotateHitTube = THREE.MathUtils.clamp(rotateRadius * 0.12, 0.55, 1.4)
  const applyScaleDrag = (clientY: number, activeDrag: NonNullable<typeof drag>) => {
    if (!onMaterialUpdate || activeDrag.axis !== "scale") return
    const clientDelta = (activeDrag.startClientY ?? clientY) - clientY
    const ratio = THREE.MathUtils.clamp(1 + clientDelta * 0.008, 0.35, 3.2)
    const nextScale = activeDrag.startMaterial.scale * ratio
    const clamped = clampMaterial(activeDrag.startMaterial, tankSize, { scale: nextScale }, materials, material)
    onMaterialUpdate(material.id, {
      x: clamped.x,
      y: clamped.y,
      z: clamped.z,
      scale: clamped.scale,
    }, activeDrag.startMaterial)
  }

  useEffect(() => {
    if (!drag || drag.axis !== "scale") return
    const handleMove = (event: PointerEvent) => {
      event.preventDefault()
      applyScaleDrag(event.clientY, drag)
    }
    const handleUp = () => {
      setDrag(null)
      onDragStateChange(false)
    }
    window.addEventListener("pointermove", handleMove, { passive: false })
    window.addEventListener("pointerup", handleUp)
    window.addEventListener("pointercancel", handleUp)
    return () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
      window.removeEventListener("pointercancel", handleUp)
    }
  }, [drag, materials, onDragStateChange, onMaterialUpdate, tankSize])

  const beginDrag = (axis: Axis, event: ThreeEvent<PointerEvent>) => {
    stopEditorGesture(event)
    captureEditorPointer(event)
    const normal = axis === "y" ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0)
    plane.setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(material.x, material.y, material.z))
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, hit)
    setDrag({ axis, startPoint: hit.clone(), startMaterial: material })
    onTransformStart?.(material)
    onDragStateChange(true)
  }

  const beginScale = (event: ThreeEvent<PointerEvent>) => {
    stopEditorGesture(event)
    captureEditorPointer(event)
    const center = new THREE.Vector3(material.x, material.y, material.z)
    const normal = camera.getWorldDirection(new THREE.Vector3())
    plane.setFromNormalAndCoplanarPoint(normal, center)
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, hit)
    setDrag({
      axis: "scale",
      startPoint: hit.clone(),
      startMaterial: material,
      startClientY: event.nativeEvent.clientY,
      startDistance: Math.max(1, hit.distanceTo(center)),
    })
    onTransformStart?.(material)
    onDragStateChange(true)
  }

  const beginRotate = (event: ThreeEvent<PointerEvent>) => {
    stopEditorGesture(event)
    captureEditorPointer(event)
    const center = new THREE.Vector3(material.x, material.y, material.z)
    const normal = camera.getWorldDirection(new THREE.Vector3())
    plane.setFromNormalAndCoplanarPoint(normal, center)
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, hit)
    setDrag({
      axis: "rotate",
      startPoint: hit.clone(),
      startMaterial: material,
      startClientY: event.nativeEvent.clientX,
    })
    onTransformStart?.(material)
    onDragStateChange(true)
  }


  return (
    <group
      position={position}
      onPointerMove={(event) => {
        if (!drag || !onMaterialUpdate) return
        stopEditorGesture(event)
        raycaster.setFromCamera(pointer, camera)
        const nextPoint = raycaster.ray.intersectPlane(plane, hit)
        if (!nextPoint) return
        const delta = hit.clone().sub(drag.startPoint)

        if (drag.axis === "scale") {
          applyScaleDrag(event.nativeEvent.clientY, drag)
          return
        }

        if (drag.axis === "rotate") {
          const rotationY = (drag.startMaterial.rotationY ?? 0) + (event.nativeEvent.clientX - (drag.startClientY ?? event.nativeEvent.clientX)) * 0.012
          const clamped = clampMaterial(drag.startMaterial, tankSize, { rotationY }, materials, material)
          onMaterialUpdate(material.id, { x: clamped.x, y: clamped.y, z: clamped.z, rotationY: clamped.rotationY }, drag.startMaterial)
          return
        }

        const patch = {
          x: drag.startMaterial.x + (drag.axis === "x" ? delta.x : 0),
          y: drag.startMaterial.y + (drag.axis === "y" ? delta.y : 0),
          z: drag.startMaterial.z + (drag.axis === "z" ? delta.z : 0),
        }
        const clamped = clampMaterial(drag.startMaterial, tankSize, patch, materials, material)
        onMaterialUpdate(material.id, { x: clamped.x, y: clamped.y, z: clamped.z }, drag.startMaterial)
      }}
      onPointerUp={(event) => {
        releaseEditorPointer(event)
        setDrag(null)
        onDragStateChange(false)
      }}
    >
      {mode === "translate" ? (
        <>
          <AxisHandle axis="x" color="#ef4444" extents={extents} onPointerDown={beginDrag} />
          <AxisHandle axis="y" color="#22c55e" extents={extents} onPointerDown={beginDrag} />
          <AxisHandle axis="z" color="#3b82f6" extents={extents} onPointerDown={beginDrag} />
        </>
      ) : mode === "scale" ? (
        <ScaleHandles material={material} onPointerDown={beginScale} />
      ) : (
        <group onPointerDown={(event) => event.stopPropagation()}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, extents.height * 0.5, 0]} onPointerDown={beginRotate}>
            <torusGeometry args={[rotateRadius, rotateTube, 16, 96]} />
            <meshBasicMaterial color="#111111" transparent opacity={0.78} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, extents.height * 0.5, 0]} onPointerDown={beginRotate}>
            <torusGeometry args={[rotateRadius, rotateHitTube, 16, 96]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      )}
    </group>
  )
}

function createGroupProxy(items: Material[]): Material {
  const boxes = items.map((item) => ({ item, extents: getProjectedExtents(item) }))
  const minX = Math.min(...boxes.map(({ item, extents }) => item.x - extents.halfX))
  const maxX = Math.max(...boxes.map(({ item, extents }) => item.x + extents.halfX))
  const minZ = Math.min(...boxes.map(({ item, extents }) => item.z - extents.halfZ))
  const maxZ = Math.max(...boxes.map(({ item, extents }) => item.z + extents.halfZ))
  const minY = Math.min(...items.map((item) => item.y))
  const maxY = Math.max(...boxes.map(({ item, extents }) => item.y + extents.height))

  return {
    id: "__group__",
    name: "组合选择",
    material: items[0]?.material ?? "丝光PLA",
    color: items[0]?.color ?? "暖泥灰",
    price: 0,
    x: (minX + maxX) / 2,
    y: minY,
    z: (minZ + maxZ) / 2,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    rotationY: 0,
    bounds: {
      halfX: Math.max(0.1, (maxX - minX) / 2),
      halfZ: Math.max(0.1, (maxZ - minZ) / 2),
      height: Math.max(0.1, maxY - minY),
    },
  }
}

function Scene({
  tankSize,
  materials,
  selectedMaterialId,
  selectedMaterialIds = [],
  onMaterialSelect,
  onMaterialSelectionChange,
  onMaterialUpdate,
  onMaterialsUpdate,
  onMaterialBounds,
  transformMode,
  viewPreset = "perspective",
  onCameraRotationChange,
}: Props) {
  const [gizmoDragging, setGizmoDragging] = useState(false)
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null)
  const [objectDrag, setObjectDrag] = useState<null | {
    id: string
    startPoint: THREE.Vector3
    startMaterial: Material
  }>(null)
  const [selectionDrag, setSelectionDrag] = useState<null | { startX: number; startY: number; currentX: number; currentY: number }>(null)
  const groupStartRef = useRef<null | { proxy: Material; materials: Material[] }>(null)
  const { camera, gl, pointer, raycaster } = useThree()
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -FLOOR_Y))
  const dragPlane = dragPlaneRef.current
  const dragPoint = useMemo(() => new THREE.Vector3(), [])
  const l = tankSize.length * SCENE_SCALE
  const w = tankSize.width * SCENE_SCALE
  const h = tankSize.height * SCENE_SCALE
  const cameraDistance = Math.max(l, w, h) * 1.34
  const selectedItems = materials.filter((item) => selectedMaterialIds.includes(item.id))
  const selected = materials.find((item) => item.id === selectedMaterialId)
  const groupSelection = selectedItems.length > 1 ? createGroupProxy(selectedItems) : null
  const activeTransformTarget = groupSelection ?? selected
  const lastCameraRotation = useRef({ x: Number.NaN, y: Number.NaN })

  const reportCameraRotation = () => {
    if (!onCameraRotationChange) return
    const target = controlsRef.current?.target ?? new THREE.Vector3(0, h * 0.36, 0)
    const offset = camera.position.clone().sub(target)
    const horizontal = Math.sqrt(offset.x * offset.x + offset.z * offset.z)
    const nextRotation = {
      x: THREE.MathUtils.clamp(-THREE.MathUtils.radToDeg(Math.atan2(offset.y, Math.max(0.001, horizontal))), -90, 90),
      y: -THREE.MathUtils.radToDeg(Math.atan2(offset.x, offset.z)),
    }
    const previous = lastCameraRotation.current
    if (Math.abs(previous.x - nextRotation.x) < 0.4 && Math.abs(previous.y - nextRotation.y) < 0.4) return
    lastCameraRotation.current = nextRotation
    onCameraRotationChange(nextRotation)
  }

  useEffect(() => {
    const positions: Record<ViewPreset, [number, number, number]> = {
      front: [0, h * 0.45, cameraDistance],
      back: [0, h * 0.45, -cameraDistance],
      left: [-cameraDistance, h * 0.45, 0],
      right: [cameraDistance, h * 0.45, 0],
      top: [0, cameraDistance, 0.01],
      perspective: [cameraDistance, cameraDistance * 0.72, cameraDistance * 0.92],
    }
    const nextPosition = positions[viewPreset]
    camera.position.set(...nextPosition)
    camera.lookAt(0, h * 0.36, 0)
    controlsRef.current?.target.set(0, h * 0.36, 0)
    controlsRef.current?.update()
    reportCameraRotation()
  }, [camera, cameraDistance, h, viewPreset] )

  const beginSelection = (event: ThreeEvent<PointerEvent>) => {
    const wantsSelection = transformMode === "select" || event.nativeEvent.shiftKey
    if (!wantsSelection || event.button !== 0 || objectDrag || gizmoDragging) return
    stopEditorGesture(event)
    onMaterialSelectionChange?.([])
    setSelectionDrag({ startX: event.nativeEvent.clientX, startY: event.nativeEvent.clientY, currentX: event.nativeEvent.clientX, currentY: event.nativeEvent.clientY })
    setEditorDragging(true)
  }

  const finishSelection = () => {
    if (!selectionDrag) return
    const rect = gl.domElement.getBoundingClientRect()
    const minX = Math.min(selectionDrag.startX, selectionDrag.currentX)
    const maxX = Math.max(selectionDrag.startX, selectionDrag.currentX)
    const minY = Math.min(selectionDrag.startY, selectionDrag.currentY)
    const maxY = Math.max(selectionDrag.startY, selectionDrag.currentY)
    const nextIds = materials.filter((material) => {
      const projected = new THREE.Vector3(material.x, material.y + getProjectedExtents(material).height * 0.5, material.z).project(camera)
      const screenX = rect.left + (projected.x + 1) * rect.width * 0.5
      const screenY = rect.top + (1 - projected.y) * rect.height * 0.5
      return screenX >= minX && screenX <= maxX && screenY >= minY && screenY <= maxY
    }).map((material) => material.id)
    onMaterialSelectionChange?.(nextIds)
    setSelectionDrag(null)
    setEditorDragging(false)
  }

  const applyGroupTransform = (patch: Partial<Material>, startProxy?: Material) => {
    if (!groupSelection || !startProxy || !groupStartRef.current || !onMaterialsUpdate) return false
    const nextProxy = { ...startProxy, ...patch }
    const deltaX = nextProxy.x - groupStartRef.current.proxy.x
    const deltaY = nextProxy.y - groupStartRef.current.proxy.y
    const deltaZ = nextProxy.z - groupStartRef.current.proxy.z
    const scaleRatio = nextProxy.scale / Math.max(0.001, groupStartRef.current.proxy.scale)
    const rotationDelta = (nextProxy.rotationY ?? 0) - (groupStartRef.current.proxy.rotationY ?? 0)
    const cos = Math.cos(rotationDelta)
    const sin = Math.sin(rotationDelta)
    const selectedIds = new Set(groupStartRef.current.materials.map((item) => item.id))
    const updates: Record<string, Partial<Material>> = {}
    const staticMaterials = materials.filter((item) => !selectedIds.has(item.id))
    let workingMaterials = [...staticMaterials]

    for (const item of groupStartRef.current.materials) {
      const relativeX = (item.x - groupStartRef.current.proxy.x) * scaleRatio
      const relativeZ = (item.z - groupStartRef.current.proxy.z) * scaleRatio
      const rotatedX = relativeX * cos - relativeZ * sin
      const rotatedZ = relativeX * sin + relativeZ * cos
      const candidate = {
        ...item,
        x: groupStartRef.current.proxy.x + rotatedX + deltaX,
        y: item.y + deltaY,
        z: groupStartRef.current.proxy.z + rotatedZ + deltaZ,
        scale: item.scale * scaleRatio,
        rotationY: (item.rotationY ?? 0) + rotationDelta,
      }
      const clamped = clampMaterial(item, tankSize, candidate, workingMaterials, item)
      updates[item.id] = { x: clamped.x, y: clamped.y, z: clamped.z, scale: clamped.scale, rotationY: clamped.rotationY }
      workingMaterials = [...workingMaterials, { ...item, ...updates[item.id] }]
    }

    onMaterialsUpdate(updates)
    return true
  }

  const setEditorDragging = (dragging: boolean) => {
    setGizmoDragging(dragging)
    if (controlsRef.current) controlsRef.current.enabled = !dragging
  }

  const beginObjectDrag = (material: Material, event: ThreeEvent<PointerEvent>) => {
    stopEditorGesture(event)
    captureEditorPointer(event)
    onMaterialSelect(material.id)
    onMaterialSelectionChange?.([material.id])
    if (transformMode !== "translate") return
    dragPlane.constant = -material.y
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(dragPlane, dragPoint)
    setObjectDrag({ id: material.id, startPoint: dragPoint.clone(), startMaterial: material })
    setEditorDragging(true)
  }

  return (
    <group
      onClick={() => onMaterialSelect(null)}
      onPointerMove={(event) => {
        if (selectionDrag) {
          stopEditorGesture(event)
          setSelectionDrag((current) => current ? { ...current, currentX: event.nativeEvent.clientX, currentY: event.nativeEvent.clientY } : current)
          return
        }
        if (!objectDrag || !onMaterialUpdate) return
        stopEditorGesture(event)
        raycaster.setFromCamera(pointer, camera)
        const point = raycaster.ray.intersectPlane(dragPlane, dragPoint)
        if (!point) return
        const delta = dragPoint.clone().sub(objectDrag.startPoint)
        const currentMaterial = materials.find((item) => item.id === objectDrag.id) ?? objectDrag.startMaterial
        const clamped = clampMaterial(objectDrag.startMaterial, tankSize, {
          x: objectDrag.startMaterial.x + delta.x,
          z: objectDrag.startMaterial.z + delta.z,
        }, materials, currentMaterial)
        onMaterialUpdate(objectDrag.id, { x: clamped.x, y: clamped.y, z: clamped.z }, objectDrag.startMaterial)
      }}
      onPointerUp={(event) => {
        releaseEditorPointer(event)
        finishSelection()
        setSelectionDrag(null)
        setObjectDrag(null)
        setEditorDragging(false)
      }}
      onPointerLeave={(event) => {
        releaseEditorPointer(event)
        setObjectDrag(null)
        setEditorDragging(false)
      }}
    >
      <PerspectiveCamera makeDefault position={[cameraDistance, cameraDistance * 0.72, cameraDistance * 0.92]} fov={42} />
      <OrbitControls
        ref={controlsRef}
        enabled={!gizmoDragging && transformMode !== "select"}
        target={[0, h * 0.36, 0]}
        minDistance={30}
        maxDistance={180}
        maxPolarAngle={Math.PI / 2.02}
        enablePan
        enableDamping
        dampingFactor={0.06}
        onChange={reportCameraRotation}
      />

      <color attach="background" args={["#c4d7d4"]} />
      <fog attach="fog" args={["#c4d7d4", 90, 180]} />
      <ambientLight intensity={0.82} />
      <directionalLight position={[35, 60, 40]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-20, 24, 18]} intensity={1.4} color="#9ee9ff" />

      <GlassTank length={tankSize.length} width={tankSize.width} height={tankSize.height} />

      <mesh position={[0, FLOOR_Y - 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} onPointerDown={beginSelection}>
        <planeGeometry args={[l, w]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {materials.map((m) => (
        <MaterialObject
          key={m.id}
          material={m}
          isSelected={selectedMaterialIds.includes(m.id)}
          onClick={() => onMaterialSelect(m.id)}
          onPointerDown={beginObjectDrag}
          onBounds={onMaterialBounds}
        />
      ))}

      {activeTransformTarget && (
        <TransformGizmo
          material={activeTransformTarget}
          mode={transformMode}
          tankSize={tankSize}
          materials={materials}
          onMaterialUpdate={(id, patch, startMaterial) => {
            if (applyGroupTransform(patch, startMaterial)) return
            onMaterialUpdate?.(id, patch, startMaterial)
          }}
          onDragStateChange={setEditorDragging}
          onTransformStart={(startMaterial) => {
            if (!groupSelection) return
            groupStartRef.current = { proxy: startMaterial, materials: selectedItems.map((item) => ({ ...item })) }
          }}
        />
      )}

      {selectionDrag && (
        <Html fullscreen pointerEvents="none">
          <div
            className="fixed z-[100] border border-neutral-950/80 bg-neutral-950/10"
            style={{
              left: Math.min(selectionDrag.startX, selectionDrag.currentX),
              top: Math.min(selectionDrag.startY, selectionDrag.currentY),
              width: Math.abs(selectionDrag.currentX - selectionDrag.startX),
              height: Math.abs(selectionDrag.currentY - selectionDrag.startY),
            }}
          />
        </Html>
      )}

      <gridHelper args={[80, 20, 0x7fb4b8, 0xb9c8c3]} position={[0, 0.04, 0]} />
      <ContactShadows position={[0, -0.02, 0]} opacity={0.32} scale={74} blur={2.6} far={22} />
    </group>
  )
}

export default function EditorCanvas({
  tankSize,
  materials,
  selectedMaterialId,
  selectedMaterialIds,
  onMaterialSelect,
  onMaterialSelectionChange,
  onMaterialUpdate,
  onMaterialsUpdate,
  onMaterialBounds,
  transformMode,
  viewPreset,
  onCameraRotationChange,
}: Props) {
  return (
    <div className="h-full w-full bg-[#c4d7d4]" style={{ touchAction: "none", overscrollBehavior: "contain" }}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [70, 48, 64], fov: 44 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#c4d7d4")
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
      >
        <Scene
          tankSize={tankSize}
          materials={materials}
          selectedMaterialId={selectedMaterialId}
          selectedMaterialIds={selectedMaterialIds}
          onMaterialSelect={onMaterialSelect}
          onMaterialSelectionChange={onMaterialSelectionChange}
          onMaterialUpdate={onMaterialUpdate}
          onMaterialsUpdate={onMaterialsUpdate}
          onMaterialBounds={onMaterialBounds}
          transformMode={transformMode}
          viewPreset={viewPreset}
          onCameraRotationChange={onCameraRotationChange}
        />
      </Canvas>
    </div>
  )
}
