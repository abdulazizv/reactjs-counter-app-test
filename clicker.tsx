"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BeautifulClicker() {
  const [count, setCount] = useState(0)

  const incrementCount = () => {
    setCount(prevCount => prevCount + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
      >
        <motion.h1 
          className="text-6xl font-bold text-white mb-8 text-center"
          key={count}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          {count}
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={incrementCount}
          className="w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-full text-lg shadow-md hover:bg-opacity-90 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
        >
          Click me!
        </motion.button>
      </motion.div>
    </div>
  )
}

