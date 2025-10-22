#Dragon Ball KI Search App

A React application that lets users search and filter Dragon Ball characters by name and base KI power level. The app first attempts to load data from the public Dragon Ball API and automatically falls back to an offline dataset of 50 canonical characters when the API is unavailable.

Features
	•	🔍 Search characters by name (debounced input)
	•	🔢 Filter using numeric or text-based KI values (e.g., 7 million, Infinity)
	•	⚡ API + Offline Fallback for reliability
	•	📄 Client-side pagination
	•	🖼 Image fallback for broken external links
	•	🎨 Responsive UI with dark theme

Tech Stack
	•	React (Vite)
	•	JavaScript (ES6+)
	•	CSS
