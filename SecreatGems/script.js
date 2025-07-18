// Firebase Configuration
// The config is now in firebase-config.js for easier setup
// If you haven't set up Firebase yet, the app will show a setup message

console.log('🚀 Hidden Gems App - Script Loading...');

// Remove duplicate declaration of firebaseConfig
// let firebaseConfig;
let isDemoMode = false;

// Try to load config from external file
try {
    // Check if firebaseConfig is available from firebase-config.js
    if (typeof firebaseConfig !== 'undefined') {
        console.log('✅ Firebase config loaded from external file');
    } else {
        console.log('⚠️ Firebase config not found. Running in demo mode');
        isDemoMode = true;
    }
} catch (error) {
    console.error('❌ Firebase config error:', error);
    isDemoMode = true;
}

// Initialize Firebase
let db, storage, auth;
if (firebaseConfig && !isDemoMode) {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        storage = firebase.storage();
        auth = firebase.auth();
        console.log('✅ Firebase initialized successfully');
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        isDemoMode = true;
    }
} else {
    console.log('🎭 Running in demo mode with sample data');
    isDemoMode = true;
}

// Show setup message if Firebase is not configured
function showFirebaseSetupMessage() {
    const setupMessage = `
        <div style="text-align: center; padding: 50px; background: white; border-radius: 15px; margin: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h2>🚀 Welcome to Hidden Gems!</h2>
            <p>To get started, you need to set up Firebase:</p>
            <ol style="text-align: left; max-width: 500px; margin: 20px auto;">
                <li>Go to <a href="https://console.firebase.google.com/" target="_blank">Firebase Console</a></li>
                <li>Create a new project</li>
                <li>Enable Firestore Database and Storage</li>
                <li>Copy your config to <code>firebase-config.js</code></li>
                <li>Update the security rules as mentioned in README.md</li>
            </ol>
            <p><strong>Need help?</strong> Check the README.md file for detailed instructions.</p>
            <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px;">Try Demo Mode</button>
        </div>
    `;
    
    document.body.innerHTML = setupMessage;
}

// Global Variables
let currentUser = null;
let allGems = [];
let filteredGems = [];

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const typeFilter = document.getElementById('typeFilter');
const locationFilter = document.getElementById('locationFilter');
const exploreTypeFilter = document.getElementById('exploreTypeFilter');
const budgetFilter = document.getElementById('budgetFilter');
const sortFilter = document.getElementById('sortFilter');
const addGemForm = document.getElementById('addGemForm');
const gemModal = document.getElementById('gemModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close');
const loadingSpinner = document.getElementById('loadingSpinner');

// DOM elements for auth
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const navUser = document.getElementById('navUser');
const userProfile = document.getElementById('userProfile');
const userPhoto = document.getElementById('userPhoto');
const userName = document.getElementById('userName');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const dashboardNavItem = document.querySelector('.nav-item a[href="#dashboard"]')?.parentElement;
const logoutNavItem = document.getElementById('logoutNavItem');
const logoutConfirmModal = document.getElementById('logoutConfirmModal');
const logoutYesBtn = document.getElementById('logoutYesBtn');
const logoutNoBtn = document.getElementById('logoutNoBtn');

// Remove all Google Auth and user profile logic. Dashboard is always visible.
// No login/logout, no user info, no Google Auth state changes.
// Remove all related event listeners and variables.
// Only keep dashboardNavItem logic to ensure dashboard is always visible.
if (dashboardNavItem) dashboardNavItem.classList.remove('dashboard-hidden');

// Navigation
function showPage(pageId) {
    console.log(`🔄 Switching to page: ${pageId}`);
    
    pages.forEach(page => page.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    const targetLink = document.querySelector(`[href="#${pageId}"]`);
    
    if (targetPage) {
        targetPage.classList.add('active');
        console.log(`✅ Page ${pageId} activated`);
    } else {
        console.error(`❌ Page ${pageId} not found!`);
    }
    
    if (targetLink) {
        targetLink.classList.add('active');
        console.log(`✅ Link for ${pageId} activated`);
    } else {
        console.error(`❌ Link for ${pageId} not found!`);
    }
    
    // Load page-specific content
    switch(pageId) {
        case 'home':
            console.log('🏠 Loading home page content...');
            loadFeaturedGems();
            break;
        case 'explore':
            console.log('🔍 Loading explore page content...');
            loadExploreGems();
            break;
        case 'dashboard':
            console.log('📊 Loading dashboard content...');
            loadDashboard();
            break;
        default:
            console.log(`📄 No specific content loader for ${pageId}`);
    }
}

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('href').substring(1);
        showPage(pageId);
        
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// --- FILTER OUT BUTTONS & FIXED FILTER LOGIC ---
// Home Apply Filters
const applyHomeFiltersBtn = document.getElementById('applyHomeFiltersBtn');
if (applyHomeFiltersBtn) {
    applyHomeFiltersBtn.addEventListener('click', performSearch);
}
// Explore Apply Filters
const applyExploreFiltersBtn = document.getElementById('applyExploreFiltersBtn');
if (applyExploreFiltersBtn) {
    applyExploreFiltersBtn.addEventListener('click', applyExploreFilters);
}
// --- FIXED FILTER LOGIC ---
// Home page: use all dropdowns
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const typeFilterValue = typeFilter.value;
    const locationFilterValue = locationFilter.value;
    const countryValue = document.getElementById('countryFilter').value;
    const stateValue = document.getElementById('stateFilter').value;
    const cityValue = document.getElementById('cityFilter').value;
    filteredGems = allGems.filter(gem => {
        const matchesSearch = gem.name.toLowerCase().includes(searchTerm) ||
            gem.description.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilterValue || gem.type === typeFilterValue;
        const matchesLocation = !locationFilterValue ||
            gem.city.toLowerCase().includes(locationFilterValue.toLowerCase()) ||
            gem.state.toLowerCase().includes(locationFilterValue.toLowerCase()) ||
            (gem.country && gem.country.toLowerCase().includes(locationFilterValue.toLowerCase()));
        const matchesCountry = !countryValue || (gem.country && gem.country === countryValue);
        const matchesState = !stateValue || (gem.state && gem.state === stateValue);
        const matchesCity = !cityValue || (gem.city && gem.city === cityValue);
        return matchesSearch && matchesType && matchesLocation && matchesCountry && matchesState && matchesCity;
    });
    displayGems(filteredGems, 'featuredGems', true, deleteGem);
}
// Explore page: use all dropdowns
function applyExploreFilters() {
    const typeFilterValue = exploreTypeFilter.value;
    const budgetFilterValue = budgetFilter.value;
    const sortFilterValue = sortFilter.value;
    const countryValue = document.getElementById('exploreCountryFilter').value;
    const stateValue = document.getElementById('exploreStateFilter').value;
    const cityValue = document.getElementById('exploreCityFilter').value;
    let filtered = allGems;
    if (typeFilterValue) {
        filtered = filtered.filter(gem => gem.type === typeFilterValue);
    }
    if (budgetFilterValue) {
        filtered = filtered.filter(gem => gem.budget === budgetFilterValue);
    }
    if (countryValue) {
        filtered = filtered.filter(gem => gem.country === countryValue);
    }
    if (stateValue) {
        filtered = filtered.filter(gem => gem.state === stateValue);
    }
    if (cityValue) {
        filtered = filtered.filter(gem => gem.city === cityValue);
    }
    switch(sortFilterValue) {
        case 'recent':
            filtered.sort((a, b) => b.timestamp - a.timestamp);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    displayGems(filtered, 'exploreGems', true, deleteGem);
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// Load Location Options
function loadLocationOptions() {
    const locations = [...new Set(allGems.map(gem => `${gem.city}${gem.state ? `, ${gem.state}` : ''}${gem.country ? `, ${gem.country}` : ''}`))];
    locationFilter.innerHTML = '<option value="">All Locations</option>';
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}

// Populate country, state, and city filters for Home and Explore pages
function loadCountryStateCityOptions() {
    // Home page filters
    const countryFilter = document.getElementById('countryFilter');
    const stateFilter = document.getElementById('stateFilter');
    const cityFilter = document.getElementById('cityFilter');
    // Explore page filters
    const exploreCountryFilter = document.getElementById('exploreCountryFilter');
    const exploreStateFilter = document.getElementById('exploreStateFilter');
    const exploreCityFilter = document.getElementById('exploreCityFilter');

    // Get unique values
    const countries = [...new Set(allGems.map(gem => gem.country).filter(Boolean))].sort();
    const states = [...new Set(allGems.map(gem => gem.state).filter(Boolean))].sort();
    const cities = [...new Set(allGems.map(gem => gem.city).filter(Boolean))].sort();

    // Helper to populate a select
    function populateSelect(select, values, allLabel) {
        if (!select) return;
        select.innerHTML = `<option value="">${allLabel}</option>`;
        values.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            select.appendChild(option);
        });
    }

    populateSelect(countryFilter, countries, 'All Countries');
    populateSelect(stateFilter, states, 'All States');
    populateSelect(cityFilter, cities, 'All Cities');
    populateSelect(exploreCountryFilter, countries, 'All Countries');
    populateSelect(exploreStateFilter, states, 'All States');
    populateSelect(exploreCityFilter, cities, 'All Cities');
}

// Display Gems
function displayGems(gems, containerId, canDelete = false, onDelete = null) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (gems.length === 0) {
        container.innerHTML = '<div class="no-results"><p>No gems found. Try adjusting your filters!</p></div>';
        return;
    }
    // Only allow delete in dashboard (myGems)
    const allowDelete = containerId === 'myGems';
    gems.forEach(gem => {
        const gemCard = createGemCard(gem, allowDelete, onDelete);
        container.appendChild(gemCard);
    });
}

function createGemCard(gem, canDelete = false, onDelete = null) {
    const card = document.createElement('div');
    card.className = 'gem-card';
    
    card.innerHTML = `
        <div class="gem-image">
            ${gem.imageUrl ? `<img src="${gem.imageUrl}" alt="${gem.name}">` : '<i class="fas fa-gem"></i>'}
        </div>
        <div class="gem-content">
            <div class="gem-header">
                <div>
                    <div class="gem-name">${gem.name}</div>
                    <div class="gem-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${gem.city}${gem.state ? `, ${gem.state}` : ''}${gem.country ? `, ${gem.country}` : ''}
                    </div>
                </div>
                <span class="gem-type">${gem.type}</span>
            </div>
            <div class="gem-rating">
                <span>${gem.rating}/5</span>
                <div class="stars">
                    ${generateStars(gem.rating)}
                </div>
            </div>
            <div class="gem-budget">${gem.budget}</div>
            <div class="gem-description">${gem.description}</div>
            ${canDelete ? '<button class="delete-gem-btn">Delete</button>' : ''}
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        // Prevent modal if delete button is clicked
        if (e.target.classList.contains('delete-gem-btn')) return;
        showGemDetails(gem);
    });
    
    if (canDelete) {
        const deleteBtn = card.querySelector('.delete-gem-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this gem?')) {
                if (onDelete) {
                    onDelete(gem);
                } else {
                    deleteGem(gem);
                }
            }
        });
    }
    
    return card;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'active' : ''}"></i>`;
    }
    return stars;
}

// Show Gem Details Modal
async function showGemDetails(gem) {
    let reviewsHtml = '';
    if (isDemoMode) {
        const reviews = gem.reviews || [];
        if (reviews.length > 0) {
            reviewsHtml = '<div class="gem-reviews"><h3>Reviews</h3>' + reviews.map(r => `<div class="review"><div class="review-user">${r.user}</div><div class="review-rating">${generateStars(r.rating)}</div><div class="review-text">${r.text}</div><div class="review-date">${new Date(r.timestamp).toLocaleString()}</div></div>`).join('') + '</div>';
        }
    } else {
        // Load reviews from Firestore
        const reviewsSnap = await db.collection('gems').doc(gem.id).collection('reviews').orderBy('timestamp', 'desc').get();
        const reviews = reviewsSnap.docs.map(doc => doc.data());
        if (reviews.length > 0) {
            reviewsHtml = '<div class="gem-reviews"><h3>Reviews</h3>' + reviews.map(r => `<div class="review"><div class="review-user">${r.user}</div><div class="review-rating">${generateStars(r.rating)}</div><div class="review-text">${r.text}</div><div class="review-date">${new Date(r.timestamp).toLocaleString()}</div></div>`).join('') + '</div>';
        }
    }
    modalContent.innerHTML = `
        <div class="gem-details">
            <div class="gem-detail-image">
                ${gem.imageUrl ? `<img src="${gem.imageUrl}" alt="${gem.name}">` : '<i class="fas fa-gem"></i>'}
            </div>
            <h2>${gem.name}</h2>
            <div class="gem-detail-meta">
                <span class="gem-type">${gem.type}</span>
                <span class="gem-budget">${gem.budget}</span>
            </div>
            <div class="gem-detail-location">
                <i class="fas fa-map-marker-alt"></i>
                ${gem.city}${gem.state ? `, ${gem.state}` : ''}${gem.country ? `, ${gem.country}` : ''}
            </div>
            <div class="gem-detail-rating">
                <span>Rating: ${gem.rating}/5</span>
                <div class="stars">
                    ${generateStars(gem.rating)}
                </div>
            </div>
            <div class="gem-detail-description">
                <h3>Description</h3>
                <p>${gem.description}</p>
            </div>
            <div class="gem-detail-date">
                <small>Added on ${new Date(gem.timestamp).toLocaleDateString()}</small>
            </div>
            ${reviewsHtml}
        </div>
    `;
    gemModal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
    gemModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === gemModal) {
        gemModal.style.display = 'none';
    }
});

// Add Gem Form
function setupAddGemForm() {
    // Rating stars
    const ratingStars = document.querySelectorAll('.rating-input i');
    const ratingInput = document.getElementById('gemRating');
    
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            ratingInput.value = rating;
            
            ratingStars.forEach((s, index) => {
                s.classList.toggle('active', index < rating);
            });
        });
    });
    
    // Image preview
    const imageInput = document.getElementById('gemImage');
    const imagePreview = document.getElementById('imagePreview');
    
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Form submission
    addGemForm.addEventListener('submit', handleAddGem);
}

// Test Imgur API connection
async function testImgurConnection() {
    try {
        const response = await fetch('https://api.imgur.com/3/credits', {
            method: 'GET',
            headers: {
                'Authorization': 'Client-ID d7c8b9679dba703'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Imgur API test successful:', data);
            return true;
        } else {
            console.error('Imgur API test failed:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Imgur API test error:', error);
        return false;
    }
}

// Fallback function to convert image to data URL (for demo mode)
function convertImageToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}

async function uploadToImgur(file) {
    const clientId = 'd7c8b9679dba703'; // <-- Your Imgur Client ID
    const formData = new FormData();
    formData.append('image', file);

    console.log('Uploading to Imgur:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        clientId: clientId
    });

    try {
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': 'Client-ID ' + clientId
                // Don't set Content-Type header - let the browser set it with boundary for FormData
            },
            body: formData
        });

        console.log('Imgur response status:', response.status);
        console.log('Imgur response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Imgur API Error:', response.status, errorText);
            throw new Error(`Imgur upload failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Imgur response:', data);
        
        if (data.success && data.data && data.data.link) {
            console.log('Imgur upload successful:', data.data.link);
            return data.data.link; // This is the public image URL
        } else {
            console.error('Imgur API returned success=false:', data);
            throw new Error('Imgur upload failed: Invalid response format');
        }
    } catch (error) {
        console.error('Imgur upload error:', error);
        throw new Error(`Imgur upload failed: ${error.message}`);
    }
}

// --- Leaflet Map Picker for Add Gem ---
let map, marker;
const mapDiv = document.getElementById('map');
const gemLat = document.getElementById('gemLat');
const gemLng = document.getElementById('gemLng');
const manualAddress = document.getElementById('manualAddress');

function initMapPicker() {
    if (!mapDiv) return;
    map = L.map('map').setView([20.5937, 78.9629], 4); // Center on India
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', function(e) {
        const { lat, lng } = e.latlng;
        if (marker) {
            marker.setLatLng([lat, lng]);
        } else {
            marker = L.marker([lat, lng], { draggable: true }).addTo(map);
            marker.on('dragend', function(e) {
                const pos = marker.getLatLng();
                gemLat.value = pos.lat;
                gemLng.value = pos.lng;
            });
        }
        gemLat.value = lat;
        gemLng.value = lng;
        manualAddress.value = '';
    });

    // If user types in manual address, clear marker
    manualAddress.addEventListener('input', function() {
        if (manualAddress.value && marker) {
            map.removeLayer(marker);
            marker = null;
            gemLat.value = '';
            gemLng.value = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initMapPicker, 500); // Wait for DOM and Leaflet to load
});

async function handleAddGem(e) {
    e.preventDefault();
    
    try {
        const gemData = {
            name: document.getElementById('gemName').value,
            type: document.getElementById('gemType').value,
            city: document.getElementById('gemCity').value,
            state: document.getElementById('gemState').value,
            country: document.getElementById('gemCountry').value,
            budget: document.getElementById('gemBudget').value,
            description: document.getElementById('gemDescription').value,
            rating: parseInt(document.getElementById('gemRating').value),
            timestamp: Date.now(),
            userName: currentUser ? (currentUser.displayName || 'Anonymous') : 'Anonymous',
            userPhoto: currentUser ? (currentUser.photoURL || '') : '',
            userEmail: currentUser ? (currentUser.email || '') : '',
            userId: currentUser ? currentUser.uid : 'anonymous',
            lat: gemLat.value,
            lng: gemLng.value,
            address: manualAddress.value
        };
        
        const imageFile = document.getElementById('gemImage').files[0];
        if (imageFile) {
            try {
                if (isDemoMode) {
                    // In demo mode, use data URL instead of Imgur
                    gemData.imageUrl = await convertImageToDataURL(imageFile);
                    console.log('Using data URL for demo mode');
                } else {
                    // Try Imgur first, fallback to data URL if it fails
                    try {
                        gemData.imageUrl = await uploadToImgur(imageFile);
                    } catch (imgurError) {
                        console.warn('Imgur failed, using data URL fallback:', imgurError);
                        gemData.imageUrl = await convertImageToDataURL(imageFile);
                        showNotification('Image uploaded locally (Imgur unavailable)', 'info');
                    }
                }
            } catch (error) {
                console.error('Image upload failed:', error);
                // Ask user if they want to continue without the image
                if (confirm('Image upload failed. Would you like to add the gem without an image?')) {
                    gemData.imageUrl = ''; // No image
                } else {
                    return; // User cancelled
                }
            }
        }
        
        if (isDemoMode) {
            // Demo mode: add to local array
            gemData.id = 'demo-' + Date.now();
            allGems.unshift(gemData);
            
            // Reset form
            addGemForm.reset();
            document.getElementById('imagePreview').innerHTML = '';
            document.getElementById('gemRating').value = '0';
            document.querySelectorAll('.rating-input i').forEach(star => star.classList.remove('active'));
            
            // Reload location options
            loadLocationOptions();
            loadCountryStateCityOptions();
            
            // Show success message
            showNotification('Gem added successfully! (Demo Mode)', 'success');
            
            // Switch to explore page
            showPage('explore');
        } else {
            // Save to Firestore (no Firebase Storage)
            await db.collection('gems').add(gemData);
            
            // Reset form
            addGemForm.reset();
            document.getElementById('imagePreview').innerHTML = '';
            document.getElementById('gemRating').value = '0';
            document.querySelectorAll('.rating-input i').forEach(star => star.classList.remove('active'));
            
            // Reload gems
            await loadAllGems();
            
            // Show success message
            showNotification('Gem added successfully!', 'success');
            
            // Switch to explore page
            showPage('explore');
        }
        
    } catch (error) {
        console.error('Error adding gem:', error);
        showNotification('Error adding gem. Please try again.', 'error');
    }
}

// Load Data
async function loadAllGems() {
    if (isDemoMode) {
        // Use fallback demo data directly
        allGems = [
            {
                id: 'demo1',
                name: 'Spice Garden Restaurant',
                type: 'restaurant',
                city: 'Mumbai',
                state: 'Maharashtra',
                country: 'India',
                budget: '₹₹',
                description: 'A hidden gem serving authentic South Indian cuisine. Their dosas are absolutely amazing and the filter coffee is to die for! Perfect for a casual lunch or dinner.',
                rating: 4,
                timestamp: Date.now() - 86400000,
                userId: 'demo-user'
            },
            {
                id: 'demo2',
                name: 'Vintage Book Corner',
                type: 'store',
                city: 'Delhi',
                state: 'Delhi',
                country: 'India',
                budget: '₹',
                description: 'A charming second-hand bookstore tucked away in a quiet lane. They have an incredible collection of rare books and first editions. The owner is very knowledgeable and always has great recommendations.',
                rating: 5,
                timestamp: Date.now() - 172800000,
                userId: 'demo-user'
            },
            {
                id: 'demo3',
                name: 'Street Art Festival',
                type: 'event',
                city: 'Bangalore',
                state: 'Karnataka',
                country: 'India',
                budget: '₹',
                description: 'Annual street art festival where local artists transform the city walls into beautiful murals. Free entry, live music, and amazing food stalls. A must-visit for art lovers!',
                rating: 4,
                timestamp: Date.now() - 259200000,
                userId: 'demo-user'
            },
            {
                id: 'demo4',
                name: 'Handmade Pottery Studio',
                type: 'store',
                city: 'Jaipur',
                state: 'Rajasthan',
                country: 'India',
                budget: '₹₹₹',
                description: 'Beautiful handcrafted pottery and ceramics. They also offer pottery classes on weekends. The pieces are unique and make perfect gifts. The studio has a peaceful atmosphere.',
                rating: 5,
                timestamp: Date.now() - 345600000,
                userId: 'demo-user'
            },
            {
                id: 'demo5',
                name: 'Mom\'s Kitchen',
                type: 'restaurant',
                city: 'Chennai',
                state: 'Tamil Nadu',
                country: 'India',
                budget: '₹',
                description: 'Home-style cooking that tastes just like your mother\'s food. Their biryani and chicken curry are legendary. Very affordable and generous portions. Always crowded during lunch hours.',
                rating: 4,
                timestamp: Date.now() - 432000000,
                userId: 'demo-user'
            },
            {
                id: 'demo6',
                name: 'Jazz Night at Blue Moon',
                type: 'event',
                city: 'Kolkata',
                state: 'West Bengal',
                country: 'India',
                budget: '₹₹',
                description: 'Weekly jazz performances by local musicians. Intimate setting with great acoustics. They serve excellent cocktails and finger food. Perfect for a romantic evening or music lovers.',
                rating: 4,
                timestamp: Date.now() - 518400000,
                userId: 'demo-user'
            }
        ];
        loadLocationOptions();
        loadCountryStateCityOptions();
        return allGems;
    } else {
        // Load from Firebase
        try {
            const snapshot = await db.collection('gems').orderBy('timestamp', 'desc').get();
            allGems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            loadLocationOptions();
            loadCountryStateCityOptions();
            return allGems;
        } catch (error) {
            console.error('Error loading gems:', error);
            return [];
        }
    }
}

async function loadFeaturedGems() {
    const gems = await loadAllGems();
    const featured = gems.slice(0, 6); // Show first 6 gems
    displayGems(featured, 'featuredGems', true, deleteGem);
}

async function loadExploreGems() {
    const gems = await loadAllGems();
    displayGems(gems, 'exploreGems', true, deleteGem);
    applyExploreFilters();
}

async function loadDashboard() {
    if (!currentUser && !isDemoMode) {
        document.getElementById('myGems').innerHTML = '<p>Please sign in to view your dashboard.</p>';
        return;
    }
    
    const userGems = allGems.filter(gem => gem.userId === (currentUser ? currentUser.uid : 'demo-user'));
    displayGems(userGems, 'myGems', true, deleteGem);
    
    // Update stats
    document.getElementById('totalGems').textContent = userGems.length;
    
    const avgRating = userGems.length > 0 
        ? (userGems.reduce((sum, gem) => sum + gem.rating, 0) / userGems.length).toFixed(1)
        : '0.0';
    document.getElementById('avgRating').textContent = avgRating;
    
    const uniqueLocations = new Set(userGems.map(gem => `${gem.city}${gem.state ? `, ${gem.state}` : ''}${gem.country ? `, ${gem.country}` : ''}`)).size;
    document.getElementById('locations').textContent = uniqueLocations;
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 4000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize App
async function initApp() {
    console.log('🔄 Initializing app...');
    
    try {
        console.log('📊 Loading initial data...');
        // Load initial data
        await loadAllGems();
        console.log(`✅ Loaded ${allGems.length} gems`);
        
        console.log('📝 Setting up form...');
        // Setup form
        setupAddGemForm();
        
        // Test Imgur API connection
        console.log('🖼️ Testing Imgur API connection...');
        const imgurWorking = await testImgurConnection();
        if (!imgurWorking && !isDemoMode) {
            console.warn('⚠️ Imgur API not working - image uploads may fail');
            showNotification('Image upload service unavailable. You can still add gems without images.', 'info');
        }
        
        console.log('🏠 Showing home page...');
        // Show home page
        showPage('home');
        
        // Show demo mode indicator if in demo mode
        if (isDemoMode) {
            console.log('🎭 Demo mode active');
            showNotification('Running in Demo Mode - Data is not saved to Firebase', 'info');
        }
        
        console.log('✅ App initialization complete!');
        
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showNotification('Error loading app. Please refresh the page.', 'error');
    }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// --- User Auth Modal Logic ---
const userIconBtn = document.getElementById('userIconBtn');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const toggleAuthMode = document.getElementById('toggleAuthMode');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authModalTitle = document.getElementById('authModalTitle');

let isLoginMode = true;

if (userIconBtn) userIconBtn.onclick = () => {
    authModal.style.display = 'block';
    showLoginForm();
};
if (closeAuthModal) closeAuthModal.onclick = () => authModal.style.display = 'none';
window.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.style.display = 'none';
});

function showLoginForm() {
    loginForm.style.display = '';
    registerForm.style.display = 'none';
    authModalTitle.textContent = 'Sign In';
    toggleAuthMode.textContent = "Don't have an account? Register";
    isLoginMode = true;
}
function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = '';
    authModalTitle.textContent = 'Register';
    toggleAuthMode.textContent = 'Already have an account? Login';
    isLoginMode = false;
}
toggleAuthMode.onclick = () => {
    if (isLoginMode) {
        showRegisterForm();
    } else {
        showLoginForm();
    }
};

// --- Firebase Email/Password Auth ---
// (navMenu and logoutBtn already declared at the top, do not redeclare here)
let userEmailDisplay = null;

function updateUserUI(user) {
    if (!userEmailDisplay) {
        userEmailDisplay = document.createElement('span');
        userEmailDisplay.className = 'user-email-display';
        userEmailDisplay.style.marginLeft = '10px';
    }
    const userNavItem = document.getElementById('userNavItem');
    if (user) {
        userIconBtn.style.display = 'none';
        userEmailDisplay.textContent = user.email || 'Guest';
        userNavItem.appendChild(userEmailDisplay);
    } else {
        userIconBtn.style.display = '';
        if (userEmailDisplay.parentNode) userEmailDisplay.parentNode.removeChild(userEmailDisplay);
    }
}

function updateLogoutUI(user) {
    if (user) {
        if (logoutNavItem) logoutNavItem.style.display = '';
    } else {
        if (logoutNavItem) logoutNavItem.style.display = 'none';
    }
}

if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged((user) => {
        currentUser = user;
        updateUserUI(user);
        updateLogoutUI(user); // Show/hide logout for all user types
        if (user) {
            authModal.style.display = 'none';
            showNotification('Signed in as ' + (user.email || 'Guest'), 'success');
        } else {
            // User is signed out, do NOT show login modal automatically
            if (userDropdown) userDropdown.style.display = 'none';
            showPage('home');
        }
    });
}

loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        showNotification('Login successful!', 'success');
        authModal.style.display = 'none';
    } catch (error) {
        showNotification(error.message, 'error');
    }
};

registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        showNotification('Registration successful! You are now signed in.', 'success');
        authModal.style.display = 'none';
    } catch (error) {
        showNotification(error.message, 'error');
    }
};

// Update gem adding to use logged-in user's info
// (already uses currentUser if available)

// Add delete logic for dashboard gems
async function deleteGem(gem) {
    try {
        if (isDemoMode) {
            allGems = allGems.filter(g => g.id !== gem.id);
            showNotification('Gem deleted! (Demo Mode)', 'success');
            loadDashboard();
        } else {
            await db.collection('gems').doc(gem.id).delete();
            showNotification('Gem deleted!', 'success');
            await loadAllGems();
            loadDashboard();
        }
    } catch (error) {
        showNotification('Failed to delete gem.', 'error');
        console.error(error);
    }
}

// Add logic for Sign In and Register buttons
const signInBtn = document.getElementById('signInBtn');
const registerBtn = document.getElementById('registerBtn');
const authButtonsNavItem = document.getElementById('authButtonsNavItem');

if (signInBtn) signInBtn.onclick = () => {
    authModal.style.display = 'block';
    showLoginForm();
};
if (registerBtn) registerBtn.onclick = () => {
    authModal.style.display = 'block';
    showRegisterForm();
};

function updateUserUI(user) {
    if (!userEmailDisplay) {
        userEmailDisplay = document.createElement('span');
        userEmailDisplay.className = 'user-email-display';
        userEmailDisplay.style.marginLeft = '10px';
    }
    const userNavItem = document.getElementById('userNavItem');
    if (user) {
        userIconBtn.style.display = 'none';
        userEmailDisplay.textContent = user.email || 'Guest';
        userNavItem.appendChild(userEmailDisplay);
    } else {
        userIconBtn.style.display = '';
        if (userEmailDisplay.parentNode) userEmailDisplay.parentNode.removeChild(userEmailDisplay);
    }
}

// Google Sign-In
if (googleSignInBtn) {
    googleSignInBtn.onclick = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await firebase.auth().signInWithPopup(provider);
            showNotification('Signed in with Google!', 'success');
            authModal.style.display = 'none';
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };
}

// Anonymous Sign-In
const anonSignInBtn = document.getElementById('anonSignInBtn');
if (anonSignInBtn) {
    anonSignInBtn.onclick = async () => {
        try {
            await firebase.auth().signInAnonymously();
            showNotification('Signed in as Guest!', 'success');
            authModal.style.display = 'none';
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };
}

if (logoutBtn) {
    logoutBtn.onclick = () => {
        // Show confirmation modal
        if (logoutConfirmModal) logoutConfirmModal.style.display = 'block';
    };
}

function setRegisterButton() {
    if (logoutBtn) {
        logoutBtn.textContent = 'Register';
        logoutBtn.className = 'login-btn';
        logoutBtn.onclick = () => {
            if (typeof showRegisterForm === 'function') showRegisterForm();
            if (typeof authModal !== 'undefined') authModal.style.display = 'block';
        };
    }
}

if (logoutYesBtn) {
    logoutYesBtn.onclick = () => {
        firebase.auth().signOut().then(() => {
            if (logoutConfirmModal) logoutConfirmModal.style.display = 'none';
            setRegisterButton();
            showPage('home');
        });
    };
}

if (logoutNoBtn) {
    logoutNoBtn.onclick = () => {
        firebase.auth().signOut().then(() => {
            if (logoutConfirmModal) logoutConfirmModal.style.display = 'none';
            setRegisterButton();
            showPage('home');
        });
    };
}

// Hide modal if user clicks outside
window.addEventListener('click', (e) => {
    if (e.target === logoutConfirmModal) {
        logoutConfirmModal.style.display = 'none';
    }
});

const userDropdown = document.getElementById('userDropdown');
const userDropdownName = document.getElementById('userDropdownName');
const dropdownLogoutBtn = document.getElementById('dropdownLogoutBtn');

// Always show the user icon
if (userIconBtn) userIconBtn.style.display = '';

// Toggle dropdown or show login/register modal on icon click
if (userIconBtn) {
    userIconBtn.onclick = (e) => {
        e.stopPropagation();
        if (currentUser) {
            if (userDropdown) {
                userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
                if (userDropdownName) {
                    userDropdownName.textContent = currentUser.isAnonymous ? 'Guest' : (currentUser.displayName || currentUser.email || 'User');
                }
            }
        } else {
            if (typeof showLoginForm === 'function') showLoginForm();
            if (typeof authModal !== 'undefined') authModal.style.display = 'block';
        }
    };
}

// Hide dropdown when clicking outside
window.addEventListener('click', (e) => {
    if (userDropdown && userDropdown.style.display === 'block' && !userDropdown.contains(e.target) && e.target !== userIconBtn) {
        userDropdown.style.display = 'none';
    }
});

// Logout from dropdown triggers confirmation modal
if (dropdownLogoutBtn) {
    dropdownLogoutBtn.onclick = (e) => {
        e.stopPropagation();
        userDropdown.style.display = 'none';
        if (logoutConfirmModal) logoutConfirmModal.style.display = 'block';
    };
}

// Remove user icon show/hide logic from updateUserUI
function updateUserUI(user) {
    if (!userEmailDisplay) {
        userEmailDisplay = document.createElement('span');
        userEmailDisplay.className = 'user-email-display';
        userEmailDisplay.style.marginLeft = '10px';
    }
    // No longer hide userIconBtn
}

// Add review modal HTML to index.html (if not present)
if (!document.getElementById('reviewModal')) {
    const reviewModal = document.createElement('div');
    reviewModal.id = 'reviewModal';
    reviewModal.className = 'modal';
    reviewModal.innerHTML = `
        <div class="modal-content review-modal-content">
            <span class="close" id="closeReviewModal">&times;</span>
            <h2>Add a Review</h2>
            <form id="reviewForm">
                <div class="form-group">
                    <label>Your Rating</label>
                    <div class="review-rating-input">
                        <i class="fas fa-star" data-rating="1"></i>
                        <i class="fas fa-star" data-rating="2"></i>
                        <i class="fas fa-star" data-rating="3"></i>
                        <i class="fas fa-star" data-rating="4"></i>
                        <i class="fas fa-star" data-rating="5"></i>
                    </div>
                    <input type="hidden" id="reviewRating" value="0" required>
                </div>
                <div class="form-group">
                    <label>Your Review</label>
                    <textarea id="reviewText" rows="3" required placeholder="Share your experience..."></textarea>
                </div>
                <button type="submit" class="submit-btn oval-btn">Submit Review</button>
            </form>
        </div>
    `;
    document.body.appendChild(reviewModal);
}

// Review modal logic
let currentReviewGem = null;
function showReviewModal(gem) {
    currentReviewGem = gem;
    document.getElementById('reviewModal').style.display = 'block';
    document.getElementById('reviewRating').value = '0';
    document.querySelectorAll('.review-rating-input i').forEach(star => star.classList.remove('active'));
    document.getElementById('reviewText').value = '';
}
document.getElementById('closeReviewModal').onclick = () => {
    document.getElementById('reviewModal').style.display = 'none';
};
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('reviewModal')) {
        document.getElementById('reviewModal').style.display = 'none';
    }
});
document.querySelectorAll('.review-rating-input i').forEach(star => {
    star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating);
        document.getElementById('reviewRating').value = rating;
        document.querySelectorAll('.review-rating-input i').forEach((s, idx) => {
            s.classList.toggle('active', idx < rating);
        });
    });
});
document.getElementById('reviewForm').onsubmit = async (e) => {
    e.preventDefault();
    const rating = parseInt(document.getElementById('reviewRating').value);
    const text = document.getElementById('reviewText').value.trim();
    if (!rating || !text) {
        showNotification('Please provide a rating and review.', 'error');
        return;
    }
    const review = {
        rating,
        text,
        user: currentUser ? (currentUser.displayName || currentUser.email || 'Anonymous') : 'Anonymous',
        timestamp: Date.now()
    };
    if (isDemoMode) {
        if (!currentReviewGem.reviews) currentReviewGem.reviews = [];
        currentReviewGem.reviews.unshift(review);
        showNotification('Review added! (Demo Mode)', 'success');
        document.getElementById('reviewModal').style.display = 'none';
        showGemDetails(currentReviewGem);
    } else {
        // Save to Firestore subcollection
        await db.collection('gems').doc(currentReviewGem.id).collection('reviews').add(review);
        showNotification('Review added!', 'success');
        document.getElementById('reviewModal').style.display = 'none';
        // Reload reviews in modal
        showGemDetails(currentReviewGem);
    }
}; 