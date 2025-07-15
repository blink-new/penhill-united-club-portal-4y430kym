import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, Settings, X, Calendar, Trophy, Users, Zap } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { useNotifications } from '../hooks/useNotifications'

interface NotificationCenterProps {
  onScheduleReminder?: (type: 'training' | 'match', time: Date, details?: any) => void
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onScheduleReminder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    matchReminders: true,
    trainingReminders: true,
    newsUpdates: false,
    socialUpdates: false
  })
  
  const { 
    permission, 
    isSupported, 
    subscribed, 
    requestPermission, 
    scheduleTrainingReminder,
    scheduleMatchReminder,
    unsubscribe 
  } = useNotifications()

  const mockNotifications = [
    {
      id: '1',
      type: 'match' as const,
      title: 'Match Reminder',
      message: 'vs. Riverside FC starts in 2 hours',
      time: '2 hours ago',
      read: false,
      icon: <Trophy className="w-4 h-4" />
    },
    {
      id: '2',
      type: 'training' as const,
      title: 'Training Session',
      message: 'First Team Training at 6:30 PM today',
      time: '4 hours ago',
      read: true,
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: '3',
      type: 'news' as const,
      title: 'New Article',
      message: 'Player of the Month: Sarah Johnson',
      time: '1 day ago',
      read: true,
      icon: <Users className="w-4 h-4" />
    }
  ]

  const unreadCount = mockNotifications.filter(n => !n.read).length

  const handleEnableNotifications = async () => {
    const granted = await requestPermission()
    if (granted) {
      // Schedule upcoming reminders
      const trainingTime = new Date()
      trainingTime.setDate(trainingTime.getDate() + 1)
      trainingTime.setHours(18, 30, 0, 0)
      
      const matchTime = new Date()
      matchTime.setDate(matchTime.getDate() + 3)
      matchTime.setHours(15, 0, 0, 0)
      
      scheduleTrainingReminder(trainingTime)
      scheduleMatchReminder(matchTime, 'Riverside FC')
      
      onScheduleReminder?.('training', trainingTime)
      onScheduleReminder?.('match', matchTime, { opponent: 'Riverside FC' })
    }
  }

  const handleSettingChange = (setting: keyof typeof notificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: value }))
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        {subscribed ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-12 right-0 z-50 w-80"
          >
            <Card className="shadow-xl border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSettings(!showSettings)}
                      className="h-8 w-8"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {!subscribed && (
                  <div className="p-4 bg-muted/50 border-b">
                    <div className="text-center">
                      <BellOff className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium mb-2">Enable Notifications</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Get reminders for matches, training sessions, and club updates
                      </p>
                      <Button size="sm" onClick={handleEnableNotifications}>
                        Enable Notifications
                      </Button>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-b bg-muted/30"
                    >
                      <div className="p-4 space-y-4">
                        <h4 className="font-medium text-sm">Notification Settings</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Match Reminders</p>
                              <p className="text-xs text-muted-foreground">1 hour before matches</p>
                            </div>
                            <Switch
                              checked={notificationSettings.matchReminders}
                              onCheckedChange={(checked) => handleSettingChange('matchReminders', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Training Reminders</p>
                              <p className="text-xs text-muted-foreground">30 minutes before training</p>
                            </div>
                            <Switch
                              checked={notificationSettings.trainingReminders}
                              onCheckedChange={(checked) => handleSettingChange('trainingReminders', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">News Updates</p>
                              <p className="text-xs text-muted-foreground">New articles and announcements</p>
                            </div>
                            <Switch
                              checked={notificationSettings.newsUpdates}
                              onCheckedChange={(checked) => handleSettingChange('newsUpdates', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Social Updates</p>
                              <p className="text-xs text-muted-foreground">New posts and interactions</p>
                            </div>
                            <Switch
                              checked={notificationSettings.socialUpdates}
                              onCheckedChange={(checked) => handleSettingChange('socialUpdates', checked)}
                            />
                          </div>
                        </div>
                        
                        {subscribed && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={unsubscribe}
                            className="w-full text-red-600 hover:text-red-700"
                          >
                            Disable All Notifications
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {mockNotifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-1 rounded-full ${
                              notification.type === 'match' ? 'bg-primary/10 text-primary' :
                              notification.type === 'training' ? 'bg-accent/10 text-accent' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {notification.icon}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium truncate">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                
                {mockNotifications.length > 0 && (
                  <div className="p-3 border-t bg-muted/30">
                    <Button variant="ghost" size="sm" className="w-full">
                      Mark All as Read
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}