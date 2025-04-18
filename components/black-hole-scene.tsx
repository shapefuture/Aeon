"use client"

import { useRef, useEffect, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Stars, useTexture, AdaptiveDpr, PerformanceMonitor } from "@react-three/drei"
import * as THREE from "three"

interface BlackHoleSceneProps {
  scrollY: number
}

export function BlackHoleScene({ scrollY }: BlackHoleSceneProps) {
  // Use a ref to track if the component is mounted to avoid memory leaks
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
        // Disable depth testing for better blending of transparent objects
        depth: false,
        stencil: false,
      }}
    >
      {/* Adaptive DPR adjusts pixel ratio based on device performance */}
      <AdaptiveDpr pixelated />

      {/* Performance monitor to adjust quality based on frame rate */}
      <PerformanceMonitor
        onDecline={(api) => {
          // The performance monitor passes an API object, not a direct fps value
          console.log("Performance declining, reducing quality")
          if (typeof api === "object" && api !== null) {
            // Safely access fps if it exists in the API object
            const fps = api.fps !== undefined ? api.fps : 0
            console.log(`Current FPS: ${typeof fps === "number" ? fps.toFixed(2) : "unknown"} FPS`)
          }
        }}
      >
        <ambientLight intensity={0.1} />
        <BlackHoleWithPerformanceOptimization scrollY={scrollY} />
      </PerformanceMonitor>
    </Canvas>
  )
}

interface BlackHoleProps {
  scrollY: number
}

// Wrapper component that handles performance optimization
function BlackHoleWithPerformanceOptimization({ scrollY }: BlackHoleProps) {
  const { gl, scene, camera } = useThree()
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high")

  const animate = useCallback(() => {
    gl.render(scene, camera)
  }, [gl, scene, camera])

  // Monitor performance and adjust quality
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause heavy animations when tab is not visible
        gl.setAnimationLoop(null)
      } else {
        gl.setAnimationLoop(animate)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      gl.setAnimationLoop(null)
    }
  }, [gl, animate])

  // Adjust quality based on device capabilities
  useEffect(() => {
    // Check if device is low-powered
    const isLowPowered = () => {
      const userAgent = navigator.userAgent
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isOldDevice = /iPhone\s(5|6|7|8)/i.test(userAgent) || /iPad\s(1|2|3|4)/i.test(userAgent)

      return isMobile && isOldDevice
    }

    if (isLowPowered()) {
      setQuality("low")
    }
  }, [])

  return <BlackHole scrollY={scrollY} quality={quality} />
}

function BlackHole({ scrollY, quality = "high" }: BlackHoleProps & { quality?: "low" | "medium" | "high" }) {
  const blackHoleRef = useRef<THREE.Group>(null)
  const diskRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const { size, viewport } = useThree()

  // Animation state refs for smooth transitions
  const animationState = useRef({
    rotation: { y: 0, x: 0 },
    diskRotation: 0,
    glowIntensity: 1.5,
    lastScrollY: 0,
    lastFrameTime: 0,
    fps: 60,
  })

  // Responsive sizing
  const responsiveScale = Math.min(1, viewport.width / 10)

  // Memoize geometry to prevent recreation on each render
  const geometries = useMemo(() => {
    // Adjust detail level based on quality
    const sphereDetail = quality === "high" ? 64 : quality === "medium" ? 32 : 16
    const ringDetail = quality === "high" ? 64 : quality === "medium" ? 32 : 16

    return {
      blackHoleSphere: new THREE.SphereGeometry(1, sphereDetail, sphereDetail),
      accretionDisk: new THREE.RingGeometry(1.5, 4, ringDetail),
      glowSphere: new THREE.SphereGeometry(2.5, sphereDetail / 2, sphereDetail / 2),
    }
  }, [quality])

  // Create textures for the accretion disk - memoized to prevent recreation
  const diskTexture = useTexture("/icons/icon-512x512.png") // Using existing app icon as fallback texture

  // Create materials with optimized shaders based on quality
  const materials = useMemo(() => {
    // Simplified shader for low quality
    const getFragmentShaderComplexity = () => {
      if (quality === "low") {
        return `
          uniform float time;
          uniform vec3 glowColor;
          uniform float glowIntensity;
          
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec2 vUv;
          
          void main() {
            // Simplified calculation for low-end devices
            float rimFactor = 0.5;
            vec3 glowEffect = glowColor * rimFactor * glowIntensity;
            vec3 blackHoleColor = vec3(0.0, 0.0, 0.0);
            float distFromCenter = length(vUv - vec2(0.5, 0.5)) * 2.0;
            float glowMask = smoothstep(0.7, 1.0, distFromCenter);
            vec3 finalColor = mix(blackHoleColor, glowEffect, glowMask);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `
      }

      return `
        uniform float time;
        uniform vec3 glowColor;
        uniform float glowIntensity;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          // Calculate rim lighting effect for the event horizon glow
          float rimPower = 2.0;
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float rimFactor = 1.0 - max(0.0, dot(viewDir, vNormal));
          rimFactor = pow(rimFactor, rimPower);
          
          // Create pulsating glow effect - optimized for smoothness
          float pulseSpeed = 0.8; 
          float pulseIntensity = 0.12;
          float pulse = 1.0 + pulseIntensity * sin(time * pulseSpeed);
          
          // Combine effects
          vec3 glowEffect = glowColor * rimFactor * pulse * glowIntensity;
          
          // Core of black hole is pure black
          vec3 blackHoleColor = vec3(0.0, 0.0, 0.0);
          
          // Blend between black hole and glow based on distance from center
          float distFromCenter = length(vUv - vec2(0.5, 0.5)) * 2.0;
          float glowMask = smoothstep(0.7, 1.0, distFromCenter);
          
          vec3 finalColor = mix(blackHoleColor, glowEffect, glowMask);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    }

    const blackHoleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        glowColor: { value: new THREE.Color(0.5, 0.2, 1.0) },
        glowIntensity: { value: animationState.current.glowIntensity },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: getFragmentShaderComplexity(),
      transparent: true,
    })

    // Simplified disk shader for low quality
    const getDiskShaderComplexity = () => {
      if (quality === "low") {
        return `
          uniform float time;
          uniform sampler2D baseTexture;
          varying vec2 vUv;
          
          void main() {
            // Simplified calculation for low-end devices
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vUv, center);
            vec3 innerColor = vec3(1.0, 0.5, 1.0);
            vec3 outerColor = vec3(0.2, 0.0, 0.5);
            vec3 color = mix(innerColor, outerColor, dist * 2.0);
            float alpha = smoothstep(0.1, 0.25, dist) * smoothstep(1.0, 0.75, dist);
            gl_FragColor = vec4(color, alpha);
          }
        `
      }

      return `
        uniform float time;
        uniform sampler2D baseTexture;
        varying vec2 vUv;
        
        void main() {
          // Calculate distance from center
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          
          // Create swirling effect with smoother animation
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          float swirl = sin(angle * 6.0 + time * 1.2) * 0.5 + 0.5; // Reduced frequency and speed
          
          // Create color gradient based on distance and swirl
          vec3 innerColor = vec3(1.0, 0.5, 1.0); // Purple-pink
          vec3 outerColor = vec3(0.2, 0.0, 0.5); // Deep purple
          vec3 color = mix(innerColor, outerColor, dist * 2.0);
          
          // Add some brightness variation with smoother transition
          float brightness = 1.0 + 0.15 * sin(dist * 12.0 + time * 0.6); // Reduced frequency
          color *= brightness;
          
          // Add glow at inner edge
          float innerGlow = smoothstep(0.2, 0.4, 1.0 - dist * 2.0);
          color += vec3(1.0, 0.7, 1.0) * innerGlow * 0.8;
          
          // Mask out the inner part (black hole) with smoother transition
          float alpha = smoothstep(0.1, 0.25, dist) * smoothstep(1.0, 0.75, dist);
          
          gl_FragColor = vec4(color, alpha);
        }
      `
    }

    const diskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseTexture: { value: diskTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: getDiskShaderComplexity(),
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false, // Improve transparency rendering
    })

    // Simplified glow shader for low quality
    const getGlowShaderComplexity = () => {
      if (quality === "low") {
        return `
          uniform float time;
          uniform vec3 glowColor;
          uniform float glowIntensity;
          
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          void main() {
            // Simplified calculation for low-end devices
            float dist = length(vPosition);
            float gradient = 1.0 - smoothstep(0.0, 1.0, dist);
            vec3 finalColor = glowColor * gradient * glowIntensity;
            float alpha = gradient * 0.6;
            gl_FragColor = vec4(finalColor, alpha);
          }
        `
      }

      return `
        uniform float time;
        uniform vec3 glowColor;
        uniform float glowIntensity;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          // Calculate distance from center
          float dist = length(vPosition);
          
          // Create pulsating effect with smoother animation
          float pulse = 1.0 + 0.12 * sin(time * 0.8); // Reduced frequency and intensity
          
          // Create radial gradient with smoother falloff
          float gradient = 1.0 - smoothstep(0.0, 1.0, dist);
          gradient = pow(gradient, 1.5); // Softer falloff
          
          // Final color with pulsating effect
          vec3 finalColor = glowColor * gradient * pulse * glowIntensity;
          float alpha = gradient * 0.6;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `
    }

    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        glowColor: { value: new THREE.Color(0.5, 0.2, 1.0) },
        glowIntensity: { value: animationState.current.glowIntensity },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: getGlowShaderComplexity(),
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // Improve transparency rendering
    })

    return { blackHoleMaterial, diskMaterial, glowMaterial }
  }, [quality, diskTexture])

  // Stars component with optimized settings
  const OptimizedStars = useMemo(() => {
    // Adjust star count based on quality
    const starCount = quality === "high" ? 3000 : quality === "medium" ? 1500 : 800

    return (
      <Stars
        radius={100}
        depth={50}
        count={starCount}
        factor={4}
        saturation={0}
        fade
        speed={0.3} // Slower star movement for smoother effect and better performance
      />
    )
  }, [quality])

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
    const targetRotationSpeed = 0.2 - Math.min(0.15, scrollY / 5000) + Math.abs(scrollVelocity) * 0.0001
    const targetDiskRotationSpeed = 0.1 - Math.min(0.08, scrollY / 8000) + Math.abs(scrollVelocity) * 0.00005
    const targetGlowIntensity = 1.5 - Math.min(0.5, scrollY / 2000)

    // Adaptive smoothing based on frame rate
    // Lower frame rates get stronger smoothing to hide jank
    const baseLerpFactor = 0.05
    const adaptiveLerpFactor = baseLerpFactor * (60 / Math.max(30, animationState.current.fps))

    // Update rotation values with adaptive lerp
    animationState.current.rotation.y += targetRotationSpeed * deltaTime * 60 * 0.01 // Normalize by frame rate

    // Smoother scroll response for x rotation
    const targetXRotation = scrollY * 0.0001
    animationState.current.rotation.x += (targetXRotation - animationState.current.rotation.x) * adaptiveLerpFactor

    // Update disk rotation with adaptive lerp
    animationState.current.diskRotation += targetDiskRotationSpeed * deltaTime * 60 * 0.01 // Normalize by frame rate

    // Update glow intensity with adaptive lerp
    animationState.current.glowIntensity +=
      (targetGlowIntensity - animationState.current.glowIntensity) * adaptiveLerpFactor

    // Update shader uniforms
    materials.blackHoleMaterial.uniforms.time.value = time
    materials.blackHoleMaterial.uniforms.glowIntensity.value = animationState.current.glowIntensity

    materials.diskMaterial.uniforms.time.value = time

    materials.glowMaterial.uniforms.time.value = time
    materials.glowMaterial.uniforms.glowIntensity.value = animationState.current.glowIntensity

    // Apply the smoothed values to the actual objects
    if (blackHoleRef.current) {
      blackHoleRef.current.rotation.y = animationState.current.rotation.y
      blackHoleRef.current.rotation.x = animationState.current.rotation.x
    }

    if (diskRef.current) {
      diskRef.current.rotation.z = animationState.current.diskRotation
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

  return (
    <>
      {OptimizedStars}
      <group ref={blackHoleRef} scale={[responsiveScale, responsiveScale, responsiveScale]}>
        {/* Black hole sphere */}
        <mesh material={materials.blackHoleMaterial} geometry={geometries.blackHoleSphere} />

        {/* Accretion disk */}
        <mesh
          ref={diskRef}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.diskMaterial}
          geometry={geometries.accretionDisk}
          renderOrder={1} // Control render order for better transparency
        />

        {/* Outer glow */}
        <mesh
          ref={glowRef}
          material={materials.glowMaterial}
          geometry={geometries.glowSphere}
          renderOrder={0} // Control render order for better transparency
        />
      </group>
    </>
  )
}

// Import useState at the top
import { useState } from "react"
