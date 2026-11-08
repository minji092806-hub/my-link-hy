# Project Guidelines & Rules (Gemini / Antigravity)

## 🔒 데이터베이스 수정 시 보안 규칙(Security Rules) 동기화 원칙 (필수 준수)

데이터베이스(Firestore) 및 스토리지(Firebase Storage)와 관련된 수정이 발생할 경우, **반드시 관련된 보안 규칙 파일(`firestore.rules`, `storage.rules`)을 함께 검토하고 수정**해야 합니다.

---

### 1. Firestore 변경 시 (`firestore.rules` 동기화)

- **스키마 및 필드 변경**:
  - 컬렉션, 서브컬렉션, 문서에 새로운 필드가 추가되거나 기존 필드명/데이터 타입이 변경될 때, `firestore.rules`의 유효성 검사 규칙 및 권한 조건을 즉시 동기화합니다.
  - 필드 단위 변경 감지 시 `affectedKeys().hasOnly([...])` 화이트리스트에 신규 필드가 누락되지 않도록 검토합니다. (예: `clickCount`, `totalViews`, `updatedAt`, `updated_at` 등)

- **권한 및 접근 제어**:
  - 인증된 사용자 전용 작업: `isAuthenticated()` 및 `isOwner(userId)` (본인 UID 일치 여부 `request.auth.uid == userId`) 검증 필수.
  - 비로그인/방문자 허용 작업: 읽기(`allow read: if true`) 및 특정 제한적 필드 업데이트에 대한 최소 권한 원칙 적용.
  - 신규 컬렉션 추가 시: 기본 차단 규칙(`match /{document=**} { allow read, write: if false; }`)에 막혀 권한 오류가 발생하지 않도록 전용 보안 규칙을 명시적으로 작성합니다.

- **데이터 무결성 검증**:
  - 생성(`create`) 및 수정(`update`) 시 `request.resource.data`를 통해 필수 필드 존재 여부, 문자열 길이 제한, 타입 검증을 규칙에 명시합니다.

---

### 2. Firebase Storage 변경 시 (`storage.rules` 동기화)

- **업로드 경로 동기화**:
  - 프로필 이미지, 링크 첨부 파일 등의 저장 경로(`avatars/{userId}/...`, `users/{userId}/...` 등)가 변경되거나 신규 경로가 추가될 경우 `storage.rules`의 `match` 경로를 갱신합니다.

- **업로드 제약 조건 유지**:
  - 파일 크기 제한 (`request.resource.size < 5 * 1024 * 1024` 등)
  - 파일 확장자 및 MIME 타입 제한 (`request.resource.contentType.matches('image/.*')` 등)
  - 본인 소유 디렉터리에만 업로드/삭제 가능하도록 사용자 UID 인증 검사 유지.

---

### 3. 작업 시 필수 체크리스트

1. [ ] `src/lib/linkService.ts`, `src/lib/authService.ts`, `src/app/api/...` 등 DB/스토리지 입출력 로직을 수정했는가?
2. [ ] 변경된 컬렉션/필드/경로가 `firestore.rules`와 `storage.rules`의 보안 정책에 부합하는가?
3. [ ] 비인가 필드 변조 또는 권한 우회 가능성이 없는지 확인했는가?
4. [ ] 클라이언트 및 서버 환경에서 권한 거부(`Missing or insufficient permissions`) 없이 정상 동작하는가?
5. [ ] 데이터베이스 수정 작업 커밋 시 `firestore.rules` 및 `storage.rules` 수정 사항을 반드시 함께 포함했는가?
