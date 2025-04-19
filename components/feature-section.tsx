'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Link2, Sparkles, Zap } from 'lucide-react'

export function FeatureSection() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Think naturally',
      description:
        'Reflect mirrors the way your brain works, helping you make connections between ideas effortlessly.',
    },
    {
      icon: <Link2 className="w-6 h-6" />,
      title: 'Connect everything',
      description:
        'Create bi-directional links between notes, building a network of knowledge that grows with you.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-powered insights',
      description:
        'Our AI helps you discover connections you might have missed and surfaces relevant information when you need it.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning fast',
      description:
        'Designed for speed with keyboard shortcuts and instant search, so you can capture ideas as quickly as they come.',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-[#130821] to-[#0a0413]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Features that enhance your thinking
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Reflect is designed to work the way your brain does, not the other way around.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 p-6 space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-purple-900/30 border border-purple-500/30'
                    : 'hover:bg-gray-800/50'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 rounded-lg p-2 mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 p-6 flex items-center justify-center">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center p-8"
            >
              <div className="bg-purple-600 rounded-full p-4 inline-block mb-6">
                {features[activeFeature].icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{features[activeFeature].title}</h3>
              <p className="text-gray-300">{features[activeFeature].description}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
