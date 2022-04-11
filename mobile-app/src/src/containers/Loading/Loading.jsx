import React from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import COLORS from '../../constants/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  text: {
    color: COLORS.SNOW,
    marginBottom: 50,
    fontSize: 32,
    fontFamily: 'playfairDisplay-regular',
    textAlign: 'center',
  }
});

export default function Loading() {
  return (
    <View style={styles.container}>
      <StatusBar hidden/>
      <Text style={styles.text}>Intelligenta Mobila System</Text>
    </View>
  );
};