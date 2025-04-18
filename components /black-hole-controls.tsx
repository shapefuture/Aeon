"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BlackHoleControlsProps {
  rotationSpeed: number
  setRotationSpeed: (value: number) => void
  glowIntensity: number
  setGlowIntensity: (value: number) => void
  diskSize: number
  setDiskSize: (value: number) => void
}

export function BlackHoleControls({
  rotationSpeed,
  setRotationSpeed,
  glowIntensity,
  setGlowIntensity,
  diskSize,
  setDiskSize,
}: BlackHoleControlsProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-10">
      <Card className="bg-black/70 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Black Hole Controls</CardTitle>
          <CardDescription className="text-gray-400">Adjust parameters to modify the black hole</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="rotation-speed" className="text-white">
                Rotation Speed
              </Label>
              <span className="text-gray-400 text-sm">{rotationSpeed.toFixed(2)}</span>
            </div>
            <Slider
              id="rotation-speed"
              min={0}
              max={1}
              step={0.01}
              value={[rotationSpeed]}
              onValueChange={(value) => setRotationSpeed(value[0])}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="glow-intensity" className="text-white">
                Glow Intensity
              </Label>
              <span className="text-gray-400 text-sm">{glowIntensity.toFixed(2)}</span>
            </div>
            <Slider
              id="glow-intensity"
              min={0.5}
              max={3}
              step={0.1}
              value={[glowIntensity]}
              onValueChange={(value) => setGlowIntensity(value[0])}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="disk-size" className="text-white">
                Accretion Disk Size
              </Label>
              <span className="text-gray-400 text-sm">{diskSize.toFixed(1)}</span>
            </div>
            <Slider
              id="disk-size"
              min={2}
              max={6}
              step={0.1}
              value={[diskSize]}
              onValueChange={(value) => setDiskSize(value[0])}
              className="cursor-pointer"
            />
          </div>

          <div className="pt-2 text-xs text-gray-500">
            <p>Drag to rotate view. Scroll to zoom.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
