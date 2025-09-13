// popup.js - 팝업 페이지의 JavaScript 로직

// i18n 관련 함수들
async function updateElementsWithI18n() {
  const currentLang = await getCurrentLanguage();
  const elementsWithI18n = document.querySelectorAll('[data-i18n]');
  elementsWithI18n.forEach(element => {
    const messageKey = element.getAttribute('data-i18n');
    element.textContent = getMessage(messageKey, currentLang);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // i18n 텍스트 업데이트
  updateElementsWithI18n();
  // 설정 버튼 이벤트
  const openOptionsBtn = document.getElementById('openOptions');
  if (openOptionsBtn) {
    openOptionsBtn.addEventListener('click', async () => {
      try {
        // 직접 chrome.runtime.openOptionsPage() 호출
        await chrome.runtime.openOptionsPage();
        window.close();
      } catch (error) {
        console.error('옵션 페이지 열기 실패:', error);
        // 대안: background script를 통한 메시지 전송
        chrome.runtime.sendMessage({ action: 'openOptions' });
        window.close();
      }
    });
  }

  // 테스트 버튼 이벤트
  const testFeatureBtn = document.getElementById('testFeature');
  if (testFeatureBtn) {
    testFeatureBtn.addEventListener('click', async () => {
      try {
        // 직접 chrome.tabs.create() 호출
        await chrome.tabs.create({ 
          url: 'https://ko.wikipedia.org/wiki/%EC%9C%84%ED%82%A4%EB%B0%B1%EA%B3%BC:%EB%8C%80%EB%AC%B8',
          active: true
        });
        window.close();
      } catch (error) {
        console.error('테스트 페이지 열기 실패:', error);
        // 대안: background script를 통한 메시지 전송
        chrome.runtime.sendMessage({ action: 'openTestPage' });
        window.close();
      }
    });
  }

  // 에러 처리를 위한 전역 에러 핸들러
  window.addEventListener('error', (event) => {
    console.error('팝업 에러:', event.error);
  });

  // Chrome runtime 에러 처리
  if (chrome.runtime.lastError) {
    console.error('Chrome runtime 에러:', chrome.runtime.lastError);
  }
}); 