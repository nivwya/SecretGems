<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="https://hiddengemsbw.s3.us-east-2.amazonaws.com/1691961203307_logo.png" alt="Logo" height="70">

  <h3 align="center">SecretGems</h3>
  <p align="center">Find and share the best local stores, budget-friendly restaurants, and exciting events around you</p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

A beautiful, modern web app for cataloging and discovering your favorite small stores, budget-friendly restaurants, and local events. Share secret gems in your area and explore recommendations from others!

## Live Demo

> https://secretgems.netlify.app/

### Features:

-  **Add Gems**: Share your favorite places and events with details, ratings, and images.
-  **Explore**: Search and filter gems by type, location (city/state/country), and budget.
-  **Dashboard**: View your added gems, stats, and manage your collection.
-  **Image Uploads**: Images are hosted via Imgur for easy sharing.
-  **Authentication**: Register or sign in with email/password (or try anonymous login).
-  **Responsive UI**: Modern, mobile-friendly design with a golden-blue aesthetic.
-  **Demo Mode**: Try the app without Firebase setup (data is not saved).

## 🛠 Tech Stack

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

 ![Home Page](https://raw.githubusercontent.com/nivwya/SecretGems/2592d8e516719239e7a2e74ae7c29040159baa24/Screenshot%202025-06-24%20202057.png)
 ![Home Screenshot](https://raw.githubusercontent.com/nivwya/SecretGems/2592d8e516719239e7a2e74ae7c29040159baa24/Screenshot%202025-06-24%20202140.png)
<img width="350" alt="Screen Shot 2023-08-12 at 10 02 29 PM" src="https://raw.githubusercontent.com/nivwya/SecretGems/2592d8e516719239e7a2e74ae7c29040159baa24/Screenshot%202025-06-24%20202218.png">
<img width="350" alt="Screen Shot 2023-08-12 at 10 02 29 PM" src="https://raw.githubusercontent.com/nivwya/SecretGems/2592d8e516719239e7a2e74ae7c29040159baa24/Screenshot%202025-06-24%20202242.png">
![Home Screenshot](https://raw.githubusercontent.com/nivwya/SecretGems/2592d8e516719239e7a2e74ae7c29040159baa24/Screenshot%202025-06-24%20202340.png)

##  How to Use

### Adding a Hidden Gem
1. Click "Add Gem" in the navigation
2. Fill out the form with:
   - Name of the place/event
   - Type (store, restaurant, event)
   - Location (city and state)
   - Budget level (₹, ₹₹, ₹₹₹)
   - Description
   - Optional photo
   - Your rating (1-5 stars)
3. Click "Add Gem" to save

### Exploring Gems
1. Use the search bar on the home page
2. Visit the "Explore" page for advanced filtering
3. Filter by:
   - Category (store, restaurant, event)
   - Budget level
   - Sort by recent, rating, or name
4. Click on any gem card to view details

### Dashboard
- View your personal statistics
- See all gems you've added
- Track your average ratings and locations

##  Customization

### Colors and Styling
The app uses a beautiful purple gradient theme. To customize:

1. **Primary Colors**: Edit the CSS variables in `styles.css`
2. **Gradients**: Modify the `background` properties
3. **Fonts**: Change the Google Fonts import in `index.html`

### Adding New Features
- **User Authentication**: The Firebase Auth is already configured
- **Comments/Ratings**: Extend the gem data structure
- **Maps Integration**: Add location coordinates and map display
- **Social Sharing**: Implement share buttons for gems

## Next Steps

- [x] Add review/rating system
- [x] Add links to major cities
- [ ] Add page for users to see their own gems
- [ ] Make app compatible for mobile view
- [ ] Polish and deploy 🚀

##  License

This project is open source and available under the [MIT License](LICENSE).

##  Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Firebase configuration
3. Ensure all Firebase services are enabled
4. Check the network tab for failed requests

##  Future Enhancements

- [ ] User authentication and profiles
- [ ] Comments and reviews system
- [ ] Map integration with location pins
- [ ] Social sharing features
- [ ] Push notifications for new gems
- [ ] Advanced search with geolocation
- [ ] Mobile app versions
- [ ] Admin panel for moderation

**Built with ❤️ using HTML, CSS, JavaScript, Imgur API and Firebase** 
