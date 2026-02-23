import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FireInput, FireResult } from '@/types/fire'

// ===== 型別定義 =====

export interface SavedCalculation {
  id: string
  input: FireInput
  result: FireResult
  clientName: string
  clientNote: string
  createdAt: Date
  fireNumber: number
  fireAge: number
  savingRate: number
}

export interface UserProfile {
  uid: string
  displayName: string
  phone: string
  email: string
  photoURL: string | null
}

// ===== 計算紀錄 CRUD =====

/** 儲存計算結果 */
export async function saveCalculation(
  uid: string,
  input: FireInput,
  result: FireResult,
  clientName = '',
  clientNote = ''
): Promise<string> {
  if (!db) throw new Error('Firestore 尚未初始化')
  const colRef = collection(db, 'users', uid, 'calculations')
  const docRef = await addDoc(colRef, {
    input,
    result,
    clientName,
    clientNote,
    createdAt: serverTimestamp(),
    // 冗餘摘要欄位，方便列表顯示
    fireNumber: result.fireNumber,
    fireAge: result.fireAge,
    savingRate: result.savingRate,
  })
  return docRef.id
}

/** 取得計算歷史（按建立時間倒序） */
export async function getCalculations(
  uid: string,
  maxCount = 50
): Promise<SavedCalculation[]> {
  if (!db) return []
  const colRef = collection(db, 'users', uid, 'calculations')
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(maxCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      input: data.input as FireInput,
      result: data.result as FireResult,
      clientName: data.clientName ?? '',
      clientNote: data.clientNote ?? '',
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      fireNumber: data.fireNumber ?? 0,
      fireAge: data.fireAge ?? 0,
      savingRate: data.savingRate ?? 0,
    }
  })
}

/** 取得單筆計算紀錄 */
export async function getCalculation(
  uid: string,
  calcId: string
): Promise<SavedCalculation | null> {
  if (!db) return null
  const docRef = doc(db, 'users', uid, 'calculations', calcId)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    id: snap.id,
    input: data.input as FireInput,
    result: data.result as FireResult,
    clientName: data.clientName ?? '',
    clientNote: data.clientNote ?? '',
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    fireNumber: data.fireNumber ?? 0,
    fireAge: data.fireAge ?? 0,
    savingRate: data.savingRate ?? 0,
  }
}

/** 刪除單筆計算紀錄 */
export async function deleteCalculation(
  uid: string,
  calcId: string
): Promise<void> {
  if (!db) return
  const docRef = doc(db, 'users', uid, 'calculations', calcId)
  await deleteDoc(docRef)
}

// ===== 用戶資料 =====

/** 更新用戶資料 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, 'displayName' | 'phone'>>
): Promise<void> {
  if (!db) return
  const docRef = doc(db, 'users', uid)
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

/** 取得用戶資料 */
export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  if (!db) return null
  const docRef = doc(db, 'users', uid)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    uid,
    displayName: data.displayName ?? '',
    phone: data.phone ?? '',
    email: data.email ?? '',
    photoURL: data.photoURL ?? null,
  }
}
