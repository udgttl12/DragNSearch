// 기본 검색엔진 설정
const DEFAULT_SEARCH_ENGINES = [
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?q=%s',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDE2djQuMjVoNi4xOUMyMi4wNSAxNi4xMiAyMS4xNSAxNyAyMCAxN0MxOC44NSAxNyAxNy45NSAxNi4xMiAxNy44MSAxNUgxNnY0aDEwLjU2QzIyLjU2IDEzIDIyLjU2IDEyLjUgMjIuNTYgMTIuMjVaIiBmaWxsPSIjNEY4NUY0Ii8+CjxwYXRoIGQ9Ik0yMiA3SDEwVjEzSDIyVjdaIiBmaWxsPSIjRUE0MzM1Ii8+CjxwYXRoIGQ9Ik0yIDdIMTBWMTNIMlY3WiIgZmlsbD0iI0ZCQkMwNSIvPgo8cGF0aCBkPSJNMTAgMkg2VjEwSDEwVjJaIiBmaWxsPSIjMzRBODUzIi8+Cjwvc3ZnPgo=',
    isDefault: true
  },
  {
    id: 'naver',
    name: 'Naver',
    url: 'https://search.naver.com/search.naver?query=%s',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDBDNzNDIi8+CjxwYXRoIGQ9Ik0xNCAxM0g5VjE2SDE0VjEzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTkgOEgxNFYxMUg5VjhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    isDefault: true
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/results?search_query=%s',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIzLjQ5OCA2LjE4NkMyMy4yODQgNS4zMDEgMjIuNjA3IDQuNTk3IDIxLjc1MiA0LjM3N0MyMC4yNTQgNCAyMCA0IDIwIDRzMC4yNTQgMCAxLjc1MiAwLjM3N0MyMi42MDcgNC41OTcgMjMuMjg0IDUuMzAxIDIzLjQ5OCA2LjE4NkMyNCA3LjY5IDI0IDEyIDI0IDEyUzI0IDE2LjMxIDIzLjQ5OCAxNy44MTRDMjMuMjg0IDE4LjY5OSAyMi42MDcgMTkuNDAzIDIxLjc1MiAxOS42MjNDMjAuMjU0IDIwIDIwIDIwIDIwIDIwczAuMjU0IDAgMS43NTIgLTAuMzc3QzIyLjYwNyAxOS40MDMgMjMuMjg0IDE4LjY5OSAyMy40OTggMTcuODE0QzI0IDE2LjMxIDI0IDEyIDI0IDEyUzI0IDcuNjkgMjMuNDk4IDYuMTg2WiIgZmlsbD0iI0ZGMDAwMCIvPgo8cGF0aCBkPSJNOS41NSA4LjVWMTUuNUwxNS41IDEyTC05LjU1IDguNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
    isDefault: true
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    url: 'https://ko.wikipedia.org/wiki/Special:Search?search=%s',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40ODYgMiAyIDYuNDg2IDIgMTJTNi40ODYgMjIgMTIgMjJTMjIgMTcuNTE0IDIyIDEyUzE3LjUxNCAyIDEyIDJaTTExLjcgOS42SDE1VjEySDExLjdWOS42Wk05IDE0LjRIMTJWMTdIOVYxNC40WiIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4K',
    isDefault: true
  }
];

// 확장 기능 설치/업데이트 시 실행
chrome.runtime.onInstalled.addListener(async () => {
  // 기본 검색엔진 설정
  const { searchEngines } = await chrome.storage.sync.get('searchEngines');
  if (!searchEngines) {
    await chrome.storage.sync.set({ searchEngines: DEFAULT_SEARCH_ENGINES });
  }
  
  // 컨텍스트 메뉴 생성
  await createContextMenus();
});

// 컨텍스트 메뉴 생성 함수
async function createContextMenus() {
  // 기존 메뉴 제거
  await chrome.contextMenus.removeAll();
  
  // 검색엔진 목록 가져오기
  const { searchEngines } = await chrome.storage.sync.get('searchEngines');
  
  if (searchEngines && searchEngines.length > 0) {
    // 부모 메뉴 생성
    chrome.contextMenus.create({
      id: 'dragSearchParent',
      title: 'Drag & Drop Search',
      contexts: ['selection']
    });
    
    // 각 검색엔진별 서브메뉴 생성
    searchEngines.forEach(engine => {
      chrome.contextMenus.create({
        id: `search_${engine.id}`,
        parentId: 'dragSearchParent',
        title: `${engine.name}로 검색`,
        contexts: ['selection']
      });
    });
  }
}

// 컨텍스트 메뉴 클릭 이벤트
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId.startsWith('search_')) {
    const engineId = info.menuItemId.replace('search_', '');
    const { searchEngines } = await chrome.storage.sync.get('searchEngines');
    const engine = searchEngines.find(e => e.id === engineId);
    
    if (engine && info.selectionText) {
      const searchUrl = engine.url.replace('%s', encodeURIComponent(info.selectionText));
      // activeTab 권한을 사용하여 새 탭 생성
      chrome.tabs.create({ url: searchUrl, active: true });
    }
  }
});

// 검색엔진 변경 시 컨텍스트 메뉴 업데이트
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.searchEngines) {
    createContextMenus();
  }
});

// content script에서 검색 요청 처리
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'search') {
    const { engineId, searchText } = request;
    chrome.storage.sync.get('searchEngines').then(({ searchEngines }) => {
      const engine = searchEngines.find(e => e.id === engineId);
      if (engine) {
        const searchUrl = engine.url.replace('%s', encodeURIComponent(searchText));
        // activeTab 권한을 사용하여 새 탭 생성
        chrome.tabs.create({ url: searchUrl, active: true });
      }
    });
  }
  
  if (request.action === 'getEngines') {
    chrome.storage.sync.get('searchEngines').then(({ searchEngines }) => {
      sendResponse({ engines: searchEngines || [] });
    });
    return true; // 비동기 응답을 위해 true 반환
  }
  
  // 팝업에서 옵션 페이지 열기 요청
  if (request.action === 'openOptions') {
    chrome.runtime.openOptionsPage();
  }
  
  // 팝업에서 테스트 페이지 열기 요청
  if (request.action === 'openTestPage') {
    // 텍스트가 많은 위키피디아 메인 페이지로 이동하여 드래그 테스트
    chrome.tabs.create({ 
      url: 'https://ko.wikipedia.org/wiki/%EC%9C%84%ED%82%A4%EB%B0%B1%EA%B3%BC:%EB%8C%80%EB%AC%B8',
      active: true
    });
  }
}); 