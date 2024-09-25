"use client"

import { useState, useEffect } from "react"

interface GradientButtonProps {
  index: number
  gradientStart: string
  gradientEnd: string
  emoji: string
}

const TextTransition = ({ isHovered, index }: { isHovered: boolean, index: number }) => {
  const [text, setText] = useState(`Preset ${index}`)
  const targetText = isHovered ? "Click me" : `Preset ${index}`

  useEffect(() => {
    if (text === targetText) return

    const timeout = setTimeout(() => {
      if (isHovered) {
        setText(targetText.slice(0, text.length + 1))
      } else {
        setText(targetText.slice(0, text.length - 1) || "Click me")
      }
    }, 50)

    return () => clearTimeout(timeout)
  }, [text, targetText, isHovered])

  return (
    <span className="inline-block min-w-[7ch] relative h-6">
      {[`Preset ${index}`, "Click me"].map((phrase, phraseIndex) => (
        <span
          key={phraseIndex}
          className="absolute left-0 right-0"
          style={{
            transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
            transform: `translateY(${isHovered ? (phraseIndex === 1 ? '0%' : '-100%') : (phraseIndex === 0 ? '0%' : '100%')})`,
            opacity: (isHovered && phraseIndex === 1) || (!isHovered && phraseIndex === 0) ? 1 : 0,
          }}
        >
          {phrase.split('').map((char, index) => (
            <span
              key={index}
              className="inline-block transition-all duration-300 ease-in-out"
              style={{
                transform: `translateY(${(isHovered && phraseIndex === 1) || (!isHovered && phraseIndex === 0) ? '0' : '100%'})`,
                opacity: (isHovered && phraseIndex === 1) || (!isHovered && phraseIndex === 0) ? 1 : 0,
                transitionDelay: `${index * 30}ms`
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

const GradientButton: React.FC<GradientButtonProps> = ({ index, gradientStart, gradientEnd, emoji }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      className="relative px-6 py-3 text-white font-semibold rounded-full transition-all duration-300 ease-in-out"
      style={{
        boxShadow: "0 0 0 3px transparent",
        backgroundClip: "padding-box",
        background: "var(--leva-colors-elevation1)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(45deg, ${gradientStart}, ${gradientEnd})`,
          content: "''",
          zIndex: -1,
          margin: "-3px",
        }}
      />
      <span
        className="flex items-center justify-center transition-transform duration-300 ease-in-out"
        style={{ transform: isHovered ? "scale(1.1)" : "scale(1)", whiteSpace: "pre-wrap" }}
      >
        <TextTransition isHovered={isHovered} index={index} />
        <span
          className="ml-2 transition-transform duration-300 ease-in-out"
          style={{
            transform: isHovered ? "translateX(4px)" : "translateX(0)",
            fontSize: "1.25rem",
          }}
        >
          {emoji}
        </span>
      </span>
    </button>
  )
}

export default function Component() {
  return (
    <div className="preset_container absolute min-h-screen flex flex-col items-center justify-center space-y-4">
      <GradientButton index={1} gradientStart="#ff00ff" gradientEnd="#00ffff" emoji="🚀" />
      <GradientButton index={2} gradientStart="#ff0000" gradientEnd="#ffff00" emoji="🌟" />
      <GradientButton index={3} gradientStart="#00ff00" gradientEnd="#0000ff" emoji="🎉" />
      <GradientButton index={4} gradientStart="#ff8c00" gradientEnd="#ff0080" emoji="🌈" />
    </div>
  )
}