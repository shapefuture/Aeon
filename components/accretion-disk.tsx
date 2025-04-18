"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
// @ts-ignore
import * as THREE from "three"
import { extend } from "@react-three/fiber"

// Type declaration for custom shader material
declare module "@react-three/fiber" {
  interface ThreeElements {
    accretionDiskMaterial: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      ref?: React.Ref<any>
      transparent?: boolean
      depthWrite?: boolean
      side?: number
    }
  }
}

// Accretion disk shader material
const AccretionDiskMaterial = shaderMaterial(
  {
    time: 0,
    innerRadius: 1.5,
    outerRadius: 3.0,
    rotationSpeed: 0.2,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying float vDistance;
    
    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vDistance = length(position.xz);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform float innerRadius;
    uniform float outerRadius;
    uniform float rotationSpeed;
    
    varying vec2 vUv;
    varying float vDistance;
    
    // Function to create a 2D rotation matrix
    mat2 rotate2D(float angle) {
      return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    }
    
    void main() {
      // Calculate normalized distance from center
      float normalizedDist = (vDistance - innerRadius) / (outerRadius - innerRadius);
      
      // Create a radial gradient for the disk
      float radialGradient = 1.0 - normalizedDist;
      
      // Create swirling effect based on angle and time
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float swirl = sin(angle * 10.0 + time * rotationSpeed * 5.0) * 0.5 + 0.5;
      
      // Create color bands in the disk
      vec3 hotColor = vec3(1.0, 0.5, 0.0); // Orange-yellow
      vec3 coolColor = vec3(0.0, 0.3, 0.8); // Blue
      
      // Mix colors based on swirl and distance
      vec3 diskColor = mix(hotColor, coolColor, swirl * normalizedDist);
      
      // Add some brightness variation
      float brightness = 1.0 + 0.3 * sin(normalizedDist * 20.0 + time * rotationSpeed);
      diskColor *= brightness;
      
      // Add glow based on distance from inner edge
      float innerGlow = smoothstep(0.0, 0.3, 1.0 - normalizedDist);
      diskColor += vec3(1.0, 0.7, 0.3) * innerGlow * 0.8;
      
      // Apply radial gradient for opacity falloff at edges
      float alpha = radialGradient * radialGradient * (1.0 - normalizedDist * 0.8);
      
      // Mask out the inner part (black hole)
      if (normalizedDist < 0.0) alpha = 0.0;
      
      gl_FragColor = vec4(diskColor, alpha);
    }
  `,
)

// Extend the Three.js materials with our custom shader
extend({ AccretionDiskMaterial })

// Declare the JSX element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      accretionDiskMaterial: {
        ref?: React.RefObject<any>
        transparent?: boolean
        depthWrite?: boolean
        side?: number
        [key: string]: any
      }
    }
  }
}

interface AccretionDiskProps {
  position: [number, number, number]
  innerRadius: number
  outerRadius: number
  rotationSpeed: number
}

export function AccretionDisk({ position, innerRadius, outerRadius, rotationSpeed }: AccretionDiskProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)

  // Update the shader uniforms on each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime
      materialRef.current.innerRadius = innerRadius
      materialRef.current.outerRadius = outerRadius
      materialRef.current.rotationSpeed = rotationSpeed
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * 0.01
    }
  })

  // Create a ring geometry for the accretion disk
  const geometry = useMemo(() => {
    return new THREE.RingGeometry(innerRadius, outerRadius, 128, 3)
  }, [innerRadius, outerRadius])

  return (
    <mesh ref={meshRef} position={position} rotation={[Math.PI / 2, 0, 0]} geometry={geometry}>
      <accretionDiskMaterial ref={materialRef} transparent={true} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}
