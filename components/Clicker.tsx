"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { translations, type Language } from '../translations'
import confetti from 'canvas-confetti'

interface HistoryEntry {
  word: string;
  timestamp: Date;
}

export default function BeautifulClicker() {
  const [count, setCount] = useState(0)
  const [userWord, setUserWord] = useState('')
  const [isWordSubmitted, setIsWordSubmitted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const t = translations[language]

  useEffect(() => {
    // Special animation for count 33
    if (count === 33) {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [count]);

  useEffect(() => {
    // Check if count is a multiple of 10
    if (count > 0 && count % 10 === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [count]);

  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
    // Play click sound
    new Audio('/click.mp3').play().catch(() => {});
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userWord.trim()) {
      setIsWordSubmitted(true)
      setIsEditing(false)
      // Reset count when word is changed
      if (isEditing) {
        setCount(0)
      }
      // Only add to history when word is first submitted or edited
      setHistory(prev => [{
        word: userWord,
        timestamp: new Date()
      }, ...prev]);
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500'
    } flex flex-col items-center justify-start pt-20 p-4 relative pb-40 sm:pb-4 sm:justify-center`}>
      {/* Theme and Language Controls */}
      <div className="absolute top-4 right-4 flex gap-4 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="bg-white bg-opacity-20 backdrop-blur-lg text-white rounded-full p-2.5 
            shadow-lg hover:bg-opacity-30 transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {isDarkMode ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </motion.button>

        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="appearance-none bg-white bg-opacity-20 backdrop-blur-lg text-white rounded-full px-6 py-2.5 pr-10 
            font-semibold shadow-lg hover:bg-opacity-30 transition-all duration-300 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-opacity-25"
          >
            <option value="en" className="text-purple-600 bg-white">English</option>
            <option value="uz" className="text-purple-600 bg-white">O'zbekcha</option>
            <option value="ru" className="text-purple-600 bg-white">Русский</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* History Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowHistory(prev => !prev)}
        className="absolute top-4 left-4 bg-white bg-opacity-20 backdrop-blur-lg text-white rounded-full p-2.5 
          shadow-lg hover:bg-opacity-30 transition-all duration-300 z-10
          focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </motion.button>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute left-4 top-20 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-4 
              shadow-xl text-white max-w-xs w-full z-20"
          >
            <h3 className="text-lg font-semibold mb-3">History</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.map((entry, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>{entry.word}</span>
                  <span>{entry.timestamp.toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Special milestone notification for count 33 */}
      <AnimatePresence>
        {count === 33 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-purple-900 px-6 py-3 rounded-full font-bold shadow-lg z-30"
          >
            🎉 Milestone: 33! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-sm mx-auto shadow-xl relative z-10"
      >
        {(!isWordSubmitted || isEditing) ? (
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-xl sm:text-2xl text-white text-center font-semibold mb-2">
              {isEditing ? t.editWord : t.enterWord}
            </h2>
            <input
              type="text"
              value={userWord}
              onChange={(e) => setUserWord(e.target.value)}
              placeholder={t.placeholder}
              className="w-full px-4 py-2 sm:py-3 rounded-full text-purple-600 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-white text-purple-600 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-base sm:text-lg shadow-md hover:bg-opacity-90 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
            >
              {isEditing ? t.saveChanges : t.startCounting}
            </motion.button>
            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full bg-red-500 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-base sm:text-lg shadow-md hover:bg-opacity-90 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              >
                {t.cancel}
              </motion.button>
            )}
          </motion.form>
        ) : (
          <>
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center"
              key={count}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {count}
            </motion.h1>
            
            {/* Mobile Buttons Container */}
            <div className="block sm:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={incrementCount}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 
                  h-24 w-24 rounded-full shadow-lg
                  flex items-center justify-center
                  text-base leading-tight
                  bg-gradient-to-br from-white to-purple-100
                  text-purple-600 font-semibold
                  active:shadow-inner z-50
                  animate-pulse-subtle"
              >
                <span className="max-w-full px-2 text-center break-words">
                  {userWord}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEdit}
                className="fixed bottom-24 right-4
                  h-12 w-12 rounded-full
                  flex items-center justify-center
                  bg-purple-600 text-white font-semibold
                  shadow-lg z-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </motion.button>
            </div>

            {/* Desktop Buttons Container */}
            <div className="hidden sm:block space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={incrementCount}
                className="w-full bg-white text-purple-600 font-semibold
                  py-3 px-6 rounded-full text-lg
                  shadow-md hover:bg-opacity-90
                  transition duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {userWord}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEdit}
                className="w-full bg-purple-600 text-white font-semibold
                  py-3 px-6 rounded-full text-lg
                  shadow-md hover:bg-opacity-90
                  transition duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {t.editButton}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
