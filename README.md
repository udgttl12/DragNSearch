# 🔍 Drag & Drop Search

텍스트를 드래그하여 다양한 검색엔진에서 즉시 검색할 수 있는 Chrome 확장 기능입니다.

## ✨ 주요 기능

### 📱 즉시 검색
- **텍스트 드래그 시 아이콘 표시**: 웹페이지에서 텍스트를 선택하면 검색엔진 아이콘들이 자동으로 나타납니다
- **클릭 또는 드래그&드롭**: 아이콘을 클릭하거나 선택된 텍스트를 드래그하여 새 탭에서 검색 실행
- **우클릭 컨텍스트 메뉴**: 선택된 텍스트에 우클릭하여 검색엔진 선택 가능

### 🛠️ 커스터마이징
- **기본 검색엔진**: Google, Naver, YouTube, Wikipedia 제공
- **사용자 정의 검색엔진**: 옵션 페이지에서 검색엔진 추가/수정/삭제
- **동기화**: chrome.storage.sync를 통해 설정이 Chrome 계정에 동기화

### 🎨 사용자 경험
- **모던 UI**: 깔끔하고 직관적인 디자인
- **반응형**: 다양한 화면 크기에 최적화
- **다크 모드**: 시스템 테마에 따른 자동 전환
- **접근성**: 고대비 모드 및 애니메이션 감소 모드 지원

## 🚀 설치 방법

### 개발자 모드로 설치 (현재)

1. Chrome 브라우저에서 `chrome://extensions/` 페이지로 이동
2. 우측 상단의 "개발자 모드" 토글을 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. 이 프로젝트 폴더를 선택
5. 확장 기능이 설치되고 활성화됩니다

### Chrome 웹 스토어 (추후 예정)
Chrome 웹 스토어에 게시 예정입니다.

## 📖 사용 방법

### 1. 기본 사용법
1. 웹페이지에서 검색하고 싶은 텍스트를 마우스로 드래그하여 선택
2. 선택된 텍스트 근처에 나타나는 검색엔진 아이콘들을 확인
3. 원하는 검색엔진 아이콘을 클릭
4. 새 탭에서 해당 검색엔진으로 검색 결과가 열립니다

### 2. 드래그&드롭 사용법
1. 텍스트를 선택한 상태에서 드래그 시작
2. 나타난 검색엔진 아이콘 위로 텍스트를 드롭
3. 즉시 검색이 실행됩니다

### 3. 우클릭 메뉴 사용법
1. 텍스트를 선택
2. 우클릭하여 컨텍스트 메뉴 열기
3. "Drag & Drop Search" 메뉴에서 원하는 검색엔진 선택

### 4. 검색엔진 관리
1. 확장 기능 아이콘 클릭 → "설정" 버튼
2. 또는 `chrome://extensions/`에서 확장 기능 세부정보 → "확장 프로그램 옵션"
3. 검색엔진 추가/수정/삭제 가능
4. URL에 `%s`를 포함하여 검색어 위치 지정

## 🔧 기술 스택

- **Manifest V3**: 최신 Chrome Extension API 사용
- **JavaScript (ES6+)**: 모던 JavaScript 문법
- **CSS3**: Flexbox, Grid, CSS Variables 활용
- **Chrome APIs**: 
  - `chrome.storage.sync`: 설정 동기화
  - `chrome.contextMenus`: 우클릭 메뉴
  - `chrome.tabs`: 새 탭 생성
  - `chrome.runtime`: 메시지 통신

## 📁 프로젝트 구조

```
DragNSearch/
├── manifest.json          # 확장 기능 메타데이터
├── background.js          # 서비스 워커 (백그라운드 스크립트)
├── content.js            # 콘텐츠 스크립트 (웹페이지 조작)
├── content.css           # 콘텐츠 스크립트 스타일
├── popup.html            # 확장 기능 팝업 페이지
├── options.html          # 옵션 페이지 HTML
├── options.css           # 옵션 페이지 스타일
├── options.js            # 옵션 페이지 로직
├── icons/
│   └── icon.svg          # 확장 기능 아이콘
└── README.md
```

## 🎯 사용 예시

### 검색엔진 URL 형식
- Google: `https://www.google.com/search?q=%s`
- Naver: `https://search.naver.com/search.naver?query=%s`
- YouTube: `https://www.youtube.com/results?search_query=%s`
- Wikipedia: `https://ko.wikipedia.org/wiki/Special:Search?search=%s`

### 커스텀 검색엔진 예시
- GitHub: `https://github.com/search?q=%s`
- Stack Overflow: `https://stackoverflow.com/search?q=%s`
- MDN: `https://developer.mozilla.org/ko/search?q=%s`

## 🔒 권한 및 보안

이 확장 기능이 요청하는 권한:
- `storage`: 사용자 설정 저장 및 동기화
- `contextMenus`: 우클릭 메뉴 추가
- `activeTab`: 현재 탭에서 검색 실행
- `scripting`: 콘텐츠 스크립트 주입
- `<all_urls>`: 모든 웹사이트에서 작동

## 🐛 문제 해결

### 검색엔진 아이콘이 나타나지 않는 경우
1. 확장 기능이 활성화되어 있는지 확인
2. 페이지를 새로고침
3. 텍스트를 다시 선택

### 검색이 실행되지 않는 경우
1. 팝업 차단기 확인
2. 검색엔진 URL이 올바른지 확인 (%s 포함 여부)
3. 네트워크 연결 상태 확인

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📧 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 GitHub Issues를 통해 연락해주세요.

---

**Drag & Drop Search**로 더 빠르고 편리한 웹 검색을 경험해보세요! 🚀
