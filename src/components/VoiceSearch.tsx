import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { useVoiceSearch } from '../hooks/useVoiceSearch'

interface VoiceSearchProps {
  onCommand?: (command: string, response: string) => void
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({ onCommand }) => {
  const [showResponse, setShowResponse] = useState(false)
  const [lastResponse, setLastResponse] = useState('')
  const { 
    transcript, 
    isListening, 
    isSupported, 
    confidence,
    startListening, 
    stopListening,
    processVoiceCommand 
  } = useVoiceSearch()

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening()
      
      // Process the command after stopping
      setTimeout(() => {
        if (transcript.trim()) {
          const result = processVoiceCommand(transcript)
          setLastResponse(result.response)
          setShowResponse(true)
          onCommand?.(transcript, result.response)
          
          // Speak the response
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(result.response)
            utterance.rate = 0.9
            utterance.pitch = 1
            speechSynthesis.speak(utterance)
          }
          
          // Hide response after 5 seconds
          setTimeout(() => setShowResponse(false), 5000)
        }
      }, 500)
    } else {
      startListening()
      setShowResponse(false)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={isListening ? "default" : "outline"}
          size="icon"
          onClick={handleVoiceCommand}
          className={`relative ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <MicOff className="w-4 h-4" />
            </motion.div>
          ) : (
            <Mic className="w-4 h-4" />
          )}
          
          {isListening && (
            <motion.div
              className="absolute -inset-1 bg-red-500/20 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute top-12 right-0 z-50"
          >
            <Card className="w-80 shadow-lg border-2 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Mic className="w-4 h-4 text-red-500" />
                  </motion.div>
                  <span className="text-sm font-medium">Listening...</span>
                  <Badge variant="secondary" className="ml-auto">
                    {Math.round(confidence * 100)}%
                  </Badge>
                </div>
                
                <div className="min-h-[60px] p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">You said:</p>
                  <p className="text-sm font-medium">
                    {transcript || "Say something like 'When is the next match?'"}
                  </p>
                </div>
                
                <div className="mt-3 text-xs text-muted-foreground">
                  <p>Try asking about:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>"When is the next match?"</li>
                    <li>"What was the last score?"</li>
                    <li>"When is training?"</li>
                    <li>"What's our league position?"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResponse && lastResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute top-12 right-0 z-50"
          >
            <Card className="w-80 shadow-lg border-2 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Penhill Assistant</span>
                </div>
                
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm">{lastResponse}</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => setShowResponse(false)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}