// 전역 변수
let searchEngines = [];
let editingEngineId = null;

// DOM 요소들
const elements = {
  engineName: document.getElementById('engine-name'),
  engineUrl: document.getElementById('engine-url'),
  engineIcon: document.getElementById('engine-icon'),
  addEngineBtn: document.getElementById('add-engine-btn'),
  enginesList: document.getElementById('engines-list'),
  resetBtn: document.getElementById('reset-btn'),
  saveBtn: document.getElementById('save-btn'),
  statusMessage: document.getElementById('status-message'),
  
  // 모달 요소들
  confirmModal: document.getElementById('confirm-modal'),
  confirmMessage: document.getElementById('confirm-message'),
  confirmCancel: document.getElementById('confirm-cancel'),
  confirmOk: document.getElementById('confirm-ok'),
  
  editModal: document.getElementById('edit-modal'),
  editEngineName: document.getElementById('edit-engine-name'),
  editEngineUrl: document.getElementById('edit-engine-url'),
  editEngineIcon: document.getElementById('edit-engine-icon'),
  editCancel: document.getElementById('edit-cancel'),
  editSave: document.getElementById('edit-save')
};

// 기본 검색엔진
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

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  loadSearchEngines();
  initEventListeners();
});

// 이벤트 리스너 초기화
function initEventListeners() {
  elements.addEngineBtn.addEventListener('click', handleAddEngine);
  elements.resetBtn.addEventListener('click', handleReset);
  elements.saveBtn.addEventListener('click', handleSave);
  
  // 모달 이벤트
  elements.confirmCancel.addEventListener('click', hideConfirmModal);
  elements.confirmOk.addEventListener('click', handleConfirmOk);
  elements.editCancel.addEventListener('click', hideEditModal);
  elements.editSave.addEventListener('click', handleEditSave);
  
  // 모달 외부 클릭 시 닫기
  elements.confirmModal.addEventListener('click', (e) => {
    if (e.target === elements.confirmModal) hideConfirmModal();
  });
  elements.editModal.addEventListener('click', (e) => {
    if (e.target === elements.editModal) hideEditModal();
  });
  
  // Enter 키로 검색엔진 추가
  [elements.engineName, elements.engineUrl, elements.engineIcon].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleAddEngine();
      }
    });
  });
  
  // 검색엔진 목록의 버튼 클릭 이벤트 (이벤트 위임)
  elements.enginesList.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;
    
    const engineId = target.getAttribute('data-engine-id');
    if (!engineId) return;
    
    console.log('버튼 클릭:', target.className, 'engineId:', engineId);
    
    if (target.classList.contains('edit-btn')) {
      editEngine(engineId);
    } else if (target.classList.contains('delete-btn')) {
      deleteEngine(engineId);
    }
  });
}

// 검색엔진 데이터 로드
async function loadSearchEngines() {
  try {
    console.log('검색엔진 로드 시작');
    const result = await chrome.storage.sync.get('searchEngines');
    console.log('저장소에서 로드된 데이터:', result);
    searchEngines = result.searchEngines || DEFAULT_SEARCH_ENGINES;
    console.log('최종 검색엔진 목록:', searchEngines);
    renderEnginesList();
  } catch (error) {
    console.error('검색엔진 로드 실패:', error);
    searchEngines = DEFAULT_SEARCH_ENGINES;
    renderEnginesList();
  }
}

// 검색엔진 목록 렌더링
function renderEnginesList() {
  console.log('렌더링 시작, 검색엔진 수:', searchEngines.length);
  elements.enginesList.innerHTML = '';
  
  if (searchEngines.length === 0) {
    elements.enginesList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">등록된 검색엔진이 없습니다.</p>';
    return;
  }
  
  searchEngines.forEach(engine => {
    console.log('렌더링 엔진:', engine.name);
    const engineElement = createEngineElement(engine);
    elements.enginesList.appendChild(engineElement);
  });
  console.log('렌더링 완료');
}

// 검색엔진 요소 생성
function createEngineElement(engine) {
  const div = document.createElement('div');
  div.className = 'engine-item';
  
  div.innerHTML = `
    <div class="engine-icon">
      <img src="${engine.icon}" alt="${engine.name}" onerror="this.style.display='none'">
    </div>
    <div class="engine-info">
      <div class="engine-name">
        ${engine.name}
        ${engine.id === 'google' ? '<span class="default-badge" style="background: #ef4444; color: white;">필수</span>' : ''}
        ${engine.isDefault && engine.id !== 'google' ? '<span class="default-badge">기본</span>' : ''}
      </div>
      <div class="engine-url">${engine.url}</div>
    </div>
    <div class="engine-actions">
      <button class="btn btn-secondary btn-small edit-btn" data-engine-id="${engine.id}">
        ✏️ 편집
      </button>
      ${engine.id !== 'google' ? `<button class="btn btn-danger btn-small delete-btn" data-engine-id="${engine.id}">🗑️ 삭제</button>` : ''}
    </div>
  `;
  
  return div;
}

// 검색엔진 추가
function handleAddEngine() {
  const name = elements.engineName.value.trim();
  const url = elements.engineUrl.value.trim();
  const icon = elements.engineIcon.value.trim();
  
  if (!name || !url) {
    showStatus('검색엔진 이름과 URL을 입력해주세요.', 'error');
    return;
  }
  
  if (!url.includes('%s')) {
    showStatus('검색 URL에 %s를 포함해주세요.', 'error');
    return;
  }
  
  if (!isValidUrl(url.replace('%s', 'test'))) {
    showStatus('올바른 URL 형식을 입력해주세요.', 'error');
    return;
  }
  
  // 중복 이름 확인
  if (searchEngines.some(engine => engine.name.toLowerCase() === name.toLowerCase())) {
    showStatus('이미 존재하는 검색엔진 이름입니다.', 'error');
    return;
  }
  
  const newEngine = {
    id: generateId(),
    name: name,
    url: url,
    icon: icon || getDefaultIcon(),
    isDefault: false
  };
  
  searchEngines.push(newEngine);
  
  // 즉시 저장소에 저장
  chrome.storage.sync.set({ searchEngines: searchEngines }).then(() => {
    renderEnginesList();
    clearForm();
    showStatus('검색엔진이 추가되었습니다.', 'success');
  }).catch((error) => {
    console.error('추가 저장 실패:', error);
    // 실패 시 배열에서 제거
    searchEngines.pop();
    showStatus('검색엔진 추가에 실패했습니다.', 'error');
  });
}

// 검색엔진 편집
function editEngine(engineId) {
  const engine = searchEngines.find(e => e.id === engineId);
  if (!engine) return;
  
  editingEngineId = engineId;
  elements.editEngineName.value = engine.name;
  elements.editEngineUrl.value = engine.url;
  elements.editEngineIcon.value = engine.icon;
  
  showEditModal();
}

// 편집 저장
function handleEditSave() {
  const name = elements.editEngineName.value.trim();
  const url = elements.editEngineUrl.value.trim();
  const icon = elements.editEngineIcon.value.trim();
  
  if (!name || !url) {
    showStatus('검색엔진 이름과 URL을 입력해주세요.', 'error');
    return;
  }
  
  if (!url.includes('%s')) {
    showStatus('검색 URL에 %s를 포함해주세요.', 'error');
    return;
  }
  
  if (!isValidUrl(url.replace('%s', 'test'))) {
    showStatus('올바른 URL 형식을 입력해주세요.', 'error');
    return;
  }
  
  // 중복 이름 확인 (자기 자신 제외)
  if (searchEngines.some(engine => engine.id !== editingEngineId && engine.name.toLowerCase() === name.toLowerCase())) {
    showStatus('이미 존재하는 검색엔진 이름입니다.', 'error');
    return;
  }
  
  const engineIndex = searchEngines.findIndex(e => e.id === editingEngineId);
  if (engineIndex !== -1) {
    const originalEngine = { ...searchEngines[engineIndex] };
    searchEngines[engineIndex] = {
      ...searchEngines[engineIndex],
      name: name,
      url: url,
      icon: icon || getDefaultIcon()
    };
    
    // 즉시 저장소에 저장
    chrome.storage.sync.set({ searchEngines: searchEngines }).then(() => {
      renderEnginesList();
      hideEditModal();
      showStatus('검색엔진이 수정되었습니다.', 'success');
    }).catch((error) => {
      console.error('편집 저장 실패:', error);
      // 실패 시 원래 상태로 복원
      searchEngines[engineIndex] = originalEngine;
      showStatus('검색엔진 수정에 실패했습니다.', 'error');
    });
  }
}

// 현재 확인 액션을 저장할 변수
let currentConfirmAction = null;

// 검색엔진 삭제
function deleteEngine(engineId) {
  const engine = searchEngines.find(e => e.id === engineId);
  if (!engine) return;
  
  elements.confirmMessage.textContent = `"${engine.name}" 검색엔진을 삭제하시겠습니까?`;
  
  // 현재 확인 액션 설정
  currentConfirmAction = async () => {
    console.log('삭제 시작:', engineId);
    searchEngines = searchEngines.filter(e => e.id !== engineId);
    
    try {
      // 즉시 저장소에 저장
      await chrome.storage.sync.set({ searchEngines: searchEngines });
      console.log('삭제 저장 완료');
      renderEnginesList();
      hideConfirmModal();
      showStatus('검색엔진이 삭제되었습니다.', 'success');
    } catch (error) {
      console.error('삭제 저장 실패:', error);
      showStatus('삭제에 실패했습니다.', 'error');
    }
  };
  
  showConfirmModal();
}

// 초기화
function handleReset() {
  elements.confirmMessage.textContent = '모든 설정을 기본값으로 초기화하시겠습니까?';
  
  // 현재 확인 액션 설정
  currentConfirmAction = async () => {
    console.log('초기화 시작');
    searchEngines = [...DEFAULT_SEARCH_ENGINES];
    
    try {
      // 즉시 저장소에 저장
      await chrome.storage.sync.set({ searchEngines: searchEngines });
      console.log('초기화 저장 완료');
      renderEnginesList();
      hideConfirmModal();
      showStatus('설정이 초기화되었습니다.', 'success');
    } catch (error) {
      console.error('초기화 저장 실패:', error);
      showStatus('초기화에 실패했습니다.', 'error');
    }
  };
  
  showConfirmModal();
}

// 저장
async function handleSave() {
  try {
    await chrome.storage.sync.set({ searchEngines: searchEngines });
    showStatus('설정이 저장되었습니다.', 'success');
  } catch (error) {
    console.error('저장 실패:', error);
    showStatus('저장에 실패했습니다.', 'error');
  }
}

// 유틸리티 함수들
function generateId() {
  return 'engine_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function getDefaultIcon() {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDJWMjJDMTAgMjIgMjAgMTcgMjAgMTJTMTAgMiAxMCAyWiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
}

function clearForm() {
  elements.engineName.value = '';
  elements.engineUrl.value = '';
  elements.engineIcon.value = '';
}

function showStatus(message, type) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status-message ${type}`;
  
  setTimeout(() => {
    elements.statusMessage.className = 'status-message';
  }, 3000);
}

// 모달 관리
function showConfirmModal() {
  elements.confirmModal.classList.add('show');
}

function hideConfirmModal() {
  elements.confirmModal.classList.remove('show');
}

function showEditModal() {
  elements.editModal.classList.add('show');
}

function hideEditModal() {
  elements.editModal.classList.remove('show');
  editingEngineId = null;
}

function handleConfirmOk() {
  console.log('확인 버튼 클릭됨, currentConfirmAction:', !!currentConfirmAction);
  if (currentConfirmAction) {
    currentConfirmAction();
    currentConfirmAction = null; // 사용 후 초기화
  } else {
    console.log('실행할 액션이 없습니다.');
  }
}

// 더 이상 전역 함수 노출이 필요하지 않음 (이벤트 위임 사용) 