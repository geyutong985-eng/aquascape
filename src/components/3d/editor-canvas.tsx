"use client"

import { useMemo, useRef, useState } from "react"
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

interface Material {
  id: string
  name: string
  price: number
  x: number
  y: number
  z: number
  scale: number
  scaleX?: number
  scaleY?: number
  scaleZ?: number
}

interface TankSize {
  length: number
  width: number
  height: number
}

interface Props {
  tankSize: TankSize
  materials: Material[]
  selectedMaterialId: string | null
  onMaterialSelect: (id: string | null) => void
  onMaterialMove?: (id: string, position: { x: number; z: number }) => void
  transformMode: 'translate' | 'rotate' | 'scale'
}

function GlassTank({ length, width, height }: TankSize) {
  const scale = 0.8
  const l = length * scale
  const w = width * scale
  const h = height * scale

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xE8F4FF,
    transparent: true,
    opacity: 0.3,
    roughness: 0.05,
    metalness: 0,
    transmission: 0.9,
    thickness: 0.5,
    side: THREE.DoubleSide,
  }), [])

  const thickness = 0.3

  return (
    <group>
      {/* Front glass */}
      <mesh position={[0, h / 2, w / 2]} material={glassMaterial}>
        <boxGeometry args={[l, h, thickness]} />
      </mesh>
      {/* Back glass */}
      <mesh position={[0, h / 2, -w / 2]} material={glassMaterial}>
        <boxGeometry args={[l, h, thickness]} />
      </mesh>
      {/* Left glass */}
      <mesh position={[-l / 2, h / 2, 0]} material={glassMaterial}>
        <boxGeometry args={[thickness, h, w]} />
      </mesh>
      {/* Right glass */}
      <mesh position={[l / 2, h / 2, 0]} material={glassMaterial}>
        <boxGeometry args={[thickness, h, w]} />
      </mesh>
      {/* Bottom glass */}
      <mesh position={[0, thickness / 2, 0]} material={glassMaterial}>
        <boxGeometry args={[l, thickness, w]} />
      </mesh>

      {/* Ground */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[l - 1, w - 1]} />
        <meshStandardMaterial color={0xE8DCC8} roughness={0.9} />
      </mesh>

      {/* Water surface */}
      <mesh position={[0, h * 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[l - 1, w - 1]} />
        <meshPhysicalMaterial color={0x87CEEB} transparent opacity={0.2} roughness={0} />
      </mesh>
    </group>
  )
}

function MaterialObject({
  material,
  isSelected,
  onClick,
  onDragStart,
}: {
  material: Material
  isSelected: boolean
  onClick: () => void
  onDragStart: (event: ThreeEvent<PointerEvent>) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  const color = useMemo(() => {
    if (material.name.includes('石')) return '#78909C'
    if (material.name.includes('草')) return '#4CAF50'
    if (material.name.includes('木')) return '#8D6E63'
    if (material.name.includes('砂')) return '#E8DCC8'
    return '#888888'
  }, [material.name])

  const geometry = useMemo(() => {
    if (material.name.includes('石')) return new THREE.DodecahedronGeometry(3, 0)
    if (material.name.includes('草')) return new THREE.ConeGeometry(2, 6, 6)
    if (material.name.includes('木')) return new THREE.CylinderGeometry(1.5, 2, 8, 8)
    return new THREE.SphereGeometry(3, 16, 16)
  }, [material.name])

  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group
      position={[material.x, material.y, material.z]}
      scale={[
        material.scale * (material.scaleX ?? 1),
        material.scale * (material.scaleY ?? 1),
        material.scale * (material.scaleZ ?? 1),
      ]}
    >
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onPointerDown={onDragStart}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      {isSelected && (
        <group>
          <mesh>
            <boxGeometry args={[8, 8, 8]} />
            <meshBasicMaterial color="#0B7285" transparent opacity={0.18} wireframe />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]}>
            <ringGeometry args={[5.2, 5.6, 48]} />
            <meshBasicMaterial color="#0B7285" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  )
}

function Scene({
  tankSize,
  materials,
  selectedMaterialId,
  onMaterialSelect,
  onMaterialMove,
}: Omit<Props, 'transformMode'>) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const { camera, pointer, raycaster } = useThree()
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const dragPoint = useMemo(() => new THREE.Vector3(), [])
  const scale = 0.8
  const l = tankSize.length * scale
  const w = tankSize.width * scale
  const h = tankSize.height * scale

  const cameraDistance = Math.max(l, w, h) * 2

  return (
    <group
      onPointerMove={() => {
        if (!draggingId || !onMaterialMove) return
        raycaster.setFromCamera(pointer, camera)
        const hit = raycaster.ray.intersectPlane(dragPlane, dragPoint)
        if (!hit) return
        onMaterialMove(draggingId, { x: dragPoint.x, z: dragPoint.z })
      }}
      onPointerUp={() => setDraggingId(null)}
      onPointerLeave={() => setDraggingId(null)}
    >
      <PerspectiveCamera position={[cameraDistance, cameraDistance * 0.8, cameraDistance]} fov={50} />
      <OrbitControls
        enabled={!draggingId}
        target={[0, h * 0.3, 0]}
        minDistance={30}
        maxDistance={300}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />

      <ambientLight intensity={0.6} />
      <directionalLight position={[50, 100, 50]} intensity={0.8} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-50, 50, -50]} intensity={0.3} />

      <GlassTank length={tankSize.length} width={tankSize.width} height={tankSize.height} />

      <mesh
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={(event) => {
          if (!draggingId || !onMaterialMove) return
          event.stopPropagation()
          onMaterialMove(draggingId, { x: event.point.x, z: event.point.z })
        }}
        onPointerUp={() => setDraggingId(null)}
      >
        <planeGeometry args={[l, w]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {materials.map((m) => (
        <MaterialObject
          key={m.id}
          material={m}
          isSelected={selectedMaterialId === m.id}
          onClick={() => onMaterialSelect(m.id)}
          onDragStart={(event) => {
            event.stopPropagation()
            onMaterialSelect(m.id)
            setDraggingId(m.id)
          }}
        />
      ))}

      <gridHelper args={[200, 50, 0xE5E6EB, 0xE5E6EB]} position={[0, 0, 0]} />
    </group>
  )
}

export default function EditorCanvas({
  tankSize,
  materials,
  selectedMaterialId,
  onMaterialSelect,
  onMaterialMove,
  transformMode,
}: Props) {
  void transformMode

  return (
    <div className="w-full h-full bg-[#c9c9c9]">
      <Canvas
        shadows
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0xc9c9c9)
        }}
      >
        <Scene
          tankSize={tankSize}
          materials={materials}
          selectedMaterialId={selectedMaterialId}
          onMaterialSelect={onMaterialSelect}
          onMaterialMove={onMaterialMove}
        />
      </Canvas>
    </div>
  )
}
