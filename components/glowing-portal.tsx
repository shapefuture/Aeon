'use client'

import { useEffect, useRef } from 'react'

export function GlowingPortal() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener('resize', setCanvasDimensions)

    // Animation variables
    let animationFrameId: number
    let time = 0

    // Draw the portal
    const draw = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio
      const centerX = width / 2
      const centerY = height / 2

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Create radial gradient for the glow
      const innerRadius = 50 + Math.sin(time * 0.5) * 5
      const outerRadius = 200 + Math.sin(time * 0.3) * 20

      // Draw the outer glow
      const outerGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        innerRadius,
        centerX,
        centerY,
        outerRadius
      )

      outerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
      outerGradient.addColorStop(0.2, 'rgba(180, 120, 255, 0.6)')
      outerGradient.addColorStop(0.6, 'rgba(120, 80, 200, 0.3)')
      outerGradient.addColorStop(1, 'rgba(80, 40, 170, 0)')

      ctx.fillStyle = outerGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw the portal arc
      ctx.beginPath()
      ctx.arc(centerX, centerY, 80, 0, Math.PI, true)
      ctx.lineWidth = 4
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.stroke()

      // Draw the inner glow
      const innerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80)

      innerGradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
      innerGradient.addColorStop(0.5, 'rgba(220, 180, 255, 0.8)')
      innerGradient.addColorStop(1, 'rgba(180, 120, 255, 0)')

      ctx.fillStyle = innerGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 80, 0, Math.PI, true)
      ctx.fill()

      // Add some particles/stars
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI
        const distance = 40 + Math.random() * 120

        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        const size = 1 + Math.random() * 2
        const opacity = Math.random() * 0.5

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Update time and request next frame
      time += 0.01
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[300px]"
      style={{
        background: 'transparent',
      }}
    />
  )
}
