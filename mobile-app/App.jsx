import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Loading from './src/src/containers/Loading/Loading';

import * as Font from 'expo-font';
import React, { useState } from 'react';
import AppLoading from 'expo-app-loading';

const fetchFonts = () => {
  return Font.loadAsync({
    'montserrat-regular': require('./src/assets/fonts/Montserrat-Regular.ttf'),
    'montserrat-black': require('./src/assets/fonts/Montserrat-Black.ttf'),
    'montserrat-bold': require('./src/assets/fonts/Montserrat-Bold.ttf'),
    'montserrat-extraBold': require('./src/assets/fonts/Montserrat-ExtraBold.ttf'),
    'montserrat-extraLight': require('./src/assets/fonts/Montserrat-ExtraLight.ttf'),
    'montserrat-light': require('./src/assets/fonts/Montserrat-Light.ttf'),
    'montserrat-semiBold': require('./src/assets/fonts/Montserrat-SemiBold.ttf'),
    'montserrat-thin': require('./src/assets/fonts/Montserrat-Thin.ttf'),
    'playfairDisplay-regular': require('./src/assets/fonts/PlayfairDisplay-Regular.ttf'),
    'playfairDisplay-black': require('./src/assets/fonts/PlayfairDisplay-Black.ttf'),
    'playfairDisplay-bold': require('./src/assets/fonts/PlayfairDisplay-Bold.ttf'),
    'playfairDisplay-extraBold': require('./src/assets/fonts/PlayfairDisplay-ExtraBold.ttf'),
    'playfairDisplay-medium': require('./src/assets/fonts/PlayfairDisplay-Medium.ttf'),
    'playfairDisplay-semiBold': require('./src/assets/fonts/PlayfairDisplay-SemiBold.ttf'),
  })
}

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={() => console.warn('error')}
      />
    );
  }

  return (
    <>
      <Loading/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
});