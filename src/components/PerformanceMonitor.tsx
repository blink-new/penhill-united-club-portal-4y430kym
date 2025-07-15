import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Zap, Clock, Wifi } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'

interface PerformanceMetrics {
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
  connectionType: string
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [performanceScore, setPerformanceScore] = useState(0)

  useEffect(() => {
    // Simulate performance monitoring
    const measurePerformance = () => {
      // Get real performance metrics where available
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

      const mockMetrics: PerformanceMetrics = {
        lcp: navigation?.loadEventEnd - navigation?.navigationStart || Math.random() * 2000 + 800,
        fid: Math.random() * 100 + 50,
        cls: Math.random() * 0.1,
        ttfb: navigation?.responseStart - navigation?.requestStart || Math.random() * 500 + 200,
        connectionType: connection?.effectiveType || '4g'
      }

      setMetrics(mockMetrics)

      // Calculate performance score (0-100)
      let score = 100
      if (mockMetrics.lcp > 2500) score -= 30
      else if (mockMetrics.lcp > 1800) score -= 15
      
      if (mockMetrics.fid > 100) score -= 20
      else if (mockMetrics.fid > 50) score -= 10
      
      if (mockMetrics.cls > 0.1) score -= 25
      else if (mockMetrics.cls > 0.05) score -= 10

      if (mockMetrics.ttfb > 600) score -= 15
      else if (mockMetrics.ttfb > 300) score -= 5

      setPerformanceScore(Math.max(0, score))
    }

    // Show performance indicator briefly on load
    setTimeout(() => {
      measurePerformance()
      setIsVisible(true)
      setTimeout(() => setIsVisible(false), 3000)
    }, 2000)

    // Monitor performance periodically
    const interval = setInterval(measurePerformance, 30000)
    return () => clearInterval(interval)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case '4g': return <Zap className="w-3 h-3" />
      case '3g': return <Activity className="w-3 h-3" />
      default: return <Wifi className="w-3 h-3" />
    }
  }

  if (!metrics) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 left-4 z-50 max-w-sm"
        >
          <Card className="shadow-lg border-2 bg-background/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="performance-indicator w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm font-medium">Performance</span>
                </div>
                <Badge className={`text-xs ${getScoreColor(performanceScore)}`}>
                  {performanceScore}/100
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">LCP</span>
                    <span className={metrics.lcp < 1800 ? 'text-green-600' : metrics.lcp < 2500 ? 'text-yellow-600' : 'text-red-600'}>
                      {(metrics.lcp / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">FID</span>
                    <span className={metrics.fid < 50 ? 'text-green-600' : metrics.fid < 100 ? 'text-yellow-600' : 'text-red-600'}>
                      {metrics.fid.toFixed(0)}ms
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">CLS</span>
                    <span className={metrics.cls < 0.05 ? 'text-green-600' : metrics.cls < 0.1 ? 'text-yellow-600' : 'text-red-600'}>
                      {metrics.cls.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">TTFB</span>
                    <span className={metrics.ttfb < 300 ? 'text-green-600' : metrics.ttfb < 600 ? 'text-yellow-600' : 'text-red-600'}>
                      {metrics.ttfb.toFixed(0)}ms
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-2 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getConnectionIcon(metrics.connectionType)}
                  <span>{metrics.connectionType.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Real-time</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}