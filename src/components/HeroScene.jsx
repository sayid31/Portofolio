import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

// Module-level — avoids React re-renders when mouse moves
const mouse = { x: 0, y: 0 }

// ── Wireframe icosahedron that tilts with mouse ───────────────────────────────

function Icosahedron() {
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return
    // Smooth lerp toward mouse position
    groupRef.current.rotation.y += (mouse.x * 0.5 - groupRef.current.rotation.y) * 0.035
    groupRef.current.rotation.x += (-mouse.y * 0.3 - groupRef.current.rotation.x) * 0.035
    // Constant slow spin
    groupRef.current.rotation.y += 0.0022
  })

  return (
    <group ref={groupRef} position={[3, 0.3, 0]}>
      {/* Wireframe shell */}
      <mesh>
        <icosahedronGeometry args={[1.65, 1]} />
        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.13} />
      </mesh>
      {/* Semi-transparent fill for depth */}
      <mesh>
        <icosahedronGeometry args={[1.63, 1]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.025} />
      </mesh>
    </group>
  )
}

// ── Floating torus (indigo accent) ────────────────────────────────────────────

function Torus() {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.x = t * 0.32
    ref.current.rotation.z = t * 0.2
    // Gentle float up/down
    ref.current.position.y = Math.sin(t * 0.55) * 0.18 + 2.0
  })

  return (
    <mesh ref={ref} position={[5, 2, -1.5]}>
      <torusGeometry args={[0.5, 0.09, 8, 28]} />
      <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.22} />
    </mesh>
  )
}

// ── Small octahedron (lower right, drift float) ───────────────────────────────

function Octahedron() {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.y = t * 0.65
    ref.current.rotation.x = t * 0.38
    ref.current.position.y = Math.sin(t * 0.72 + 1.2) * 0.22 - 2.1
  })

  return (
    <mesh ref={ref} position={[1.8, -2.1, -0.5]}>
      <octahedronGeometry args={[0.48, 0]} />
      <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.2} />
    </mesh>
  )
}

// ── Small indigo ring (far right, extra depth) ────────────────────────────────

function Ring() {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.y = t * 0.28
    ref.current.rotation.z = t * 0.15
  })

  return (
    <mesh ref={ref} position={[5.5, -1, -2]}>
      <torusGeometry args={[0.35, 0.04, 6, 20]} />
      <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.15} />
    </mesh>
  )
}

// ── Canvas export (lazy-loaded from Hero.jsx) ─────────────────────────────────

export default function HeroScene() {
  useEffect(() => {
    const track = (e) => {
      mouse.x = (e.clientX / window.innerWidth)  *  2 - 1
      mouse.y = (e.clientY / window.innerHeight) * -2 + 1
    }
    window.addEventListener('mousemove', track, { passive: true })
    return () => window.removeEventListener('mousemove', track)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 48 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%' }}
    >
      <Icosahedron />
      <Torus />
      <Octahedron />
      <Ring />
    </Canvas>
  )
}
