import { useRef, useEffect } from 'react'
import * as THREE from 'three'

// Module-level mouse state — no React re-renders on mouse move
const mouse = { x: 0, y: 0 }

// Generate points that form a rough human silhouette
function generateSilhouette(count) {
  const positions = []
  const velocities = []
  const delays = []

  for (let i = 0; i < count; i++) {
    // Parametric human silhouette using math
    const t = Math.random() * Math.PI * 2
    const section = Math.random()

    let x, y, z

    if (section < 0.35) {
      // Head — circle
      const r = 0.22 + Math.random() * 0.06
      x = Math.cos(t) * r
      y = Math.sin(t) * r + 1.6
      z = (Math.random() - 0.5) * 0.15
    } else if (section < 0.55) {
      // Neck + Shoulders — trapezoid
      const blend = (section - 0.35) / 0.2
      const shoulderW = 0.3 + blend * 0.5
      x = (Math.random() - 0.5) * shoulderW * 2
      y = 1.2 - blend * 0.3
      z = (Math.random() - 0.5) * 0.12
    } else if (section < 0.75) {
      // Torso — rectangle with slight taper
      const taper = 0.85 + Math.random() * 0.15
      x = (Math.random() - 0.5) * 0.55 * taper
      y = Math.random() * 0.6 + 0.4
      z = (Math.random() - 0.5) * 0.12
    } else if (section < 0.88) {
      // Arms — angled lines
      const side = Math.random() > 0.5 ? 1 : -1
      const armLen = Math.random()
      x = side * (0.28 + armLen * 0.55)
      y = 1.05 - armLen * 0.7
      z = (Math.random() - 0.5) * 0.08
    } else {
      // Legs — two lines
      const side = Math.random() > 0.5 ? 1 : -1
      const legLen = Math.random()
      x = side * (0.1 + legLen * 0.05)
      y = 0.4 - legLen * 0.9
      z = (Math.random() - 0.5) * 0.08
    }

    // Add slight randomness for organic feel
    x += (Math.random() - 0.5) * 0.04
    y += (Math.random() - 0.5) * 0.03
    z += (Math.random() - 0.5) * 0.02

    positions.push(x, y, z)
    velocities.push(
      (Math.random() - 0.5) * 0.002,
      (Math.random() - 0.5) * 0.002,
      (Math.random() - 0.5) * 0.001
    )
    delays.push(Math.random() * Math.PI * 2)
  }

  return { positions: new Float32Array(positions), velocities: new Float32Array(velocities), delays }
}

// Generate spark particles — float around the silhouette (group offset moves it left)
function generateSparks(count) {
  const positions = []
  const speeds = []
  const phases = []

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 0.2 + Math.random() * 0.4
    const height = (Math.random() - 0.5) * 1.8

    positions.push(
      Math.cos(angle) * radius,       // local coords — group offset handles position
      height + 0.2,
      Math.sin(angle) * radius * 0.4 - 0.5
    )
    speeds.push(0.3 + Math.random() * 0.7)
    phases.push(Math.random() * Math.PI * 2)
  }

  return { positions: new Float32Array(positions), speeds, phases }
}

export default function TerminalScene() {
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
    const w = el.clientWidth  || 1
    const h = el.clientHeight || 1

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
    camera.position.z = 4.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // ── Silhouette particles — smaller, offset to the right ─────
    const SILHOUETTE_COUNT = 2200
    const silData = generateSilhouette(SILHOUETTE_COUNT)

    const silGeo = new THREE.BufferGeometry()
    silGeo.setAttribute('position', new THREE.BufferAttribute(silData.positions, 3))

    const silMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.01,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const silPoints = new THREE.Points(silGeo, silMat)
    silPoints.scale.setScalar(0.75)        // smaller
    silPoints.position.set(-1.5, -0.3, 0)  // offset left-center
    scene.add(silPoints)

    // ── Spark particles — around the silhouette ─────────────────
    const SPARK_COUNT = 350
    const sparkData = generateSparks(SPARK_COUNT)

    const sparkGeo = new THREE.BufferGeometry()
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkData.positions, 3))

    const sparkMat = new THREE.PointsMaterial({
      color: 0xffcb6b,
      size: 0.022,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const sparkPoints = new THREE.Points(sparkGeo, sparkMat)
    sparkPoints.scale.setScalar(0.75)        // smaller
    sparkPoints.position.set(-1.5, -0.3, 0)  // offset left-center with silhouette
    scene.add(sparkPoints)

    // ── Glow ring behind silhouette ────────────────────────────
    const ringGeo = new THREE.RingGeometry(0.6, 1.2, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.position.set(-1.5, -0.3, -1.5)
    scene.add(ringMesh)

    // ── Outer glow ring ────────────────────────────────────────
    const outerRingGeo = new THREE.RingGeometry(1.4, 1.9, 64)
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.025,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat)
    outerRingMesh.position.set(-1.5, -0.3, -2)
    scene.add(outerRingMesh)

    // ── Animation loop ─────────────────────────────────────────
    let rafId
    const clock = new THREE.Clock()

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Silhouette: gentle breathing + mouse parallax
      silPoints.rotation.y += (mouse.x * 0.08 - silPoints.rotation.y) * 0.02
      silPoints.rotation.x += (-mouse.y * 0.05 - silPoints.rotation.x) * 0.02

      // Subtle breathing scale — must preserve base 0.75 size
      const breathe = 1 + Math.sin(t * 0.8) * 0.015
      silPoints.scale.setScalar(0.75 * breathe)

      // Silhouette particles: gentle float
      const silPos = silGeo.attributes.position.array
      for (let i = 0; i < SILHOUETTE_COUNT; i++) {
        const idx = i * 3
        const delay = silData.delays[i]
        silPos[idx]     += silData.velocities[idx]     * Math.sin(t * 0.5 + delay)
        silPos[idx + 1] += silData.velocities[idx + 1] * Math.cos(t * 0.4 + delay)
        silPos[idx + 2] += silData.velocities[idx + 2] * Math.sin(t * 0.3 + delay)
      }
      silGeo.attributes.position.needsUpdate = true

      // Sparks: fly upward and reset
      const sparkPos = sparkGeo.attributes.position.array
      for (let i = 0; i < SPARK_COUNT; i++) {
        const idx = i * 3
        const speed = sparkData.speeds[i]
        const phase = sparkData.phases[i]

        sparkPos[idx]     += Math.sin(t * speed + phase) * 0.001
        sparkPos[idx + 1] += speed * 0.003
        sparkPos[idx + 2] += Math.cos(t * speed * 0.5 + phase) * 0.0005

        // Reset when too high — local coords (group offset places it left)
        if (sparkPos[idx + 1] > 2.0) {
          sparkPos[idx]     = (Math.random() - 0.5) * 1.3
          sparkPos[idx + 1] = -1.2
          sparkPos[idx + 2] = (Math.random() - 0.5) * 0.6 - 0.5
        }
      }
      sparkGeo.attributes.position.needsUpdate = true

      // Spark opacity pulsing
      sparkMat.opacity = 0.6 + Math.sin(t * 2) * 0.25

      // Glow rings: gentle rotation + pulse
      ringMesh.rotation.z = t * 0.05
      ringMat.opacity = 0.03 + Math.sin(t * 0.6) * 0.015

      outerRingMesh.rotation.z = -t * 0.03
      outerRingMat.opacity = 0.02 + Math.sin(t * 0.4 + 1) * 0.01

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize handler ─────────────────────────────────────────
    const onResize = () => {
      const rw = el.clientWidth  || 1
      const rh = el.clientHeight || 1
      camera.aspect = rw / rh
      camera.updateProjectionMatrix()
      renderer.setSize(rw, rh)
    }
    window.addEventListener('resize', onResize)

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      silGeo.dispose()
      silMat.dispose()
      sparkGeo.dispose()
      sparkMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      outerRingGeo.dispose()
      outerRingMat.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
