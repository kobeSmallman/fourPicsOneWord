import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Component that receives letter, onPress, selected, and tileWidth as props
const LetterTile = ({ letter, onPress, selected, tileWidth }) => {
    return (
       
        <TouchableOpacity
            style={[
                styles.tile,
                { width: tileWidth, height: tileWidth }, // Use the dynamic tileWidth for sizing
                selected ? styles.selected : null
            ]}
            onPress={() => onPress()}
        >
            <Text style={styles.letter}>{letter}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tile: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#d1d1d1',
    },
    selected: {
        backgroundColor: '#b0c4de',
    },
    letter: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default LetterTile;
