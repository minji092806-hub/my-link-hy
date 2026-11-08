import { db } from "@/lib/firebase";
import type { LinkItem } from "@/types";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  increment,
  type Unsubscribe,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";

/**
 * Firestore 컬렉션 상수
 * - users/{userId}/links
 */
export const USERS_COLLECTION = "users";
export const ANONYMOUS_DOC = "anonymous";
export const LINKS_SUBCOLLECTION = "links";

/**
 * Firestore 'users/{userId}/links' 서브컬렉션 참조 헬퍼
 */
export function getLinksCollectionRef(userId: string = ANONYMOUS_DOC) {
  return collection(db, USERS_COLLECTION, userId || ANONYMOUS_DOC, LINKS_SUBCOLLECTION);
}

/**
 * DocumentData를 프론트엔드 LinkItem 모델로 매핑
 */
function mapDocToLinkItem(id: string, data: DocumentData): LinkItem {
  return {
    id,
    title: data.title ?? "",
    url: data.url ?? "",
    description: data.description || undefined,
    icon: data.icon || "🔗",
    order: typeof data.order === "number" ? data.order : 0,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    color: data.color || "cyan",
    badge: data.badge || undefined,
    clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
    category: data.category || "work",
    createdAt: data.createdAt,
    updated_at: data.updated_at || data.updatedAt || undefined,
  };
}

/**
 * 새 링크를 Firestore 'users/{userId}/links' 컬렉션에 추가
 * - createdAt: serverTimestamp() 기준으로 저장
 * - undefined 필드를 방지하여 Firestore 에러를 차단합니다.
 */
export async function addLinkToFirestore(
  newLink: Omit<LinkItem, "id" | "order" | "clickCount"> & {
    order?: number;
    clickCount?: number;
  },
  userId: string = ANONYMOUS_DOC
): Promise<LinkItem> {
  const linksRef = getLinksCollectionRef(userId);

  // Firestore는 undefined 필드 저장을 허용하지 않으므로 정의된 값만 설정
  const docPayload: Record<string, unknown> = {
    title: newLink.title.trim(),
    url: newLink.url.trim(),
    category: newLink.category ?? "work",
    icon: newLink.icon?.trim() || "🔗",
    color: newLink.color ?? "cyan",
    order: typeof newLink.order === "number" ? newLink.order : 1,
    isActive: newLink.isActive ?? true,
    clickCount: newLink.clickCount ?? 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  if (newLink.description && newLink.description.trim()) {
    docPayload.description = newLink.description.trim();
  }

  if (newLink.badge && newLink.badge.trim() && newLink.badge !== "없음") {
    docPayload.badge = newLink.badge.trim();
  }

  const docRef = await addDoc(linksRef, docPayload);

  return {
    id: docRef.id,
    title: docPayload.title as string,
    url: docPayload.url as string,
    category: docPayload.category as LinkItem["category"],
    icon: docPayload.icon as string,
    color: docPayload.color as LinkItem["color"],
    order: docPayload.order as number,
    isActive: docPayload.isActive as boolean,
    clickCount: docPayload.clickCount as number,
    description: (docPayload.description as string) || undefined,
    badge: (docPayload.badge as string) || undefined,
    createdAt: new Date(),
    updated_at: new Date(),
  };
}

/**
 * Firestore 'users/{userId}/links' 경로에서 createdAt 기준 최신순(desc)으로 1회 조회
 */
export async function getLinksFromFirestore(userId: string = ANONYMOUS_DOC): Promise<LinkItem[]> {
  const linksRef = getLinksCollectionRef(userId);
  const linksQuery = query(linksRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(linksQuery);

  return snapshot.docs.map((docSnap) =>
    mapDocToLinkItem(docSnap.id, docSnap.data())
  );
}

/**
 * Firestore의 'users/{userId}/links' 목록을 createdAt 기준 최신순(desc)으로 실시간 구독(onSnapshot)
 * - 페이지 로드 시 초기 데이터를 수신하고, 링크 추가/수정/삭제 시 실시간으로 콜백이 실행됩니다.
 */
export function subscribeToLinks(
  userId: string = ANONYMOUS_DOC,
  onSuccess: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const linksRef = getLinksCollectionRef(userId);
  const linksQuery = query(linksRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    linksQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const items: LinkItem[] = snapshot.docs.map((docSnap) =>
        mapDocToLinkItem(docSnap.id, docSnap.data())
      );
      onSuccess(items);
    },
    (error) => {
      console.error(`[Firestore] users/${userId}/links 실시간 구독 에러:`, error);
      if (onError) onError(error);
    }
  );
}

/**
 * Firestore 링크 수정 (users/{userId}/links/{linkId})
 */
export async function updateLinkInFirestore(
  linkId: string,
  updates: Partial<Pick<LinkItem, "title" | "url" | "description" | "category" | "icon" | "color" | "badge" | "isActive">>,
  userId: string = ANONYMOUS_DOC
): Promise<void> {
  const linkDocRef = doc(db, USERS_COLLECTION, userId || ANONYMOUS_DOC, LINKS_SUBCOLLECTION, linkId);
  const docPayload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  if (updates.title !== undefined) {
    docPayload.title = updates.title.trim();
  }
  if (updates.url !== undefined) {
    docPayload.url = updates.url.trim();
  }
  if (updates.description !== undefined) {
    docPayload.description = updates.description.trim() || null;
  }
  if (updates.category !== undefined) {
    docPayload.category = updates.category;
  }
  if (updates.icon !== undefined) {
    docPayload.icon = updates.icon.trim() || "🔗";
  }
  if (updates.color !== undefined) {
    docPayload.color = updates.color;
  }
  if (updates.badge !== undefined) {
    docPayload.badge = updates.badge.trim() || null;
  }
  if (updates.isActive !== undefined) {
    docPayload.isActive = updates.isActive;
  }

  await updateDoc(linkDocRef, docPayload);
}

/**
 * Firestore 링크 삭제 (users/{userId}/links/{linkId})
 */
export async function deleteLinkFromFirestore(
  linkId: string,
  userId: string = ANONYMOUS_DOC
): Promise<void> {
  const linkDocRef = doc(db, USERS_COLLECTION, userId || ANONYMOUS_DOC, LINKS_SUBCOLLECTION, linkId);
  await deleteDoc(linkDocRef);
}

/**
 * Firestore 링크 클릭 카운트 원자적(atomic) 증가
 * - users/{userId}/links/{linkId} 문서의 clickCount 필드 갱신
 * - Firestore increment(1)을 통해 동시 클릭 시에도 안전하게 원자적 카운트
 * - 서버 API(/api/links/click)를 호출하여 서버에서 안전하게 처리
 * - 로그인 상태 확인 및 실패 시 console.error 출력
 */
export async function incrementClickCountInFirestore(
  linkId: string,
  userId: string
): Promise<void> {
  // 1. 로그인 확인 (로그인되지 않은 경우 콘솔 에러 출력 후 중단)
  if (!userId || userId.trim() === "" || userId === ANONYMOUS_DOC) {
    console.error(
      `[Firestore] 로그인 확인 실패: 로그인된 유저 ID가 없어 클릭 카운트를 저장할 수 없습니다. (userId: "${userId}", linkId: "${linkId}")`
    );
    return;
  }

  if (!linkId || linkId.trim() === "") {
    console.error("[Firestore] 클릭 카운트 저장 실패: linkId가 비어 있습니다.");
    return;
  }

  // 2. 서버 측 API Route(/api/links/click) 호출을 통해 서버에서 안전하게 처리
  try {
    if (typeof window !== "undefined") {
      const response = await fetch("/api/links/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, linkId }),
      });

      if (response.ok) {
        return;
      }
      console.warn(
        `[API] /api/links/click 응답 코드 ${response.status}, 클라이언트 Firestore SDK로 재시도합니다.`
      );
    }
  } catch (apiErr) {
    console.warn("[API] /api/links/click 호출 실패, 클라이언트 Firestore SDK로 폴백:", apiErr);
  }

  // 3. 클라이언트 직접 SDK 폴백: Firestore 원자적(atomic) increment(1)
  try {
    const linkDocRef = doc(db, USERS_COLLECTION, userId, LINKS_SUBCOLLECTION, linkId);
    await updateDoc(linkDocRef, {
      clickCount: increment(1),
      updatedAt: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
  } catch (err) {
    console.error(
      `[Firestore] users/${userId}/links/${linkId} 클릭 카운트(clickCount) 저장 실패:`,
      err
    );
  }
}
