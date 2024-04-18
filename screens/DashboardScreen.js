import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DashboardScreen = ({ navigation }) => {
  // State hooks for username and loading status
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch username from local storage on component mount
  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('loggedInUsername');
      setUsername(storedUsername);
      setLoading(false); // Set loading to false after fetching username
    };

    fetchUsername();
  }, []); // Empty dependency array ensures this runs only once on component mount

  // If loading is true display an ActivityIndicator
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#DF9ABB" />
      </View>
    );
  }

  // Main content of the Dashboard
  return (
    <View style={styles.container}>
       <Text style={styles.title}>
        Welcome {username}, Ready to play 4 Pics 1 Word?
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (username) {
              navigation.navigate('Game', { username });
            } else {
              Alert.alert('Error', 'Please log in to continue.');
            }
          }}>
          <MaterialCommunityIcons name="play-circle" size={24} color="white" />
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Leaderboard', { username })}>
          <MaterialCommunityIcons name="chart-bar" size={24} color="white" />
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Alert.alert("About the Game", `
Four Pics One Word is a simple and engaging puzzle game. The objective is to guess a word based on four related images.
            
Gameplay Overview:
- Each level displays four images that hint at a single word.
- You guess the word using the scrambled letters provided.
- Use hints to assist if stuck, but don't spend all your coins!
  - Reveal a Letter: Shows one correct letter.
  - Remove Letters: Eliminates some incorrect letters.
Hints cost coins, which you can earn by completing levels.
            
Features:
- Levels increase in difficulty, they can be larger words or more abstract or both!
- Occasionally, levels may repeat, giving you a chance to earn more coins as freebies.
- Coins are vital for accessing hints and progressing in challenging levels
-If you are stuck, don't worry this game is meant to be fun!
-Reload or leave and go back to dashboard, then go back into a game and have a new word with the same difficulty level on, so you're not stuck forever, perhaps you'll see that challenge again in the future.
            
Goal:
Advance through levels, earn coins, and enjoy the challenge of deducing words from pictures.
            
Press 'Start' to begin your adventure in linking images with words and sharpening your cognitive skills.
`)}>
<MaterialCommunityIcons name="information" size={24} color="white" />
<Text style={styles.buttonText}>About the Game</Text>
</TouchableOpacity>
</View>
</View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#6D44A3', // Dark purple background, replace with your exact color code
  },
  title: {
    fontSize: 26, // increased font size
    color: '#FFFFFF', // keeping the color white as per previous styles
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#DF9ABB', // Use the color palette you provided
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
  // If you want custom button styles, you would need to replace Button with TouchableOpacity
});

export default DashboardScreen;
