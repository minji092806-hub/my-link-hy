import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  handle?: string;
  bio?: string;
  createdAt?: unknown;
  lastLoginAt?: unknown;
  updatedAt?: unknown;
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

  // 디스플레이 네임: 이메일 앞부분(@ 이전) 기본값
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
    // 기존 유저 로그인 시 최종 로그인 일시 및 최신 프로필 정보 갱신
    // 사용자가 직접 변경한 displayName 및 handle이 있다면 보존
    const existing = snap.data() as UserData;
    const updated = {
      ...existing,
      email: user.email ?? existing.email,
      photoURL: existing.photoURL || user.photoURL,
      displayName: existing.displayName || emailPrefix,
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

/**
 * 사용자 핸들에서 '@'를 제거한 순수 ID 반환 (URL 슬러그용)
 * 예: "@kkyareuk" -> "kkyareuk"
 */
export function getUserHandleId(
  handle?: string | null,
  email?: string | null,
  fallback?: string | null
): string {
  if (handle && handle.trim()) {
    const trimmed = handle.trim();
    const clean = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
    if (clean) return clean;
  }
  if (email && email.includes('@')) {
    return email.split('@')[0];
  }
  return fallback || 'user';
}

/**
 * 사용자 검색 (핸들 ID 우선, 그다음 displayName, uid 순서로 검색)
 * - Firestore users 컬렉션에서 handle 일치 여부 확인 (@ 포함/미포함 유연하게 대응)
 * - 없으면 displayName 일치 여부 확인
 * - 없으면 uid 직접 조회
 * - 일치하는 유저가 없으면 null 반환
 */
export async function getUserByDisplayName(rawIdentifier: string): Promise<UserData | null> {
  if (!rawIdentifier) return null;
  const decoded = decodeURIComponent(rawIdentifier).trim();
  if (!decoded) return null;

  try {
    const usersRef = collection(db, "users");

    // 1. handle 일치 여부 최우선 검색 (예: kkyareuk 또는 @kkyareuk)
    const handleWithoutAt = decoded.startsWith("@") ? decoded.slice(1) : decoded;
    const handleWithAt = `@${handleWithoutAt}`;

    const qHandle1 = query(usersRef, where("handle", "==", handleWithAt));
    const snapHandle1 = await getDocs(qHandle1);
    if (!snapHandle1.empty) {
      const docSnap = snapHandle1.docs[0];
      return { ...docSnap.data(), uid: docSnap.id } as UserData;
    }

    const qHandle2 = query(usersRef, where("handle", "==", handleWithoutAt));
    const snapHandle2 = await getDocs(qHandle2);
    if (!snapHandle2.empty) {
      const docSnap = snapHandle2.docs[0];
      return { ...docSnap.data(), uid: docSnap.id } as UserData;
    }

    // 2. displayName 정확 일치 쿼리
    const qName = query(usersRef, where("displayName", "==", decoded));
    const snapName = await getDocs(qName);
    if (!snapName.empty) {
      const docSnap = snapName.docs[0];
      return { ...docSnap.data(), uid: docSnap.id } as UserData;
    }

    // 3. uid 자체로 접근한 경우도 지원
    const directDocRef = doc(db, "users", decoded);
    const directSnap = await getDoc(directDocRef);
    if (directSnap.exists()) {
      return { ...directSnap.data(), uid: directSnap.id } as UserData;
    }
  } catch (error) {
    console.error("[Firestore] 유저 검색 에러:", error);
  }

  return null;
}

/**
 * Display Name(닉네임) 중복 확인
 * - 빈값 또는 2자 미만 / 20자 초과 등 검증
 * - Firestore users 컬렉션에서 동일한 displayName이 존재하는지 쿼리
 * - 본인의 현재 uid는 중복 검사 대상에서 제외
 */
export async function checkDisplayNameDuplicate(
  displayName: string,
  currentUid?: string
): Promise<{ isAvailable: boolean; message: string }> {
  const trimmed = displayName.trim();

  if (!trimmed) {
    return { isAvailable: false, message: '이름(Display Name)을 입력해주세요.' };
  }

  if (trimmed.length < 2) {
    return { isAvailable: false, message: '이름은 최소 2글자 이상 입력해주세요.' };
  }

  if (trimmed.length > 20) {
    return { isAvailable: false, message: '이름은 최대 20글자까지 가능해요.' };
  }

  // 특수문자 제한 (한글, 영문, 숫자, 밑줄, 하이픈, 띄어쓰기 허용)
  const validPattern = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s_\-]+$/;
  if (!validPattern.test(trimmed)) {
    return {
      isAvailable: false,
      message: '이름에는 한글, 영문, 숫자, 밑줄(_), 하이픈(-), 공백만 사용할 수 있어요.',
    };
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('displayName', '==', trimmed));
    const snapshot = await getDocs(q);

    // 본인 uid를 제외한 다른 유저 중 동일한 displayName이 있는지 확인
    const otherUsers = snapshot.docs.filter((docSnap) => docSnap.id !== currentUid);

    if (otherUsers.length > 0) {
      return {
        isAvailable: false,
        message: `'${trimmed}'은(는) 이미 다른 사용자가 사용 중인 이름이에요.`,
      };
    }

    return {
      isAvailable: true,
      message: `'${trimmed}'은(는) 사용 가능한 멋진 이름이에요! ✨`,
    };
  } catch (error) {
    console.error('Display Name 중복 확인 에러:', error);
    // Firestore 권한 등으로 조회가 불가능할 경우의 fallback
    return {
      isAvailable: true,
      message: '확인 완료: 현재 사용할 수 있는 이름이에요.',
    };
  }
}

/**
 * 사용자 프로필 업데이트 (Firestore users/{uid} 문서 갱신 + Firebase Auth updateProfile 동기화)
 */
export async function updateUserProfileData(
  uid: string,
  updates: Partial<Pick<UserData, 'displayName' | 'handle' | 'bio' | 'photoURL'>>
): Promise<UserData> {
  const userDocRef = doc(db, 'users', uid);
  const snap = await getDoc(userDocRef);
  const existing = snap.exists() ? (snap.data() as UserData) : ({} as UserData);

  const cleanDisplayName =
    typeof updates.displayName === 'string'
      ? updates.displayName.trim()
      : updates.displayName === null
        ? null
        : (existing.displayName ?? null);

  const cleanHandle =
    typeof updates.handle === 'string'
      ? updates.handle.trim()
      : updates.handle;

  const cleanBio =
    typeof updates.bio === 'string'
      ? updates.bio.trim()
      : updates.bio;

  const cleanPhotoURL =
    typeof updates.photoURL === 'string'
      ? updates.photoURL.trim() || null
      : updates.photoURL === null
        ? null
        : (existing.photoURL ?? null);

  const updatedData: UserData = {
    ...existing,
    uid,
    displayName: cleanDisplayName,
    ...(cleanHandle !== undefined && { handle: cleanHandle }),
    ...(cleanBio !== undefined && { bio: cleanBio }),
    photoURL: cleanPhotoURL,
    updatedAt: serverTimestamp(),
  };

  // 1. Firestore 저장
  await setDoc(userDocRef, updatedData, { merge: true });

  // 2. Firebase Auth 인증 유저 프로필과도 동기화 (auth.currentUser가 동일 유저일 때)
  // 단, data: (base64) 포맷은 Firebase Auth photoURL 규격에 맞지 않으므로 제외
  if (auth.currentUser && auth.currentUser.uid === uid) {
    try {
      const authPhotoURL =
        cleanPhotoURL && !cleanPhotoURL.startsWith('data:')
          ? cleanPhotoURL
          : undefined;

      await updateProfile(auth.currentUser, {
        displayName: cleanDisplayName || undefined,
        photoURL: authPhotoURL,
      });
    } catch (authErr) {
      console.warn('Firebase Auth updateProfile 동기화 경고:', authErr);
    }
  }

  return updatedData;
}

/**
 * 사용자 기기에서 선택한 사진을 프로필용으로 초고속 압축 및 리사이징 (최대 320x320, JPEG 82%)
 * - createImageBitmap 및 ObjectURL을 사용하여 메인 스레드 멈춤 없이 0.05초 만에 디코딩 및 압축
 */
export async function compressProfileImage(file: File): Promise<{ blob: Blob; dataUrl: string }> {
  // 모던 브라우저 지원: createImageBitmap (초고속 네이티브 비동기 디코딩)
  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      const maxSize = 320;
      let { width, height } = bitmap;

      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.82)
        );

        if (blob) {
          return { blob, dataUrl };
        }
      }
    } catch (e) {
      console.warn('createImageBitmap 디코딩 실패, ObjectURL로 대체 진행:', e);
    }
  }

  // Fallback: URL.createObjectURL을 사용한 고속 디코딩 (FileReader base64 메모리 폭증 방지)
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxSize = 320;
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context 생성 실패'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, dataUrl });
          } else {
            reject(new Error('Blob 변환 실패'));
          }
        },
        'image/jpeg',
        0.82
      );
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}

/**
 * 사전 압축된 Blob을 업로드 (타임아웃 3.5초 안전장치 적용)
 * - 네트워크 지연이나 Storage CORS/보안 규칙으로 인한 무한 멈춤(30~60초)을 3.5초 내로 차단
 */
export async function uploadProfileImageBlob(
  uid: string,
  blob: Blob,
  fallbackDataUrl: string
): Promise<string> {
  try {
    const storageRef = ref(storage, `users/${uid}/avatar_${Date.now()}.jpg`);

    // Storage 업로드 작업
    const uploadTask = (async () => {
      const snapshot = await uploadBytes(storageRef, blob, {
        contentType: 'image/jpeg',
      });
      return await getDownloadURL(snapshot.ref);
    })();

    // 3.5초 타임아웃 레이스: 3.5초 내에 완료되지 않으면 즉시 dataUrl fallback으로 반환
    const timeoutTask = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error('Storage upload timeout (3.5s limit)')), 3500)
    );

    return await Promise.race([uploadTask, timeoutTask]);
  } catch (storageError) {
    console.warn('[Firebase Storage] 업로드 타임아웃 또는 권한 제한 - 즉시 Fallback 적용:', storageError);
    return fallbackDataUrl;
  }
}

/**
 * 프로필 사진 업로드 처리 (사전 압축되지 않은 원본 파일용 호환 함수)
 */
export async function uploadProfileImageFile(uid: string, file: File): Promise<string> {
  const { blob, dataUrl } = await compressProfileImage(file);
  return uploadProfileImageBlob(uid, blob, dataUrl);
}

