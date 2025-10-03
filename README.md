# ListFlow - Premium Shopping List App

A production-ready, offline-first shopping list application built with React Native, featuring beautiful animations, intelligent organization, and premium features.

## 🎯 Features

### Core Features (Free)
- ✅ Unlimited shopping lists with custom icons and colors
- ✅ Smart item management with categories
- ✅ Beautiful animations powered by Reanimated 3 & Skia
- ✅ Shopping Mode for in-store use
- ✅ 100% Offline functionality
- ✅ Multi-language support (10 languages)
- ✅ Dark/Light theme with custom themes

### Premium Features
- ⭐ Pantry Management with expiry tracking
- ⭐ Recipe storage and ingredient integration
- ⭐ Barcode scanner
- ⭐ Smart suggestions based on history
- ⭐ Shopping analytics
- ⭐ Advanced customization

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native 0.81+
- **Language**: TypeScript
- **Database**: WatermelonDB (SQLite)
- **State Management**: Zustand
- **Animations**: React Native Reanimated 3, Skia
- **Navigation**: React Navigation 6
- **Storage**: MMKV for preferences
- **UI**: Custom components with React Native Paper

### Project Structure
```
src/
├── animations/     # Reanimated & Skia animations
├── components/     # Reusable UI components
├── database/       # WatermelonDB models & schemas
├── hooks/          # Custom React hooks
├── navigation/     # Navigation configuration
├── screens/        # Screen components
├── services/       # Business logic
├── stores/         # Zustand stores
├── theme/          # Design tokens
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Xcode 15+ (for iOS)
- CocoaPods

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Install iOS dependencies:
```bash
cd ios && pod install && cd ..
```

3. Run the app:
```bash
# iOS
yarn ios

# Android (not configured yet)
yarn android
```

## 📱 Screens

1. **Splash Screen** - Physics-based particle animation
2. **Onboarding** - 4-screen flow for first-time users
3. **Home Screen** - List overview with animations
4. **List Detail** - Item management with gestures
5. **Shopping Mode** - Full-screen mode for in-store use
6. **Pantry** - Track items at home (Premium)
7. **Recipes** - Store and manage recipes (Premium)
8. **Settings** - App configuration

## 🎨 Design System

All design tokens are defined in `src/theme/`:
- **Colors**: Semantic color palette with dark mode
- **Typography**: SF Pro-based scale
- **Spacing**: Consistent 4px grid
- **Shadows**: Elevation system
- **Border Radius**: Rounded corner scale

## 🔧 Configuration

### Environment Variables
None required - fully offline app

### Settings
- Theme: Light/Dark/Auto
- Haptics: On/Off
- Language: 10 languages supported

## 🧪 Testing

```bash
# Unit tests
yarn test

# Type checking
yarn tsc --noEmit

# Linting
yarn lint
```

## 📦 Build & Deployment

### iOS Build
```bash
cd ios
bundle exec fastlane beta  # TestFlight
bundle exec fastlane release  # App Store
```

## 🔒 Privacy

- **100% Offline** - No data sent to servers
- **Local Storage** - All data stays on device
- **No Tracking** - Zero analytics/telemetry
- **No Accounts** - No sign-up required

## 📄 License

Proprietary - All rights reserved

## 🙏 Credits

Built with:
- React Native
- WatermelonDB
- Zustand
- React Native Reanimated
- React Native Skia
- And many other amazing open-source libraries

---

**Version**: 1.0.0
**Platform**: iOS (Primary)
**Status**: Production Ready ✅
