# ShoppingListPro

A premium React Native shopping list application with advanced features including templates, multi-language support, theming, and offline-first architecture.

## 📱 Project Overview

**ShoppingListPro** (formerly ListFlow) is a comprehensive shopping list management app built with React Native. The app provides an intuitive interface for creating, managing, and organizing shopping lists with support for templates, categories, pantry management, and recipe integration.

### Key Features

- ✅ **Multi-List Management** - Create and manage multiple shopping lists simultaneously
- ✅ **Templates System** - Pre-defined and custom templates for quick list creation
- ✅ **Theming** - 4 beautiful themes (Light, Dark, Solar, Mono)
- ✅ **Multi-Language** - Support for 10 languages (EN, RU, ES, DE, FR, PT, JP, ZH, KO, UK)
- ✅ **Offline-First** - Full functionality without internet connection using WatermelonDB
- ✅ **Pantry Management** - Track pantry items with expiry dates
- ✅ **Haptic & Sound Feedback** - Enhanced user experience with tactile and audio cues
- ✅ **Recipe Integration** - Link recipes to shopping lists

## 🏗️ Technical Stack

### Core Technologies
- **React Native** (0.81.4) - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **WatermelonDB** - Offline-first reactive database
- **Zustand** - State management
- **React Navigation** - Navigation and routing
- **i18next** - Internationalization

### UI & Design
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch gestures
- **React Native Safe Area Context** - Handle device notches
- **FlashList** - High-performance lists

## 📂 Project Structure

```
ShoppingListPro/
├── src/
│   ├── components/        # Reusable UI components
│   ├── database/         # WatermelonDB models and schemas
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Screen components
│   ├── stores/           # Zustand state stores
│   ├── theme/            # Theme system and design tokens
│   ├── translations/     # i18n translation files
│   └── types/            # TypeScript type definitions
├── ios/                  # iOS native code
├── android/              # Android native code
└── App.tsx              # Main app entry point
```

## 🎨 Themes

The app supports 4 distinct themes:

1. **Light** - Classic clean interface
2. **Dark** - Easy on the eyes  
3. **Solar** - Warm yellow shades
4. **Mono** - Grayscale design

## 🌍 Supported Languages

🇬🇧 English | 🇷🇺 Russian | 🇪🇸 Spanish | 🇩🇪 German | 🇫🇷 French | 🇧🇷 Portuguese | 🇯🇵 Japanese | 🇨🇳 Chinese | 🇰🇷 Korean | 🇺🇦 Ukrainian

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.19.4
- npm or yarn
- Xcode (for iOS)
- CocoaPods

### Installation

\`\`\`bash
npm install
cd ios && pod install && cd ..
npm run ios
\`\`\`

## 📋 Development Tasks

### ✅ Completed
- [x] Theme system (4 variants)
- [x] Multi-language support (10 languages)
- [x] Settings screen with theme/sound/haptics
- [x] Template system with predefined templates
- [x] Navigation structure
- [x] Database setup
- [x] Lists management
- [x] Safe area handling

### 📝 TODO
- [ ] Shopping mode implementation
- [ ] Item management in lists
- [ ] Budget tracking
- [ ] Price history
- [ ] Barcode scanning
- [ ] Share functionality
- [ ] Cloud sync

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-03
