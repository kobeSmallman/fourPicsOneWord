import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert,TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { fetchImages } from '../api/unsplash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EASY_WORDS, MEDIUM_WORDS, HARD_WORDS, INITIAL_COINS, HINT_COST_LETTER_REVEAL, HINT_COST_DELETE_WRONG_LETTERS } from '../utils/constants';
import { storeUserProfile, getUserProfile } from '../utils/storage';
import LetterTile from '../components/LetterTile';
import ImageTile from '../components/ImageTile';
import { Audio } from 'expo-av';
const screenWidth = Dimensions.get('window').width;
//intializations for used values
const GameScreen = ({ navigation, route }) => {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [word, setWord] = useState('');
    const [scrambledLetters, setScrambledLetters] = useState([]);
    const [userGuess, setUserGuess] = useState([]);
    const [images, setImages] = useState([]);
    const [coins, setCoins] = useState(INITIAL_COINS);
    const [loading, setLoading] = useState(true);
    const { username } = route.params;
    const lastLoadedLevel = useRef(null);
    const gameMusic = useRef(new Audio.Sound());
//check if the profile is created as a caution check and set up the sound and 
    useEffect(() => {
        async function initialize() {
            const profile = await getUserProfile(route.params.username);
            if (!profile) {
                Alert.alert('Error', 'Profile not found. Please log in again.');
                navigation.navigate('Login');
                return;
            }

            const newLevel = profile.currentLevel || 1;
            setCurrentLevel(newLevel);
            loadGameData(newLevel);

            // Play the game music
            try {
                await gameMusic.current.unloadAsync();  // Ensure any previously loaded sound is unloaded
                await gameMusic.current.loadAsync(require('../assets/sounds/gameScreen.mp3'));
                await gameMusic.current.setIsLoopingAsync(true);
                await gameMusic.current.playAsync();
            } catch (error) {
                console.error("Error handling game music:", error);
            }
        }

        initialize();

        return () => {
            gameMusic.current.stopAsync();  // Stop the music when navigating away
            gameMusic.current.unloadAsync();  
        };
    }, [navigation, route.params.username]); 
    
  
      
    //make the tile width dependant on the word length so big words don't go out of screen and are dynamic
    const getTileWidth = () => {
        let baseTileWidth = screenWidth / (word.length > 0 ? word.length : 1) - 8; // Avoid division by zero
        return Math.min(60, Math.max(baseTileWidth, 30)); // Ensure tiles are not too small or too large
    };
   
   //icon set up for later (the return statement)
    const IconButton = ({ title, onPress, iconName }) => {
        return (
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <MaterialCommunityIcons name={iconName} size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>{title}</Text>
          </TouchableOpacity>
        );
      };
      //load the game data, user information, current level, and coins, and setup the images and fetch them and get the URLs and loading is false so don't show that
      //couple logs for information
      const loadGameData = async (level) => {
        if (level === lastLoadedLevel.current) {
            console.log(`Skipping fetch for already loaded level: ${level}`);
            return;
        }
    
        console.log(`Loading data for level: ${level}`);
        setLoading(true);
        const randomWord = selectRandomWord(level).toUpperCase();
        setWord(randomWord);
        const profile = await getUserProfile(username);
        if (profile) {
            setCoins(profile.coins || INITIAL_COINS);
            }
        try {
            const urls = await fetchImages(randomWord);
            setImages(urls);
            setupLetters(randomWord); // Setup letters for the current word
            setLoading(false);
            lastLoadedLevel.current = level; // Mark this level as loaded
            console.log(`Data successfully loaded for level: ${level}`);
        } catch (error) {
            console.error(`Error loading data for level ${level}:`, error);
            Alert.alert('Error', 'Failed to load images.');
            setLoading(false);
        }
    };
    //based on the level findout the difficulty array to choose the word from
    const selectRandomWord = (level) => {
        const wordList = level % 10 === 0 ? HARD_WORDS : level % 3 === 0 ? MEDIUM_WORDS : EASY_WORDS;
        return wordList[Math.floor(Math.random() * wordList.length)];
    };
//set up the letters for the guessing part
    const setupLetters = (word) => {
        let letters = word.split('');
        const additionalLetters = [];
        while (letters.length + additionalLetters.length < 24) {
            const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            if (!letters.includes(randomChar.toUpperCase())) {
                additionalLetters.push(randomChar.toUpperCase());
            }
        }
        const combinedLetters = [...letters, ...additionalLetters];
        setScrambledLetters(shuffleArray(combinedLetters));
        setUserGuess(Array(word.length).fill('')); // Ensure userGuess array is reset here
    };
//shuffle the letters
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
//what to do when pressing a letter
    const handleLetterPress = (letter, index) => {
        const newUserGuess = [...userGuess];
        const firstEmpty = newUserGuess.indexOf('');
        if (firstEmpty !== -1) {
            newUserGuess[firstEmpty] = letter;
            setUserGuess(newUserGuess);
            setScrambledLetters(scrambledLetters.filter((_, i) => i !== index)); // Remove letter from scrambled
        }
    };
//what to do when removing a letter, (if there is one there)
    const handleLetterRemove = (index) => {
        const letter = userGuess[index];
        if (letter !== '') { // Only act if there's a letter to remove
            const newUserGuess = [...userGuess];
            newUserGuess[index] = '';
            setUserGuess(newUserGuess);
            setScrambledLetters([...scrambledLetters, letter]); // Add the letter back to the pool of scrambled letters
        }
    };
    
//what to do when the user wnats to spend coins to get a hint
    const handleUseHint = async (type) => {
        if (type === 'reveal' && coins >= HINT_COST_LETTER_REVEAL) {
            const unfilledIndexes = userGuess.map((letter, index) => letter === '' ? index : null).filter(index => index !== null);
            if (unfilledIndexes.length > 0) {
                const randomIndex = unfilledIndexes[Math.floor(Math.random() * unfilledIndexes.length)];
                const newUserGuess = [...userGuess];
                newUserGuess[randomIndex] = word[randomIndex];
                setUserGuess(newUserGuess);
                const newCoins = coins - HINT_COST_LETTER_REVEAL;
                setCoins(newCoins);
                await updateProfile({ coins: newCoins });
            }
        } else if (type === 'remove' && coins >= HINT_COST_DELETE_WRONG_LETTERS) {
            const wrongLetters = scrambledLetters.filter(letter => !word.includes(letter));
            const halfIndex = Math.ceil(wrongLetters.length / 2);
            const lettersToRemove = shuffleArray(wrongLetters).slice(0, halfIndex);
            setScrambledLetters(scrambledLetters.filter(letter => !lettersToRemove.includes(letter)));
            const newCoins = coins - HINT_COST_DELETE_WRONG_LETTERS;
            setCoins(newCoins);
            await updateProfile({ coins: newCoins });
        } else {
            Alert.alert("Insufficient Coins", "You do not have enough coins for this hint.");
        }
    };
    
    //update the profile with the new information 
    const updateProfile = async (updates) => {
        const profile = await getUserProfile(username);
        if (profile) {
            const updatedProfile = { ...profile, ...updates };
            await storeUserProfile(username, updatedProfile);
            setCoins(updatedProfile.coins);  // Update local state to reflect the stored value
        } else {
            console.error('Profile update failed: No user profile loaded');
            Alert.alert('Error', 'Profile update failed. Please log in again.');
        }
    };
    // Did the user get the guess wrong? play fail sound, success is handled in submit because of the timing in which I should give success sound so it actually works
    const handleGameEvent = async (event) => {
        try {
            const profile = await getUserProfile(username);
            if (!profile) {
                console.error('No user profile loaded');
                Alert.alert('Error', 'No user profile loaded. Please log in again.');
                navigation.navigate('Login');
                return;
            }
    
            let soundUri;
            if (event === 'fail') {
               
                soundUri = require('../assets/sounds/fail.mp3');
            } 
        } catch (error) {
            console.error('Failed to handle game event:', error);
            Alert.alert('Error', 'Failed to process game event.');
        }
    };
    
    //use handleGameEvent and play good sound here if they get it right and reward them accordingly
const handleSubmitGuess = async () => {
    if (userGuess.join('') === word) {
        const profile = await getUserProfile(username);
        if (!profile) {
            
            Alert.alert('Error', 'Failed to retrieve user data.');
            return;
        }
        try {
            const { sound: successSound } = await Audio.Sound.createAsync(
                require('../assets/sounds/success.mp3')
            );
            await successSound.playAsync();
        } catch (error) {
            console.error('Error playing success sound', error);
        }
        let reward = 10; // Default reward for easy levels
        if (HARD_WORDS.includes(word.toLowerCase())) {
            reward = 30; // Hard level reward
        } else if (MEDIUM_WORDS.includes(word.toLowerCase())) {
            reward = 15; // Medium level reward
        }

        const newCoinTotal = profile.coins + reward;

        Alert.alert("Correct!", "You've guessed the word!", [{
            text: "Next Level", onPress: async () => {
                const newLevel = currentLevel + 1;
                await updateProfile({
                    currentLevel: newLevel,
                    coins: newCoinTotal
                });

                setCurrentLevel(newLevel);
                setCoins(newCoinTotal);
                setUserGuess(Array(word.length).fill(''));

                loadGameData(newLevel);
            }
        }]);
    } else {
        handleGameEvent('fail');
        Alert.alert("Incorrect", "Please try again.");
    }
};
    //UI rendered
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.levelText}>Level: {currentLevel}</Text>
            <Text style={styles.coinsText}>Coins: {coins}</Text>
            <View style={styles.imageContainer}>
                {images.map((uri, index) => (
                    <ImageTile key={index} imageUrl={uri} />
                ))}
            </View>
            <View style={styles.wordContainer}>
                {userGuess.map((letter, index) => (
                    <LetterTile key={index} letter={letter} onPress={() => handleLetterRemove(index)} tileWidth={getTileWidth()} />
                ))}
            </View>
            <View style={styles.letterContainer}>
                {scrambledLetters.map((letter, index) => (
                    <LetterTile key={index} letter={letter} onPress={() => handleLetterPress(letter, index)} tileWidth={getTileWidth()} />
                ))}
            </View>
           
            <View style={styles.buttonContainer}>
            <IconButton
        title="Reveal One Letter"
        onPress={() => handleUseHint('reveal')}
        iconName="alpha-a-circle-outline" // Change icon name as needed
      />
      <IconButton
        title="Remove Half Letters"
        onPress={() => handleUseHint('remove')}
        iconName="delete-sweep-outline" // Change icon name as needed
      />
      <IconButton
        title="Submit Guess"
        onPress={handleSubmitGuess}
        iconName="check-circle-outline" // Change icon name as needed
      />
           
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#6D44A3', // Use the purple shade from your color palette
    },
    levelText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#DFD6DE', // A lighter purple or white color for the text
        marginBottom: 8,
    },
    coinsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#DFD6DE', // Consistent with levelText
        marginBottom: 16,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 20,
        },
        wordContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        },
        letterTile: {
        height: 50, // Increased height for better touch targets
        margin: 4,
        borderWidth: 1,
        borderColor: '#DFD6DE', // A lighter shade for the border
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF', // White background for the letter tiles
        },
        letter: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#6D44A3', // Use the purple shade for letter text
        },
        letterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
        },
        buttonContainer: {
        marginTop: 10,
        marginBottom: 20,
        },
        coinsText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#DFD6DE', // A lighter purple or white color for the text
        marginVertical: 10,
        },
        button: {
            flexDirection: 'row',
            backgroundColor: '#A884F2', // Use the color palette you provided
            padding: 10,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 3,
            marginVertical: 5,
          },
          buttonText: {
            color: '#FFFFFF',
            fontSize: 18,
            marginLeft: 8,
          },
        // Additional styling can be added for any new components or modifications
        });
        
        export default GameScreen;