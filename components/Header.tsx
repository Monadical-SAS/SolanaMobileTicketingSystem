import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from './Colors';

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export function Header({title, subtitle}: HeaderProps) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <ImageBackground
      accessibilityRole="image"
      testID="new-app-screen-header"
      source={require('../img/background.png')}
      style={[
        styles.background,
        {
          backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        },
      ]}
      imageStyle={styles.logo}>
      <View>
        <Text style={styles.title}>{title || 'Solana'}</Text>
        <Text style={styles.subtitle}>{subtitle || 'React Native'}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    paddingBottom: 20,
    paddingTop: 20,
    maxHeight: 300,
    width: '100%',
  },
  logo: {
    overflow: 'visible',
    resizeMode: 'cover',
  },
  title: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});
