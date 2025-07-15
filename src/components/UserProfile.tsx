import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Trophy, Star, Calendar, Share2, Settings, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Progress } from './ui/progress'
import { useGamification } from '../hooks/useGamification'

interface UserProfileProps {
  user?: {
    name: string
    email: string
    avatar?: string
    memberSince: Date
  }
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    memberSince: new Date('2024-01-15')
  }
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'stats'>('overview')
  
  const {
    badges,
    userStats,
    getEarnedBadges,
    getProgressBadges,
    getTotalBadgeScore,
    getUserLevel
  } = useGamification()

  const earnedBadges = getEarnedBadges()
  const progressBadges = getProgressBadges()
  const userLevel = getUserLevel()
  const totalScore = getTotalBadgeScore()

  const membershipDays = Math.floor((Date.now() - user.memberSince.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        
        {/* Level indicator ring */}
        <motion.div
          className="absolute -inset-1 rounded-full border-2 border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div 
            className="absolute inset-0 rounded-full border-2 border-primary"
            style={{
              clipPath: `polygon(0 0, ${(totalScore / 100) * 100}% 0, ${(totalScore / 100) * 100}% 100%, 0 100%)`
            }}
          />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-12 right-0 z-50 w-96"
          >
            <Card className="shadow-xl border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-lg">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Badge 
                      className="absolute -bottom-1 -right-1 text-xs px-1 py-0"
                      variant="secondary"
                    >
                      {userLevel.level}
                    </Badge>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{userLevel.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Trophy className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">
                        {totalScore} points • {earnedBadges.length} badges
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Tab Navigation */}
                <div className="flex border-b">
                  {[
                    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
                    { id: 'badges', label: 'Badges', icon: <Trophy className="w-4 h-4" /> },
                    { id: 'stats', label: 'Stats', icon: <Star className="w-4 h-4" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-primary border-b-2 border-primary bg-primary/5'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-4 space-y-4"
                      >
                        <div>
                          <h4 className="font-medium mb-2">Member Since</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {user.memberSince.toLocaleDateString()} ({membershipDays} days)
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Recent Achievements</h4>
                          <div className="space-y-2">
                            {earnedBadges.slice(0, 3).map((badge) => (
                              <div key={badge.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                                <span className="text-lg">{badge.icon}</span>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{badge.name}</p>
                                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                                </div>
                              </div>
                            ))}
                            {earnedBadges.length === 0 && (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                No badges earned yet. Keep engaging with the club!
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Progress to Next Level</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Level {userLevel.level}</span>
                              <span>{totalScore}/100 points</span>
                            </div>
                            <Progress value={(totalScore / 100) * 100} className="h-2" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'badges' && (
                      <motion.div
                        key="badges"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-4"
                      >
                        <div className="space-y-4">
                          {earnedBadges.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3 text-green-600">Earned Badges</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {earnedBadges.map((badge) => (
                                  <motion.div
                                    key={badge.id}
                                    whileHover={{ scale: 1.05 }}
                                    className="p-3 bg-green-50 border border-green-200 rounded-lg text-center"
                                  >
                                    <div className="text-2xl mb-1">{badge.icon}</div>
                                    <p className="text-xs font-medium">{badge.name}</p>
                                    <Badge variant="secondary" className="mt-1 text-xs">
                                      {badge.category}
                                    </Badge>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {progressBadges.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3 text-blue-600">In Progress</h4>
                              <div className="space-y-2">
                                {progressBadges.map((badge) => (
                                  <div key={badge.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-lg">{badge.icon}</span>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">{badge.name}</p>
                                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-xs">
                                        <span>{badge.progress}/{badge.maxProgress}</span>
                                        <span>{Math.round((badge.progress / badge.maxProgress) * 100)}%</span>
                                      </div>
                                      <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-1" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'stats' && (
                      <motion.div
                        key="stats"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-4 space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold text-primary">{userStats.eventsAttended}</p>
                            <p className="text-xs text-muted-foreground">Events Attended</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold text-primary">{userStats.newsArticlesRead}</p>
                            <p className="text-xs text-muted-foreground">Articles Read</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold text-primary">{userStats.socialShares}</p>
                            <p className="text-xs text-muted-foreground">Social Shares</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold text-primary">{userStats.volunteerHours}</p>
                            <p className="text-xs text-muted-foreground">Volunteer Hours</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Activity Summary</h4>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p>Last activity: {userStats.lastActivity.toLocaleDateString()}</p>
                            <p>Total score: {totalScore} points</p>
                            <p>Current level: {userLevel.title}</p>
                            <p>Badges earned: {earnedBadges.length}/{badges.length}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="p-4 border-t bg-muted/30">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Share2 className="w-4 h-4" />
                      Share Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}