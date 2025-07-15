import { useState, useEffect, useCallback } from 'react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
  progress: number
  maxProgress: number
  category: 'engagement' | 'loyalty' | 'social' | 'volunteer'
}

interface UserStats {
  eventsAttended: number
  newsArticlesRead: number
  socialShares: number
  volunteerHours: number
  memberSince: Date
  lastActivity: Date
}

export const useGamification = () => {
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 'first_visit',
      name: 'Welcome Aboard',
      description: 'Visited the club portal for the first time',
      icon: '👋',
      earned: false,
      progress: 0,
      maxProgress: 1,
      category: 'engagement'
    },
    {
      id: 'news_reader',
      name: 'News Hound',
      description: 'Read 10 news articles',
      icon: '📰',
      earned: false,
      progress: 0,
      maxProgress: 10,
      category: 'engagement'
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Shared 5 posts on social media',
      icon: '🦋',
      earned: false,
      progress: 0,
      maxProgress: 5,
      category: 'social'
    },
    {
      id: 'super_volunteer',
      name: 'Super Volunteer',
      description: 'Attended 3 volunteer events',
      icon: '🦸',
      earned: false,
      progress: 0,
      maxProgress: 3,
      category: 'volunteer'
    },
    {
      id: 'loyal_supporter',
      name: 'Loyal Supporter',
      description: 'Member for over 1 year',
      icon: '💎',
      earned: false,
      progress: 0,
      maxProgress: 365,
      category: 'loyalty'
    },
    {
      id: 'match_attendee',
      name: 'Match Day Hero',
      description: 'Attended 5 matches this season',
      icon: '⚽',
      earned: false,
      progress: 0,
      maxProgress: 5,
      category: 'engagement'
    }
  ])

  const [userStats, setUserStats] = useState<UserStats>({
    eventsAttended: 0,
    newsArticlesRead: 0,
    socialShares: 0,
    volunteerHours: 0,
    memberSince: new Date('2024-01-01'),
    lastActivity: new Date()
  })

  // Load saved progress from localStorage
  useEffect(() => {
    const savedBadges = localStorage.getItem('penhill_badges')
    const savedStats = localStorage.getItem('penhill_user_stats')
    
    if (savedBadges) {
      try {
        const parsedBadges = JSON.parse(savedBadges)
        setBadges(parsedBadges)
      } catch (error) {
        console.error('Error loading badges:', error)
      }
    }
    
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats)
        setUserStats({
          ...parsedStats,
          memberSince: new Date(parsedStats.memberSince),
          lastActivity: new Date(parsedStats.lastActivity)
        })
      } catch (error) {
        console.error('Error loading user stats:', error)
      }
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('penhill_badges', JSON.stringify(badges))
  }, [badges])

  useEffect(() => {
    localStorage.setItem('penhill_user_stats', JSON.stringify(userStats))
  }, [userStats])

  // Award first visit badge on mount
  useEffect(() => {
    const hasVisited = localStorage.getItem('penhill_first_visit')
    if (!hasVisited) {
      localStorage.setItem('penhill_first_visit', 'true')
      updateBadgeProgress('first_visit', 1)
    }
  }, [updateBadgeProgress])

  const updateBadgeProgress = useCallback((badgeId: string, progressToAdd: number) => {
    setBadges(prev => prev.map(badge => {
      if (badge.id === badgeId) {
        const newProgress = Math.min(badge.progress + progressToAdd, badge.maxProgress)
        const wasEarned = badge.earned
        const isNowEarned = newProgress >= badge.maxProgress
        
        if (!wasEarned && isNowEarned) {
          // Badge just earned - show notification
          setTimeout(() => {
            showBadgeNotification(badge)
          }, 500)
        }
        
        return {
          ...badge,
          progress: newProgress,
          earned: isNowEarned,
          earnedAt: isNowEarned && !wasEarned ? new Date() : badge.earnedAt
        }
      }
      return badge
    }))
  }, [])

  const trackActivity = useCallback((activity: string, value: number = 1) => {
    setUserStats(prev => ({ ...prev, lastActivity: new Date() }))

    switch (activity) {
      case 'first_visit':
        updateBadgeProgress('first_visit', 1)
        break
      case 'news_read':
        setUserStats(prev => ({ ...prev, newsArticlesRead: prev.newsArticlesRead + value }))
        updateBadgeProgress('news_reader', value)
        break
      case 'social_share':
        setUserStats(prev => ({ ...prev, socialShares: prev.socialShares + value }))
        updateBadgeProgress('social_butterfly', value)
        break
      case 'event_attended':
        setUserStats(prev => ({ ...prev, eventsAttended: prev.eventsAttended + value }))
        updateBadgeProgress('match_attendee', value)
        break
      case 'volunteer_activity':
        setUserStats(prev => ({ ...prev, volunteerHours: prev.volunteerHours + value }))
        updateBadgeProgress('super_volunteer', value)
        break
    }

    // Check loyalty badge based on membership duration
    const daysSinceMember = Math.floor((Date.now() - userStats.memberSince.getTime()) / (1000 * 60 * 60 * 24))
    updateBadgeProgress('loyal_supporter', daysSinceMember)
  }, [updateBadgeProgress, userStats.memberSince])

  const showBadgeNotification = (badge: Badge) => {
    // Create a custom notification for badge earned
    const event = new CustomEvent('badgeEarned', {
      detail: {
        badge: {
          ...badge,
          earned: true,
          earnedAt: new Date()
        }
      }
    })
    window.dispatchEvent(event)
  }

  const getEarnedBadges = () => badges.filter(badge => badge.earned)
  
  const getProgressBadges = () => badges.filter(badge => !badge.earned && badge.progress > 0)
  
  const getAvailableBadges = () => badges.filter(badge => !badge.earned && badge.progress === 0)

  const getBadgesByCategory = (category: Badge['category']) => 
    badges.filter(badge => badge.category === category)

  const getTotalBadgeScore = () => 
    badges.reduce((score, badge) => score + (badge.earned ? badge.maxProgress : 0), 0)

  const getUserLevel = () => {
    const score = getTotalBadgeScore()
    if (score >= 50) return { level: 5, title: 'Club Legend' }
    if (score >= 30) return { level: 4, title: 'Super Fan' }
    if (score >= 20) return { level: 3, title: 'Dedicated Supporter' }
    if (score >= 10) return { level: 2, title: 'Active Member' }
    return { level: 1, title: 'New Member' }
  }

  return {
    badges,
    userStats,
    trackActivity,
    getEarnedBadges,
    getProgressBadges,
    getAvailableBadges,
    getBadgesByCategory,
    getTotalBadgeScore,
    getUserLevel
  }
}