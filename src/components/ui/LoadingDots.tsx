"use client"

import { motion } from "framer-motion"

export default function LoadingDots() {
  const dots = [0, 1, 2, 3, 4]

  return (
    <div className="flex items-center justify-center">
      <div className="flex space-x-1">
        {dots.map((dot) => (
          <motion.div
            key={dot}
            className="w-2 h-2 bg-gray-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  )
}