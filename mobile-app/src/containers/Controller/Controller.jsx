import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import NativeI18nManager from 'react-native/Libraries/ReactNative/NativeI18nManager';
import LargeButton from '../../components/Buttons/LargeButton';
import colors from '../../constants/colors';
import Layout from '../../components/Layout/Layout';
import SpeedSlider from '../../components/SpeedSlider/SpeedSlider'

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    height: Dimensions.get('window').height * 0.93,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontFamily: "playfairDisplay-bold",
    color: colors.SNOW,
    fontSize: 32,
    marginLeft: 20
  },
  largeButtonContainer: {
    width: Dimensions.get('window').width,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  speedSlider: {
    
  }
});

export default function Controller({navigation}) {
  return (
    <Layout>
      <View style={styles.container}>
        <View>
          <Text style={styles.text}>Controller</Text>
          <View style={styles.largeButtonContainer}>
              <LargeButton title="Controller" color={colors.PRIMARY}></LargeButton>
              <LargeButton title="Map" color={colors.SNOW} onPress={() => {}}></LargeButton>
          </View>
        </View>
        <SpeedSlider />
      </View>
    </Layout>
  );
};