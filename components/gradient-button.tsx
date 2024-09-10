"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

export function GradientButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      className="relative px-6 py-3 bg-white text-black font-semibold rounded-full transition-all duration-300 ease-in-out"
      style={{
        boxShadow: "0 0 0 3px transparent", // Increased from 2px to 3px
        backgroundClip: "padding-box",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: "linear-gradient(45deg, #ff00ff, #00ffff)",
          content: "''",
          zIndex: -1,
          margin: "-3px", // Added to make the gradient border visible
        }}
      />
      <span
        className="flex items-center justify-center transition-transform duration-300 ease-in-out"
        style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
      >
        <span className="mr-2">Click me</span>
        <ArrowRight
          size={18} // Reduced size from default 24 to 18
          className="transition-transform duration-300 ease-in-out"
          style={{
            transform: isHovered ? "translateX(4px)" : "translateX(0)",
          }}
        />
      </span>
    </button>
  )
}