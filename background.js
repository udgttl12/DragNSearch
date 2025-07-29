// 전역 변수
let isCreatingMenus = false; // 컨텍스트 메뉴 생성 중복 방지 플래그

// 기본 검색엔진 설정
const DEFAULT_SEARCH_ENGINES = [
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?q=%s',
    icon: 'http://www.google.com/s2/favicons?domain=https://www.google.com',
    isDefault: true
  },
  {
    id: 'naver',
    name: 'Naver',
    url: 'https://search.naver.com/search.naver?query=%s',
    icon: 'http://www.google.com/s2/favicons?domain=https://www.naver.com',
    isDefault: true
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/results?search_query=%s',
    icon: 'http://www.google.com/s2/favicons?domain=https://www.youtube.com',
    isDefault: true
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    url: 'https://ko.wikipedia.org/wiki/Special:Search?search=%s',
    icon: 'http://www.google.com/s2/favicons?domain=https://www.wikipedia.org',
    isDefault: true
  }
];

// 확장 기능 설치/업데이트 시 실행
chrome.runtime.onInstalled.addListener(async (details) => {
  try {
    console.log('확장 기능 설치/업데이트:', details.reason);
    
    if (details.reason === 'install') {
      // 새로 설치된 경우: 기본 검색엔진 설정만 하고 메뉴는 전혀 건드리지 않음
      await chrome.storage.sync.set({ searchEngines: DEFAULT_SEARCH_ENGINES });
      console.log('새로 설치됨 - 기본 검색엔진 설정 완료 (메뉴는 사용자가 직접 설정)');
    } else if (details.reason === 'update') {
      // 업데이트된 경우: 기존 설정 유지, 메뉴는 전혀 건드리지 않음
      const { searchEngines } = await chrome.storage.sync.get('searchEngines');
      if (!searchEngines || searchEngines.length === 0) {
        // 기존 설정이 없는 경우에만 기본값 설정
        await chrome.storage.sync.set({ searchEngines: DEFAULT_SEARCH_ENGINES });
        console.log('업데이트됨 - 기본 검색엔진 설정 완료 (메뉴는 사용자가 직접 설정)');
      } else {
        console.log('업데이트됨 - 기존 설정 유지 (메뉴는 사용자가 직접 설정)');
      }
    }
  } catch (error) {
    console.error('확장 기능 초기화 실패:', error);
  }
});

// 컨텍스트 메뉴 생성 함수 (기존 메뉴는 전혀 건드리지 않음)
async function createContextMenus() {
  // 중복 실행 방지
  if (isCreatingMenus) {
    console.log('이미 컨텍스트 메뉴를 생성 중입니다.');
    return;
  }
  
  isCreatingMenus = true;
  
  try {
    console.log('새 메뉴만 추가 중 (기존 메뉴는 건드리지 않음)...');
    
    // 검색엔진 목록 가져오기
    const { searchEngines } = await chrome.storage.sync.get('searchEngines');
    
    if (searchEngines && searchEngines.length > 0) {
      console.log('메뉴 추가 중:', searchEngines.length, '개 검색엔진');
      
      // 부모 메뉴가 없으면만 생성
      try {
        await chrome.contextMenus.create({
          id: 'dragSearchParent',
          title: 'Drag & Drop Search',
          contexts: ['selection']
        });
        console.log('부모 메뉴 생성됨');
      } catch (error) {
        if (error.message.includes('duplicate')) {
          console.log('부모 메뉴가 이미 존재함 - 건드리지 않음');
        } else {
          console.error('부모 메뉴 생성 실패:', error);
          return;
        }
      }
      
      // 각 검색엔진별 서브메뉴 추가 (기존 메뉴는 건드리지 않음)
      for (const engine of searchEngines) {
        try {
          await chrome.contextMenus.create({
            id: `search_${engine.id}`,
            parentId: 'dragSearchParent',
            title: `${engine.name}로 검색`,
            contexts: ['selection']
          });
          console.log(`메뉴 추가됨: ${engine.name}`);
        } catch (error) {
          if (error.message.includes('duplicate')) {
            console.log(`메뉴가 이미 존재함 - 건드리지 않음: ${engine.name}`);
          } else {
            console.error(`메뉴 생성 실패 (${engine.name}):`, error);
          }
        }
      }
      
      console.log('메뉴 추가 완료 (기존 메뉴는 그대로 유지)');
    } else {
      console.log('검색엔진이 없어 메뉴를 추가하지 않습니다.');
    }
  } catch (error) {
    console.error('메뉴 추가 실패:', error);
  } finally {
    // 플래그 리셋
    isCreatingMenus = false;
  }
}

// 컨텍스트 메뉴 업데이트 함수 (비활성화 - 기존 메뉴를 전혀 건드리지 않음)
async function updateContextMenus() {
  console.log('메뉴 업데이트 비활성화됨 - 기존 메뉴를 건드리지 않습니다.');
  // 아무것도 하지 않음 - 기존 메뉴를 전혀 건드리지 않음
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

// 확장 기능 시작 시 메뉴는 전혀 건드리지 않음
chrome.runtime.onStartup.addListener(async () => {
  try {
    console.log('확장 기능 시작 - 메뉴는 사용자가 직접 설정');
    // 메뉴는 전혀 건드리지 않고, 설정만 확인
    const { searchEngines } = await chrome.storage.sync.get('searchEngines');
    if (!searchEngines || searchEngines.length === 0) {
      console.log('검색엔진 설정이 없음 - 기본값 설정');
      await chrome.storage.sync.set({ searchEngines: DEFAULT_SEARCH_ENGINES });
    }
  } catch (error) {
    console.error('시작 시 설정 확인 실패:', error);
  }
});

// 검색엔진 변경 시 메뉴는 전혀 건드리지 않음
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.searchEngines) {
    console.log('검색엔진 설정 변경됨 - 메뉴는 사용자가 직접 설정');
    // 메뉴는 전혀 건드리지 않음 (사용자가 직접 설정 페이지에서 관리)
  }
});

// content script에서 검색 요청 처리
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'search') {
    const { engineId, searchText } = request;
    console.log('검색 요청 받음:', engineId, searchText);
    
    chrome.storage.sync.get('searchEngines').then(({ searchEngines }) => {
      console.log('저장된 검색엔진들:', searchEngines);
      const engine = searchEngines.find(e => e.id === engineId);
      console.log('찾은 검색엔진:', engine);
      
      if (engine) {
        const searchUrl = engine.url.replace('%s', encodeURIComponent(searchText));
        console.log('최종 검색 URL:', searchUrl);
        // activeTab 권한을 사용하여 새 탭 생성
        chrome.tabs.create({ url: searchUrl, active: true }).then(() => {
          // 새 탭 생성 성공 후 응답
          sendResponse({ success: true });
        }).catch((error) => {
          console.error('새 탭 생성 실패:', error);
          sendResponse({ success: false, error: '새 탭 생성에 실패했습니다.' });
        });
      } else {
        console.error('검색엔진을 찾을 수 없음:', engineId);
        sendResponse({ success: false, error: '검색엔진을 찾을 수 없습니다.' });
      }
    }).catch((error) => {
      console.error('검색엔진 로드 실패:', error);
      sendResponse({ success: false, error: '검색엔진 로드에 실패했습니다.' });
    });
    
    // 비동기 응답을 위해 true 반환
    return true;
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
  
  // 설정 페이지에서 메뉴 생성 요청
  if (request.action === 'createMenus') {
    console.log('설정 페이지에서 메뉴 생성 요청 받음');
    createContextMenus().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('메뉴 생성 실패:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true; // 비동기 응답을 위해 true 반환
  }
}); 