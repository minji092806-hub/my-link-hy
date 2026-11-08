import { db } from "@/lib/firebase";
import type { LinkItem } from "@/types";
import {
  collection,
  doc,
  addDoc,
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
 * Firestore 경로: users/anonymous/links
 */
export const USERS_COLLECTION = "users";
export const ANONYMOUS_DOC = "anonymous";
export const LINKS_SUBCOLLECTION = "links";

/**
 * Firestore 'users/anonymous/links' 서브컬렉션 참조 헬퍼
 */
export function getLinksCollectionRef() {
  return collection(db, USERS_COLLECTION, ANONYMOUS_DOC, LINKS_SUBCOLLECTION);
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
  };
}

/**
 * 새 링크를 Firestore 'users/anonymous/links' 컬렉션에 추가
 * - undefined 필드를 방지하여 Firestore 에러를 차단합니다.
 */
export async function addLinkToFirestore(
  newLink: Omit<LinkItem, "id" | "order" | "clickCount"> & {
    order?: number;
    clickCount?: number;
  }
): Promise<LinkItem> {
  const linksRef = getLinksCollectionRef();

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
  };
}

/**
 * Firestore의 'users/anonymous/links' 목록을 실시간 구독(onSnapshot)
 */
export function subscribeToLinks(
  onSuccess: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const linksRef = getLinksCollectionRef();
  const linksQuery = query(linksRef, orderBy("order", "asc"));

  return onSnapshot(
    linksQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const items: LinkItem[] = snapshot.docs.map((docSnap) =>
        mapDocToLinkItem(docSnap.id, docSnap.data())
      );
      onSuccess(items);
    },
    (error) => {
      console.error("[Firestore] links 실시간 구독 에러:", error);
      if (onError) onError(error);
    }
  );
}

/**
 * Firestore 링크 클릭 카운트 원자적(atomic) 증가
 */
export async function incrementClickCountInFirestore(linkId: string): Promise<void> {
  try {
    const linkDocRef = doc(db, USERS_COLLECTION, ANONYMOUS_DOC, LINKS_SUBCOLLECTION, linkId);
    await updateDoc(linkDocRef, {
      clickCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn(`[Firestore] link (${linkId}) clickCount 업데이트 실패:`, err);
  }
}
