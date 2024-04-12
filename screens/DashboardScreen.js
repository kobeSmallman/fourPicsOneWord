import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Four Pics One Word!</Text>
      <Button
        title="Start Game"
        onPress={() => navigation.navigate('GameScreen')} // Navigate to the Game Screen
      />
      <Button
        title="Shop"
        onPress={() => navigation.navigate('ShopScreen')} // Navigate to the Shop Screen
      />
      <Button
        title="Leaderboards"
        onPress={() => navigation.navigate('LeaderboardScreen')} // Navigate to the Leaderboard Screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default DashboardScreen;
