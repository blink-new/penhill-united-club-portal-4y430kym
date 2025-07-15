import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Trophy, 
  Users, 
  Clock, 
  MapPin, 
  Star, 
  TrendingUp, 
  Activity,
  Target,
  Award,
  Zap,
  Heart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface MemberStats {
  matchesAttended: number
  trainingsSessions: number
  volunteerHours: number
  socialEngagement: number
  membershipStreak: number
  favoritePlayer: string
  preferredPosition: string
  joinDate: Date
}

interface PersonalizedContent {
  nextMatch: {
    opponent: string
    date: Date
    venue: string
    importance: 'high' | 'medium' | 'low'
    prediction: string
  }
  recommendations: {
    id: string
    type: 'article' | 'video' | 'event'
    title: string
    reason: string
    image: string
  }[]
  achievements: {
    id: string
    title: string
    description: string
    icon: string
    unlockedAt: Date
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }[]
}

export const MemberDashboard: React.FC = () => {
  const [memberStats, setMemberStats] = useState<MemberStats>({
    matchesAttended: 12,
    trainingsSessions: 8,
    volunteerHours: 24,
    socialEngagement: 85,
    membershipStreak: 156,
    favoritePlayer: 'Marcus Thompson',
    preferredPosition: 'Midfielder',
    joinDate: new Date('2024-01-15')
  })

  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent>({
    nextMatch: {
      opponent: 'Riverside FC',
      date: new Date('2024-07-20T15:00:00'),
      venue: 'Penhill Stadium',
      importance: 'high',
      prediction: '78% win probability based on recent form'
    },
    recommendations: [
      {
        id: '1',
        type: 'article',
        title: 'Marcus Thompson: The Making of a Goal Machine',
        reason: 'Based on your favorite player',
        image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=120&fit=crop'
      },
      {
        id: '2',
        type: 'video',
        title: 'Midfield Masterclass: Tactical Analysis',
        reason: 'Matches your preferred position',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=120&fit=crop'
      },
      {
        id: '3',
        type: 'event',
        title: 'Volunteer Appreciation Dinner',
        reason: 'You\'ve volunteered 24 hours this season',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&h=120&fit=crop'
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Loyal Supporter',
        description: 'Attended 10+ matches this season',
        icon: '🏆',
        unlockedAt: new Date('2024-06-15'),
        rarity: 'rare'
      },
      {
        id: '2',
        title: 'Community Champion',
        description: 'Volunteered 20+ hours',
        icon: '🌟',
        unlockedAt: new Date('2024-07-01'),
        rarity: 'epic'
      },
      {
        id: '3',
        title: 'Social Butterfly',
        description: 'High social engagement score',
        icon: '🦋',
        unlockedAt: new Date('2024-07-10'),
        rarity: 'common'
      }
    ]
  })

  const [activeTab, setActiveTab] = useState('overview')
  const [timeUntilMatch, setTimeUntilMatch] = useState('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const matchTime = personalizedContent.nextMatch.date
      const diff = matchTime.getTime() - now.getTime()
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        
        if (days > 0) {
          setTimeUntilMatch(`${days}d ${hours}h ${minutes}m`)
        } else {
          setTimeUntilMatch(`${hours}h ${minutes}m`)
        }
      } else {
        setTimeUntilMatch('Match in progress')
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000)
    return () => clearInterval(interval)
  }, [personalizedContent.nextMatch.date])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
    }
  }

  const getEngagementLevel = (score: number) => {
    if (score >= 90) return { level: 'Superfan', color: 'text-purple-600', bg: 'bg-purple-100' }
    if (score >= 70) return { level: 'Active', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 50) return { level: 'Regular', color: 'text-green-600', bg: 'bg-green-100' }
    return { level: 'Casual', color: 'text-gray-600', bg: 'bg-gray-100' }
  }

  const engagement = getEngagementLevel(memberStats.socialEngagement)

  return (
    <div className="space-y-6">
      {/* Personalized Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent p-6 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome back, Member!</h2>
              <p className="opacity-90">Your next match is in {timeUntilMatch}</p>
            </div>
            <div className="text-right">
              <Badge className={`${engagement.bg} ${engagement.color} border-0`}>
                {engagement.level} Member
              </Badge>
              <p className="text-sm opacity-90 mt-1">{memberStats.membershipStreak} day streak</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{memberStats.matchesAttended}</div>
              <div className="text-sm opacity-90">Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{memberStats.trainingsSessions}</div>
              <div className="text-sm opacity-90">Training</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{memberStats.volunteerHours}</div>
              <div className="text-sm opacity-90">Vol. Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{memberStats.socialEngagement}%</div>
              <div className="text-sm opacity-90">Engagement</div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-6xl">⚽</div>
          <div className="absolute bottom-4 left-4 text-4xl">🏆</div>
          <div className="absolute top-1/2 left-1/3 text-3xl">⭐</div>
        </div>
      </motion.div>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="recommendations">For You</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Next Match Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Next Match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">vs {personalizedContent.nextMatch.opponent}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {personalizedContent.nextMatch.date.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {personalizedContent.nextMatch.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {personalizedContent.nextMatch.venue}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={personalizedContent.nextMatch.importance === 'high' ? 'destructive' : 'secondary'}
                  className="capitalize"
                >
                  {personalizedContent.nextMatch.importance} Priority
                </Badge>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Match Prediction</span>
                </div>
                <p className="text-sm text-muted-foreground">{personalizedContent.nextMatch.prediction}</p>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">Get Tickets</Button>
                <Button variant="outline" className="flex-1">Add to Calendar</Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Favorite Player</p>
                    <p className="font-semibold">{memberStats.favoritePlayer}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Position</p>
                    <p className="font-semibold">{memberStats.preferredPosition}</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-semibold">{memberStats.joinDate.toLocaleDateString()}</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Match Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Season Progress</span>
                    <span>{memberStats.matchesAttended}/20 matches</span>
                  </div>
                  <Progress value={(memberStats.matchesAttended / 20) * 100} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{Math.round((memberStats.matchesAttended / 20) * 100)}%</div>
                    <div className="text-sm text-muted-foreground">Attendance Rate</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{20 - memberStats.matchesAttended}</div>
                    <div className="text-sm text-muted-foreground">Matches Left</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {personalizedContent.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getRarityColor(achievement.rarity)}`}>
                        <span className="text-lg">{achievement.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <Badge variant="outline" className="text-xs capitalize">
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {personalizedContent.recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={rec.image} 
                        alt={rec.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{rec.title}</h3>
                          <Badge variant="outline" className="text-xs capitalize">
                            {rec.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                        <Button size="sm" variant="outline">
                          {rec.type === 'article' ? 'Read Article' : 
                           rec.type === 'video' ? 'Watch Video' : 'View Event'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}