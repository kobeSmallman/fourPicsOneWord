import axios from 'axios';

// Unsplash access key
const ACCESS_KEY = '3cNtyAWwIZG5TAjw5h1XufGWjDv6Ay8pgSZFKNXG0N8'; 

// Base URL for the Unsplash API
const BASE_URL = 'https://api.unsplash.com';

// Axios instance creation with base configurations that uses api key and url 
const apiClient = axios.create({
    baseURL: BASE_URL, 
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` } 
});

// Asynchronously fetches images based on a search query using the Unsplash API 
export const fetchImages = async (query) => {
    console.log("Querying for:", query); // nice to see in the terminal what we are querying for 
    try {
        // Make a GET request to the search endpoint of the Unsplash API
        const response = await apiClient.get('/search/photos', {
            params: { query, per_page: 4 }, //44 images
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate', // Ensure responses are not cached
                'Pragma': 'no-cache', // Part of the caching headers
                'Expires': '0' // Set the cache expiration to 0 for no caching
            }
        });
        // Extract the regular size URLs of the images from the response data
        return response.data.results.map(img => img.urls.regular);
    } catch (error) {
        console.error('Error fetching images from Unsplash:', error); // Log the error for fail request
        throw error; 
    }
};
