// lib/notificationListener.js

import { useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { useDispatch } from 'react-redux'
import { setNotifications,addNotification, updateNotification } from '../app/redux/feature/notificationSlice'

export default function useNotificationListener(userId) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!userId) return

    const q = query(
      collection(db, 'artworkNotifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    let isInitial = true

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isInitial) {
        const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        dispatch(setNotifications(allData))
        isInitial = false
        return
      }

      snapshot.docChanges().forEach(change => {
        const data = { id: change.doc.id, ...change.doc.data() }

        if (change.type === "added") {
          dispatch(addNotification(data))
        }

        if (change.type === "modified") {
          dispatch(updateNotification(data))
        }
      })
    })

    return () => unsubscribe()
  }, [userId])
}
