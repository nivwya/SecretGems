# SecretGems
A beautiful, modern web app for cataloging and discovering your favorite small stores, budget-friendly restaurants, and local events. Share hidden gems in your area and explore recommendations from others!

✨ Features

•Add Gems: Share your favorite places and events with details, ratings, and images.

•Explore: Search and filter gems by type, location (city/state/country), and budget.

•Dashboard: View your added gems, stats, and manage your collection.

•Image Uploads: Images are hosted via Imgur for easy sharing.

•Authentication: Register or sign in with email/password (or as a guest).

•Responsive UI: Modern, mobile-friendly design with a golden-blue theme.

•Demo Mode: Try the app without Firebase setup (data is not saved).


🚀 Live Demo

> [Add link here if deployed, e.g. GitHub Pages, Vercel, Netlify, etc.]

🖼️ Screenshots

> [Add screenshots/gifs of the Home, Explore, Add Gem, and Dashboard pages]

🛠️ Tech Stack

•Frontend: HTML, CSS, JavaScript

•Backend: Firebase Firestore (for data), Imgur API (for images)

•Map Picker: Leaflet (OpenStreetMap)

📦 Setup & Installation

Clone the repository:
Apply to index.html
Run
Install dependencies:
No build step required; all dependencies are loaded via CDN.
Firebase Setup:
Go to Firebase Console, create a new project.
Enable Firestore Database and Authentication (Email/Password).
In your project, click the gear icon > Project settings > General > Your apps > Firebase SDK snippet > Config.
Copy the config object and create a file named firebase-config.js in the project root:
Apply to index.html
Security Rules: Update Firestore rules for basic security (see below).
Imgur Setup:
The app uses a public Imgur Client ID for image uploads. For production, register your own Imgur application and update the Client ID in script.js.
Run the app:
Open index.html in your browser.
