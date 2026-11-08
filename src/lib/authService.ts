import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  handle?: string;
  bio?: string;
  createdAt?: unknown;
  lastLoginAt?: unknown;
}

// 구글 인증 제공자 인스턴스
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/**
 * Google 팝업 로그인
 */
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  // 로그인 성공 시 Firestore 'users/{user.uid}' 경로에 유저 정보 동기화
  await syncUserProfile(result.user);
  return result.user;
}

/**
 * Firebase 로그아웃
 */
export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Firebase onAuthStateChanged 실시간 감지 리스너
 */
export function subscribeAuthState(
  callback: (user: User | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

/**
 * 이메일 앞부분(@ 이전)을 디스플레이 네임으로 추출
 */
export function getEmailPrefix(email?: string | null, fallback?: string | null): string {
  if (email && email.includes('@')) {
    return email.split('@')[0];
  }
  return fallback || '사용자';
}

/**
 * Firestore 경로: users/{user.uid} 에 유저 정보 저장 및 동기화
 */
export async function syncUserProfile(user: User): Promise<UserData> {
  const userDocRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userDocRef);

  // 디스플레이 네임: 이메일 앞부분(@ 이전) 사용
  const emailPrefix = getEmailPrefix(user.email, user.displayName);

  const baseUserData: UserData = {
    uid: user.uid,
    email: user.email,
    displayName: emailPrefix,
    photoURL: user.photoURL,
  };

  if (!snap.exists()) {
    // 최초 로그인 시 유저 프로필 생성
    const newProfile = {
      ...baseUserData,
      handle: `@${emailPrefix}`,
      bio: '마이링크로 연결되는 나만의 공간이에요 ✨',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userDocRef, newProfile);
    return newProfile;
  } else {
    // 기존 유저 로그인 시 최종 로그인 일시 및 최신 프로필 정보 갱신 (displayName도 이메일 앞부분으로 동기화)
    const existing = snap.data() as UserData;
    const updated = {
      ...existing,
      ...baseUserData,
      displayName: emailPrefix,
      handle: existing.handle || `@${emailPrefix}`,
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userDocRef, updated, { merge: true });
    return updated;
  }
}

/**
 * Firestore 경로: users/{uid} 에서 유저 정보 조회
 */
export async function getUserProfile(uid: string): Promise<UserData | null> {
  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserData;
    }
  } catch (error) {
    console.warn(`[Firestore] users/${uid} 유저 정보 로드 실패:`, error);
  }
  return null;
}
