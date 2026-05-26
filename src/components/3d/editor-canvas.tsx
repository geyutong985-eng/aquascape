"use client"

import { Suspense, type ElementRef, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber"
import { ContactShadows, OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei"
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
  bounds?: ModelBounds
}

interface TankSize {
  length: number
  width: number
  height: number
}

type TransformMode = "translate" | "scale"
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
  onMaterialSelect: (id: string | null) => void
  onMaterialUpdate?: (id: string, patch: Partial<Material>) => void
  onMaterialBounds?: (id: string, bounds: ModelBounds) => void
  transformMode: TransformMode
}

const SCENE_SCALE = 0.8
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

function clampMaterial(material: Material, tankSize: TankSize, patch: Partial<Material>) {
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
  const extentX = bounds.halfX * scale * scaleX
  const extentZ = bounds.halfZ * scale * scaleZ
  const height = bounds.height * scale * scaleY
  const halfX = Math.max(0, l / 2 - extentX)
  const halfZ = Math.max(0, w / 2 - extentZ)
  const topY = Math.max(FLOOR_Y, h - height)

  return {
    ...next,
    x: THREE.MathUtils.clamp(next.x, -halfX, halfX),
    y: THREE.MathUtils.clamp(next.y, FLOOR_Y, topY),
    z: THREE.MathUtils.clamp(next.z, -halfZ, halfZ),
    scale,
  }
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
  onPointerDown,
}: {
  axis: Axis
  color: string
  onPointerDown: (axis: Axis, event: ThreeEvent<PointerEvent>) => void
}) {
  const rotation: [number, number, number] = axis === "x"
    ? [0, 0, -Math.PI / 2]
    : axis === "z"
      ? [Math.PI / 2, 0, 0]
      : [0, 0, 0]
  const position: [number, number, number] = axis === "x"
    ? [5.5, 0, 0]
    : axis === "z"
      ? [0, 0, 5.5]
      : [0, 5.5, 0]

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerDown={(event) => onPointerDown(axis, event)}
    >
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 4.6, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 4.2, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 4.25, 0]}>
        <coneGeometry args={[0.46, 0.95, 18]} />
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
  const width = bounds.halfX * 2 * material.scale * (material.scaleX ?? 1)
  const depth = bounds.halfZ * 2 * material.scale * (material.scaleZ ?? 1)
  const height = bounds.height * material.scale * (material.scaleY ?? 1)
  const halfX = width / 2
  const halfZ = depth / 2
  const midY = height / 2
  const points: [number, number, number][] = [
    [halfX, midY, halfZ],
    [-halfX, midY, halfZ],
    [halfX, midY, -halfZ],
    [-halfX, midY, -halfZ],
    [0, height, 0],
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
            <boxGeometry args={[2.4, 2.4, 2.4]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
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
  onMaterialUpdate,
  onDragStateChange,
}: {
  material: Material
  mode: TransformMode
  tankSize: TankSize
  onMaterialUpdate?: (id: string, patch: Partial<Material>) => void
  onDragStateChange: (dragging: boolean) => void
}) {
  const { camera, pointer, raycaster } = useThree()
  const [drag, setDrag] = useState<null | {
    axis: Axis | "scale"
    startPoint: THREE.Vector3
    startMaterial: Material
    startClientY?: number
    startDistance?: number
  }>(null)
  const plane = useMemo(() => new THREE.Plane(), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const position = [material.x, material.y, material.z] as [number, number, number]
  const applyScaleDrag = useCallback((clientY: number, activeDrag: NonNullable<typeof drag>) => {
    if (!onMaterialUpdate || activeDrag.axis !== "scale") return
    const clientDelta = (activeDrag.startClientY ?? clientY) - clientY
    const ratio = THREE.MathUtils.clamp(1 + clientDelta * 0.008, 0.35, 3.2)
    const nextScale = activeDrag.startMaterial.scale * ratio
    const clamped = clampMaterial(activeDrag.startMaterial, tankSize, { scale: nextScale })
    onMaterialUpdate(material.id, {
      x: clamped.x,
      y: clamped.y,
      z: clamped.z,
      scale: clamped.scale,
    })
  }, [material.id, onMaterialUpdate, tankSize])

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
  }, [applyScaleDrag, drag, onDragStateChange])

  const beginDrag = (axis: Axis, event: ThreeEvent<PointerEvent>) => {
    stopEditorGesture(event)
    captureEditorPointer(event)
    const normal = axis === "y" ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0)
    plane.setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(material.x, material.y, material.z))
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, hit)
    setDrag({ axis, startPoint: hit.clone(), startMaterial: material })
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

        const patch = {
          x: drag.startMaterial.x + (drag.axis === "x" ? delta.x : 0),
          y: drag.startMaterial.y + (drag.axis === "y" ? delta.y : 0),
          z: drag.startMaterial.z + (drag.axis === "z" ? delta.z : 0),
        }
        const clamped = clampMaterial(drag.startMaterial, tankSize, patch)
        onMaterialUpdate(material.id, { x: clamped.x, y: clamped.y, z: clamped.z })
      }}
      onPointerUp={(event) => {
        releaseEditorPointer(event)
        setDrag(null)
        onDragStateChange(false)
      }}
    >
      {mode === "translate" ? (
        <>
          <AxisHandle axis="x" color="#ef4444" onPointerDown={beginDrag} />
          <AxisHandle axis="y" color="#22c55e" onPointerDown={beginDrag} />
          <AxisHandle axis="z" color="#3b82f6" onPointerDown={beginDrag} />
        </>
      ) : (
        <ScaleHandles material={material} onPointerDown={beginScale} />
      )}
    </group>
  )
}

function Scene({
  tankSize,
  materials,
  selectedMaterialId,
  onMaterialSelect,
  onMaterialUpdate,
  onMaterialBounds,
  transformMode,
}: Props) {
  const [gizmoDragging, setGizmoDragging] = useState(false)
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null)
  const [objectDrag, setObjectDrag] = useState<null | {
    id: string
    startPoint: THREE.Vector3
    startMaterial: Material
  }>(null)
  const { camera, pointer, raycaster } = useThree()
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -FLOOR_Y))
  const dragPoint = useMemo(() => new THREE.Vector3(), [])
  const l = tankSize.length * SCENE_SCALE
  const w = tankSize.width * SCENE_SCALE
  const h = tankSize.height * SCENE_SCALE
  const cameraDistance = Math.max(l, w, h) * 1.34
  const selected = materials.find((item) => item.id === selectedMaterialId)
  const setEditorDragging = (dragging: boolean) => {
    setGizmoDragging(dragging)
    if (controlsRef.current) controlsRef.current.enabled = !dragging
  }

  const beginObjectDrag = (material: Material, event: ThreeEvent<PointerEvent>) => {
    stopEditorGesture(event)
    captureEditorPointer(event)
    onMaterialSelect(material.id)
    if (transformMode !== "translate") return
    const dragPlane = dragPlaneRef.current
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
        if (!objectDrag || !onMaterialUpdate) return
        stopEditorGesture(event)
        raycaster.setFromCamera(pointer, camera)
        const point = raycaster.ray.intersectPlane(dragPlaneRef.current, dragPoint)
        if (!point) return
        const delta = dragPoint.clone().sub(objectDrag.startPoint)
        const clamped = clampMaterial(objectDrag.startMaterial, tankSize, {
          x: objectDrag.startMaterial.x + delta.x,
          z: objectDrag.startMaterial.z + delta.z,
        })
        onMaterialUpdate(objectDrag.id, { x: clamped.x, y: clamped.y, z: clamped.z })
      }}
      onPointerUp={(event) => {
        releaseEditorPointer(event)
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
        enabled={!gizmoDragging}
        target={[0, h * 0.36, 0]}
        minDistance={30}
        maxDistance={180}
        maxPolarAngle={Math.PI / 2.02}
        enablePan
        enableDamping
        dampingFactor={0.06}
      />

      <color attach="background" args={["#c4d7d4"]} />
      <fog attach="fog" args={["#c4d7d4", 90, 180]} />
      <ambientLight intensity={0.82} />
      <directionalLight position={[35, 60, 40]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-20, 24, 18]} intensity={1.4} color="#9ee9ff" />

      <GlassTank length={tankSize.length} width={tankSize.width} height={tankSize.height} />

      {materials.map((m) => (
        <MaterialObject
          key={m.id}
          material={m}
          isSelected={selectedMaterialId === m.id}
          onClick={() => onMaterialSelect(m.id)}
          onPointerDown={beginObjectDrag}
          onBounds={onMaterialBounds}
        />
      ))}

      {selected && (
        <TransformGizmo
          material={selected}
          mode={transformMode}
          tankSize={tankSize}
          onMaterialUpdate={onMaterialUpdate}
          onDragStateChange={setEditorDragging}
        />
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
  onMaterialSelect,
  onMaterialUpdate,
  onMaterialBounds,
  transformMode,
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
          onMaterialSelect={onMaterialSelect}
          onMaterialUpdate={onMaterialUpdate}
          onMaterialBounds={onMaterialBounds}
          transformMode={transformMode}
        />
      </Canvas>
    </div>
  )
}
