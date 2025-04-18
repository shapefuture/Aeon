"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import { extend } from "@react-three/fiber"

// Gravitational lensing shader material
const GravitationalLensingMaterial = shaderMaterial(
  {
    time: 0,
    blackHolePosition: new THREE.Vector3(0, 0, 0),
    blackHoleRadius: 1.0,
    lensStrength: 2.0,
  },
  // Vertex shader
  `
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 blackHolePosition;
    uniform float blackHoleRadius;
    uniform float lensStrength;
    
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    
    void main() {
      // Calculate direction from fragment to black hole
      vec3 dirToBlackHole = normalize(blackHolePosition - vWorldPosition);
      
      // Calculate distance to black hole
      float distToBlackHole = length(blackHolePosition - vWorldPosition);
      
      // Calculate lensing effect based on distance
      float lensEffect = lensStrength * blackHoleRadius / max(distToBlackHole, blackHoleRadius * 1.5);
      
      // Create distortion effect
      vec3 distortedNormal = normalize(vNormal + dirToBlackHole * lensEffect);
      
      // Create color based on distortion
      vec3 color = vec3(0.1, 0.1, 0.3) + distortedNormal * 0.5;
      
      // Add time-based variation
      color += 0.1 * sin(time + vWorldPosition.x * 2.0) * vec3(0.1, 0.2, 0.3);
      
      gl_FragColor = vec4(color, 0.3 * lensEffect);
    }
  `,
)

// Extend the Three.js materials with our custom shader
extend({ GravitationalLensingMaterial })

// Declare the JSX element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      gravitationalLensingMaterial: any
    }
  }
}

interface GravitationalLensingProps {
  blackHolePosition: [number, number, number]
  blackHoleRadius: number
  lensStrength: number
}

export function GravitationalLensing({ blackHolePosition, blackHoleRadius, lensStrength }: GravitationalLensingProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)

  // Update the shader uniforms on each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime
      materialRef.current.blackHolePosition = new THREE.Vector3(...blackHolePosition)
      materialRef.current.blackHoleRadius = blackHoleRadius
      materialRef.current.lensStrength = lensStrength
    }
  })

  // Create a sphere geometry for the lensing effect
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(blackHoleRadius * 5, 64, 64)
  }, [blackHoleRadius])

  return (
    <mesh ref={meshRef} position={blackHolePosition} geometry={geometry}>
      <gravitationalLensingMaterial ref={materialRef} transparent={true} depthWrite={false} side={THREE.BackSide} />
    </mesh>
  )
}
