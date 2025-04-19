'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EnchantedUniverse } from '@/components/enchanted-universe'
import { useDebounce } from '@/hooks/use-debounce'
import { ArrowRight, Plus } from 'lucide-react'
import { logger } from '@/lib/logger'
import { tryCatch, tryCatchSync } from '@/lib/errors'
import { ErrorBoundary } from '@/components/error-boundary'

// Logger instance for the AeonLanding component
const landingLogger = logger.child('AeonLanding')

/**
 * Main landing page component for Aeon website
 */
export function AeonLanding() {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-[#0C0C0C] text-[#F4F2F1] flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl mb-4">Something went wrong</h1>
            <p className="mb-6">
              We're experiencing technical difficulties. Please refresh the page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-[#9C9C9C] text-[#F4F2F1] hover:bg-[#F4F2F1]/5 rounded-none"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      }
      onError={error => {
        landingLogger.error('AeonLanding error:', error)
      }}
    >
      <AeonLandingContent />
    </ErrorBoundary>
  )
}

/**
 * Inner content of the AeonLanding component separated for error boundary
 */
function AeonLandingContent() {
  // State for scroll position and cursor
  const [scrollY, setScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHoveringArt, setIsHoveringArt] = useState(false)
  const [revealedGlyph, setRevealedGlyph] = useState<string | null>(null)
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null)

  // Refs for elements and animation
  const heroRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rafRef = useRef<number | null>(null)
  const prevScrollY = useRef(0)
  const cursorRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Debounced scroll position for less frequent updates
  const debouncedScrollY = useDebounce(scrollY, 10)

  // Handle cursor movement
  useEffect(() => {
    landingLogger.debug('AeonLanding mounted')

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    tryCatchSync(
      () => {
        window.addEventListener('mousemove', handleMouseMove)
      },
      error => {
        landingLogger.error('Error adding mousemove event listener:', error)
      }
    )

    return () => {
      tryCatchSync(
        () => {
          window.removeEventListener('mousemove', handleMouseMove)
          landingLogger.debug('AeonLanding unmounted')
        },
        error => {
          landingLogger.error('Error removing mousemove event listener:', error)
        }
      )
    }
  }, [])

  // Optimized scroll handling with requestAnimationFrame
  useEffect(() => {
    // Current scroll position with smooth interpolation
    let currentScrollY = window.scrollY
    // Target scroll position (actual window scroll)
    let targetScrollY = window.scrollY
    // Smoothing factor (lower = smoother)
    const smoothing = 0.08 // Slower for more ritualistic feel

    // Function to handle scroll events
    const handleScroll = () => {
      // Update the target position
      targetScrollY = window.scrollY

      // Calculate scroll velocity (unused but kept for future use)
      // const scrollVelocity = targetScrollY - prevScrollY.current
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
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)

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

    // Calculate normalized scroll progress (0 to 1)
    const normalizedScroll = Math.min(debouncedScrollY / 1500, 1)

    // Apply easing functions to create smoother transitions
    const universeScale = 1 - easeOutCubic(Math.min(normalizedScroll * 1.2, 0.4))
    const universeOpacity = 1 - easeOutCubic(Math.min(normalizedScroll * 1.5, 0.7))
    const heroContentOpacity = 1 - easeOutCubic(Math.min(normalizedScroll * 2, 1))
    const heroContentTranslate = -easeOutCubic(Math.min(normalizedScroll * 2, 1)) * 50

    return {
      universeScale,
      universeOpacity,
      heroContentOpacity,
      heroContentTranslate,
    }
  }, [debouncedScrollY])

  // Handle glyph reveal
  const revealGlyph = (glyphId: string) => {
    setRevealedGlyph(glyphId)
    landingLogger.info(`Revealing glyph: ${glyphId}`)

    // Play audio whisper if it's a patron glyph
    if (glyphId === 'patrons' && audioRef.current) {
      tryCatch(
        async () => {
          try {
            await audioRef.current?.play()
            setAudioPlaying('patron')
            landingLogger.debug('Audio started playing')
          } catch (error) {
            landingLogger.error('Error playing audio:', error)
            // Still set the state even if audio fails
            setAudioPlaying('patron')
          }
        },
        error => {
          landingLogger.error('Error in audio playback:', error)
        }
      )
    }

    const timerId = setTimeout(() => {
      setRevealedGlyph(null)
      setAudioPlaying(null)

      if (audioRef.current) {
        tryCatchSync(
          () => {
            audioRef.current!.pause()
            audioRef.current!.currentTime = 0
            landingLogger.debug('Audio stopped')
          },
          error => {
            landingLogger.error('Error stopping audio:', error)
          }
        )
      }
    }, 8000)

    // Store the timer ID for cleanup if needed
    return timerId
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#F4F2F1] overflow-x-hidden font-serif">
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className={`fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference transition-all duration-300 ${
          isHoveringArt ? 'scale-[2.5] opacity-80' : 'scale-100 opacity-60'
        }`}
        style={{
          transform: `translate(${cursorPosition.x - 16}px, ${cursorPosition.y - 16}px)`,
          border: '1px solid #F4F2F1',
          borderRadius: '50%',
        }}
      >
        {isHoveringArt && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Plus size={12} className="text-[#F4F2F1]" />
          </div>
        )}
      </div>

      {/* Audio element for whispers */}
      <audio ref={audioRef} className="hidden">
        {/* Audio source removed */}
      </audio>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0C0C0C]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border border-[#9C9C9C] rounded-full flex items-center justify-center">
              <span className="text-[#9C9C9C] text-xs">Æ</span>
            </div>
            <span className="font-serif tracking-wider text-[#F4F2F1]">AEON</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#what-we-do"
              className="text-sm text-[#9C9C9C] hover:text-[#F4F2F1] tracking-wider uppercase"
            >
              Process
            </Link>
            <Link
              href="#for-whom"
              className="text-sm text-[#9C9C9C] hover:text-[#F4F2F1] tracking-wider uppercase"
            >
              Patrons
            </Link>
            <Link
              href="#artists"
              className="text-sm text-[#9C9C9C] hover:text-[#F4F2F1] tracking-wider uppercase"
            >
              Artists
            </Link>
            <Link
              href="#contact"
              className="text-sm text-[#9C9C9C] hover:text-[#F4F2F1] tracking-wider uppercase"
            >
              Contact
            </Link>
          </nav>

          <div>
            <Button
              variant="outline"
              className="border-[#9C9C9C] text-[#F4F2F1] hover:bg-[#F4F2F1]/5 rounded-none text-xs tracking-widest uppercase"
            >
              Begin
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Enchanted Universe Animation */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #0C0C0C, #0C0C0C)',
        }}
      >
        {/* Enchanted Universe Animation */}
        <div
          className="absolute inset-0 z-0 parallax-element gpu-accelerated"
          style={{
            transform: `scale(${parallaxValues.universeScale})`,
            opacity: parallaxValues.universeOpacity,
            willChange: isScrolling ? 'transform, opacity' : 'auto',
          }}
        >
          <EnchantedUniverse scrollY={debouncedScrollY} />
        </div>

        {/* Hero Content */}
        <div
          className="relative z-10 text-center px-4 max-w-3xl mx-auto parallax-element gpu-accelerated"
          style={{
            transform: `translateY(${parallaxValues.heroContentTranslate}px)`,
            opacity: parallaxValues.heroContentOpacity,
            willChange: isScrolling ? 'transform, opacity' : 'auto',
          }}
        >
          <div className="mb-12 opacity-80">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9C9C9C]">
              Private Atelier
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
            Some truths can't be spoken.
            <br />
            They must be sculpted.
          </h1>

          <p className="text-lg text-[#9C9C9C] max-w-2xl mx-auto mb-12 font-sans">
            Bespoke experiences and symbolic artifacts, co-created with boundary-pushing
            contemporary artists. Designed to reflect who you are—or who you are becoming.
          </p>

          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border-[#9C9C9C] text-[#F4F2F1] hover:bg-[#F4F2F1]/5 rounded-none group"
              onClick={() => {
                tryCatchSync(
                  () => {
                    const whatWeDoSection = document.getElementById('what-we-do')
                    if (whatWeDoSection) {
                      whatWeDoSection.scrollIntoView({ behavior: 'smooth' })
                      landingLogger.debug('Scrolled to what-we-do section')
                    } else {
                      landingLogger.warn('what-we-do section not found')
                    }
                  },
                  error => {
                    landingLogger.error('Error scrolling to section:', error)
                  }
                )
              }}
            >
              <span className="text-xs tracking-widest uppercase mr-2">Begin The Discovery</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Hidden glyph */}
        <div
          className="absolute bottom-12 right-12 w-6 h-6 cursor-pointer opacity-20 hover:opacity-60 transition-opacity duration-500"
          onClick={() => revealGlyph('manifesto')}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z"
              stroke="#F4F2F1"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="what-we-do" className="py-24 bg-[#0C0C0C]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-center">We Create the Uncreated.</h2>

            <div className="mb-12 space-y-6 font-sans">
              <p className="text-[#9C9C9C]">
                At AEON, we don't sell art.
                <br />
                We produce personal mythologies—through form, material, and meaning.
                <br />
                You bring the question.
                <br />
                We translate it into a living, breathing artifact.
              </p>

              <p className="text-[#9C9C9C]">This may take the shape of:</p>

              <ul className="space-y-4 text-[#F4F2F1]">
                <li className="flex items-start">
                  <span className="block w-4 h-4 mt-1 mr-3 border border-[#9C9C9C]"></span>
                  <span>An ephemeral installation that lives only one night.</span>
                </li>
                <li className="flex items-start">
                  <span className="block w-4 h-4 mt-1 mr-3 border border-[#9C9C9C]"></span>
                  <span>A living portrait based on your neural rhythms.</span>
                </li>
                <li className="flex items-start">
                  <span className="block w-4 h-4 mt-1 mr-3 border border-[#9C9C9C]"></span>
                  <span>A sculpture that evolves with time—and your biology.</span>
                </li>
                <li className="flex items-start">
                  <span className="block w-4 h-4 mt-1 mr-3 border border-[#9C9C9C]"></span>
                  <span>A private immersive opera about your lineage.</span>
                </li>
                <li className="flex items-start">
                  <span className="block w-4 h-4 mt-1 mr-3 border border-[#9C9C9C]"></span>
                  <span>A mirror that doesn't show your face, but your future.</span>
                </li>
              </ul>

              <p className="text-[#9C9C9C] pt-4">
                Each project is a collaboration between you, a dedicated curator, and a global
                network of transdisciplinary artists.
              </p>
            </div>

            {/* Art fragment - hover effect */}
            <div
              className="relative w-full h-64 my-16 overflow-hidden group cursor-pointer"
              onMouseEnter={() => setIsHoveringArt(true)}
              onMouseLeave={() => setIsHoveringArt(false)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIj48L3N2Zz4=')",
                }}
              ></div>
              <div className="absolute inset-0 bg-[#0C0C0C]/60"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-xs tracking-widest uppercase text-[#9C9C9C]">Fragment of Work</p>
                <p className="text-sm italic mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  "I don't paint your face. I paint what survived your childhood."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section id="for-whom" className="py-24 bg-[#0C0C0C]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-center">For Visionaries, Not Buyers.</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-lg tracking-wider uppercase">Private Patrons</h3>
                <p className="text-sm text-[#9C9C9C] font-sans">
                  Seeking personal transformation, milestone commemoration, legacy inscription.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg tracking-wider uppercase">Discreet Collectors</h3>
                <p className="text-sm text-[#9C9C9C] font-sans">
                  Craving symbolic capital beyond the traditional art market.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg tracking-wider uppercase">Firms & Families</h3>
                <p className="text-sm text-[#9C9C9C] font-sans">
                  Translating values into sacred objects or installations.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg tracking-wider uppercase">Founders</h3>
                <p className="text-sm text-[#9C9C9C] font-sans">
                  Exploring identity shifts through immersive storytelling.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg tracking-wider uppercase">Institutions</h3>
                <p className="text-sm text-[#9C9C9C] font-sans">
                  Launching transcendent, unsellable experiences.
                </p>
              </div>
            </div>

            {/* Hidden glyph */}
            <div
              className="relative w-12 h-12 mx-auto mt-16 cursor-pointer opacity-30 hover:opacity-80 transition-opacity duration-500"
              onClick={() => revealGlyph('patrons')}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#9C9C9C" strokeWidth="1" />
                <path d="M8 12L16 12" stroke="#9C9C9C" strokeWidth="1" />
                <path d="M12 8L12 16" stroke="#9C9C9C" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section id="process" className="py-24 bg-[#0C0C0C]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-center">
              How The Invisible Becomes Real
            </h2>

            <div className="space-y-16">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-16 h-16 border border-[#9C9C9C] flex items-center justify-center shrink-0">
                  <span className="text-xs tracking-widest">01</span>
                </div>
                <div>
                  <h3 className="text-lg tracking-wider uppercase mb-3">Inquiry</h3>
                  <p className="text-[#9C9C9C] font-sans">
                    You express a desire, a question, a feeling. No brief required.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-16 h-16 border border-[#9C9C9C] flex items-center justify-center shrink-0">
                  <span className="text-xs tracking-widest">02</span>
                </div>
                <div>
                  <h3 className="text-lg tracking-wider uppercase mb-3">Interpretation</h3>
                  <p className="text-[#9C9C9C] font-sans">
                    Our curators translate it into symbolic, aesthetic, and experiential
                    coordinates.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-16 h-16 border border-[#9C9C9C] flex items-center justify-center shrink-0">
                  <span className="text-xs tracking-widest">03</span>
                </div>
                <div>
                  <h3 className="text-lg tracking-wider uppercase mb-3">Artist Matchmaking</h3>
                  <p className="text-[#9C9C9C] font-sans">
                    We identify the one artist (or collaborative duo) whose language aligns.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-16 h-16 border border-[#9C9C9C] flex items-center justify-center shrink-0">
                  <span className="text-xs tracking-widest">04</span>
                </div>
                <div>
                  <h3 className="text-lg tracking-wider uppercase mb-3">Co-Creation</h3>
                  <p className="text-[#9C9C9C] font-sans">You engage directly or via proxy.</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-16 h-16 border border-[#9C9C9C] flex items-center justify-center shrink-0">
                  <span className="text-xs tracking-widest">05</span>
                </div>
                <div>
                  <h3 className="text-lg tracking-wider uppercase mb-3">Revelation</h3>
                  <p className="text-[#9C9C9C] font-sans">
                    The piece is delivered in a ceremony, or hidden in plain sight.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button
                variant="outline"
                className="border-[#9C9C9C] text-[#F4F2F1] hover:bg-[#F4F2F1]/5 rounded-none group"
              >
                <span className="text-xs tracking-widest uppercase mr-2">
                  Explore a Sample Journey
                </span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Discretion Section */}
      <section className="py-24 bg-[#0C0C0C]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-center">Privacy is Our First Medium.</h2>

            <div className="space-y-6 text-center font-sans">
              <p className="text-[#9C9C9C]">Every project is protected by non-disclosure.</p>
              <p className="text-[#9C9C9C]">
                You may never meet the artist. Or meet only in voice.
              </p>
              <p className="text-[#9C9C9C]">The work may remain hidden, coded, or destructible.</p>
              <p className="text-[#9C9C9C]">This is luxury without trace—art as stealth signal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Artists Section */}
      <section id="artists" className="py-24 bg-[#0C0C0C]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-center">
              100+ Global Artists. Zero Public Rosters.
            </h2>

            <div className="mb-12 font-sans">
              <p className="text-[#9C9C9C] mb-6">We work across:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[#F4F2F1]">Generative AI / Neuro-interfaces / Bio-art</p>
                  <p className="text-[#F4F2F1]">Conceptual sculpture / Sacred object design</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[#F4F2F1]">Memory architecture / Ritual installations</p>
                  <p className="text-[#F4F2F1]">Soundscapes / Sensory dramaturgy</p>
                </div>
              </div>
            </div>

            {/* Artist fragments grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden group cursor-pointer"
                  onMouseEnter={() => setIsHoveringArt(true)}
                  onMouseLeave={() => setIsHoveringArt(false)}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                    style={{
                      backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48L3N2Zz4=')`,
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-[#0C0C0C]/60 group-hover:bg-[#0C0C0C]/40 transition-all duration-700"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <p className="text-xs tracking-widest uppercase text-[#9C9C9C] mb-2">
                      Artist Fragment
                    </p>
                    <p className="text-sm italic opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      {i === 1
                        ? 'My material is memory.'
                        : i === 2
                          ? "The artifact knows when it's complete."
                          : "I don't paint your face. I paint what survived your childhood."}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hidden glyph */}
            <div
              className="relative w-12 h-12 mx-auto mt-16 cursor-pointer opacity-30 hover:opacity-80 transition-opacity duration-500"
              onClick={() => revealGlyph('artists')}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#9C9C9C"
                  strokeWidth="1"
                />
                <path d="M12 8V16" stroke="#9C9C9C" strokeWidth="1" />
                <path d="M8 12H16" stroke="#9C9C9C" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-[#0C0C0C]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-6 text-center">
              You don't need to know what you want. You need to know it's time.
            </h2>
            <p className="text-[#9C9C9C] text-center mb-12 font-sans">
              One conversation can begin the alchemy.
            </p>

            <form className="space-y-8">
              <div className="space-y-4">
                <label
                  htmlFor="name"
                  className="block text-xs tracking-widest uppercase text-[#9C9C9C]"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-transparent border-b border-[#9C9C9C] py-2 text-[#F4F2F1] focus:outline-none focus:border-[#F4F2F1]"
                />
              </div>

              <div className="space-y-4">
                <label
                  htmlFor="contact"
                  className="block text-xs tracking-widest uppercase text-[#9C9C9C]"
                >
                  Private Contact (phone/email)
                </label>
                <input
                  type="text"
                  id="contact"
                  className="w-full bg-transparent border-b border-[#9C9C9C] py-2 text-[#F4F2F1] focus:outline-none focus:border-[#F4F2F1]"
                />
              </div>

              <div className="space-y-4">
                <label
                  htmlFor="question"
                  className="block text-xs tracking-widest uppercase text-[#9C9C9C]"
                >
                  What has no place in your current life—but refuses to leave you?
                </label>
                <textarea
                  id="question"
                  rows={4}
                  className="w-full bg-transparent border-b border-[#9C9C9C] py-2 text-[#F4F2F1] focus:outline-none focus:border-[#F4F2F1]"
                ></textarea>
              </div>

              <div className="text-center pt-8">
                <Button
                  type="submit"
                  className="bg-transparent border border-[#9C9C9C] text-[#F4F2F1] hover:bg-[#F4F2F1]/5 rounded-none px-12 py-6"
                >
                  <span className="text-xs tracking-widest uppercase">Submit Intention</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0C0C0C] border-t border-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-8 h-8 border border-[#9C9C9C] rounded-full flex items-center justify-center">
                <span className="text-[#9C9C9C] text-xs">Æ</span>
              </div>
              <span className="font-serif tracking-wider text-[#F4F2F1]">AEON</span>
            </div>

            <div className="text-xs tracking-widest uppercase text-[#9C9C9C]">
              By invitation only. {new Date().getFullYear()}.
            </div>
          </div>
        </div>
      </footer>

      {/* Revealed glyph content */}
      {revealedGlyph && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0C0C]/90 backdrop-blur-sm">
          <div className="max-w-lg p-8 border border-[#9C9C9C] bg-[#0C0C0C]">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-lg tracking-wider uppercase">
                {revealedGlyph === 'manifesto'
                  ? 'Manifesto Fragment'
                  : revealedGlyph === 'patrons'
                    ? 'Patron Whispers'
                    : 'Artist Shadows'}
              </h3>
              <button
                onClick={() => setRevealedGlyph(null)}
                className="text-[#9C9C9C] hover:text-[#F4F2F1] transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1" />
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1" />
                </svg>
              </button>
            </div>

            <div className="font-sans text-[#9C9C9C]">
              {revealedGlyph === 'manifesto' ? (
                <p className="italic">
                  "Art is not what you see, but what you make others see. We create not objects, but
                  revelations—moments where the veil between what is and what could be becomes
                  translucent. This is our sacred task."
                </p>
              ) : revealedGlyph === 'patrons' ? (
                <div>
                  <p className="italic mb-4">
                    "The piece arrived on the anniversary. No signature, no explanation—just as we
                    agreed. When my daughter touched it, it began to glow with a light I cannot
                    describe. It knew her. It remembered."
                  </p>
                  {audioPlaying === 'patron' && (
                    <div className="flex items-center justify-center mt-6">
                      <div className="w-16 h-1 bg-[#9C9C9C]/30">
                        <div className="h-full w-1/3 bg-[#9C9C9C] animate-pulse"></div>
                      </div>
                      <span className="ml-2 text-xs text-[#9C9C9C]/70">Audio playing...</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="italic">
                  "I work blindfolded. I never see their faces. The curator describes not their
                  appearance but their essence—the weight they carry, the light they seek. This is
                  all I need to know."
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Soul Cartography Quiz - Hidden Experience */}
      <div
        className="fixed bottom-8 left-8 w-8 h-8 cursor-pointer opacity-20 hover:opacity-60 transition-opacity duration-500 z-30"
        onClick={() => revealGlyph('soul')}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="#F4F2F1"
            strokeWidth="1"
          />
          <path
            d="M12 8V16M8 12H16"
            stroke="#F4F2F1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
