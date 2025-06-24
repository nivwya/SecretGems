<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="https://hiddengemsbw.s3.us-east-2.amazonaws.com/1691961203307_logo.png" alt="Logo" height="70">

  <h3 align="center">SecretGems</h3>
  <p align="center">Find and share the best local stores, budget-friendly restaurants, and exciting events around you</p>
</div>

<!-- ABOUT THE PROJECT -->

## ✨ About The Project

A beautiful, modern web app for cataloging and discovering your favorite small stores, budget-friendly restaurants, and local events. Share secret gems in your area and explore recommendations from others!

## 🚀 Live Demo

> [Add link here if deployed, e.g. GitHub Pages, Vercel, Netlify, etc.]

### ✨ Features:

- 📍 **Add Gems**: Share your favorite places and events with details, ratings, and images.
- 🔎 **Explore**: Search and filter gems by type, location (city/state/country), and budget.
- 👤 **Dashboard**: View your added gems, stats, and manage your collection.
- 🖼 **Image Uploads**: Images are hosted via Imgur for easy sharing.
- 🔐 **Authentication**: Register or sign in with email/password (or try anonymous login).
- 📱 **Responsive UI**: Modern, mobile-friendly design with a golden-blue aesthetic.
- 🧪 **Demo Mode**: Try the app without Firebase setup (data is not saved).

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase Firestore (database), Firebase Auth, Imgur API (image hosting)
- **Optional Map Picker**: Leaflet.js with OpenStreetMap

<!-- GETTING STARTED -->

## Getting Started

Follow these steps to set up the project locally. Make sure to have all the above technologies installed and updated to the latest version.

1. Clone this repository
2. Install required dependencies in root folder and `client` folder

```
npm install
```

3. Firebase Setup:
- Go to Firebase Console, create a new project.
- Enable Firestore Database and Authentication (Email/Password).
- In your project, click the gear icon > Project settings > General > Your apps > Firebase SDK snippet > Config.
- Copy the config object and create a file named firebase-config.js in the project root:
  
```
     // firebase-config.js
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
```
- Security Rules: Update Firestore rules for basic security (see below).

4. Imgur Setup:
- The app uses a public Imgur Client ID for image uploads. For production, register your own Imgur application and update the Client ID in script.js.
  
5. Run the app:
- Open index.html in your browser.

## 🖼️ Inside Look

- ![Home Page](https://imgur.com/ty8DN3D)
- ![Explore Page](https://i.imgur.com/your_explore.png)
- ![Add Gem Page](https://i.imgur.com/your_addgem.png)
- ![Dashboard](https://i.imgur.com/your_dashboard.png)

![Screen Shot 2023-08-13 at 6 17 17 PM]([https://imgur.com/ty8DN3D])
![Screen Shot 2023-08-12 at 10 01 12 PM](https://github.com/braydonwang/Hidden-Gems/assets/16049357/9790d63d-64cf-4bec-9724-72fcbe5763f8)
<img width="350" alt="Screen Shot 2023-08-12 at 10 02 29 PM" src="https://github.com/braydonwang/Hidden-Gems/assets/16049357/48decde8-7383-4930-a767-24f9709edeec">
<img width="350" alt="Screen Shot 2023-08-12 at 10 02 29 PM" src="https://github.com/braydonwang/Hidden-Gems/assets/16049357/3cb5e49a-bf78-4da4-b57c-4a34e6a7aded">

## Next Steps

- [x] Add review/rating system
- [x] Add links to major cities
- [ ] Add page for users to see their own gems
- [ ] Make app compatible for mobile view
- [ ] Polish and deploy 🚀
