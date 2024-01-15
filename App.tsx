import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Appearance,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@MyApp:colorScheme';

const App = () => {
  const [colorScheme, setColorScheme] = useState('light'); // Default to light initially

  const persistColorScheme = async newColorScheme => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newColorScheme);
    } catch (e) {
      console.error('Error persisting color scheme:', e);
    }
  };

  const retrievePersistedColorScheme = async () => {
    try {
      const storedColorScheme = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedColorScheme !== null) {
        setColorScheme(storedColorScheme);
      }
    } catch (e) {
      console.error('Error retrieving persisted color scheme:', e);
    }
  };

  useEffect(() => {
    retrievePersistedColorScheme();

    const appearanceListener = Appearance.addChangeListener(
      ({colorScheme: newColorScheme}) => {
        setColorScheme(newColorScheme);
        persistColorScheme(newColorScheme);
      },
    );

    return () => {
      appearanceListener.remove();
    };
  }, []);

  const toggleColorScheme = () => {
    const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newColorScheme);
    persistColorScheme(newColorScheme);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
    },
    text: {
      fontSize: 24,
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
    button: {
      marginTop: 20,
      padding: 10,
      backgroundColor: colorScheme === 'dark' ? '#555' : '#ddd',
      borderRadius: 5,
    },
    buttonText: {
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Change Theme</Text>
      <TouchableOpacity style={styles.button} onPress={toggleColorScheme}>
        <Text style={styles.buttonText}>Toggle Dark Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
