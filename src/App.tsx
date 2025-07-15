import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Calendar, 
  ChevronUp, 
  Clock, 
  Cloud, 
  Download,
  ExternalLink,
  Home,
  Mail,
  MapPin,
  Menu,
  Moon,
  Play,
  Share2,
  Star,
  Sun,
  Trophy,
  Users,
  X,
  Zap,
  Heart,
  Bookmark,
  MoreHorizontal
} from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Input } from './components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import { VoiceSearch } from './components/VoiceSearch'
import { NotificationCenter } from './components/NotificationCenter'
import { UserProfile } from './components/UserProfile'
import { BadgeNotification } from './components/BadgeNotification'
import { useGamification } from './hooks/useGamification'

interface NewsItem {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  category: string
  readTime: string
}

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: 'match' | 'training' | 'event'
}

interface SocialPost {
  id: string
  platform: 'instagram' | 'twitter'
  content: string
  image?: string
  likes: number
  date: string
}

interface QuickAccessItem {
  id: string
  title: string
  icon: React.ReactNode
  href: string
  lastUsed: number
}

function App() {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [savedPosts, setSavedPosts] = useState<string[]>([])
  const [quickAccessItems, setQuickAccessItems] = useState<QuickAccessItem[]>([
    { id: '1', title: 'Team Selection', icon: <Users className="w-5 h-5" />, href: '#', lastUsed: Date.now() - 3600000 },
    { id: '2', title: 'Match Reports', icon: <Trophy className="w-5 h-5" />, href: '#', lastUsed: Date.now() - 7200000 },
    { id: '3', title: 'Training Schedule', icon: <Calendar className="w-5 h-5" />, href: '#', lastUsed: Date.now() - 1800000 },
    { id: '4', title: 'Player Stats', icon: <Star className="w-5 h-5" />, href: '#', lastUsed: Date.now() - 5400000 },
    { id: '5', title: 'Club Shop', icon: <ExternalLink className="w-5 h-5" />, href: '#', lastUsed: Date.now() - 10800000 },
    { id: '6', title: 'Contact Us', icon: <Mail className="w-5 h-5" />, href: '#', lastUsed: Date.now() - 14400000 }
  ])
  
  const lastScrollY = useRef(0)
  const scrollDirection = useRef<'up' | 'down'>('up')
  
  // Initialize gamification
  const { trackActivity } = useGamification()

  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Penhill United Secures Victory in Derby Match',
      excerpt: 'A thrilling 3-2 victory against local rivals showcases the team\'s resilience and tactical prowess.',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop',
      date: '2 hours ago',
      category: 'Match Report',
      readTime: '3 min read'
    },
    {
      id: '2',
      title: 'New Youth Academy Program Launches',
      excerpt: 'Exciting opportunities for young players aged 8-16 to develop their skills with professional coaching.',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop',
      date: '5 hours ago',
      category: 'Academy',
      readTime: '2 min read'
    },
    {
      id: '3',
      title: 'Stadium Renovation Update',
      excerpt: 'Phase 2 of our stadium improvements is ahead of schedule with new facilities opening next month.',
      image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=250&fit=crop',
      date: '1 day ago',
      category: 'Club News',
      readTime: '4 min read'
    },
    {
      id: '4',
      title: 'Player of the Month: Sarah Johnson',
      excerpt: 'Outstanding performances throughout March earn Sarah our Player of the Month award.',
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=250&fit=crop',
      date: '2 days ago',
      category: 'Awards',
      readTime: '2 min read'
    }
  ]

  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'vs. Riverside FC',
      date: '2024-07-20',
      time: '15:00',
      location: 'Penhill Stadium',
      type: 'match'
    },
    {
      id: '2',
      title: 'First Team Training',
      date: '2024-07-18',
      time: '18:30',
      location: 'Training Ground',
      type: 'training'
    },
    {
      id: '3',
      title: 'Youth Academy Trials',
      date: '2024-07-22',
      time: '10:00',
      location: 'Penhill Stadium',
      type: 'event'
    }
  ]

  const socialPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'instagram',
      content: 'Match day preparation in full swing! 💪 #PenhillUnited #MatchDay',
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&h=300&fit=crop',
      likes: 234,
      date: '3h'
    },
    {
      id: '2',
      platform: 'twitter',
      content: 'Great training session today! The team is looking sharp for Saturday\'s big match. ⚽',
      likes: 89,
      date: '6h'
    },
    {
      id: '3',
      platform: 'instagram',
      content: 'Behind the scenes: Stadium preparations for this weekend\'s derby! 🏟️',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=300&h=300&fit=crop',
      likes: 156,
      date: '1d'
    }
  ]

  const leagueTable = [
    { position: 1, team: 'City Rangers', played: 28, points: 67, form: ['W', 'W', 'W', 'D', 'W'] },
    { position: 2, team: 'Penhill United', played: 28, points: 63, form: ['W', 'W', 'L', 'W', 'W'] },
    { position: 3, team: 'Riverside FC', played: 28, points: 58, form: ['D', 'W', 'W', 'W', 'L'] },
    { position: 4, team: 'Athletic Club', played: 28, points: 55, form: ['L', 'D', 'W', 'W', 'D'] },
    { position: 5, team: 'United FC', played: 28, points: 52, form: ['W', 'L', 'L', 'W', 'W'] }
  ]

  const topScorers = [
    { name: 'Marcus Thompson', goals: 18, team: 'Penhill United' },
    { name: 'Alex Rodriguez', goals: 16, team: 'City Rangers' },
    { name: 'Jamie Wilson', goals: 14, team: 'Penhill United' },
    { name: 'Sam Parker', goals: 12, team: 'Riverside FC' },
    { name: 'Chris Johnson', goals: 11, team: 'Athletic Club' }
  ]

  // Time and weather simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Scroll handling for smart header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        scrollDirection.current = 'down'
        setIsHeaderCollapsed(true)
      } else if (currentScrollY < lastScrollY.current) {
        scrollDirection.current = 'up'
        setIsHeaderCollapsed(false)
      }
      
      setShowBackToTop(currentScrollY > 600)
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dark mode detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const handleQuickAccessClick = (itemId: string) => {
    setQuickAccessItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, lastUsed: Date.now() }
          : item
      ).sort((a, b) => b.lastUsed - a.lastUsed)
    )
    trackActivity('event_attended')
  }

  const handleNewsRead = (newsId: string) => {
    trackActivity('news_read')
  }

  const handleSocialShare = (postId: string) => {
    trackActivity('social_share')
  }

  const handleSavePost = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleVoiceCommand = (command: string, response: string) => {
    console.log('Voice command:', command, 'Response:', response)
    trackActivity('event_attended') // Track voice interaction
  }

  const getNextMatch = () => {
    const nextMatch = upcomingEvents.find(event => event.type === 'match')
    if (!nextMatch) return null
    
    const matchDate = new Date(`${nextMatch.date}T${nextMatch.time}`)
    const now = new Date()
    const timeDiff = matchDate.getTime() - now.getTime()
    
    if (timeDiff <= 0) return null
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { ...nextMatch, countdown: { days, hours, minutes } }
  }

  const nextMatch = getNextMatch()
  const isGameDay = nextMatch && nextMatch.countdown.days === 0 && nextMatch.countdown.hours <= 12

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Badge Notification System */}
      <BadgeNotification />
      
      {/* Smart Sticky Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
        animate={{
          height: isHeaderCollapsed ? '56px' : '72px',
          y: 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              className="flex items-center space-x-2"
              animate={{ scale: isHeaderCollapsed ? 0.9 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PU</span>
              </div>
              {!isHeaderCollapsed && (
                <motion.span
                  className="font-bold text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Penhill United
                </motion.span>
              )}
            </motion.div>
            
            {/* Live Breadcrumb */}
            <nav className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Game Day Calendar Chip */}
            <AnimatePresence>
              {isGameDay && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="hidden md:flex"
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Add to Calendar
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Voice Search */}
            <VoiceSearch onCommand={handleVoiceCommand} />

            {/* Notification Center */}
            <NotificationCenter />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* User Profile */}
            <UserProfile />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-background border-b md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">Home</Button>
                <Button variant="ghost" className="w-full justify-start">Fixtures</Button>
                <Button variant="ghost" className="w-full justify-start">News</Button>
                <Button variant="ghost" className="w-full justify-start">Team</Button>
                <Button variant="ghost" className="w-full justify-start">Academy</Button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-[72px]">
        {/* Personalized Hero Banner */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 hero-gradient"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: isDarkMode 
                ? 'url(https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=800&fit=crop)'
                : 'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop)'
            }}
          ></div>
          
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome Back to Penhill United
              </h1>
              
              {nextMatch && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="glass-effect rounded-lg p-6 max-w-md mx-auto mb-6"
                >
                  <h3 className="text-xl font-semibold mb-2">Next Match</h3>
                  <p className="text-lg mb-2">{nextMatch.title}</p>
                  <div className="flex justify-center space-x-4 text-sm">
                    <span>{nextMatch.countdown.days}d</span>
                    <span>{nextMatch.countdown.hours}h</span>
                    <span>{nextMatch.countdown.minutes}m</span>
                  </div>
                  
                  {/* Weather Overlay */}
                  {nextMatch.countdown.days <= 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-4 flex items-center justify-center space-x-2 text-sm"
                    >
                      <Cloud className="w-4 h-4" />
                      <span>18°C, Partly Cloudy</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  View Fixtures
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Join the Club
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Access Grid */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickAccessItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                    onClick={() => handleQuickAccessClick(item.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-3 flex justify-center text-primary">
                        {item.icon}
                      </div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* News River with Infinite Scroll */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Latest News</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="md:hidden">
              <div className="news-river flex space-x-4 overflow-x-auto pb-4">
                {newsItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="news-item flex-shrink-0 w-80"
                  >
                    <Card className="h-full">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <Badge className="absolute top-2 left-2">
                          {item.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{item.date}</span>
                          <span>{item.readTime}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <Button size="sm" variant="ghost" className="gap-2">
                            <Play className="w-3 h-3" />
                            Listen
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                      <Badge className="absolute top-2 left-2">
                        {item.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.date}</span>
                        <span>{item.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Club Performance Split View */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Club Performance</h2>
            
            <div className="hidden lg:grid lg:grid-cols-2 gap-8">
              {/* League Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    League Table
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leagueTable.map((team, index) => (
                      <motion.div
                        key={team.team}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          team.team === 'Penhill United' ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-sm w-6">{team.position}</span>
                          <span className="font-medium">{team.team}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>{team.played}</span>
                          <span className="font-bold">{team.points}</span>
                          <div className="flex space-x-1">
                            {team.form.map((result, i) => (
                              <span
                                key={i}
                                className={`w-5 h-5 rounded-full text-xs flex items-center justify-center text-white ${
                                  result === 'W' ? 'bg-green-500' : 
                                  result === 'D' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                              >
                                {result}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Scorers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Top Scorers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topScorers.map((scorer, index) => (
                      <motion.div
                        key={scorer.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          scorer.team === 'Penhill United' ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${scorer.name}`} />
                            <AvatarFallback>{scorer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{scorer.name}</p>
                            <p className="text-xs text-muted-foreground">{scorer.team}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{scorer.goals}</p>
                          <p className="text-xs text-muted-foreground">goals</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden">
              <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table">League Table</TabsTrigger>
                  <TabsTrigger value="scorers">Top Scorers</TabsTrigger>
                </TabsList>
                <TabsContent value="table" className="mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {leagueTable.map((team, index) => (
                          <div
                            key={team.team}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              team.team === 'Penhill United' ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="font-bold text-sm w-6">{team.position}</span>
                              <span className="font-medium text-sm">{team.team}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <span>{team.played}</span>
                              <span className="font-bold">{team.points}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="scorers" className="mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {topScorers.map((scorer, index) => (
                          <div
                            key={scorer.name}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              scorer.team === 'Penhill United' ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${scorer.name}`} />
                                <AvatarFallback>{scorer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{scorer.name}</p>
                                <p className="text-xs text-muted-foreground">{scorer.team}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{scorer.goals}</p>
                              <p className="text-xs text-muted-foreground">goals</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Upcoming Events with iCal */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Subscribe to Calendar
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -3 }}
                >
                  <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-2 rounded-lg ${
                          event.type === 'match' ? 'bg-primary/10 text-primary' :
                          event.type === 'training' ? 'bg-accent/10 text-accent' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {event.type === 'match' ? <Trophy className="w-5 h-5" /> :
                           event.type === 'training' ? <Zap className="w-5 h-5" /> :
                           <Calendar className="w-5 h-5" />}
                        </div>
                        <Badge variant={event.type === 'match' ? 'default' : 'secondary'}>
                          {event.type}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{event.title}</h3>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full mt-4" variant="outline">
                        Add to Calendar
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Masonry Wall */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Club Updates</h2>
            
            <div className="masonry-grid">
              {socialPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="masonry-item"
                >
                  <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                            post.platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-blue-500'
                          }`}>
                            {post.platform === 'instagram' ? 'IG' : 'X'}
                          </div>
                          <span className="text-sm font-medium">@penhillunited</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                      
                      {post.image && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <img 
                            src={post.image} 
                            alt="Social post"
                            className="w-full h-auto"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      <p className="text-sm mb-3">{post.content}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span>❤️ {post.likes} likes</span>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 px-2"
                            onClick={() => handleSocialShare(post.id)}
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className={`h-6 px-2 ${savedPosts.includes(post.id) ? 'text-primary' : ''}`}
                          onClick={() => handleSavePost(post.id)}
                        >
                          <Bookmark className={`w-3 h-3 ${savedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                <p className="text-muted-foreground mb-6">
                  Get the latest news, match updates, and exclusive content delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1"
                  />
                  <Button>Subscribe</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  No spam, unsubscribe anytime. Cookie-free signup.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">PU</span>
                </div>
                <span className="font-bold">Penhill United</span>
              </div>
              <p className="text-sm opacity-80">
                Building champions on and off the field since 1952.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Fixtures</a></li>
                <li><a href="#" className="hover:opacity-100">Results</a></li>
                <li><a href="#" className="hover:opacity-100">Team</a></li>
                <li><a href="#" className="hover:opacity-100">Academy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Club Info</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">About Us</a></li>
                <li><a href="#" className="hover:opacity-100">Contact</a></li>
                <li><a href="#" className="hover:opacity-100">Sponsors</a></li>
                <li><a href="#" className="hover:opacity-100">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Button size="icon" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <span className="sr-only">Facebook</span>
                  📘
                </Button>
                <Button size="icon" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <span className="sr-only">Twitter</span>
                  🐦
                </Button>
                <Button size="icon" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <span className="sr-only">Instagram</span>
                  📷
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2024 Penhill United FC. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top FAB */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App