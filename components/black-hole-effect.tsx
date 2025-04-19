'use client'

import { useEffect, useRef } from 'react'

export function BlackHoleEffect() {
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

    // Draw the black hole
    const draw = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio
      const centerX = width / 2
      const centerY = height / 2 + 20 // Slightly below center to match screenshot

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Create the outer glow
      const outerGradient = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 200)
      outerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
      outerGradient.addColorStop(0.2, 'rgba(200, 150, 255, 0.6)')
      outerGradient.addColorStop(0.5, 'rgba(150, 100, 255, 0.3)')
      outerGradient.addColorStop(1, 'rgba(100, 50, 200, 0)')

      ctx.fillStyle = outerGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 200, 0, Math.PI * 2)
      ctx.fill()

      // Draw the black hole arc (semi-circle)
      const arcRadius = 80

      // Draw the bright edge of the black hole
      ctx.beginPath()
      ctx.arc(centerX, centerY, arcRadius, 0, Math.PI, true)
      ctx.lineWidth = 3
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.stroke()

      // Create the inner glow
      const innerGradient = ctx.createRadialGradient(
        centerX,
        centerY - 10,
        0,
        centerX,
        centerY,
        arcRadius
      )
      innerGradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
      innerGradient.addColorStop(0.3, 'rgba(230, 200, 255, 0.8)')
      innerGradient.addColorStop(0.7, 'rgba(180, 120, 255, 0.4)')
      innerGradient.addColorStop(1, 'rgba(120, 80, 200, 0)')

      // Draw the inner glow
      ctx.fillStyle = innerGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, arcRadius, 0, Math.PI, true)
      ctx.fill()

      // Add some stars/particles
      const numParticles = 30
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI
        const distance = 40 + Math.random() * 150

        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        const size = 1 + Math.random() * 2
        const opacity = Math.random() * 0.5

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Add a subtle pulsating effect
      const pulseSpeed = 0.5
      const pulseSize = 5
      const pulsatingRadius = arcRadius + Math.sin(time * pulseSpeed) * pulseSize

      ctx.beginPath()
      ctx.arc(centerX, centerY, pulsatingRadius, 0, Math.PI, true)
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.stroke()

      // Update time and request next frame
      time += 0.02
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
      className="w-full h-[200px]"
      style={{
        background: 'transparent',
      }}
    />
  )
}
