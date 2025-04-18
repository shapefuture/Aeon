"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import { extend } from "@react-three/fiber"

// Black hole shader material
const BlackHoleMaterial = shaderMaterial(
  {
    time: 0,
    glowColor: new THREE.Color(0.1, 0.1, 0.4),
    glowIntensity: 1.5,
  },
  // Vertex shader
  `
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
  // Fragment shader
  `
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
      
      // Create pulsating glow effect
      float pulseSpeed = 2.0;
      float pulseIntensity = 0.2;
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
  `,
)

// Extend the Three.js materials with our custom shader
extend({ BlackHoleMaterial })

// Declare the JSX element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      blackHoleMaterial: any
    }
  }
}

interface BlackHoleProps {
  position: [number, number, number]
  radius: number
  rotationSpeed: number
  glowIntensity: number
}

export function BlackHole({ position, radius, rotationSpeed, glowIntensity }: BlackHoleProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)

  // Update the shader uniforms on each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime
      materialRef.current.glowIntensity = glowIntensity
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * 0.01
    }
  })

  // Create a higher resolution sphere for better visual quality
  const geometry = useMemo(() => new THREE.SphereGeometry(radius, 64, 64), [radius])

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      material={materialRef.current}
    />
  )
}
