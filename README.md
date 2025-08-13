# Daily Bible Verse - buat dedek wulan yey💗💗💗

Aplikasi web Progressive Web App (PWA) yang dibuat khusus untuk dedek wulann sebagai hadiah spiritual penuh kasih. Menampilkan ayat-ayat Alkitab Katolik harian dengan desain forest theme yang menenangkan.

## ✨ Features

- 📱 **Progressive Web App (PWA)** - Install sebagai widget di home screen
- 🌲 **Forest Theme** - Background natural yang menenangkan
- 📖 **400+ Ayat Alkitab Katolik** - Koleksi lengkap untuk setahun penuh
- 🔄 **Smart Daily Algorithm** - Ayat acak tapi konsisten, coverage 365+ hari tanpa repeat
- 📋 **Copy to Clipboard** - Mudah berbagi ayat dengan orang lain
- 🌐 **Offline Support** - Bekerja tanpa internet setelah install
- 📱 **Mobile Optimized** - Responsive design untuk semua perangkat
- ⚡ **Fast Loading** - Optimized performance dengan caching

## 📱 PWA Installation

### Desktop

1. Buka aplikasi di browser
2. Klik icon install di address bar
3. Atau klik tombol "Install" yang muncul

### Mobile (Android/iOS)

1. Buka aplikasi di browser mobile
2. Tap "Add to Home Screen" dari menu browser
3. Aplikasi akan muncul sebagai widget di home screen

## 🎨 Design Features

### Color Palette

- **Forest Dark**: `#1a2f1a` - Deep forest shadows
- **Forest Medium**: `#2d4a2d` - Mid-tone greens
- **Forest Light**: `#4a6b4a` - Lighter forest green
- **Text Light**: `#f8f9fa` - Clean white text
- **Accent Gold**: `#d4af37` - Elegant gold accent

### Typography

- **Primary Font**: 'Crimson Text' (serif) - Untuk ayat yang elegant
- **Secondary Font**: 'Inter' (sans-serif) - Untuk UI elements

### Widget Optimization

- **2x2 Grid Size** - Perfect balance, tidak terlalu besar/kecil
- **Smart Text Truncation** - Show 2-3 lines dengan "..." untuk ayat panjang
- **Touch-Friendly** - Minimum 44px button sizes
- **Quick Access** - Tap widget untuk buka full app

## 🔧 Technical Stack

- **Frontend**: React 18 + Vite
- **Styling**: Bootstrap 5 + Custom CSS
- **PWA**: Service Worker + Web App Manifest
- **Performance**: Memoization, lazy loading, code splitting
- **Offline**: LocalStorage + IndexedDB + Cache API

## 📂 Project Structure

```
daily-bible-verse/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icon-*.svg             # App icons
├── src/
│   ├── components/            # React components
│   │   ├── PersonalGreeting.jsx
│   │   ├── DailyVerse.jsx
│   │   ├── CopyButton.jsx
│   │   ├── OfflineIndicator.jsx
│   │   └── PWAInstallPrompt.jsx
│   ├── data/
│   │   └── bibleVerses.js     # Bible verses database
│   ├── hooks/
│   │   ├── useNetworkStatus.js
│   │   └── usePWAInstall.js
│   ├── utils/
│   │   ├── dateUtils.js       # Date utilities
│   │   ├── verseSelector.js   # Verse selection logic
│   │   ├── offlineStorage.js  # Offline storage
│   │   └── performance.js     # Performance utilities
│   ├── styles/
│   │   └── main.css           # Main styles
│   └── App.jsx                # Main app component
└── package.json
```

## 📱 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Privacy & Security

- ❌ **No data collection** - Tidak ada tracking atau analytics
- ❌ **No external API calls** - Semua data tersimpan lokal
- ❌ **No authentication** - Tidak perlu login atau registrasi
- ✅ **HTTPS required** - Untuk PWA functionality
- ✅ **Offline-first** - Data tersimpan aman di device

## 💝 Special Message buat dedek wulan yey

Aplikasi ini dibuat dengan penuh kasih untuk dedek wulan yeyy💗💗💗. Semoga setiap ayat yang muncul dapat memberikan semangat, kedamaian, dan keberkahan dalam setiap hari. Tuhan Yesus memberkati dedek wulan yey!💗💗💗

## 📄 License

Made with ❤️ by mas daprut for dedek wulan cantikk💗💗💗

---

_"Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal."_ - Yohanes 3:16
