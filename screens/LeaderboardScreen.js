import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LeaderboardScreen = () => {
    
    const [leaderboardData, setLeaderboardData] = useState([]);

    // Fetch leaderboard data on component mount
    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    // Function to fetch leaderboard data from AsyncStorage
    const fetchLeaderboardData = async () => {
        try {
            // Retrieve all keys from AsyncStorage
            const allKeys = await AsyncStorage.getAllKeys();
            // Filter keys for user profiles
            const userKeys = allKeys.filter(key => key.startsWith('userProfile_'));
            // Retrieve profiles for userKeys
            const profiles = await AsyncStorage.multiGet(userKeys);
            // Parse profiles and sort by currentLevel
            const users = profiles.map(item => JSON.parse(item[1])).sort((a, b) => b.currentLevel - a.currentLevel);
            // Set leaderboardData state with sorted user data
            setLeaderboardData(users);
        } catch (error) {
           
            Alert.alert('Error', 'Failed to load leaderboard data.');
        }
    };

    // Render leaderboard 
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Player</Text>
                <Text style={styles.header}>Level</Text>
                <Text style={styles.header}>Coins</Text>
            </View>
            {leaderboardData.length > 0 ? (
                leaderboardData.map((user, index) => (
                    <View key={index} style={styles.userRow}>
                        <Text style={styles.username}>{user.username}</Text>
                        <Text style={styles.level}>Level: {user.currentLevel}</Text>
                        <Text style={styles.coins}>Coins: {user.coins}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.noData}>No leaderboard data available.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#EDE7F6', // Light purple background
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6D44A3', // Dark purple text color
        textAlign: 'center',
        marginVertical: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#DF9ABB', // Use the color from your palette for the line
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6D44A3',
    },
    userRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#DF9ABB', // Same color for separator lines
    },
    username: {
        fontSize: 18,
        color: '#4A148C', // Darker purple text for contrast
        width: '33%',
        textAlign: 'center', // Center align text
    },
    level: {
        fontSize: 18,
        color: '#4A148C',
        width: '33%',
        textAlign: 'center',
    },
    coins: {
        fontSize: 18,
        color: '#4A148C',
        width: '33%',
        textAlign: 'center',
    },
    noData: {
        textAlign: 'center',
        color: '#6D44A3',
        marginTop: 20,
        fontSize: 18,
    },
});

export default LeaderboardScreen;
