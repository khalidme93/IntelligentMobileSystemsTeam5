import { StyleSheet } from 'react-native';

import * as Font from 'expo-font';
import React, { useMemo, useState } from 'react';
import AppLoading from 'expo-app-loading';
import Navigation from './src/navigation/navigation';
import { AppContext } from './src/hooks/useAppContext';

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
  const [ip, setIp] = useState('192.168.150.228');
  const [port, setPort] = useState('5000');

  const value = useMemo(() => ({
    ip, setIp, port, setPort
  }), [ip, port]);

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
    <AppContext.Provider value={value}>
      <Navigation/>
    </AppContext.Provider>
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