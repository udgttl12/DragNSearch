# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 설정 (Language Setting)
이 프로젝트에서 작업할 때는 **한국어로 답변**해주세요. (Please respond in Korean when working on this project.)

## Project Overview
Chrome Extension (Manifest V3) for text search via drag & drop functionality. Users can select text on any webpage and quickly search using multiple search engines.

## Architecture

### Core Components
1. **background.js** - Service worker handling:
   - Context menu creation and updates
   - Storage synchronization for search engines
   - Tab communication for settings updates
   - Default search engines initialization

2. **content.js** - Content script injected into all pages:
   - Text selection detection
   - Search popup creation and positioning
   - Drag & drop functionality
   - Grid/horizontal layout switching
   - Dynamic popup distance adjustment (5-100px)

3. **options.js/html** - Settings management:
   - Search engine CRUD operations
   - Layout configuration (horizontal/grid)
   - Popup distance settings
   - Import/export functionality
   - Data persistence via chrome.storage.sync

### Message Communication Pattern
```javascript
// From background to content scripts:
chrome.tabs.sendMessage(tab.id, { action: 'updateEngines' })
chrome.tabs.sendMessage(tab.id, { action: 'updateLayout', layoutSetting: value })

// From content/options to background:
chrome.runtime.sendMessage({ action: 'getEngines' })
chrome.runtime.sendMessage({ action: 'saveEngines', engines: [...] })
```

## Development Commands
This is a pure JavaScript Chrome extension without build tools:
- **Load extension**: chrome://extensions/ → Developer mode → Load unpacked
- **Reload extension**: Click refresh button in chrome://extensions/
- **View background logs**: Click "Service Worker" link in extension card
- **Debug content script**: F12 on any webpage → Console

## Key Implementation Details

### Search Engine URL Format
All search URLs must include `%s` placeholder for search terms:
```javascript
'https://www.google.com/search?q=%s'
```

### Storage Structure
```javascript
{
  searchEngines: [
    {
      id: string,
      name: string,
      url: string,
      icon: string,
      isDefault: boolean // for built-in engines
    }
  ],
  layoutSetting: 'horizontal' | 'grid',
  popupDistance: number // 5-100, step 5
}
```

### Grid Layout Auto-sizing
- 1-4 engines: 2x2
- 5-9 engines: 3x3
- 10-16 engines: 4x4
- 17-25 engines: 5x5
- 26+ engines: 6x6

## Current Localization Status
Currently Korean-hardcoded. For i18n implementation:
1. Create `_locales/en/messages.json` and `_locales/ko/messages.json`
2. Add `"default_locale": "en"` to manifest.json
3. Replace hardcoded strings with `chrome.i18n.getMessage()`
4. Store language preference in chrome.storage

## Testing Checklist
- [ ] Text selection on various websites
- [ ] Search popup appearance and positioning
- [ ] All search engines functionality
- [ ] Context menu operations
- [ ] Settings persistence across browser restart
- [ ] Import/export functionality
- [ ] Layout switching (horizontal ↔ grid)
- [ ] Popup distance adjustment