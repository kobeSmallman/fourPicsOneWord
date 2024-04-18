import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getUserProfile, storeUserProfile } from '../utils/storage'; 
import { INITIAL_COINS } from '../utils/constants';  

const RegisterScreen = ({ navigation }) => {
    // State for username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleRegister = async () => {
        try {
            // Check if username already exists
            const existingUser = await getUserProfile(username);
            if (existingUser) {
                Alert.alert('Error', 'Username already exists.');
                return;
            }
            // Create new user profile with initial coins from constants
            const newUserProfile = { username, password, coins: INITIAL_COINS, currentLevel: 1, sounds: { fail: false, success: false, default: false, gameScreen: false } };
            // Store new user profile in AsyncStorage
            await storeUserProfile(username, newUserProfile);
         
            Alert.alert('Registration Successful', 'You have been registered successfully!');
            navigation.navigate('Login');
        } catch (error) {
            
            Alert.alert('Registration Failed', 'An error occurred during registration.');
            console.error('Registration Error:', error);
        }
    };
    
    // Render registration form
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#A099AA" // Light grey color for placeholder text
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A099AA" // Light grey color for placeholder text
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
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
        padding: 20,
    },
    title: {
        fontSize: 26,
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

export default RegisterScreen;