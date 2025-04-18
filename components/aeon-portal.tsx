"use client"

import { useRef, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AdaptiveDpr } from "@react-three/drei"
import * as THREE from "three"

interface AeonPortalProps {
  scrollY: number
}

export function AeonPortal({ scrollY }: AeonPortalProps) {
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        depth: false,
        stencil: false,
      }}
    >
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.1} />
      <PortalEffect scrollY={scrollY} />
    </Canvas>
  )
}

function PortalEffect({ scrollY }: { scrollY: number }) {
  const portalRef = useRef<THREE.Group>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)
  const { size, viewport } = useThree()

  // Animation state for smooth transitions
  const animationState = useRef({
    rotation: { y: 0, x: 0 },
    innerRotation: 0,
    outerRotation: 0,
    glowIntensity: 1.2,
    lastScrollY: 0,
    lastFrameTime: 0,
    fps: 60,
  })

  // Responsive sizing
  const responsiveScale = Math.min(1, viewport.width / 10)

  // Memoize geometry to prevent recreation
  const geometries = useMemo(() => {
    return {
      innerRing: new THREE.RingGeometry(1.0, 1.2, 64, 1),
      middleRing: new THREE.RingGeometry(1.5, 1.7, 64, 1),
      outerRing: new THREE.RingGeometry(2.0, 2.1, 64, 1),
    }
  }, [])

  // Create materials with custom shaders
  const materials = useMemo(() => {
    // Inner ring shader - iridescent effect
    const innerRingMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: animationState.current.glowIntensity },
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        varying vec2 vUv;
        
        // Function to create iridescent effect
        vec3 iridescence(float angle) {
          // Create a subtle iridescent effect
          vec3 baseColor = vec3(0.96, 0.95, 0.94); // Porcelain white
          vec3 accentColor1 = vec3(0.61, 0.61, 0.61); // Ether gray
          vec3 accentColor2 = vec3(0.05, 0.05, 0.05); // Deep obsidian
          
          float t1 = 0.5 + 0.5 * sin(angle * 5.0 + time * 0.5);
          float t2 = 0.5 + 0.5 * sin(angle * 3.0 - time * 0.3);
          
          vec3 color = mix(baseColor, accentColor1, t1 * 0.7);
          color = mix(color, accentColor2, t2 * 0.3);
          
          return color * intensity;
        }
        
        void main() {
          // Calculate angle for iridescent effect
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          
          // Create pulsating effect
          float pulse = 1.0 + 0.1 * sin(time * 0.4);
          
          // Get iridescent color
          vec3 color = iridescence(angle) * pulse;
          
          // Add subtle glow
          float glow = 0.8 + 0.2 * sin(time * 0.3);
          
          gl_FragColor = vec4(color, glow);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    // Middle ring shader - more solid
    const middleRingMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          // Ether gray with subtle variation
          vec3 color = vec3(0.61, 0.61, 0.61);
          
          // Add subtle pulsing
          float pulse = 0.9 + 0.1 * sin(time * 0.2);
          color *= pulse;
          
          gl_FragColor = vec4(color, 0.7);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    // Outer ring shader - obsidian with subtle glow
    const outerRingMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          // Deep obsidian base
          vec3 color = vec3(0.05, 0.05, 0.05);
          
          // Add subtle edge glow
          float edgeGlow = smoothstep(0.4, 0.5, abs(vUv.x - 0.5) + abs(vUv.y - 0.5));
          vec3 glowColor = vec3(0.3, 0.3, 0.3);
          
          // Subtle time variation
          float variation = 0.95 + 0.05 * sin(time * 0.15);
          
          color = mix(color, glowColor, edgeGlow * variation);
          
          gl_FragColor = vec4(color, 0.9);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    return { innerRingMaterial, middleRingMaterial, outerRingMaterial }
  }, [])

  // Animation loop with frame timing and smooth interpolation
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const deltaTime = state.clock.getDelta()

    // Calculate FPS for adaptive quality
    const currentTime = performance.now()
    if (currentTime - animationState.current.lastFrameTime > 1000) {
      animationState.current.fps = 1 / deltaTime
      animationState.current.lastFrameTime = currentTime
    }

    // Calculate scroll velocity for more responsive animations
    const scrollVelocity = scrollY - animationState.current.lastScrollY
    animationState.current.lastScrollY = scrollY

    // Target values based on scroll with velocity influence
    const targetRotationSpeed = 0.05 - Math.min(0.03, scrollY / 8000) + Math.abs(scrollVelocity) * 0.00005
    const targetInnerRotationSpeed = -0.03 - Math.min(0.02, scrollY / 10000) - Math.abs(scrollVelocity) * 0.00003
    const targetOuterRotationSpeed = 0.02 - Math.min(0.01, scrollY / 12000) + Math.abs(scrollVelocity) * 0.00002
    const targetGlowIntensity = 1.2 - Math.min(0.3, scrollY / 3000)

    // Adaptive smoothing based on frame rate
    const baseLerpFactor = 0.03 // Slower for more ritualistic feel
    const adaptiveLerpFactor = baseLerpFactor * (60 / Math.max(30, animationState.current.fps))

    // Update rotation values with adaptive lerp
    animationState.current.rotation.y += targetRotationSpeed * deltaTime * 60 * 0.01

    // Smoother scroll response for x rotation
    const targetXRotation = scrollY * 0.00005 // More subtle
    animationState.current.rotation.x += (targetXRotation - animationState.current.rotation.x) * adaptiveLerpFactor

    // Update ring rotations with adaptive lerp
    animationState.current.innerRotation += targetInnerRotationSpeed * deltaTime * 60 * 0.01
    animationState.current.outerRotation += targetOuterRotationSpeed * deltaTime * 60 * 0.01

    // Update glow intensity with adaptive lerp
    animationState.current.glowIntensity +=
      (targetGlowIntensity - animationState.current.glowIntensity) * adaptiveLerpFactor

    // Update shader uniforms
    materials.innerRingMaterial.uniforms.time.value = time
    materials.innerRingMaterial.uniforms.intensity.value = animationState.current.glowIntensity
    materials.middleRingMaterial.uniforms.time.value = time
    materials.outerRingMaterial.uniforms.time.value = time

    // Apply the smoothed values to the actual objects
    if (portalRef.current) {
      portalRef.current.rotation.y = animationState.current.rotation.y
      portalRef.current.rotation.x = animationState.current.rotation.x
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = animationState.current.innerRotation
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = animationState.current.outerRotation
    }
  })

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      // Dispose of geometries and materials to prevent memory leaks
      Object.values(geometries).forEach((geometry) => geometry.dispose())
      Object.values(materials).forEach((material) => material.dispose())
    }
  }, [geometries, materials])

  // Create a subtle particle system for the background
  const ParticleField = useMemo(() => {
    return (
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={(() => {
              const arr = new Float32Array(200 * 3)
              for (let i = 0; i < 200; i++) {
                arr[i * 3] = (Math.random() - 0.5) * 10
                arr[i * 3 + 1] = (Math.random() - 0.5) * 10
                arr[i * 3 + 2] = (Math.random() - 0.5) * 10
              }
              return arr
            })()}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#9C9C9C" transparent opacity={0.6} />
      </points>
    )
  }, [])

  return (
    <>
      {ParticleField}
      <group ref={portalRef} scale={[responsiveScale, responsiveScale, responsiveScale]}>
        {/* Inner ring */}
        <mesh
          ref={innerRingRef}
          material={materials.innerRingMaterial}
          geometry={geometries.innerRing}
          renderOrder={2}
        />

        {/* Middle ring */}
        <mesh material={materials.middleRingMaterial} geometry={geometries.middleRing} renderOrder={1} />

        {/* Outer ring */}
        <mesh
          ref={outerRingRef}
          material={materials.outerRingMaterial}
          geometry={geometries.outerRing}
          renderOrder={0}
        />
      </group>
    </>
  )
}
