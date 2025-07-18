// Demo Data for Hidden Gems App
// This file contains sample data to demonstrate the app functionality
// You can use this to test the app before setting up Firebase

const demoGems = [
    {
        id: 'demo1',
        name: 'Spice Garden Restaurant',
        type: 'restaurant',
        city: 'Mumbai',
        state: 'Maharashtra',
        budget: '₹₹',
        description: 'A hidden gem serving authentic South Indian cuisine. Their dosas are absolutely amazing and the filter coffee is to die for! Perfect for a casual lunch or dinner.',
        rating: 4,
        imageUrl: null,
        timestamp: Date.now() - 86400000, // 1 day ago
        userId: 'demo-user'
    },
    {
        id: 'demo2',
        name: 'Vintage Book Corner',
        type: 'store',
        city: 'Delhi',
        state: 'Delhi',
        budget: '₹',
        description: 'A charming second-hand bookstore tucked away in a quiet lane. They have an incredible collection of rare books and first editions. The owner is very knowledgeable and always has great recommendations.',
        rating: 5,
        imageUrl: null,
        timestamp: Date.now() - 172800000, // 2 days ago
        userId: 'demo-user'
    },
    {
        id: 'demo3',
        name: 'Street Art Festival',
        type: 'event',
        city: 'Bangalore',
        state: 'Karnataka',
        budget: '₹',
        description: 'Annual street art festival where local artists transform the city walls into beautiful murals. Free entry, live music, and amazing food stalls. A must-visit for art lovers!',
        rating: 4,
        imageUrl: null,
        timestamp: Date.now() - 259200000, // 3 days ago
        userId: 'demo-user'
    },
    {
        id: 'demo4',
        name: 'Handmade Pottery Studio',
        type: 'store',
        city: 'Jaipur',
        state: 'Rajasthan',
        budget: '₹₹₹',
        description: 'Beautiful handcrafted pottery and ceramics. They also offer pottery classes on weekends. The pieces are unique and make perfect gifts. The studio has a peaceful atmosphere.',
        rating: 5,
        imageUrl: null,
        timestamp: Date.now() - 345600000, // 4 days ago
        userId: 'demo-user'
    },
    {
        id: 'demo5',
        name: 'Mom\'s Kitchen',
        type: 'restaurant',
        city: 'Chennai',
        state: 'Tamil Nadu',
        budget: '₹',
        description: 'Home-style cooking that tastes just like your mother\'s food. Their biryani and chicken curry are legendary. Very affordable and generous portions. Always crowded during lunch hours.',
        rating: 4,
        imageUrl: null,
        timestamp: Date.now() - 432000000, // 5 days ago
        userId: 'demo-user'
    },
    {
        id: 'demo6',
        name: 'Jazz Night at Blue Moon',
        type: 'event',
        city: 'Kolkata',
        state: 'West Bengal',
        budget: '₹₹',
        description: 'Weekly jazz performances by local musicians. Intimate setting with great acoustics. They serve excellent cocktails and finger food. Perfect for a romantic evening or music lovers.',
        rating: 4,
        imageUrl: null,
        timestamp: Date.now() - 518400000, // 6 days ago
        userId: 'demo-user'
    },
    {
        id: 'demo7',
        name: 'Organic Farmers Market',
        type: 'store',
        city: 'Pune',
        state: 'Maharashtra',
        budget: '₹₹',
        description: 'Weekly farmers market selling fresh organic produce directly from local farmers. Great prices, fresh vegetables, and you get to support local agriculture. They also have homemade jams and pickles.',
        rating: 5,
        imageUrl: null,
        timestamp: Date.now() - 604800000, // 7 days ago
        userId: 'demo-user'
    },
    {
        id: 'demo8',
        name: 'Hidden Beach Cafe',
        type: 'restaurant',
        city: 'Goa',
        state: 'Goa',
        budget: '₹₹',
        description: 'A small cafe right on the beach, away from the tourist crowds. Fresh seafood, amazing sunset views, and the best coconut water. Perfect spot for a peaceful breakfast or romantic dinner.',
        rating: 5,
        imageUrl: null,
        timestamp: Date.now() - 691200000, // 8 days ago
        userId: 'demo-user'
    }
];

// Function to load demo data
function loadDemoData() {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            resolve(demoGems);
        }, 1000);
    });
}

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { demoGems, loadDemoData };
} 