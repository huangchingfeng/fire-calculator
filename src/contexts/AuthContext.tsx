'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, isConfigured } from '@/lib/firebase'
import {
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from '@/lib/firestore'

// ===== Context 型別 =====

interface AuthContextValue {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  isFirebaseReady: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Pick<UserProfile, 'displayName' | 'phone'>>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ===== Provider =====

const googleProvider = new GoogleAuthProvider()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(isConfigured)

  // 建立或更新 Firestore 用戶文件
  const ensureUserDoc = useCallback(
    async (firebaseUser: User, extraData?: { displayName?: string; phone?: string }) => {
      if (!db) return
      const existing = await getUserProfile(firebaseUser.uid)
      if (existing) {
        setUserProfile(existing)
        return
      }
      // 新用戶，建立文件
      const profile: UserProfile = {
        uid: firebaseUser.uid,
        displayName: extraData?.displayName ?? firebaseUser.displayName ?? '',
        phone: extraData?.phone ?? '',
        email: firebaseUser.email ?? '',
        photoURL: firebaseUser.photoURL ?? null,
      }
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      setUserProfile(profile)
    },
    []
  )

  // 監聽登入狀態
  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await ensureUserDoc(firebaseUser)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [ensureUserDoc])

  // Google 登入
  const signInWithGoogle = useCallback(async () => {
    if (!auth) throw new Error('Firebase 尚未設定')
    const result = await signInWithPopup(auth, googleProvider)
    await ensureUserDoc(result.user)
  }, [ensureUserDoc])

  // Email 登入
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase 尚未設定')
    const result = await signInWithEmailAndPassword(auth, email, password)
    await ensureUserDoc(result.user)
  }, [ensureUserDoc])

  // Email 註冊
  const signUpWithEmail = useCallback(
    async (email: string, password: string, name: string, phone: string) => {
      if (!auth) throw new Error('Firebase 尚未設定')
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await ensureUserDoc(result.user, { displayName: name, phone })
    },
    [ensureUserDoc]
  )

  // 登出
  const signOut = useCallback(async () => {
    if (!auth) return
    await firebaseSignOut(auth)
    setUser(null)
    setUserProfile(null)
  }, [])

  // 更新個人資料
  const updateProfileFn = useCallback(
    async (data: Partial<Pick<UserProfile, 'displayName' | 'phone'>>) => {
      if (!user) return
      await updateUserProfile(user.uid, data)
      setUserProfile((prev) =>
        prev ? { ...prev, ...data } : prev
      )
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isFirebaseReady: isConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateProfile: updateProfileFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ===== Hook =====

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth 必須在 AuthProvider 內使用')
  }
  return ctx
}
