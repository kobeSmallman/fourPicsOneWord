export const INITIAL_COINS = 100; // Initial number of coins for a new player
export const HINT_COST_LETTER_REVEAL = 10; // Cost in coins for revealing one letter
export const HINT_COST_DELETE_WRONG_LETTERS = 20; // Cost in coins for deleting a percentage of wrong letters

//these are the words that utilize the API to fetch the images, each word was tested with the unsplash API to make sure it gets at least 4 images.
export const EASY_WORDS = [
    "cat", "dog", "car", "boat", "apple", "cake", "tree", "house", "flower", "bird",
    "beach", "mountain", "snow", "rain", "street", "garden", "forest", "moon", "sun", "star",
    "leaf", "cloud", "book", "shoe", "hat"
];

export const MEDIUM_WORDS = [
    "peace", "joy", "celebration", "travel", "adventure",
    "serenity", "mystery", "elegance", "speed", "luxury",
    "nostalgia", "solitude", "harmony", "fury", "glow",
    "sparkle", "dream", "silence", "night", "twilight", "dawn", "reflection", "shadow", "light", "tranquil",
    "beautiful", "radiant", "vibrant"
];

export const HARD_WORDS = [
    "complex", "puzzling", "monolithic", "profound", "grandiose",
    "formidable", "imposing", "daunting", "intricate", "fierce",
    "harsh", "exhausting", "winding", "passionate", "spikey",
    "enormous", "resolute", "energetic", "ethereal"
];
