import { useState, useEffect } from 'react'

interface NotificationState {
  permission: NotificationPermission
  isSupported: boolean
  subscribed: boolean
}

interface PushNotification {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
}

export const useNotifications = () => {
  const [state, setState] = useState<NotificationState>({
    permission: 'default',
    isSupported: false,
    subscribed: false
  })

  useEffect(() => {
    if ('Notification' in window) {
      setState(prev => ({
        ...prev,
        isSupported: true,
        permission: Notification.permission
      }))
    }

    // Check if user has existing subscription
    const hasSubscription = localStorage.getItem('push_notifications_enabled') === 'true'
    setState(prev => ({ ...prev, subscribed: hasSubscription }))
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!state.isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      setState(prev => ({ ...prev, permission }))
      
      if (permission === 'granted') {
        localStorage.setItem('push_notifications_enabled', 'true')
        setState(prev => ({ ...prev, subscribed: true }))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  const sendNotification = (notification: PushNotification) => {
    if (state.permission !== 'granted' || !state.isSupported) return

    const options: NotificationOptions = {
      body: notification.body,
      icon: notification.icon || '/favicon.svg',
      badge: notification.badge || '/favicon.svg',
      tag: notification.tag,
      data: notification.data,
      requireInteraction: true
    }

    new Notification(notification.title, options)
  }

  const scheduleTrainingReminder = (trainingTime: Date) => {
    if (state.permission !== 'granted') return

    const reminderTime = new Date(trainingTime.getTime() - 30 * 60 * 1000) // 30 minutes before
    const now = new Date()
    
    if (reminderTime > now) {
      const timeoutMs = reminderTime.getTime() - now.getTime()
      
      setTimeout(() => {
        sendNotification({
          title: 'Training Reminder',
          body: 'Training session starts in 30 minutes at the Training Ground',
          tag: 'training-reminder',
          data: { type: 'training', time: trainingTime.toISOString() }
        })
      }, timeoutMs)
    }
  }

  const scheduleMatchReminder = (matchTime: Date, opponent: string) => {
    if (state.permission !== 'granted') return

    const reminderTime = new Date(matchTime.getTime() - 60 * 60 * 1000) // 1 hour before
    const now = new Date()
    
    if (reminderTime > now) {
      const timeoutMs = reminderTime.getTime() - now.getTime()
      
      setTimeout(() => {
        sendNotification({
          title: 'Match Starting Soon!',
          body: `Match vs ${opponent} starts in 1 hour. Get ready!`,
          tag: 'match-reminder',
          data: { type: 'match', opponent, time: matchTime.toISOString() }
        })
      }, timeoutMs)
    }
  }

  const unsubscribe = () => {
    localStorage.removeItem('push_notifications_enabled')
    setState(prev => ({ ...prev, subscribed: false }))
  }

  return {
    ...state,
    requestPermission,
    sendNotification,
    scheduleTrainingReminder,
    scheduleMatchReminder,
    unsubscribe
  }
}