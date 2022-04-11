import React from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import COLORS from '../../constants/colors'
import LargeButton from '../../components/Buttons/LargeButton';

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
    fontFamily: 'playfairDisplay-bold',
    textAlign: 'center',
  }
});

export default function Loading({navigation}) {
  return (
    <View style={styles.container}>
      <StatusBar hidden/>
      <Text style={styles.text}>Intelligenta Mobila System</Text>
      <LargeButton title={'Controller'} color={COLORS.SNOW} onPress={() => navigation.navigate('Controller')}/>
    </View>
  );
};