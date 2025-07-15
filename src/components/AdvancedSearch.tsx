import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, Trophy, Users, Calendar, Filter, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface SearchResult {
  id: string
  title: string
  type: 'news' | 'player' | 'match' | 'event'
  excerpt: string
  date: string
  relevance: number
  image?: string
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'recent' | 'trending' | 'suggestion'
  icon: React.ReactNode
}

export const AdvancedSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Penhill United Secures Victory in Derby Match',
      type: 'news',
      excerpt: 'A thrilling 3-2 victory against local rivals showcases the team\'s resilience...',
      date: '2 hours ago',
      relevance: 95,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      title: 'Marcus Thompson',
      type: 'player',
      excerpt: 'Top scorer with 18 goals this season. Forward position.',
      date: 'Player Profile',
      relevance: 88,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
    },
    {
      id: '3',
      title: 'vs. Riverside FC',
      type: 'match',
      excerpt: 'Upcoming match on July 20th at 3:00 PM at Penhill Stadium',
      date: 'July 20, 2024',
      relevance: 82
    },
    {
      id: '4',
      title: 'Youth Academy Trials',
      type: 'event',
      excerpt: 'Open trials for players aged 8-16. Registration required.',
      date: 'July 22, 2024',
      relevance: 75
    }
  ]

  const trendingSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'Derby match highlights', type: 'trending', icon: <Trophy className="w-4 h-4" /> },
    { id: '2', text: 'Marcus Thompson stats', type: 'trending', icon: <Users className="w-4 h-4" /> },
    { id: '3', text: 'Next fixture', type: 'trending', icon: <Calendar className="w-4 h-4" /> },
    { id: '4', text: 'League table position', type: 'trending', icon: <Trophy className="w-4 h-4" /> }
  ]

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('penhill_recent_searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (query.length > 0) {
      setIsLoading(true)
      
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(result => 
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.excerpt.toLowerCase().includes(query.toLowerCase())
        ).sort((a, b) => b.relevance - a.relevance)
        
        setResults(filtered)
        setIsLoading(false)
      }, 300)
      
      return () => clearTimeout(timer)
    } else {
      setResults([])
      setIsLoading(false)
    }
  }, [query])

  useEffect(() => {
    if (query.length === 0) {
      // Show recent searches and trending suggestions
      const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 3).map((search, index) => ({
        id: `recent-${index}`,
        text: search,
        type: 'recent',
        icon: <Clock className="w-4 h-4" />
      }))
      
      setSuggestions([...recentSuggestions, ...trendingSuggestions])
    } else {
      // Show search suggestions based on query
      const querySuggestions = trendingSuggestions.filter(s => 
        s.text.toLowerCase().includes(query.toLowerCase())
      )
      setSuggestions(querySuggestions)
    }
  }, [query, recentSearches])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('penhill_recent_searches', JSON.stringify(updated))
      
      setQuery(searchQuery)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    }
  }

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'news': return <Trophy className="w-4 h-4" />
      case 'player': return <Users className="w-4 h-4" />
      case 'match': return <Calendar className="w-4 h-4" />
      case 'event': return <Calendar className="w-4 h-4" />
      default: return <Search className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'news': return 'bg-blue-100 text-blue-800'
      case 'player': return 'bg-green-100 text-green-800'
      case 'match': return 'bg-purple-100 text-purple-800'
      case 'event': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredResults = activeTab === 'all' 
    ? results 
    : results.filter(r => r.type === activeTab)

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search club...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="shadow-2xl border-2">
                <CardContent className="p-0">
                  {/* Search Input */}
                  <div className="flex items-center gap-3 p-4 border-b">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <Input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search news, players, matches, events..."
                      className="border-0 focus-visible:ring-0 text-lg"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Search Content */}
                  <div className="max-h-96 overflow-y-auto">
                    {query.length === 0 ? (
                      /* Suggestions */
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            {suggestions.some(s => s.type === 'recent') ? 'Recent & Trending' : 'Trending Searches'}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {suggestions.map((suggestion) => (
                            <motion.button
                              key={suggestion.id}
                              whileHover={{ x: 4 }}
                              onClick={() => handleSearch(suggestion.text)}
                              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 text-left transition-colors"
                            >
                              <div className={`p-1 rounded ${suggestion.type === 'recent' ? 'text-muted-foreground' : 'text-primary'}`}>
                                {suggestion.icon}
                              </div>
                              <span className="text-sm">{suggestion.text}</span>
                              {suggestion.type === 'trending' && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  Trending
                                </Badge>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Search Results */
                      <div>
                        {/* Filter Tabs */}
                        <div className="px-4 pt-4">
                          <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-5">
                              <TabsTrigger value="all">All</TabsTrigger>
                              <TabsTrigger value="news">News</TabsTrigger>
                              <TabsTrigger value="player">Players</TabsTrigger>
                              <TabsTrigger value="match">Matches</TabsTrigger>
                              <TabsTrigger value="event">Events</TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>

                        {/* Results */}
                        <div className="p-4">
                          {isLoading ? (
                            <div className="space-y-3">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-muted rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                      <div className="h-4 bg-muted rounded w-3/4" />
                                      <div className="h-3 bg-muted rounded w-1/2" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : filteredResults.length > 0 ? (
                            <div className="space-y-3">
                              {filteredResults.map((result, index) => (
                                <motion.div
                                  key={result.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                >
                                  {result.image ? (
                                    <img 
                                      src={result.image} 
                                      alt={result.title}
                                      className="w-12 h-12 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                                      {getTypeIcon(result.type)}
                                    </div>
                                  )}
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-medium text-sm truncate">{result.title}</h3>
                                      <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                                        {result.type}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                      {result.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-muted-foreground">{result.date}</span>
                                      <span className="text-xs text-primary font-medium">
                                        {result.relevance}% match
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                              <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Try searching for news, players, matches, or events
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Add keyboard shortcut listener
if (typeof window !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      // Trigger search modal open
      const searchButton = document.querySelector('[data-search-trigger]') as HTMLButtonElement
      searchButton?.click()
    }
  })
}