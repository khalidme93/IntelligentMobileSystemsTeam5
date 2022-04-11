import React from 'react';
import { View } from 'react-native';
import Wave from './components/Wave';

export default function Layout({ children }) {
  return (
    <View>
      <Wave/>
      {children}
    </View>
  );
}