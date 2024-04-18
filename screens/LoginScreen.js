import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../utils/storage'; 

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
//login and get user profile and make sure credentials are correct (username and password) 
  const handleLogin = async () => {
    try {
      const userProfile = await getUserProfile(username);
      if (userProfile && userProfile.password === password) {
        await AsyncStorage.setItem('loggedInUsername', username); // Save username on successful login
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard', params: { username } }], // Pass username as a parameter to Dashboard
        });
      } else {
        Alert.alert("Login Failed", "Incorrect username or password.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during login.");
    }
  };
  

  const handleRegister = () => {
    navigation.navigate('Register');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Your Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#A099AA" 
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A099AA" 
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6D44A3', 
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF', 
    marginBottom: 30,
  },
  input: {
    width: '80%',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DF9ABB', 
    borderRadius: 10,
    backgroundColor: '#F3E5F5', 
    color: '#4A148C', 
  },
  button: {
    width: '80%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#DF9ABB', 
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF', 
  },
});

export default LoginScreen;