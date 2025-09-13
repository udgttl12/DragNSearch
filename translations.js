// translations.js - 커스텀 번역 시스템

const translations = {
  en: {
    // Extension metadata
    extensionName: "Drag & Drop Search",
    extensionDescription: "Search text instantly by dragging and dropping to various search engines",

    // Popup
    popupTitle: "🔍 Drag & Drop Search",
    popupSubtitle: "Quick search by text dragging",
    featureDragText: "Search engine icons appear when you drag text",
    featureClickDrag: "Click icon or drag text to search",
    featureCustomEngine: "Add custom search engines",
    featureContextMenu: "Also available in right-click menu",
    optionsButton: "⚙️ Settings",
    testButton: "🧪 Test Feature",

    // Options page
    optionsTitle: "Drag & Drop Search - Settings",
    optionsSubtitle: "Search Engine Management & Settings",
    languageSettings: "Language Settings",
    selectLanguage: "Select Language",
    languageEnglish: "English",
    languageKorean: "한국어",

    // Search engine management
    searchEngineManagement: "Search Engine Management",
    searchEngineName: "Search Engine Name",
    searchEngineNamePlaceholder: "e.g: Google, Naver",
    searchEngineUrl: "Search URL",
    searchEngineUrlPlaceholder: "https://www.google.com/search?q=%s",
    searchEngineUrlHint: "%s will be replaced with search terms",
    useExistingIcon: "Use existing search engine icon",
    useExistingIconHint: "Automatically get icon from the site",
    searchEngineIcon: "Icon URL (Optional)",
    searchEngineIconPlaceholder: "https://example.com/icon.png",
    searchEngineIconHint: "Only enter when not using existing icon",
    addSearchEngine: "Add Search Engine",

    // Display settings
    displaySettings: "Search Engine Display Settings",
    layoutOnDrag: "Search Engine Layout on Drag",
    layoutHorizontal: "Horizontal Layout",
    layoutHorizontalDesc: "Display search engines in a horizontal line",
    layoutGrid: "Grid Layout",
    layoutGridDesc: "Grid size adjusts automatically based on number of search engines",
    layoutGridSizes: "1-4: 2x2 • 5-9: 3x3 • 10-16: 4x4 • 17-25: 5x5 • 26+: 6x6",
    popupDisplayDistance: "Popup Display Distance",
    popupDistanceLabel: "Distance from dragged text to popup",
    popupDistanceDesc: "Adjustable from 5px (close) to 100px (far) in 5px increments",

    // Data management
    dataManagement: "Data Management",
    backupRestore: "Backup & Restore",
    exportSettings: "Export Settings (JSON)",
    importSettings: "Import Settings (JSON)",
    backupDescription: "You can backup or restore search engine settings as JSON files.",
    warningTitle: "⚠️ Important Notice",
    warningBackupTitle: "Please backup your settings before deleting the extension!",
    warningBackupDesc: "All registered search engine information will be permanently deleted when you delete the extension. Please save a backup using the \"Export Settings\" button above before deleting.",
    warningRestoreDesc: "After backing up and reinstalling the extension, you can restore all search engines using \"Import Settings\".",

    // Engine list
    registeredEngines: "Registered Search Engines",
    editButton: "Edit",
    deleteButton: "Delete",
    requiredBadge: "Required",
    defaultBadge: "Default",
    noEnginesMessage: "No search engines registered.",

    // Buttons and actions
    resetToDefault: "Reset to Default",
    saveSettings: "Save",
    cancelButton: "Cancel",
    confirmButton: "Confirm",

    // Modals
    confirmTitle: "Confirm",
    editEngineTitle: "Edit Search Engine",

    // Status messages
    settingsSaved: "Settings saved successfully",
    engineAdded: "Search engine added successfully",
    engineUpdated: "Search engine updated successfully",
    engineDeleted: "Search engine deleted successfully",
    resetCompleted: "Reset to default settings completed",
    settingsExported: "Settings exported successfully",
    settingsImported: "Settings imported successfully",

    // Error messages
    errorInvalidUrl: "Please enter a valid URL",
    errorMissingPlaceholder: "Search URL must contain %s placeholder",
    errorEmptyName: "Please enter search engine name",
    errorDuplicateName: "A search engine with this name already exists",
    errorInvalidJsonFile: "Please select a valid JSON file",
    errorInvalidFileFormat: "Invalid file format. Please select a valid JSON file",

    // Confirm messages
    confirmReset: "Are you sure you want to reset all settings to default? This action cannot be undone.",
    confirmDelete: "Are you sure you want to delete this search engine?",
    confirmImport: "Would you like to import {count} search engines?\nCurrent settings will be replaced.",

    // Context menu
    contextMenuTitle: "Drag & Drop Search"
  },

  ko: {
    // Extension metadata
    extensionName: "Drag & Drop Search",
    extensionDescription: "텍스트를 드래그하여 다양한 검색엔진에서 즉시 검색할 수 있는 확장 기능",

    // Popup
    popupTitle: "🔍 Drag & Drop Search",
    popupSubtitle: "텍스트를 드래그하여 빠른 검색",
    featureDragText: "텍스트를 드래그하면 검색 아이콘이 나타납니다",
    featureClickDrag: "아이콘을 클릭하거나 드래그하여 검색",
    featureCustomEngine: "사용자 정의 검색엔진 추가 가능",
    featureContextMenu: "우클릭 메뉴에서도 사용 가능",
    optionsButton: "⚙️ 설정",
    testButton: "🧪 기능 테스트",

    // Options page
    optionsTitle: "Drag & Drop Search - 설정",
    optionsSubtitle: "검색엔진 관리 및 설정",
    languageSettings: "언어 설정",
    selectLanguage: "언어 선택",
    languageEnglish: "English",
    languageKorean: "한국어",

    // Search engine management
    searchEngineManagement: "검색엔진 관리",
    searchEngineName: "검색엔진 이름",
    searchEngineNamePlaceholder: "예: Google, Naver",
    searchEngineUrl: "검색 URL",
    searchEngineUrlPlaceholder: "https://www.google.com/search?q=%s",
    searchEngineUrlHint: "%s는 검색어로 대체됩니다",
    useExistingIcon: "기존 검색엔진 아이콘 등록하기",
    useExistingIconHint: "체크하면 사이트에서 자동으로 아이콘을 가져옵니다",
    searchEngineIcon: "아이콘 URL (선택사항)",
    searchEngineIconPlaceholder: "https://example.com/icon.png",
    searchEngineIconHint: "기존 아이콘을 사용하지 않을 때만 입력하세요",
    addSearchEngine: "검색엔진 추가",

    // Display settings
    displaySettings: "검색엔진 표시 설정",
    layoutOnDrag: "드래그 시 검색엔진 배치",
    layoutHorizontal: "가로 배치",
    layoutHorizontalDesc: "검색엔진을 한 줄로 가로로 표시합니다",
    layoutGrid: "그리드 배치",
    layoutGridDesc: "검색엔진 개수에 따라 자동으로 격자 크기가 조정됩니다",
    layoutGridSizes: "1-4개: 2x2 • 5-9개: 3x3 • 10-16개: 4x4 • 17-25개: 5x5 • 26개 이상: 6x6",
    popupDisplayDistance: "팝업 표시 거리",
    popupDistanceLabel: "드래그한 텍스트에서 팝업까지의 거리",
    popupDistanceDesc: "5픽셀(가까움) ~ 100픽셀(멀리) 사이에서 5픽셀 단위로 조정할 수 있습니다",

    // Data management
    dataManagement: "데이터 관리",
    backupRestore: "백업 및 복원",
    exportSettings: "설정 내보내기 (JSON)",
    importSettings: "설정 가져오기 (JSON)",
    backupDescription: "검색엔진 설정을 JSON 파일로 백업하거나 복원할 수 있습니다.",
    warningTitle: "⚠️ 중요 알림",
    warningBackupTitle: "확장프로그램을 삭제하기 전에 반드시 설정을 백업하세요!",
    warningBackupDesc: "확장프로그램을 삭제하면 등록한 모든 검색엔진 정보가 영구적으로 삭제됩니다. 삭제 전에 위의 \"설정 내보내기\" 버튼을 사용하여 JSON 파일로 백업을 저장하시기 바랍니다.",
    warningRestoreDesc: "백업 후 확장프로그램을 재설치하면 \"설정 가져오기\"로 모든 검색엔진을 복원할 수 있습니다.",

    // Engine list
    registeredEngines: "등록된 검색엔진",
    editButton: "편집",
    deleteButton: "삭제",
    requiredBadge: "필수",
    defaultBadge: "기본",
    noEnginesMessage: "등록된 검색엔진이 없습니다.",

    // Buttons and actions
    resetToDefault: "기본값으로 초기화",
    saveSettings: "저장",
    cancelButton: "취소",
    confirmButton: "확인",

    // Modals
    confirmTitle: "확인",
    editEngineTitle: "검색엔진 편집",

    // Status messages
    settingsSaved: "설정이 저장되었습니다",
    engineAdded: "검색엔진이 추가되었습니다",
    engineUpdated: "검색엔진이 수정되었습니다",
    engineDeleted: "검색엔진이 삭제되었습니다",
    resetCompleted: "기본값으로 초기화가 완료되었습니다",
    settingsExported: "설정이 내보내기되었습니다",
    settingsImported: "설정이 가져오기되었습니다",

    // Error messages
    errorInvalidUrl: "올바른 URL을 입력해주세요",
    errorMissingPlaceholder: "검색 URL에 %s 플레이스홀더가 포함되어야 합니다",
    errorEmptyName: "검색엔진 이름을 입력해주세요",
    errorDuplicateName: "동일한 이름의 검색엔진이 이미 존재합니다",
    errorInvalidJsonFile: "올바른 JSON 파일을 선택해주세요",
    errorInvalidFileFormat: "잘못된 파일 형식입니다. 올바른 JSON 파일을 선택해주세요",

    // Confirm messages
    confirmReset: "모든 설정을 기본값으로 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    confirmDelete: "이 검색엔진을 삭제하시겠습니까?",
    confirmImport: "{count}개의 검색엔진을 가져오시겠습니까?\n현재 설정이 대체됩니다.",

    // Context menu
    contextMenuTitle: "Drag & Drop Search"
  }
};

// 현재 언어 가져오기
function getCurrentLanguage() {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['selectedLanguage']).then(result => {
        resolve(result.selectedLanguage || 'en');
      }).catch(() => {
        resolve('en');
      });
    } else {
      resolve('en');
    }
  });
}

// 번역 가져오기
function getMessage(key, currentLang = 'en') {
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

// 전역으로 내보내기
if (typeof window !== 'undefined') {
  window.translations = translations;
  window.getCurrentLanguage = getCurrentLanguage;
  window.getMessage = getMessage;
}