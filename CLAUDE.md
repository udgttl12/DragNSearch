# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

DragNSearch는 텍스트를 드래그하여 다양한 검색엔진에서 즉시 검색할 수 있는 Chrome Manifest V3 확장 기능입니다.

## 개발 환경 설정

### 확장 기능 설치 및 테스트
```bash
# Chrome에서 확장 기능 로드
# 1. chrome://extensions/ 페이지 이동
# 2. "개발자 모드" 활성화
# 3. "압축해제된 확장 프로그램을 로드합니다" 클릭
# 4. 프로젝트 폴더 선택
```

### 개발 중 변경사항 적용
```bash
# 확장 기능 새로고침 (chrome://extensions/에서)
# 또는 Ctrl+R을 눌러 확장 기능 새로고침
```

## 아키텍처 개요

### 핵심 구조
- **Manifest V3** 기반 Chrome 확장 기능
- **background.js**: 서비스 워커, 검색엔진 관리, 컨텍스트 메뉴 생성
- **content.js**: 웹페이지에 주입되는 스크립트, 텍스트 선택 감지 및 팝업 UI 처리
- **options.js/html**: 설정 페이지, 검색엔진 관리 인터페이스

### 데이터 흐름
1. 사용자가 텍스트 선택 → content.js에서 감지
2. content.js가 background.js에 검색엔진 목록 요청
3. background.js가 chrome.storage.sync에서 설정 읽어서 응답
4. content.js가 검색 아이콘 팝업 표시
5. 사용자 클릭 시 background.js가 새 탭에서 검색 실행

### 저장소 구조
```javascript
// chrome.storage.sync에 저장되는 데이터
{
  searchEngines: [
    {
      id: 'google',
      name: 'Google', 
      url: 'https://www.google.com/search?q=%s',
      icon: 'favicon_url',
      isDefault: true
    }
  ],
  layoutSetting: 'horizontal', // 또는 'grid'
  popupDistance: 15 // 5-100 픽셀
}
```

## 주요 컴포넌트

### background.js
- **검색엔진 관리**: DEFAULT_SEARCH_ENGINES 설정, storage 동기화
- **컨텍스트 메뉴**: createContextMenus() - 우클릭 메뉴 생성
- **메시지 처리**: getEngines, search, openOptions 액션 처리
- **에러 복구**: 검색엔진 설정이 손상된 경우 기본값으로 복구

### content.js  
- **텍스트 선택 감지**: mouseup 이벤트로 텍스트 선택 처리
- **팝업 UI**: createPopup() - 검색 아이콘 팝업 생성 및 배치
- **레이아웃**: horizontal (가로) / grid (격자) 배치 지원
- **드래그앤드롭**: 선택 텍스트를 아이콘으로 드래그 가능
- **거리 조절**: 팝업과 선택 영역 간 거리 설정 (5-100px)

### options.js/html
- **검색엔진 CRUD**: 추가, 수정, 삭제, 순서 변경
- **설정 관리**: 레이아웃, 팝업 거리 설정  
- **데이터 관리**: 설정 내보내기/가져오기 기능
- **실시간 미리보기**: 설정 변경 시 즉시 적용

## 개발 시 주의사항

### Chrome Extension API 사용
- Manifest V3 사용: service worker 기반
- 권한: storage, contextMenus, activeTab, host_permissions
- 메시지 통신: chrome.runtime.sendMessage/onMessage 사용

### 검색엔진 URL 형식
- `%s`가 검색어 치환 위치를 나타냄
- 예: `https://www.google.com/search?q=%s`

### CSS 및 UI 고려사항
- content.css는 웹페이지에 주입되므로 네임스페이스 충돌 방지
- CSS 변수 사용으로 다크모드/접근성 지원
- z-index 관리로 다른 웹페이지 요소와 겹침 방지

### 에러 처리
- chrome.runtime.lastError 확인 필수
- storage 접근 실패 시 기본값 사용
- 네트워크 에러 시 폴백 메커니즘

### 성능 최적화
- 검색엔진 로드는 백그라운드에서 미리 수행
- DOM 조작 최소화, 이벤트 위임 사용
- 메모리 누수 방지를 위한 이벤트 리스너 정리

## 디버깅 가이드

### 확장 기능 디버깅
```bash
# Background script 디버깅
# chrome://extensions/ → "검사" → "서비스 워커"

# Content script 디버깅  
# 웹페이지에서 F12 → Console 탭

# Options 페이지 디버깅
# chrome://extensions/ → "확장 프로그램 옵션" → F12
```

### 일반적인 문제 해결
1. **팝업이 나타나지 않음**: content.js 로드 확인, 텍스트 선택 길이 체크
2. **검색이 안 됨**: URL 형식(%s 포함) 및 팝업 차단기 확인  
3. **설정이 저장되지 않음**: chrome.storage.sync 권한 및 동기화 상태 확인

## 한국어 지원
- 기본 검색엔진에 네이버, 한국 위키피디아 포함
- UI 텍스트 및 에러 메시지 한국어 제공
- 한국 사용자 친화적 검색엔진 기본 설정