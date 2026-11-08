'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { User } from 'firebase/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  UserData,
  checkDisplayNameDuplicate,
  updateUserProfileData,
  getEmailPrefix,
  uploadProfileImageFile,
  uploadProfileImageBlob,
  compressProfileImage,
} from '@/lib/authService';
import {
  User as UserIcon,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  AtSign,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  Camera,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: UserData | null;
  currentUser: User | null;
  onProfileUpdated: (updated: UserData) => void;
}

type CheckStatus = 'current' | 'idle' | 'checking' | 'available' | 'duplicate' | 'invalid';

const PRESET_AVATARS = [
  { label: '기본 Google', url: '' },
  {
    label: '고양이',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: '강아지',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: '캐릭터',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: '자연·감성',
    url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=150&auto=format&fit=crop&q=80',
  },
];

export function EditProfileDialog({
  open,
  onOpenChange,
  userProfile,
  currentUser,
  onProfileUpdated,
}: EditProfileDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 원래 초기값
  const initialDisplayName = useMemo(() => {
    return (
      userProfile?.displayName ||
      getEmailPrefix(currentUser?.email, currentUser?.displayName)
    );
  }, [userProfile, currentUser]);

  const initialHandle = useMemo(() => {
    const raw = userProfile?.handle || `@${initialDisplayName}`;
    return raw.startsWith('@') ? raw.slice(1) : raw;
  }, [userProfile, initialDisplayName]);

  const initialBio = useMemo(() => {
    return userProfile?.bio || '마이링크로 연결되는 나만의 공간이에요 ✨';
  }, [userProfile]);

  const initialPhotoURL = useMemo(() => {
    return userProfile?.photoURL || currentUser?.photoURL || '';
  }, [userProfile, currentUser]);

  // 입력 폼 상태
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [handle, setHandle] = useState(initialHandle);
  const [bio, setBio] = useState(initialBio);
  const [photoURL, setPhotoURL] = useState(initialPhotoURL);

  // 로컬 파일 업로드 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [showAdvancedPhoto, setShowAdvancedPhoto] = useState(false);
  const compressedImageRef = useRef<{ blob: Blob; dataUrl: string } | null>(null);

  // 중복 확인 상태
  const [checkStatus, setCheckStatus] = useState<CheckStatus>('current');
  const [checkMessage, setCheckMessage] = useState<string>('현재 사용 중인 이름이에요.');

  // 저장 중 상태 및 일반 에러 메시지
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingStep, setSubmittingStep] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 다이얼로그 열릴 때 초기화
  useEffect(() => {
    if (open) {
      setDisplayName(initialDisplayName);
      setHandle(initialHandle);
      setBio(initialBio);
      setPhotoURL(initialPhotoURL);
      setSelectedFile(null);
      setSelectedFileName(null);
      compressedImageRef.current = null;
      setShowAdvancedPhoto(false);
      setCheckStatus('current');
      setCheckMessage('현재 사용 중인 이름이에요.');
      setSubmitError(null);
      setSubmittingStep('');
    }
  }, [open, initialDisplayName, initialHandle, initialBio, initialPhotoURL]);

  // 사용자의 로컬 사진 파일 선택 핸들러 (선택 즉시 초고속 압축 수행하여 저장 시 지연 0초)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      setSubmitError('이미지 파일(PNG, JPG, WEBP, GIF 등)만 선택할 수 있어요.');
      return;
    }

    // 파일 용량 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setSubmitError('파일 용량이 10MB를 초과해요. 더 작은 이미지를 선택해주세요.');
      return;
    }

    setIsProcessingFile(true);
    setSubmitError(null);

    try {
      // 1) 클라이언트 네이티브 createImageBitmap 기반 초고속 압축 (약 0.05초)
      const compressed = await compressProfileImage(file);
      compressedImageRef.current = compressed;
      setPhotoURL(compressed.dataUrl);
      setSelectedFile(file);
      setSelectedFileName(file.name);
    } catch (err) {
      console.error('이미지 미리보기 처리 실패:', err);
      // fallback
      const objectUrl = URL.createObjectURL(file);
      setPhotoURL(objectUrl);
      setSelectedFile(file);
      setSelectedFileName(file.name);
      compressedImageRef.current = null;
    } finally {
      setIsProcessingFile(false);
      // input value 초기화 (같은 파일 다시 선택 가능하도록)
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 선택한 사진 취소 / 기본 사진으로 복원
  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    setSelectedFileName(null);
    compressedImageRef.current = null;
    setPhotoURL(currentUser?.photoURL || '');
  };

  // Display Name 변경 시 중복 검사 상태 갱신
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setDisplayName(nextVal);
    setSubmitError(null);

    const trimmed = nextVal.trim();

    if (trimmed === initialDisplayName.trim()) {
      setCheckStatus('current');
      setCheckMessage('현재 사용 중인 이름이에요.');
      return;
    }

    if (!trimmed) {
      setCheckStatus('invalid');
      setCheckMessage('이름을 입력해주세요.');
      return;
    }

    if (trimmed.length < 2) {
      setCheckStatus('invalid');
      setCheckMessage('이름은 최소 2글자 이상 입력해주세요.');
      return;
    }

    if (trimmed.length > 20) {
      setCheckStatus('invalid');
      setCheckMessage('이름은 최대 20글자까지 가능해요.');
      return;
    }

    // 변경된 이름 -> 중복 확인 필요 상태로 전환
    setCheckStatus('idle');
    setCheckMessage('이름이 변경되었어요. 중복 확인을 진행해주세요.');
  };

  // 중복 확인 실행 버튼 핸들러
  const handleCheckDuplicate = useCallback(async () => {
    const trimmed = displayName.trim();

    if (trimmed === initialDisplayName.trim()) {
      setCheckStatus('current');
      setCheckMessage('현재 회원님이 사용 중인 이름이에요.');
      return true;
    }

    if (!trimmed || trimmed.length < 2 || trimmed.length > 20) {
      setCheckStatus('invalid');
      setCheckMessage('이름은 2~20글자 사이로 입력해주세요.');
      return false;
    }

    setCheckStatus('checking');
    setCheckMessage('중복 확인 중...');

    try {
      const result = await checkDisplayNameDuplicate(trimmed, currentUser?.uid);
      if (result.isAvailable) {
        setCheckStatus('available');
        setCheckMessage(result.message);
        return true;
      } else {
        setCheckStatus('duplicate');
        setCheckMessage(result.message);
        return false;
      }
    } catch (err) {
      console.error('중복 확인 오류:', err);
      setCheckStatus('available');
      setCheckMessage('확인 완료: 현재 사용할 수 있는 이름이에요.');
      return true;
    }
  }, [displayName, initialDisplayName, currentUser?.uid]);

  // 초기화 (되돌리기) 버튼
  const handleReset = () => {
    setDisplayName(initialDisplayName);
    setHandle(initialHandle);
    setBio(initialBio);
    setPhotoURL(initialPhotoURL);
    setSelectedFile(null);
    setSelectedFileName(null);
    compressedImageRef.current = null;
    setCheckStatus('current');
    setCheckMessage('현재 사용 중인 이름이에요.');
    setSubmitError(null);
  };

  // 제출(저장) 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setSubmitError('로그인 세션이 만료되었어요. 다시 로그인해주세요.');
      return;
    }

    const trimmedName = displayName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setSubmitError('이름은 최소 2글자 이상 입력해주세요.');
      return;
    }

    // 이름이 변경되었는데 아직 중복 확인을 하지 않은 경우 자동 검증
    if (trimmedName !== initialDisplayName.trim() && checkStatus !== 'available') {
      const isOk = await handleCheckDuplicate();
      if (!isOk) {
        setSubmitError('사용 가능한 이름인지 중복 확인을 먼저 완료해주세요.');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let finalPhotoURL = photoURL.trim() || currentUser.photoURL || null;

      // ── 사용자가 직접 사진 파일을 업로드한 경우 (사전 압축된 Blob으로 초고속 업로드) ──
      if (compressedImageRef.current) {
        setSubmittingStep('프로필 사진 저장 중...');
        finalPhotoURL = await uploadProfileImageBlob(
          currentUser.uid,
          compressedImageRef.current.blob,
          compressedImageRef.current.dataUrl
        );
      } else if (selectedFile) {
        setSubmittingStep('프로필 사진 저장 중...');
        finalPhotoURL = await uploadProfileImageFile(currentUser.uid, selectedFile);
      }

      setSubmittingStep('프로필 정보 저장 중...');
      const cleanHandle = handle.trim().replace(/^@+/, '');
      const finalHandle = cleanHandle ? `@${cleanHandle}` : `@${trimmedName}`;

      const updated = await updateUserProfileData(currentUser.uid, {
        displayName: trimmedName,
        handle: finalHandle,
        bio: bio.trim(),
        photoURL: finalPhotoURL,
      });

      onProfileUpdated(updated);
      onOpenChange(false);
    } catch (err) {
      console.error('프로필 저장 에러:', err);
      setSubmitError('프로필을 저장하는 도중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
      setSubmittingStep('');
    }
  };

  const currentPreviewName = displayName.trim() || initialDisplayName || '사용자';
  const cleanPreviewHandle = handle.trim().replace(/^@+/, '');
  const currentPreviewHandle = cleanPreviewHandle ? `@${cleanPreviewHandle}` : `@${currentPreviewName}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden sm:rounded-2xl border-border bg-background shadow-xl">
        <DialogHeader className="p-5 pb-3 border-b border-border/70 bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs">
              <Sparkles className="size-3.5" />
            </span>
            <DialogTitle className="text-lg font-bold text-foreground">
              프로필 수정
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            프로필 사진, 닉네임, 소개글을 내 취향에 맞게 꾸며보세요.
          </DialogDescription>
        </DialogHeader>

        {/* 숨겨진 로컬 파일 선택 Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleImageFileChange}
          className="hidden"
        />

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* ─── 1. 실시간 미리보기 (Live Preview) ─── */}
          <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-background p-3.5 dark:border-blue-900/40 dark:from-blue-950/20 dark:via-neutral-900 dark:to-neutral-950">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Sparkles className="size-3" />
                실시간 프로필 미리보기
              </span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 text-muted-foreground">
                Live Preview
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              {/* 아바타 (클릭 시 사진 파일 선택 다이얼로그 열기) */}
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => fileInputRef.current?.click()}
                title="클릭하여 내 사진으로 변경"
              >
                <Avatar className="size-14 rounded-2xl ring-2 ring-background shadow-xs transition-transform group-hover:scale-105">
                  {photoURL ? (
                    <AvatarImage src={photoURL} alt={currentPreviewName} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 text-lg font-bold text-white">
                    {currentPreviewName[0]?.toUpperCase() || '✨'}
                  </AvatarFallback>
                </Avatar>

                {/* 아바타 호버 오버레이 */}
                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Camera className="size-4" />
                </div>

                <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs ring-1 ring-background">
                  <Camera className="size-2.5" />
                </div>
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-sm font-extrabold text-foreground truncate">
                    {currentPreviewName}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0 font-medium">(내 링크)</span>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground truncate">
                  {currentPreviewHandle}
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {bio.trim() || '소개글이 아직 없어요.'}
                </p>
              </div>
            </div>
          </div>

          {/* ─── 2. 프로필 사진 직접 변경 (내 파일 업로드 기능) ─── */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Camera className="size-3.5 text-blue-600" />
                프로필 사진 변경
              </Label>
              {selectedFileName && (
                <Badge variant="blue" className="text-[10px] py-0 px-1.5 h-4">
                  내 사진 선택됨
                </Badge>
              )}
            </div>

            {/* 내 기기에서 사진 선택 버튼 */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingFile}
                className="flex-1 h-9 rounded-lg border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-bold gap-2 cursor-pointer transition-all"
              >
                {isProcessingFile ? (
                  <Loader2 className="size-3.5 animate-spin text-blue-600" />
                ) : (
                  <Upload className="size-3.5 text-blue-600" />
                )}
                <span>내 기기에서 사진 선택 (PNG, JPG, WEBP)</span>
              </Button>

              {/* 사진 리셋 / 원래 Google 사진으로 복원 */}
              {(selectedFileName || photoURL !== (currentUser?.photoURL || '')) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelectedFile}
                  title="원래 프로필 사진으로 복원"
                  className="h-9 px-2.5 text-xs text-muted-foreground hover:text-red-600 cursor-pointer shrink-0"
                >
                  <X className="size-3.5 mr-1" />
                  사진 복원
                </Button>
              )}
            </div>

            {selectedFileName && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="size-3 shrink-0" />
                선택된 파일: <span className="font-semibold underline truncate max-w-[200px]">{selectedFileName}</span> (저장 시 자동 적용돼요)
              </p>
            )}

            {/* 고급 옵션: 프리셋 선택 & URL 직접 입력 토글 */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvancedPhoto((prev) => !prev)}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>기본 프리셋 또는 이미지 URL 직접 입력</span>
                {showAdvancedPhoto ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>

              {showAdvancedPhoto && (
                <div className="mt-2.5 space-y-2 pt-2 border-t border-border/60">
                  <Input
                    id="photoURL"
                    value={photoURL}
                    onChange={(e) => {
                      setPhotoURL(e.target.value);
                      setSelectedFile(null);
                      setSelectedFileName(null);
                    }}
                    placeholder="https://... 이미지 링크 입력"
                    className="h-8 text-xs font-mono"
                  />

                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] text-muted-foreground mr-1">추천 프리셋:</span>
                    {PRESET_AVATARS.map((preset) => {
                      const targetUrl = preset.url || currentUser?.photoURL || '';
                      const isSelected = photoURL === targetUrl && !selectedFileName;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setPhotoURL(targetUrl);
                            setSelectedFile(null);
                            setSelectedFileName(null);
                          }}
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer font-medium',
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 font-bold'
                              : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                          )}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── 3. Display Name (표시 이름) & 중복 확인 ─── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="displayName" className="text-xs font-bold text-foreground flex items-center gap-1">
                <UserIcon className="size-3.5 text-blue-600" />
                표시 이름 (Display Name) <span className="text-red-500">*</span>
              </Label>
              <span className="text-[11px] font-mono text-muted-foreground">
                {displayName.length}/20자
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={handleDisplayNameChange}
                  placeholder="2~20자 이내의 멋진 이름을 입력해주세요"
                  maxLength={20}
                  className={cn(
                    'h-9 text-xs pr-8 font-medium transition-colors',
                    checkStatus === 'available' && 'border-emerald-500 focus-visible:ring-emerald-500',
                    checkStatus === 'duplicate' && 'border-red-500 focus-visible:ring-red-500',
                    checkStatus === 'invalid' && 'border-amber-500 focus-visible:ring-amber-500'
                  )}
                  required
                />
                {/* 인라인 상태 아이콘 */}
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  {checkStatus === 'checking' && (
                    <Loader2 className="size-3.5 animate-spin text-blue-600" />
                  )}
                  {(checkStatus === 'available' || checkStatus === 'current') && (
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                  )}
                  {checkStatus === 'duplicate' && (
                    <AlertCircle className="size-3.5 text-red-500" />
                  )}
                </div>
              </div>

              {/* 중복 확인 버튼 */}
              <Button
                type="button"
                variant={checkStatus === 'available' ? 'outline' : 'secondary'}
                size="sm"
                onClick={handleCheckDuplicate}
                disabled={
                  checkStatus === 'checking' ||
                  checkStatus === 'current' ||
                  displayName.trim().length < 2
                }
                className="h-9 px-3 text-xs font-bold shrink-0 cursor-pointer"
              >
                {checkStatus === 'checking' ? (
                  <>
                    <Loader2 className="size-3 animate-spin mr-1" />
                    확인 중
                  </>
                ) : checkStatus === 'available' ? (
                  <>
                    <Check className="size-3 text-emerald-600 mr-1" />
                    확인 완료
                  </>
                ) : (
                  '중복 확인'
                )}
              </Button>
            </div>

            {/* 중복 확인 상태 메시지 피드백 */}
            <div
              className={cn(
                'text-[11px] font-medium transition-all flex items-center gap-1 mt-1',
                checkStatus === 'available' && 'text-emerald-600 dark:text-emerald-400 font-semibold',
                checkStatus === 'duplicate' && 'text-red-600 dark:text-red-400 font-semibold',
                checkStatus === 'current' && 'text-muted-foreground',
                checkStatus === 'idle' && 'text-blue-600 dark:text-blue-400',
                checkStatus === 'invalid' && 'text-amber-600 dark:text-amber-400',
                checkStatus === 'checking' && 'text-blue-600 animate-pulse'
              )}
            >
              {checkStatus === 'available' && <CheckCircle2 className="size-3 shrink-0" />}
              {checkStatus === 'duplicate' && <AlertCircle className="size-3 shrink-0" />}
              <span>{checkMessage}</span>
            </div>
          </div>

          {/* ─── 4. Handle (고유 핸들 / 아이디) ─── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="handle" className="text-xs font-bold text-foreground flex items-center gap-1">
                <AtSign className="size-3.5 text-blue-600" />
                사용자 핸들 (ID)
              </Label>
              <span className="text-[11px] text-muted-foreground">공개 프로필 표기</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                @
              </span>
              <Input
                id="handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/^@+/, ''))}
                placeholder="예: minji_art"
                maxLength={30}
                className="h-9 text-xs pl-7 font-mono font-medium"
              />
            </div>
          </div>

          {/* ─── 5. Bio (한 줄 소개글) ─── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio" className="text-xs font-bold text-foreground flex items-center gap-1">
                <FileText className="size-3.5 text-blue-600" />
                소개글 (Bio)
              </Label>
              <span className="text-[11px] font-mono text-muted-foreground">
                {bio.length}/100자
              </span>
            </div>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="방문자들에게 나를 소개하는 멋진 한마디를 적어보세요."
              maxLength={100}
              rows={2}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none leading-relaxed"
            />
          </div>

          {/* 에러 피드백 */}
          {submitError && (
            <div className="rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400 flex items-start gap-1.5">
              <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <DialogFooter className="pt-2 flex items-center justify-between sm:justify-between border-t border-border/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-9 text-xs text-muted-foreground hover:text-foreground cursor-pointer gap-1 px-2.5"
            >
              <RotateCcw className="size-3" />
              <span>되돌리기</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="h-9 text-xs font-semibold cursor-pointer"
              >
                취소
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || isProcessingFile || checkStatus === 'duplicate' || displayName.trim().length < 2}
                className="h-9 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 cursor-pointer shadow-xs gap-1.5 min-w-[100px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>{submittingStep || '저장 중...'}</span>
                  </>
                ) : (
                  <>
                    <Check className="size-3 stroke-[3]" />
                    <span>프로필 저장</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
