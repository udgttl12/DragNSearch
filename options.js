// 전역 변수
let searchEngines = [];
let editingEngineId = null;
let layoutSetting = 'horizontal'; // 기본값: 가로 배치
let popupDistance = 15; // 기본값: 15픽셀

// DOM 요소들
const elements = {
  engineName: document.getElementById('engine-name'),
  engineUrl: document.getElementById('engine-url'),
  engineIcon: document.getElementById('engine-icon'),
  useExistingIcon: document.getElementById('use-existing-icon'),
  iconUrlGroup: document.getElementById('icon-url-group'),
  addEngineBtn: document.getElementById('add-engine-btn'),
  enginesList: document.getElementById('engines-list'),
  resetBtn: document.getElementById('reset-btn'),
  saveBtn: document.getElementById('save-btn'),
  statusMessage: document.getElementById('status-message'),
  
  // 표시 설정 요소들
  layoutHorizontal: document.getElementById('layout-horizontal'),
  layoutGrid: document.getElementById('layout-grid'),
  popupDistance: document.getElementById('popup-distance'),
  popupDistanceValue: document.getElementById('popup-distance-value'),
  
  // 데이터 관리 요소들
  exportBtn: document.getElementById('export-btn'),
  importBtn: document.getElementById('import-btn'),
  importFile: document.getElementById('import-file'),
  
  // 모달 요소들
  confirmModal: document.getElementById('confirm-modal'),
  confirmMessage: document.getElementById('confirm-message'),
  confirmCancel: document.getElementById('confirm-cancel'),
  confirmOk: document.getElementById('confirm-ok'),
  
  editModal: document.getElementById('edit-modal'),
  editEngineName: document.getElementById('edit-engine-name'),
  editEngineUrl: document.getElementById('edit-engine-url'),
  editEngineIcon: document.getElementById('edit-engine-icon'),
  editUseExistingIcon: document.getElementById('edit-use-existing-icon'),
  editIconUrlGroup: document.getElementById('edit-icon-url-group'),
  editCancel: document.getElementById('edit-cancel'),
  editSave: document.getElementById('edit-save')
};

// 기본 검색엔진
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

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  loadSearchEngines();
  loadSettings();
  initEventListeners();
});

// 이벤트 리스너 초기화
function initEventListeners() {
  elements.addEngineBtn.addEventListener('click', handleAddEngine);
  elements.resetBtn.addEventListener('click', handleReset);
  elements.saveBtn.addEventListener('click', handleSave);
  
  // 표시 설정 이벤트
  elements.layoutHorizontal.addEventListener('change', handleLayoutChange);
  elements.layoutGrid.addEventListener('change', handleLayoutChange);
  elements.popupDistance.addEventListener('input', handlePopupDistanceChange);
  
  // 데이터 관리 이벤트
  elements.exportBtn.addEventListener('click', handleExport);
  elements.importBtn.addEventListener('click', () => elements.importFile.click());
  elements.importFile.addEventListener('change', handleImport);
  
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
  
  // 기존 아이콘 사용 체크박스 이벤트
  elements.useExistingIcon.addEventListener('change', handleUseExistingIconChange);
  elements.editUseExistingIcon.addEventListener('change', handleEditUseExistingIconChange);
  
  // URL 입력 필드 변경 이벤트 (자동 아이콘 업데이트)
  elements.engineUrl.addEventListener('input', handleUrlInputChange);
  elements.editEngineUrl.addEventListener('input', handleEditUrlInputChange);
  
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

// 기존 아이콘 사용 체크박스 변경 처리
function handleUseExistingIconChange() {
  if (elements.useExistingIcon.checked) {
    // 체크박스가 체크되면 아이콘 URL을 자동으로 설정
    const url = elements.engineUrl.value.trim();
    if (url) {
      const domain = extractDomainFromUrl(url);
      if (domain) {
        elements.engineIcon.value = `http://www.google.com/s2/favicons?domain=${domain}`;
      }
    }
    elements.iconUrlGroup.style.display = 'none';
  } else {
    // 체크박스가 해제되면 아이콘 URL을 비우고 입력 필드 표시
    elements.engineIcon.value = '';
    elements.iconUrlGroup.style.display = 'block';
  }
}

// 편집 모달에서 기존 아이콘 사용 체크박스 변경 처리
function handleEditUseExistingIconChange() {
  if (elements.editUseExistingIcon.checked) {
    // 체크박스가 체크되면 아이콘 URL을 자동으로 설정
    const url = elements.editEngineUrl.value.trim();
    if (url) {
      const domain = extractDomainFromUrl(url);
      if (domain) {
        elements.editEngineIcon.value = `http://www.google.com/s2/favicons?domain=${domain}`;
      }
    }
    elements.editIconUrlGroup.style.display = 'none';
  } else {
    // 체크박스가 해제되면 아이콘 URL을 비우고 입력 필드 표시
    elements.editEngineIcon.value = '';
    elements.editIconUrlGroup.style.display = 'block';
  }
}

// URL에서 도메인 추출
function extractDomainFromUrl(url) {
  try {
    // %s를 제거하고 URL 파싱
    const cleanUrl = url.replace('%s', 'test');
    const urlObj = new URL(cleanUrl);
    return urlObj.hostname;
  } catch (error) {
    console.error('URL 파싱 실패:', error);
    return null;
  }
}

// URL 입력 필드 변경 처리 (추가 폼)
function handleUrlInputChange() {
  if (elements.useExistingIcon.checked) {
    const url = elements.engineUrl.value.trim();
    if (url) {
      const domain = extractDomainFromUrl(url);
      if (domain) {
        elements.engineIcon.value = `http://www.google.com/s2/favicons?domain=${domain}`;
      }
    }
  }
}

// URL 입력 필드 변경 처리 (편집 모달)
function handleEditUrlInputChange() {
  if (elements.editUseExistingIcon.checked) {
    const url = elements.editEngineUrl.value.trim();
    if (url) {
      const domain = extractDomainFromUrl(url);
      if (domain) {
        elements.editEngineIcon.value = `http://www.google.com/s2/favicons?domain=${domain}`;
      }
    }
  }
}

// 모든 탭에 검색엔진 업데이트 알림
async function notifyAllTabsUpdate() {
  try {
    await chrome.runtime.sendMessage({ action: 'notifyAllTabs' });
    console.log('모든 탭 업데이트 알림 완료');
  } catch (error) {
    console.log('탭 업데이트 알림 실패 (정상):', error.message);
  }
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
    
    // 모든 탭에 업데이트 알림
    notifyAllTabsUpdate();
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
  
  // 기존 아이콘 사용 여부 확인 및 체크박스 설정
  const isUsingGoogleFavicon = engine.icon && engine.icon.includes('google.com/s2/favicons');
  elements.editUseExistingIcon.checked = isUsingGoogleFavicon;
  
  // 체크박스 상태에 따라 아이콘 URL 입력 필드 표시/숨김
  if (isUsingGoogleFavicon) {
    elements.editIconUrlGroup.style.display = 'none';
  } else {
    elements.editIconUrlGroup.style.display = 'block';
  }
  
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
      
      // 모든 탭에 업데이트 알림
      notifyAllTabsUpdate();
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
      
      // 모든 탭에 업데이트 알림
      notifyAllTabsUpdate();
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
      
      // 모든 탭에 업데이트 알림
      notifyAllTabsUpdate();
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
    
    // 모든 탭에 업데이트 알림
    await notifyAllTabsUpdate();
    
    // 설정 저장 후 메뉴 생성 요청
    try {
      await chrome.runtime.sendMessage({ action: 'createMenus' });
      showStatus('설정이 저장되었습니다. 컨텍스트 메뉴가 업데이트되었습니다.', 'success');
    } catch (error) {
      console.error('메뉴 생성 요청 실패:', error);
      showStatus('설정이 저장되었습니다. 컨텍스트 메뉴는 수동으로 설정해주세요.', 'success');
    }
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
  elements.useExistingIcon.checked = false;
  elements.iconUrlGroup.style.display = 'block';
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

// 검색엔진 설정 내보내기
function handleExport() {
  try {
    // 순수한 검색엔진 배열만 내보내기
    const jsonString = JSON.stringify(searchEngines, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const filename = `drag-search-engines_${timestamp}.json`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showStatus(`설정이 ${filename} 파일로 내보내졌습니다.`, 'success');
  } catch (error) {
    console.error('내보내기 실패:', error);
    showStatus('설정 내보내기에 실패했습니다.', 'error');
  }
}

// 검색엔진 설정 가져오기
function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    showStatus('JSON 파일만 가져올 수 있습니다.', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const importData = JSON.parse(e.target.result);
      
      // 데이터 유효성 검사 - 배열인지 확인
      if (!Array.isArray(importData)) {
        showStatus('유효하지 않은 설정 파일입니다. 검색엔진 배열이어야 합니다.', 'error');
        return;
      }
      
      // 검색엔진 데이터 유효성 검사
      const validEngines = importData.filter(engine => {
        return engine && engine.id && engine.name && engine.url && engine.url.includes('%s');
      });
      
      if (validEngines.length === 0) {
        showStatus('가져올 수 있는 유효한 검색엔진이 없습니다.', 'error');
        return;
      }
      
      // Google 검색엔진이 없으면 추가
      const hasGoogle = validEngines.some(engine => engine.id === 'google');
      if (!hasGoogle) {
        validEngines.unshift({
          id: 'google',
          name: 'Google',
          url: 'https://www.google.com/search?q=%s',
          icon: 'http://www.google.com/s2/favicons?domain=https://www.google.com',
          isDefault: true
        });
      }
      
      // 확인 모달 표시
      elements.confirmMessage.innerHTML = `
        <strong>${validEngines.length}개의 검색엔진</strong>을 가져오시겠습니까?<br>
        <small style="color: #6b7280;">현재 설정이 대체됩니다.</small>
      `;
      
      currentConfirmAction = async () => {
        try {
          searchEngines = validEngines;
          await chrome.storage.sync.set({ searchEngines: searchEngines });
          renderEnginesList();
          hideConfirmModal();
          showStatus(`${validEngines.length}개의 검색엔진을 성공적으로 가져왔습니다.`, 'success');
          
          // 모든 탭에 업데이트 알림
          notifyAllTabsUpdate();
        } catch (error) {
          console.error('가져오기 저장 실패:', error);
          showStatus('설정 가져오기에 실패했습니다.', 'error');
        }
      };
      
      showConfirmModal();
      
    } catch (error) {
      console.error('파일 읽기 실패:', error);
      showStatus('파일을 읽을 수 없습니다. 올바른 JSON 파일인지 확인해주세요.', 'error');
    }
  };
  
  reader.readAsText(file);
  // 파일 입력 초기화 (같은 파일 다시 선택 가능하도록)
  event.target.value = '';
}

// 설정 로드
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['layoutSetting', 'popupDistance']);
    
    // 레이아웃 설정 로드
    layoutSetting = result.layoutSetting || 'horizontal';
    if (layoutSetting === 'horizontal') {
      elements.layoutHorizontal.checked = true;
    } else if (layoutSetting === 'grid') {
      elements.layoutGrid.checked = true;
    }
    
    // 팝업 거리 설정 로드
    popupDistance = result.popupDistance || 15;
    elements.popupDistance.value = popupDistance;
    elements.popupDistanceValue.textContent = `${popupDistance}px`;
    
    console.log('설정 로드 완료:', { layoutSetting, popupDistance });
  } catch (error) {
    console.error('설정 로드 실패:', error);
    // 기본값으로 설정
    layoutSetting = 'horizontal';
    popupDistance = 15;
    elements.layoutHorizontal.checked = true;
    elements.popupDistance.value = popupDistance;
    elements.popupDistanceValue.textContent = `${popupDistance}px`;
  }
}

// 레이아웃 설정 변경 처리
async function handleLayoutChange(event) {
  const newLayout = event.target.value;
  layoutSetting = newLayout;
  
  try {
    // 즉시 저장
    await chrome.storage.sync.set({ layoutSetting: layoutSetting });
    console.log('레이아웃 설정 저장 완료:', layoutSetting);
    
    // 모든 탭에 레이아웃 변경 알림
    await notifyAllTabsLayoutUpdate();
    
    showStatus('표시 설정이 저장되었습니다.', 'success');
  } catch (error) {
    console.error('레이아웃 설정 저장 실패:', error);
    showStatus('설정 저장에 실패했습니다.', 'error');
  }
}

// 팝업 거리 설정 변경 처리
async function handlePopupDistanceChange(event) {
  const newDistance = parseInt(event.target.value);
  popupDistance = newDistance;
  
  // 실시간으로 표시값 업데이트
  elements.popupDistanceValue.textContent = `${newDistance}px`;
  
  try {
    // 즉시 저장
    await chrome.storage.sync.set({ popupDistance: popupDistance });
    console.log('팝업 거리 설정 저장 완료:', popupDistance);
    
    // 모든 탭에 팝업 거리 변경 알림
    await notifyAllTabsPopupDistanceUpdate();
  } catch (error) {
    console.error('팝업 거리 설정 저장 실패:', error);
  }
}

// 모든 탭에 레이아웃 업데이트 알림
async function notifyAllTabsLayoutUpdate() {
  try {
    await chrome.runtime.sendMessage({ 
      action: 'notifyAllTabs', 
      type: 'layoutUpdate',
      layoutSetting: layoutSetting 
    });
    console.log('모든 탭 레이아웃 업데이트 알림 완료');
  } catch (error) {
    console.log('탭 레이아웃 업데이트 알림 실패 (정상):', error.message);
  }
}

// 모든 탭에 팝업 거리 업데이트 알림
async function notifyAllTabsPopupDistanceUpdate() {
  try {
    await chrome.runtime.sendMessage({ 
      action: 'notifyAllTabs', 
      type: 'popupDistanceUpdate',
      popupDistance: popupDistance
    });
    console.log('모든 탭 팝업 거리 업데이트 알림 완료');
  } catch (error) {
    console.log('탭 팝업 거리 업데이트 알림 실패 (정상):', error.message);
  }
} 