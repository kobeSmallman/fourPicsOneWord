import AsyncStorage from '@react-native-async-storage/async-storage';


// Stores data in AsyncStorage and it uses both a key and a value, the key under which the data will be stored and the value for what we are storing (not null).
//The value is serialized to a string before being stored.
//Inside of this are the user profile information regarding what I wanted to store, which I specify with functions in gameScreen
export const storeData = async (key, value) => {
    if (!key) throw new Error("Key is required.");
    if (value === undefined) throw new Error("Value is required.");
    
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error('Error saving data', e);
        throw new Error("Data could not be saved.");
    }
};
  
//store the user profile information by username, it uses storeData function above, with the key formatted to userProfile_${username}
export const storeUserProfile = async (username, profileData) => {
    try {
        await storeData(`userProfile_${username}`, profileData);
        console.log("Profile stored successfully for", username);
    } catch (error) {
        console.error('Failed to store user profile:', error);
    }
};
//update profile and this helps maintain when reloads happen the level will be the same and not change the word pool for the respective level
export const updateUserProfile = async (username, updates) => {
    try {
        const profile = await getUserProfile(username);
        if (!profile) {
            console.error("No profile found for this username:", username);
            return; // Handle the case where there is no existing profile
        }
        const updatedProfile = { ...profile, ...updates };
        await storeUserProfile(username, updatedProfile);
        console.log("Profile updated successfully for", username);
    } catch (error) {
        console.error("Failed to update user profile:", error);
    }
};
// get the user profile based on username
export const getUserProfile = async (username) => {
    try {
        const jsonValue = await AsyncStorage.getItem(`userProfile_${username}`);
        if (!jsonValue) {
            return null; //no profile found
        }
        return JSON.parse(jsonValue);
    } catch (e) {
        throw new Error("Failed to fetch user profile.");  //issue reading the profile
    }
};




//AsyncStorage.clear(); //I've used this to clear my storage throughout building this.


