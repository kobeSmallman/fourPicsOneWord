import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import GameScreen from './screens/GameScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import RegisterScreen from './screens/RegisterScreen';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 3000);
//initializations
const Stack = createStackNavigator();
const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);
//Custom navigation theme
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#000000',  
    background: 'white', 
    card: '#000000',    
    text: '#FFFFFF',     
    border: '#000000',   
  },
};

function App() {
  const [username, setUsername] = useState(null);
  const [backgroundMusic, setBackgroundMusic] = useState(new Audio.Sound());
//fetch username for contextValue so we can utilize this throughout the app
  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('loggedInUsername');
      setUsername(storedUsername);
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const startBackgroundMusic = async () => {
      try {
        await backgroundMusic.loadAsync(require('./assets/sounds/default.mp3'), { shouldPlay: true, isLooping: true });
        await backgroundMusic.playAsync();
      } catch (error) {
        console.error("Couldn't load background music", error);
      }
    };

    startBackgroundMusic();

    return () => {
      backgroundMusic.unloadAsync();
    };
  }, [backgroundMusic]);

  const userContextValue = { username, setUsername };

  return (
    <UserContext.Provider value={userContextValue}>
      <NavigationContainer theme={MyTheme} onStateChange={async (state) => {
        // Stop music if navigating to GameScreen
        const routeName = state.routes[state.index].name;
        if (routeName === 'Game') {
          await backgroundMusic.pauseAsync();
        } else {
          await backgroundMusic.playAsync();
        }
      }}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#FFFFFF',  
          headerTitleStyle: { fontWeight: 'bold' }
        }}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: true }} />
          <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: true }} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

export default App;
