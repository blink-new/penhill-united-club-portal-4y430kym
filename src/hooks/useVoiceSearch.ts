import { useState, useEffect } from 'react'

interface VoiceSearchResult {
  transcript: string
  isListening: boolean
  isSupported: boolean
  confidence: number
}

export const useVoiceSearch = () => {
  const [result, setResult] = useState<VoiceSearchResult>({
    transcript: '',
    isListening: false,
    isSupported: false,
    confidence: 0
  })

  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onstart = () => {
        setResult(prev => ({ ...prev, isListening: true }))
      }

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

        const confidence = event.results[0]?.[0]?.confidence || 0

        setResult(prev => ({
          ...prev,
          transcript,
          confidence
        }))
      }

      recognitionInstance.onend = () => {
        setResult(prev => ({ ...prev, isListening: false }))
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setResult(prev => ({ ...prev, isListening: false }))
      }

      setRecognition(recognitionInstance)
      setResult(prev => ({ ...prev, isSupported: true }))
    }
  }, [])

  const startListening = () => {
    if (recognition && !result.isListening) {
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition && result.isListening) {
      recognition.stop()
    }
  }

  const processVoiceCommand = (transcript: string) => {
    const command = transcript.toLowerCase()
    
    if (command.includes('when') && command.includes('match')) {
      return { type: 'fixture_query', response: 'Next match is vs. Riverside FC on July 20th at 3 PM' }
    }
    
    if (command.includes('score') || command.includes('result')) {
      return { type: 'score_query', response: 'Last match: Penhill United 3-2 Derby Rivals' }
    }
    
    if (command.includes('table') || command.includes('position')) {
      return { type: 'table_query', response: 'Penhill United is currently 2nd in the league with 63 points' }
    }
    
    if (command.includes('training')) {
      return { type: 'training_query', response: 'Next training session is Thursday at 6:30 PM' }
    }
    
    return { type: 'unknown', response: 'Sorry, I didn\'t understand that command. Try asking about matches, scores, or training.' }
  }

  return {
    ...result,
    startListening,
    stopListening,
    processVoiceCommand
  }
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}