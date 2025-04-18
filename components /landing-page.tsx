"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlackHoleScene } from "@/components/black-hole-scene"
import { NoteInterface } from "@/components/note-interface"
import { FeatureSection } from "@/components/feature-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { Footer } from "@/components/footer"
import { useDebounce } from "@/hooks/use-debounce"

export function LandingPage() {
  // State for scroll position and performance monitoring
  const [scrollY, setScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [performanceMode, setPerformanceMode] = useState<"high" | "medium" | "low">("high")

  // Refs for elements and animation
  const heroRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rafRef = useRef<number | null>(null)
  const prevScrollY = useRef(0)
  const scrollVelocity = useRef(0)

  // Debounced scroll position for less frequent updates to Three.js
  const debouncedScrollY = useDebounce(scrollY, 10)

  // Detect device capabilities on mount
  useEffect(() => {
    // Check for low-end devices
    const checkDeviceCapabilities = () => {
      // Check if device is low-powered
      const userAgent = navigator.userAgent
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isOldDevice = /iPhone\s(5|6|7|8)/i.test(userAgent) || /iPad\s(1|2|3|4)/i.test(userAgent)

      // Check for low memory devices
      const lowMemory = (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4

      if ((isMobile && isOldDevice) || lowMemory) {
        setPerformanceMode("low")
      } else if (isMobile) {
        setPerformanceMode("medium")
      }
    }

    checkDeviceCapabilities()
  }, [])

  // Optimized scroll handling with requestAnimationFrame
  useEffect(() => {
    // Current scroll position with smooth interpolation
    let currentScrollY = window.scrollY
    // Target scroll position (actual window scroll)
    let targetScrollY = window.scrollY
    // Smoothing factor (lower = smoother)
    const smoothing = 0.12

    // Function to handle scroll events
    const handleScroll = () => {
      // Update the target position
      targetScrollY = window.scrollY

      // Calculate scroll velocity
      scrollVelocity.current = targetScrollY - prevScrollY.current
      prevScrollY.current = targetScrollY

      // Set scrolling state for potential optimizations
      setIsScrolling(true)

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Set a timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 100)
    }

    // Animation loop for smooth scrolling
    const animate = () => {
      // Calculate the difference
      const diff = targetScrollY - currentScrollY

      // Only update if the difference is significant
      if (Math.abs(diff) > 0.1) {
        // Add a fraction of the difference to the current position
        currentScrollY += diff * smoothing

        // Update the state with the smoothed value
        setScrollY(currentScrollY)
      }

      // Continue the animation loop
      rafRef.current = requestAnimationFrame(animate)
    }

    // Start the animation loop
    rafRef.current = requestAnimationFrame(animate)

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  // Memoize parallax calculations to reduce unnecessary recalculations
  const parallaxValues = useMemo(() => {
    // Use easing functions for smoother transitions
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
    const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4)

    // Calculate normalized scroll progress (0 to 1)
    const normalizedScroll = Math.min(debouncedScrollY / 1500, 1)

    // Apply easing functions to create smoother transitions
    const blackHoleScale = 1 - easeOutCubic(Math.min(normalizedScroll * 1.2, 0.4))
    const blackHoleOpacity = 1 - easeOutQuart(Math.min(normalizedScroll * 1.5, 0.7))
    const heroContentOpacity = 1 - easeOutQuart(Math.min(normalizedScroll * 2, 1))
    const heroContentTranslate = -easeOutCubic(Math.min(normalizedScroll * 2, 1)) * 50

    return {
      blackHoleScale,
      blackHoleOpacity,
      heroContentOpacity,
      heroContentTranslate,
    }
  }, [debouncedScrollY])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-medium">Reflect</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-sm text-gray-300 hover:text-white">
              Product
            </Link>
            <Link href="#" className="text-sm text-gray-300 hover:text-white">
              Pricing
            </Link>
            <Link href="#" className="text-sm text-gray-300 hover:text-white">
              Company
            </Link>
            <Link href="#" className="text-sm text-gray-300 hover:text-white">
              Blog
            </Link>
            <Link href="#" className="text-sm text-gray-300 hover:text-white">
              Changelog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="link" className="text-white">
              Login
            </Button>
            <Button className="bg-white text-purple-900 hover:bg-gray-100 rounded-full text-sm px-4">
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with 3D Black Hole */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #000000, #1a0b2e)",
        }}
      >
        {/* 3D Black Hole with will-change optimization */}
        <div
          className="absolute inset-0 z-0 parallax-element gpu-accelerated"
          style={{
            transform: `scale(${parallaxValues.blackHoleScale})`,
            opacity: parallaxValues.blackHoleOpacity,
            willChange: isScrolling ? "transform, opacity" : "auto",
          }}
        >
          <BlackHoleScene scrollY={debouncedScrollY} />
        </div>

        {/* Hero Content with will-change optimization */}
        <div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto parallax-element gpu-accelerated"
          style={{
            transform: `translateY(${parallaxValues.heroContentTranslate}px)`,
            opacity: parallaxValues.heroContentOpacity,
            willChange: isScrolling ? "transform, opacity" : "auto",
          }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-8 backdrop-blur-sm">
            <span className="text-xs">New: Our AI integration just landed</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">Think better with Reflect</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">Never miss a note, idea or connection.</p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700 rounded-full px-6 smooth-transition">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-6 border-gray-700 text-white hover:bg-gray-800 smooth-transition"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 5V19M12 19L5 12M12 19L19 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* Note Interface Section */}
      <section className="py-20 bg-gradient-to-b from-[#1a0b2e] to-[#130821]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Organize your thoughts, effortlessly</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Reflect helps you capture, connect, and recall your ideas with ease.
            </p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto">
            <NoteInterface />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#130821] to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to think better?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of thinkers, creators, and knowledge workers who use Reflect every day.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 rounded-full px-8 py-6 text-lg">Start Free Trial</Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
