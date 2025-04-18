"use client"

import { useRef, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AdaptiveDpr } from "@react-three/drei"
import * as THREE from "three"

interface EnchantedUniverseProps {
  scrollY: number
}

export function EnchantedUniverse({ scrollY }: EnchantedUniverseProps) {
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
      <CosmicEffect scrollY={scrollY} />
    </Canvas>
  )
}

function CosmicEffect({ scrollY }: { scrollY: number }) {
  const universeRef = useRef<THREE.Group>(null)
  const starsRef = useRef<THREE.Points>(null)
  const constellationRef = useRef<THREE.Line>(null)
  const glyphsRef = useRef<THREE.Group>(null)
  const { size, viewport } = useThree()

  // Animation state for smooth transitions
  const animationState = useRef({
    rotation: { y: 0, x: 0 },
    starsPulsation: 0,
    glyphRotation: 0,
    glowIntensity: 1.2,
    lastScrollY: 0,
    lastFrameTime: 0,
    fps: 60,
  })

  // Responsive sizing
  const responsiveScale = Math.min(1, viewport.width / 10)

  // Create star particles
  const starParticles = useMemo(() => {
    const starCount = 500
    const positions = new Float32Array(starCount * 3)
    const sizes = new Float32Array(starCount)
    const colors = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount; i++) {
      // Position stars in a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 2 + Math.random() * 8

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Vary star sizes
      sizes[i] = Math.random() * 0.1 + 0.02

      // Create a subtle color palette
      const colorChoice = Math.random()
      if (colorChoice < 0.7) {
        // White/blue stars (majority)
        colors[i * 3] = 0.9 + Math.random() * 0.1 // R
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1 // G
        colors[i * 3 + 2] = 1.0 // B
      } else if (colorChoice < 0.85) {
        // Subtle gold
        colors[i * 3] = 0.9 // R
        colors[i * 3 + 1] = 0.8 // G
        colors[i * 3 + 2] = 0.6 // B
      } else {
        // Subtle purple
        colors[i * 3] = 0.8 // R
        colors[i * 3 + 1] = 0.6 // G
        colors[i * 3 + 2] = 0.9 // B
      }
    }

    return { positions, sizes, colors }
  }, [])

  // Create constellation lines
  const constellationGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()

    // Create a mystical constellation pattern
    const points = [
      new THREE.Vector3(-1.2, 0.8, 0),
      new THREE.Vector3(-0.5, 1.5, 0),
      new THREE.Vector3(0.7, 1.2, 0),
      new THREE.Vector3(1.3, 0.3, 0),
      new THREE.Vector3(0.8, -0.7, 0),
      new THREE.Vector3(-0.2, -1.1, 0),
      new THREE.Vector3(-1.0, -0.4, 0),
      new THREE.Vector3(-1.2, 0.8, 0), // Close the loop
    ]

    geometry.setFromPoints(points)
    return geometry
  }, [])

  // Create mystical glyphs
  const glyphGeometries = useMemo(() => {
    // Create several mystical symbols/glyphs
    const circle = new THREE.RingGeometry(0.2, 0.25, 32)

    // Create a pentagram
    const pentagram = new THREE.BufferGeometry()
    const pentPoints = []
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      pentPoints.push(new THREE.Vector3(0.3 * Math.cos(angle), 0.3 * Math.sin(angle), 0))

      // Connect to the point two ahead (creates the star pattern)
      const nextIndex = (i + 2) % 5
      const nextAngle = (nextIndex * 2 * Math.PI) / 5 - Math.PI / 2
      pentPoints.push(new THREE.Vector3(0.3 * Math.cos(nextAngle), 0.3 * Math.sin(nextAngle), 0))

      // Add a null point to break the line
      if (i < 4) {
        pentPoints.push(new THREE.Vector3(0.3 * Math.cos(angle), 0.3 * Math.sin(angle), 0))
      }
    }
    pentagram.setFromPoints(pentPoints)

    // Create a spiral
    const spiral = new THREE.BufferGeometry()
    const spiralPoints = []
    for (let i = 0; i < 100; i++) {
      const angle = 0.1 * i
      const radius = 0.01 * i
      spiralPoints.push(new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0))
    }
    spiral.setFromPoints(spiralPoints)

    return { circle, pentagram, spiral }
  }, [])

  // Create materials with custom shaders
  const materials = useMemo(() => {
    // Star particles shader
    const starsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          
          // Subtle pulsation based on position and time
          float pulseFactor = 0.8 + 0.2 * sin(time * 0.3 + position.x * 2.0 + position.y * 2.0 + position.z * 2.0);
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pulseFactor * size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create a soft circular point
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          // Soften the edges
          float alpha = 1.0 - smoothstep(0.3, 0.5, r);
          
          // Add a subtle glow
          vec3 glow = vColor * (1.0 - r * 1.5);
          
          gl_FragColor = vec4(glow, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    // Constellation lines shader
    const constellationMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        uniform float time;
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
          // Create a flowing effect along the line
          float flow = fract(vUv.x - time * 0.1);
          
          // Make the line fade in and out
          float opacity = 0.3 + 0.2 * sin(time * 0.2);
          
          // Brighter at the nodes
          float nodeBrightness = smoothstep(0.45, 0.5, flow) - smoothstep(0.5, 0.55, flow);
          nodeBrightness = max(0.0, nodeBrightness * 3.0);
          
          // Subtle color variation
          vec3 baseColor = vec3(0.9, 0.9, 1.0); // Slightly blue-white
          vec3 accentColor = vec3(0.8, 0.7, 1.0); // Subtle purple
          
          vec3 finalColor = mix(baseColor, accentColor, sin(time * 0.3) * 0.5 + 0.5);
          
          gl_FragColor = vec4(finalColor, (opacity + nodeBrightness) * smoothstep(0.0, 0.1, 1.0 - abs(vUv.y - 0.5) * 2.0));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    // Glyph shader
    const glyphMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        uniform float time;
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
          // Create a subtle pulsing glow
          float pulse = 0.7 + 0.3 * sin(time * 0.4);
          
          // Iridescent effect
          vec3 baseColor = vec3(0.9, 0.9, 1.0); // White base
          vec3 color1 = vec3(0.7, 0.9, 1.0); // Light blue
          vec3 color2 = vec3(0.9, 0.7, 1.0); // Light purple
          
          float t = sin(time * 0.2) * 0.5 + 0.5;
          vec3 iridescence = mix(color1, color2, t);
          
          // Edge glow
          float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
          edge = pow(edge, 0.5);
          
          vec3 finalColor = mix(baseColor, iridescence, edge) * pulse;
          
          gl_FragColor = vec4(finalColor, edge * 0.7);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    // Nebula background shader
    const nebulaBackgroundMaterial = new THREE.ShaderMaterial({
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
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          // Create a subtle nebula effect
          vec2 uv = vUv * 2.0 - 1.0;
          
          // Multiple layers of noise
          float n1 = snoise(uv * 1.5 + time * 0.02);
          float n2 = snoise(uv * 3.0 - time * 0.01);
          float n3 = snoise(uv * 5.0 + time * 0.03);
          
          // Combine noise layers
          float noise = 0.5 * n1 + 0.3 * n2 + 0.2 * n3;
          
          // Create color gradients
          vec3 darkBlue = vec3(0.05, 0.05, 0.1); // Deep space
          vec3 purple = vec3(0.2, 0.05, 0.3); // Cosmic purple
          vec3 teal = vec3(0.05, 0.2, 0.2); // Cosmic teal
          
          // Mix colors based on noise and position
          vec3 color = mix(darkBlue, purple, noise * 0.5 + 0.5);
          color = mix(color, teal, length(uv) * 0.2);
          
          // Add distance falloff for a vignette effect
          float falloff = 1.0 - length(uv) * 0.7;
          falloff = max(0.0, falloff);
          falloff = pow(falloff, 2.0);
          
          // Final color with opacity
          gl_FragColor = vec4(color * falloff, falloff * 0.3);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return {
      starsMaterial,
      constellationMaterial,
      glyphMaterial,
      nebulaBackgroundMaterial,
    }
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
    const targetRotationSpeed = 0.03 - Math.min(0.02, scrollY / 10000) + Math.abs(scrollVelocity) * 0.00003
    const targetGlyphRotationSpeed = 0.02 - Math.min(0.01, scrollY / 12000) + Math.abs(scrollVelocity) * 0.00002
    const targetGlowIntensity = 1.2 - Math.min(0.3, scrollY / 3000)

    // Adaptive smoothing based on frame rate
    const baseLerpFactor = 0.02 // Very slow for an ethereal feel
    const adaptiveLerpFactor = baseLerpFactor * (60 / Math.max(30, animationState.current.fps))

    // Update rotation values with adaptive lerp
    animationState.current.rotation.y += targetRotationSpeed * deltaTime * 60 * 0.01

    // Smoother scroll response for x rotation
    const targetXRotation = scrollY * 0.00003 // Very subtle
    animationState.current.rotation.x += (targetXRotation - animationState.current.rotation.x) * adaptiveLerpFactor

    // Update glyph rotation
    animationState.current.glyphRotation += targetGlyphRotationSpeed * deltaTime * 60 * 0.01

    // Update glow intensity with adaptive lerp
    animationState.current.glowIntensity +=
      (targetGlowIntensity - animationState.current.glowIntensity) * adaptiveLerpFactor

    // Update shader uniforms
    materials.starsMaterial.uniforms.time.value = time
    materials.constellationMaterial.uniforms.time.value = time
    materials.glyphMaterial.uniforms.time.value = time
    materials.nebulaBackgroundMaterial.uniforms.time.value = time

    // Apply the smoothed values to the actual objects
    if (universeRef.current) {
      universeRef.current.rotation.y = animationState.current.rotation.y
      universeRef.current.rotation.x = animationState.current.rotation.x
    }

    if (glyphsRef.current) {
      glyphsRef.current.rotation.z = animationState.current.glyphRotation
    }
  })

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      // Dispose of geometries and materials to prevent memory leaks
      Object.values(glyphGeometries).forEach((geometry) => geometry.dispose())
      Object.values(materials).forEach((material) => material.dispose())
    }
  }, [glyphGeometries, materials])

  return (
    <>
      {/* Background nebula */}
      <mesh renderOrder={0}>
        <planeGeometry args={[20, 20]} />
        <primitive object={materials.nebulaBackgroundMaterial} attach="material" />
      </mesh>

      <group ref={universeRef} scale={[responsiveScale, responsiveScale, responsiveScale]}>
        {/* Star particles */}
        <points ref={starsRef} renderOrder={1}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[starParticles.positions, 3]}
              count={starParticles.positions.length / 3}
            />
            <bufferAttribute
              attach="attributes-size"
              args={[starParticles.sizes, 1]}
              count={starParticles.sizes.length}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[starParticles.colors, 3]}
              count={starParticles.colors.length / 3}
            />
          </bufferGeometry>
          <primitive object={materials.starsMaterial} attach="material" />
        </points>

        {/* Constellation lines */}
        <lineSegments ref={constellationRef} geometry={constellationGeometry} renderOrder={2}>
          <primitive object={materials.constellationMaterial} attach="material" />
        </lineSegments>

        {/* Mystical glyphs */}
        <group ref={glyphsRef} renderOrder={3}>
          <lineSegments geometry={glyphGeometries.pentagram} position={[1.5, 0.8, 0]}>
            <primitive object={materials.glyphMaterial} attach="material" />
          </lineSegments>

          <lineSegments geometry={glyphGeometries.spiral} position={[-1.5, -0.8, 0]}>
            <primitive object={materials.glyphMaterial} attach="material" />
          </lineSegments>

          <mesh geometry={glyphGeometries.circle} position={[0, 1.5, 0]}>
            <primitive object={materials.glyphMaterial} attach="material" />
          </mesh>
        </group>
      </group>
    </>
  )
}
