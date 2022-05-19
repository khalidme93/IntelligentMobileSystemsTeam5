import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Slider from 'react-native-slider';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.85,
    height: Dimensions.get('window').height * 0.04,
  },
  slider: {
    width: Dimensions.get('window').width * 0.85,
    height: 30,
    color: colors.PRIMARY,
  },
  text: {
    fontFamily: 'montserrat-regular',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default function SpeedSlider({onSlidingComplete, value}) {
  return (
    <View style={styles.container}>
      <Slider 
        maximumValue={9} 
        minimumValue={0} 
        value={value} 
        onSlidingComplete={onSlidingComplete} 
        minimumTrackTintColor={colors.GRAY} 
        maximumTrackTintColor={colors.GRAY} 
        thumbTintColor={colors.PRIMARY_DARK}
      />
      <Text style={styles.text}>Speed</Text>
    </View>
  );
};