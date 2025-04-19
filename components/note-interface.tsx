'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, ArrowLeft, ArrowRight, Calendar, ChevronDown, Play } from 'lucide-react'

export function NoteInterface() {
  const [currentMonth] = useState('April 2023')
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

  // Generate calendar days for April 2023
  const calendarDays = [
    [null, null, null, null, null, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
  ]

  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-xl overflow-hidden border border-gray-800 shadow-2xl transform transition-all hover:scale-[1.02] duration-500">
      {/* Top bar */}
      <div className="flex items-center p-3 border-b border-gray-800">
        <div className="flex-1 flex items-center gap-2 bg-gray-800/50 rounded-md px-3 py-1.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent border-none text-sm text-gray-300 focus:outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-12 min-h-[400px]">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3 border-r border-gray-800 p-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-300 p-2 rounded hover:bg-gray-800">
              <Calendar className="w-4 h-4" />
              <span>Daily notes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 p-2 rounded hover:bg-gray-800">
              <ChevronDown className="w-4 h-4" />
              <span>All notes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 p-2 rounded hover:bg-gray-800">
              <ChevronDown className="w-4 h-4" />
              <span>Tasks</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 p-2 rounded hover:bg-gray-800">
              <ChevronDown className="w-4 h-4" />
              <span>Tags</span>
            </div>
          </div>
        </div>

        {/* Note content */}
        <div className="col-span-12 md:col-span-5 p-4 border-r border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Sun, April 2nd, 2023</div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm">Today I started using Reflect!</div>
              <div className="text-xs text-gray-500">
                A note-taking tool designed to mirror the way we think.
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm">
                I love how Reflect helps organize thoughts through connections, instead of
                hierarchical folders.
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm">What should I capture next?</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm">Going to explore the AI features tomorrow.</div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <div className="col-span-12 md:col-span-4 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium">{currentMonth}</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
                <ArrowLeft className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day, i) => (
              <div key={i} className="text-xs text-gray-500 py-1">
                {day}
              </div>
            ))}

            {calendarDays.flat().map((day, i) => (
              <div
                key={i}
                className={`
                  text-xs py-1 rounded-full w-6 h-6 flex items-center justify-center mx-auto
                  ${day === 2 ? 'bg-purple-500 text-white' : 'text-gray-300'}
                  ${day === null ? 'invisible' : ''}
                `}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
