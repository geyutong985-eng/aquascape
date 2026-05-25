"use client"

import { Suspense, useEffect, useMemo } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import * as THREE from "three"

function PreviewModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const model = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.material = new THREE.MeshStandardMaterial({
        color: "#6f7b73",
        roughness: 0.62,
        metalness: 0.04,
      })
    })

    const box = new THREE.Box3().setFromObject(root)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDimension = Math.max(size.x, size.y, size.z) || 1
    const group = new THREE.Group()

    root.position.set(-center.x, -center.y, -center.z)
    group.scale.setScalar(2.8 / maxDimension)
    group.add(root)

    return group
  }, [scene])

  return <primitive object={model} />
}

function PreviewFallback() {
  return (
    <group>
      <mesh rotation={[0.18, 0.16, -0.12]}>
        <cylinderGeometry args={[0.48, 0.72, 2.5, 20]} />
        <meshStandardMaterial color="#6f7b73" roughness={0.72} transparent opacity={0.48} />
      </mesh>
      <mesh position={[0.2, 0.28, 0.2]}>
        <sphereGeometry args={[0.34, 18, 12]} />
        <meshStandardMaterial color="#eaf3f0" roughness={0.8} />
      </mesh>
    </group>
  )
}

function FitOnResize() {
  const { invalidate } = useThree()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => invalidate())
    return () => window.cancelAnimationFrame(frame)
  }, [invalidate])

  return null
}

export default function ModelCardPreview({ path, live = false }: { path: string; live?: boolean }) {
  useEffect(() => {
    useGLTF.preload(path)
  }, [path])

  return (
    <Canvas
      frameloop={live ? "always" : "demand"}
      dpr={[1, 1.25]}
      resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      camera={{ position: [3.4, 2.4, 4.2], fov: 38 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ display: "block", height: "100%", width: "100%" }}
    >
      <FitOnResize />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 3]} intensity={1.5} />
      <Suspense fallback={<PreviewFallback />}>
        <PreviewModel path={path} />
      </Suspense>
      {live && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.9} />}
    </Canvas>
  )
}
