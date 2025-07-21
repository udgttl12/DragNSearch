// 전역 변수
let searchEngines = [];
let popupElement = null;
let selectedText = '';
let mousePosition = { x: 0, y: 0 };

// 검색엔진 데이터 로드
async function loadSearchEngines() {
  return new Promise((resolve) => {
    // Chrome extension context 유효성 검사
    if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
      console.log('Chrome extension context가 유효하지 않음 - 기본 검색엔진 사용');
      // 기본 검색엔진으로 폴백
      searchEngines = [
        {
          id: 'google',
          name: 'Google',
          url: 'https://www.google.com/search?q=%s',
          icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDE2djQuMjVoNi4xOUMyMi4wNSAxNi4xMiAyMS4xNSAxNyAyMCAxN0MxOC44NSAxNyAxNy45NSAxNi4xMiAxNy44MSAxNUgxNnY0aDEwLjU2QzIyLjU2IDEzIDIyLjU2IDEyLjUgMjIuNTYgMTIuMjVaIiBmaWxsPSIjNEY4NUY0Ii8+CjxwYXRoIGQ9Ik0yMiA3SDEwVjEzSDIyVjdaIiBmaWxsPSIjRUE0MzM1Ii8+CjxwYXRoIGQ9Ik0yIDdIMTBWMTNIMlY3WiIgZmlsbD0iI0ZCQkMwNSIvPgo8cGF0aCBkPSJNMTAgMkg2VjEwSDEwVjJaIiBmaWxsPSIjMzRBODUzIi8+Cjwvc3ZnPgo=',
          isDefault: true
        }
      ];
      resolve();
      return;
    }

    try {
      chrome.runtime.sendMessage({ action: 'getEngines' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('검색엔진 로드 실패:', chrome.runtime.lastError.message);
          // 기본 Google 검색엔진만 사용
          searchEngines = [
            {
              id: 'google',
              name: 'Google',
              url: 'https://www.google.com/search?q=%s',
              icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDE2djQuMjVoNi4xOUMyMi4wNSAxNi4xMiAyMS4xNSAxNyAyMCAxN0MxOC44NSAxNyAxNy45NSAxNi4xMiAxNy44MSAxNUgxNnY0aDEwLjU2QzIyLjU2IDEzIDIyLjU2IDEyLjUgMjIuNTYgMTIuMjVaIiBmaWxsPSIjNEY4NUY0Ii8+CjxwYXRoIGQ9Ik0yMiA3SDEwVjEzSDIyVjdaIiBmaWxsPSIjRUE0MzM1Ii8+CjxwYXRoIGQ9Ik0yIDdIMTBWMTNIMlY3WiIgZmlsbD0iI0ZCQkMwNSIvPgo8cGF0aCBkPSJNMTAgMkg2VjEwSDEwVjJaIiBmaWxsPSIjMzRBODUzIi8+Cjwvc3ZnPgo=',
              isDefault: true
            }
          ];
          resolve();
          return;
        }
        if (response && response.engines) {
          searchEngines = response.engines;
        } else {
          // 응답이 없을 경우 기본 검색엔진 사용
          searchEngines = [
            {
              id: 'google',
              name: 'Google',
              url: 'https://www.google.com/search?q=%s',
              icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDE2djQuMjVoNi4xOUMyMi4wNSAxNi4xMiAyMS4xNSAxNyAyMCAxN0MxOC44NSAxNyAxNy45NSAxNi4xMiAxNy44MSAxNUgxNnY0aDEwLjU2QzIyLjU2IDEzIDIyLjU2IDEyLjUgMjIuNTYgMTIuMjVaIiBmaWxsPSIjNEY4NUY0Ii8+CjxwYXRoIGQ9Ik0yMiA3SDEwVjEzSDIyVjdaIiBmaWxsPSIjRUE0MzM1Ii8+CjxwYXRoIGQ9Ik0yIDdIMTBWMTNIMlY3WiIgZmlsbD0iI0ZCQkMwNSIvPgo8cGF0aCBkPSJNMTAgMkg2VjEwSDEwVjJaIiBmaWxsPSIjMzRBODUzIi8+Cjwvc3ZnPgo=',
              isDefault: true
            }
          ];
        }
        resolve();
      });
    } catch (error) {
      console.error('검색엔진 로드 중 오류:', error.message);
      // 기본 Google 검색엔진만 사용
      searchEngines = [
        {
          id: 'google',
          name: 'Google',
          url: 'https://www.google.com/search?q=%s',
          icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDE2djQuMjVoNi4xOUMyMi4wNSAxNi4xMiAyMS4xNSAxNyAyMCAxN0MxOC44NSAxNyAxNy45NSAxNi4xMiAxNy44MSAxNUgxNnY0aDEwLjU2QzIyLjU2IDEzIDIyLjU2IDEyLjUgMjIuNTYgMTIuMjVaIiBmaWxsPSIjNEY4NUY0Ii8+CjxwYXRoIGQ9Ik0yMiA3SDEwVjEzSDIyVjdaIiBmaWxsPSIjRUE0MzM1Ii8+CjxwYXRoIGQ9Ik0yIDdIMTBWMTNIMlY3WiIgZmlsbD0iI0ZCQkMwNSIvPgo8cGF0aCBkPSJNMTAgMkg2VjEwSDEwVjJaIiBmaWxsPSIjMzRBODUzIi8+Cjwvc3ZnPgo=',
          isDefault: true
        }
      ];
      resolve();
    }
  });
}

// 팝업 생성
function createPopup() {
  if (popupElement) {
    popupElement.remove();
  }

  popupElement = document.createElement('div');
  popupElement.id = 'drag-search-popup';
  popupElement.className = 'drag-search-popup';
  
  // 검색엔진 아이콘들 생성
  searchEngines.forEach(engine => {
    const iconElement = document.createElement('div');
    iconElement.className = 'search-engine-icon';
    iconElement.title = `${engine.name}로 검색`;
    iconElement.dataset.engineId = engine.id;
    
    const imgElement = document.createElement('img');
    imgElement.src = engine.icon;
    imgElement.alt = engine.name;
    imgElement.draggable = false;
    
    iconElement.appendChild(imgElement);
    popupElement.appendChild(iconElement);
    
    // 클릭 이벤트
    iconElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      performSearch(engine.id, selectedText);
      hidePopup();
    });
    
    // 드래그 오버 이벤트 (드래그&드롭을 위해)
    iconElement.addEventListener('dragover', (e) => {
      e.preventDefault();
      iconElement.classList.add('drag-hover');
    });
    
    iconElement.addEventListener('dragleave', () => {
      iconElement.classList.remove('drag-hover');
    });
    
    iconElement.addEventListener('drop', (e) => {
      e.preventDefault();
      iconElement.classList.remove('drag-hover');
      const droppedText = e.dataTransfer.getData('text/plain');
      if (droppedText) {
        performSearch(engine.id, droppedText);
        hidePopup();
      }
    });
  });

  document.body.appendChild(popupElement);
}

// 팝업 표시
function showPopup(x, y) {
  if (!popupElement || searchEngines.length === 0) return;
  
  // 팝업 위치 계산 (화면 경계 고려)
  const popupRect = popupElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  let left = x + 10;
  let top = y - popupRect.height - 10;
  
  // 우측 경계 체크
  if (left + popupRect.width > viewportWidth) {
    left = x - popupRect.width - 10;
  }
  
  // 상단 경계 체크
  if (top < 0) {
    top = y + 20;
  }
  
  popupElement.style.left = `${left}px`;
  popupElement.style.top = `${top}px`;
  popupElement.style.display = 'flex';
}

// 팝업 숨기기
function hidePopup() {
  if (popupElement) {
    popupElement.style.display = 'none';
  }
}

// 검색 실행
function performSearch(engineId, text) {
  // Chrome extension context 유효성 검사
  if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
    console.log('Chrome extension context가 유효하지 않음');
    handleExtensionDisconnected(engineId, text);
    return;
  }

  // Extension ID 확인으로 context 유효성 재검사
  try {
    const extensionId = chrome.runtime.id;
    if (!extensionId) {
      console.log('Extension ID를 가져올 수 없음 - context 무효');
      handleExtensionDisconnected(engineId, text);
      return;
    }
  } catch (error) {
    console.log('Extension context 검사 실패:', error.message);
    handleExtensionDisconnected(engineId, text);
    return;
  }

  try {
    chrome.runtime.sendMessage({
      action: 'search',
      engineId: engineId,
      searchText: text
    }, (response) => {
      // sendMessage 호출 후에도 runtime 에러 체크
      if (chrome.runtime.lastError) {
        console.error('검색 실행 실패:', chrome.runtime.lastError.message);
        handleExtensionDisconnected(engineId, text);
      }
    });
  } catch (error) {
    console.error('검색 실행 중 오류:', error.message);
    handleExtensionDisconnected(engineId, text);
  }
}

// 확장 기능 연결 끊어졌을 때 처리
function handleExtensionDisconnected(engineId, text) {
  console.log('확장 기능 연결 끊어짐, 대안 검색 실행');
  
  // 로컬 저장된 검색엔진 정보로 직접 검색
  const fallbackEngines = {
    'google': 'https://www.google.com/search?q=%s',
    'naver': 'https://search.naver.com/search.naver?query=%s',
    'youtube': 'https://www.youtube.com/results?search_query=%s',
    'wikipedia': 'https://ko.wikipedia.org/wiki/Special:Search?search=%s'
  };
  
  const searchUrl = fallbackEngines[engineId];
  if (searchUrl) {
    const finalUrl = searchUrl.replace('%s', encodeURIComponent(text));
    window.open(finalUrl, '_blank');
    
    // 사용자에게 알림
    showExtensionUpdateNotice();
  } else {
    // 기본 Google 검색으로 폴백
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
    window.open(googleUrl, '_blank');
    showExtensionUpdateNotice();
  }
}

// 확장 기능 업데이트 알림 표시
function showExtensionUpdateNotice() {
  // 이미 알림이 표시된 경우 중복 방지
  if (document.getElementById('drag-search-update-notice')) return;
  
  const notice = document.createElement('div');
  notice.id = 'drag-search-update-notice';
  notice.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4f46e5;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 2147483647;
    max-width: 300px;
    animation: slideInRight 0.3s ease;
  `;
  
  notice.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>🔄</span>
      <div>
        <div style="font-weight: 600;">Drag & Drop Search</div>
        <div style="font-size: 12px; opacity: 0.9;">확장 기능이 업데이트되었습니다.<br>페이지를 새로고침하시면 모든 기능을 사용할 수 있습니다.</div>
      </div>
      <button class="drag-search-close-btn" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 0; margin-left: 8px;">×</button>
    </div>
  `;
  
  // 닫기 버튼 이벤트 리스너 추가
  const closeBtn = notice.querySelector('.drag-search-close-btn');
  closeBtn.addEventListener('click', () => {
    notice.remove();
  });
  
  // CSS 애니메이션 추가
  if (!document.getElementById('drag-search-notice-style')) {
    const style = document.createElement('style');
    style.id = 'drag-search-notice-style';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notice);
  
  // 10초 후 자동 제거
  setTimeout(() => {
    if (notice.parentElement) {
      notice.remove();
    }
  }, 10000);
}

// 텍스트 선택 감지
function handleTextSelection() {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (text.length > 0) {
    selectedText = text;
    
    // 선택 영역의 위치 계산
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // 팝업 표시
    showPopup(rect.right, rect.top);
  } else {
    hidePopup();
  }
}

// 마우스 이벤트 리스너
document.addEventListener('mouseup', (e) => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
  
  // 약간의 지연을 두어 선택이 완료된 후 처리
  setTimeout(handleTextSelection, 10);
});

// 키보드 이벤트 리스너 (키보드로 텍스트 선택 시)
document.addEventListener('keyup', (e) => {
  // Shift + 화살표 키로 선택 시
  if (e.shiftKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    setTimeout(handleTextSelection, 10);
  }
});

// 클릭 시 팝업 숨기기 (팝업 외부 클릭)
document.addEventListener('mousedown', (e) => {
  if (popupElement && !popupElement.contains(e.target)) {
    hidePopup();
  }
});

// 드래그 시작 시 텍스트 데이터 설정
document.addEventListener('dragstart', (e) => {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  if (text.length > 0) {
    e.dataTransfer.setData('text/plain', text);
  }
});

// 스크롤 시 팝업 숨기기
document.addEventListener('scroll', hidePopup);
window.addEventListener('resize', hidePopup);

// 초기화
(async function init() {
  await loadSearchEngines();
  createPopup();
  hidePopup();
})(); 