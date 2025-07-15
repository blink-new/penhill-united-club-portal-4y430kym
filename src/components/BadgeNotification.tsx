import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface BadgeEarnedEvent extends CustomEvent {
  detail: {
    badge: {
      id: string
      name: string
      description: string
      icon: string
      earned: boolean
      earnedAt: Date
      category: string
    }
  }
}

export const BadgeNotification: React.FC = () => {
  const [earnedBadge, setEarnedBadge] = useState<BadgeEarnedEvent['detail']['badge'] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleBadgeEarned = (event: BadgeEarnedEvent) => {
      setEarnedBadge(event.detail.badge)
      setIsVisible(true)
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }

    window.addEventListener('badgeEarned', handleBadgeEarned as EventListener)
    
    return () => {
      window.removeEventListener('badgeEarned', handleBadgeEarned as EventListener)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && earnedBadge && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-20 right-4 z-[100] max-w-sm"
        >
          <Card className="shadow-2xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: 3, duration: 0.5 }}
                    className="text-3xl"
                  >
                    {earnedBadge.icon}
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Badge Earned!</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{earnedBadge.name}</h3>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-6 w-6 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{earnedBadge.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {earnedBadge.category}
                </Badge>
                <span className="text-xs text-gray-500">
                  Earned {earnedBadge.earnedAt.toLocaleDateString()}
                </span>
              </div>
              
              <motion.div
                className="mt-4 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </CardContent>
          </Card>
          
          {/* Celebration particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{ 
                  x: '50%', 
                  y: '50%', 
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}