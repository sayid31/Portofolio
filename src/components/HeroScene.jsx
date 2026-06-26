import { useRef, useEffect } from 'react'
import * as THREE from 'three'

// Module-level mouse state — no React re-renders on mouse move
const mouse = { x: 0, y: 0 }

export default function HeroScene() {
  const mountRef = useRef(null)

  // Mouse tracking
  useEffect(() => {
    const track = (e) => {
      mouse.x = (e.clientX / window.innerWidth)  *  2 - 1
      mouse.y = (e.clientY / window.innerHeight) * -2 + 1
    }
    window.addEventListener('mousemove', track, { passive: true })
    return () => window.removeEventListener('mousemove', track)
  }, [])

  // Three.js scene
  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    // ── Scene / camera ─────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, el.clientWidth / el.clientHeight, 0.1, 100)
    camera.position.z = 7

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // ── Helpers ────────────────────────────────────────────────
    const wire = (geo, color, opacity = 0.13) => {
      const mat  = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })
      const fill = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: opacity * 0.2 })
      const mesh = new THREE.Mesh(geo, mat)
      const inner = new THREE.Mesh(geo.clone(), fill)
      inner.scale.setScalar(0.995)
      const group = new THREE.Group()
      group.add(mesh, inner)
      return group
    }

    // ── Shapes ─────────────────────────────────────────────────
    // Main icosahedron — right side, follows mouse
    const icoGeo   = new THREE.IcosahedronGeometry(1.65, 1)
    const icoGroup = wire(icoGeo, 0x10b981, 0.13)
    icoGroup.position.set(3, 0.3, 0)
    scene.add(icoGroup)

    // Torus — upper right, indigo
    const torGeo  = new THREE.TorusGeometry(0.5, 0.09, 8, 28)
    const torMesh = new THREE.Mesh(
      torGeo,
      new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.22 })
    )
    torMesh.position.set(5, 2, -1.5)
    scene.add(torMesh)

    // Small octahedron — lower right
    const octGeo  = new THREE.OctahedronGeometry(0.48, 0)
    const octMesh = new THREE.Mesh(
      octGeo,
      new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.2 })
    )
    octMesh.position.set(1.8, -2.1, -0.5)
    scene.add(octMesh)

    // Tiny torus ring — far right
    const ringGeo  = new THREE.TorusGeometry(0.35, 0.04, 6, 20)
    const ringMesh = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.15 })
    )
    ringMesh.position.set(5.5, -1, -2)
    scene.add(ringMesh)

    // ── Animation loop ─────────────────────────────────────────
    let rafId
    const clock = new THREE.Clock()

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Icosahedron: smooth mouse lerp + auto-spin
      icoGroup.rotation.y += (mouse.x * 0.5 - icoGroup.rotation.y) * 0.035
      icoGroup.rotation.x += (-mouse.y * 0.3 - icoGroup.rotation.x) * 0.035
      icoGroup.rotation.y += 0.0022

      // Torus: spin + float
      torMesh.rotation.x = t * 0.32
      torMesh.rotation.z = t * 0.20
      torMesh.position.y = Math.sin(t * 0.55) * 0.18 + 2.0

      // Octahedron: spin + float
      octMesh.rotation.y = t * 0.65
      octMesh.rotation.x = t * 0.38
      octMesh.position.y = Math.sin(t * 0.72 + 1.2) * 0.22 - 2.1

      // Ring: slow drift
      ringMesh.rotation.y = t * 0.28
      ringMesh.rotation.z = t * 0.15

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize handler ─────────────────────────────────────────
    const onResize = () => {
      if (!el) return
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}
