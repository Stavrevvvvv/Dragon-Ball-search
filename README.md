# Dragon Ball KI Search App

A React application that lets users search and filter **Dragon Ball characters** by name and base **KI power level**. The app first attempts to load data from the public Dragon Ball API and automatically falls back to an offline dataset of 50 canonical characters if the API is unavailable.

## 🚀 Features
- 🔍 **Search by name** (with debounce for performance)
- 🔢 **Filter by KI** using numeric or text-based values (e.g., `7 million`, `Infinity`)
- 🌐 **Live API + Offline Fallback** for uninterrupted functionality
- 📄 **Client-side pagination**
- 🖼 **Image fallback** for broken external image links
- 🎨 **Responsive UI** with dark theme

## 🛠 Tech Stack
- **React (Vite)**
- **JavaScript (ES6+)**
- **CSS**

## 📦 Installation & Run Locally
```bash
npm install
npm run dev
```

## 📄 Description
This app demonstrates API integration, error handling, data normalization, offline resilience, and user interface filtering logic — aligned with frontend development best practices.
