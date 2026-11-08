'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserProfile,
  updateUserProfileData,
  checkDisplayNameDuplicate,
  type UserData,
} from '@/lib/authService';

/**
 * 프로필 조회 Query 훅
 */
export function useProfile(uid: string | null | undefined) {
  return useQuery({
    queryKey: ['userProfile', uid],
    queryFn: async () => {
      if (!uid) return null;
      return await getUserProfile(uid);
    },
    enabled: !!uid,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 프로필 수정 Mutation 훅 (TanStack Query 낙관적 업데이트 적용)
 * - onMutate: 서버 응답을 기다리지 않고 캐시를 즉시 갱신 (화면 반영 0초)
 * - onError: 서버 에러 발생 시 직전 프로필 상태로 자동 롤백
 * - onSettled: 최종 완료 후 서버 데이터와 정합성 재검증
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      uid,
      updates,
    }: {
      uid: string;
      updates: Partial<Pick<UserData, 'displayName' | 'handle' | 'bio' | 'photoURL'>>;
    }) => {
      return await updateUserProfileData(uid, updates);
    },
    // ── 1. 낙관적 업데이트 (서버 응답 전 즉시 실행) ──
    onMutate: async ({ uid, updates }) => {
      // 진행 중인 refetch가 있으면 취소 (낙관적 값 덮어쓰기 방지)
      await queryClient.cancelQueries({ queryKey: ['userProfile', uid] });

      // 이전 상태 스냅샷 저장 (롤백용)
      const previousProfile = queryClient.getQueryData<UserData>(['userProfile', uid]);

      // 캐시를 새로운 값으로 즉각 갱신
      queryClient.setQueryData<UserData>(['userProfile', uid], (old) => {
        if (!old) {
          return {
            uid,
            email: null,
            displayName: updates.displayName || null,
            photoURL: updates.photoURL || null,
            handle: updates.handle,
            bio: updates.bio,
          };
        }
        return {
          ...old,
          ...(updates.displayName !== undefined && { displayName: updates.displayName }),
          ...(updates.handle !== undefined && { handle: updates.handle }),
          ...(updates.bio !== undefined && { bio: updates.bio }),
          ...(updates.photoURL !== undefined && { photoURL: updates.photoURL }),
        };
      });

      // 롤백 컨텍스트 반환
      return { previousProfile, uid };
    },
    // ── 2. 에러 발생 시 롤백 (Safety Rollback) ──
    onError: (err, variables, context) => {
      console.error('[TanStack Query] 프로필 업데이트 실패, 롤백 실행:', err);
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile', context.uid], context.previousProfile);
      }
    },
    // ── 3. 완료 후 서버 데이터 동기화 ──
    onSettled: (data, error, variables, context) => {
      const targetUid = context?.uid || variables.uid;
      if (targetUid) {
        queryClient.invalidateQueries({ queryKey: ['userProfile', targetUid] });
      }
    },
  });
}
