import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// A functional component ImageTile that takes an imageUrl as a prop
const ImageTile = ({ imageUrl }) => {
    return (
        // View component that serves as a container for the image
        <View style={styles.container}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        margin: 5,
        width: 100, 
        height: 100, 
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: '#e1e4e8', 
    },
    image: {
        width: '100%', 
        height: '100%', 
        resizeMode: 'cover', 
    },
});

// Export the ImageTile component to be used in other parts of the app.
export default ImageTile;
