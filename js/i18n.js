/**
 * i18n (Internationalization) Helper Functions
 * Chrome Extension 다국어 지원을 위한 유틸리티 함수들
 */

// 현재 설정된 언어 가져오기
let currentLanguage = null;

// 지원하는 언어 목록
const SUPPORTED_LANGUAGES = ['ko', 'en'];
const DEFAULT_LANGUAGE = 'ko';

/**
 * 메시지 가져오기 (chrome.i18n.getMessage 래퍼)
 * @param {string} key - 메시지 키
 * @param {string|string[]} substitutions - 치환할 값들
 * @returns {string} 번역된 메시지
 */
function getMessage(key, substitutions = null) {
  try {
    if (chrome && chrome.i18n && chrome.i18n.getMessage) {
      const message = chrome.i18n.getMessage(key, substitutions);
      return message || key; // 메시지가 없으면 키 자체를 반환
    }
  } catch (error) {
    console.warn('i18n getMessage 오류:', error);
  }
  return key; // 폴백: 키 자체를 반환
}

/**
 * 현재 UI 언어 가져오기
 * @returns {string} 언어 코드 (ko, en)
 */
function getCurrentLanguage() {
  if (currentLanguage) {
    return currentLanguage;
  }
  
  try {
    if (chrome && chrome.i18n && chrome.i18n.getUILanguage) {
      const browserLang = chrome.i18n.getUILanguage();
      currentLanguage = browserLang.startsWith('ko') ? 'ko' : 'en';
    } else {
      currentLanguage = DEFAULT_LANGUAGE;
    }
  } catch (error) {
    console.warn('언어 감지 오류:', error);
    currentLanguage = DEFAULT_LANGUAGE;
  }
  
  return currentLanguage;
}

/**
 * 사용자 설정 언어 가져오기
 * @returns {Promise<string>} 설정된 언어 코드
 */
async function getUserLanguage() {
  try {
    const result = await chrome.storage.sync.get('userLanguage');
    return result.userLanguage || getCurrentLanguage();
  } catch (error) {
    console.warn('사용자 언어 설정 로드 오류:', error);
    return getCurrentLanguage();
  }
}

/**
 * 사용자 언어 설정 저장
 * @param {string} language - 언어 코드
 * @returns {Promise<void>}
 */
async function setUserLanguage(language) {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    console.warn('지원하지 않는 언어:', language);
    return;
  }
  
  try {
    await chrome.storage.sync.set({ userLanguage: language });
    currentLanguage = language;
    console.log('언어 설정 저장:', language);
  } catch (error) {
    console.error('언어 설정 저장 오류:', error);
  }
}

/**
 * HTML 요소에 i18n 적용
 * data-i18n 속성을 가진 요소들의 텍스트를 번역
 * @param {Element} rootElement - 루트 요소 (기본: document)
 */
function applyI18nToElement(rootElement = document) {
  const elements = rootElement.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translatedText = getMessage(key);
    
    // 요소 타입에 따라 적절한 속성에 설정
    if (element.tagName === 'INPUT') {
      if (element.type === 'button' || element.type === 'submit') {
        element.value = translatedText;
      } else {
        element.placeholder = translatedText;
      }
    } else {
      element.textContent = translatedText;
    }
  });
  
  // data-i18n-attr 속성을 가진 요소들의 속성 번역
  const attrElements = rootElement.querySelectorAll('[data-i18n-attr]');
  attrElements.forEach(element => {
    const attrData = element.getAttribute('data-i18n-attr');
    try {
      const attrs = JSON.parse(attrData);
      Object.keys(attrs).forEach(attr => {
        const key = attrs[attr];
        element.setAttribute(attr, getMessage(key));
      });
    } catch (error) {
      console.warn('i18n 속성 파싱 오류:', error);
    }
  });
}

/**
 * 검색 관련 텍스트 생성
 * @param {string} engineName - 검색엔진 이름
 * @returns {object} 검색 관련 텍스트들
 */
function getSearchTexts(engineName) {
  return {
    searchWith: engineName + getMessage('searchWith'),
    searching: engineName + ' ' + getMessage('searching')
  };
}

/**
 * 동적으로 생성되는 요소의 텍스트 설정
 * @param {string} key - 메시지 키
 * @param {string|string[]} substitutions - 치환할 값들
 * @returns {string} 번역된 텍스트
 */
function getText(key, substitutions = null) {
  return getMessage(key, substitutions);
}

/**
 * 언어 변경 시 페이지 새로고침 필요 여부 확인
 * @param {string} newLanguage - 새 언어
 * @returns {boolean} 새로고침 필요 여부
 */
function needsReload(newLanguage) {
  return getCurrentLanguage() !== newLanguage;
}

/**
 * 페이지 초기화 시 i18n 적용
 */
function initializeI18n() {
  // DOM이 준비되면 i18n 적용
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyI18nToElement();
    });
  } else {
    applyI18nToElement();
  }
}

// 전역 객체에 i18n 함수들 등록 (다른 스크립트에서 사용 가능)
if (typeof window !== 'undefined') {
  window.i18n = {
    getMessage,
    getCurrentLanguage,
    getUserLanguage,
    setUserLanguage,
    applyI18nToElement,
    getSearchTexts,
    getText,
    needsReload,
    initializeI18n,
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE
  };
}

// CommonJS/Node.js 환경 지원
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getMessage,
    getCurrentLanguage,
    getUserLanguage,
    setUserLanguage,
    applyI18nToElement,
    getSearchTexts,
    getText,
    needsReload,
    initializeI18n,
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE
  };
}