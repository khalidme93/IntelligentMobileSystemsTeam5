import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import NativeI18nManager from 'react-native/Libraries/ReactNative/NativeI18nManager';
import LargeButton from '../../components/Buttons/LargeButton';
import RoundButton from '../../components/Buttons/RoundButton';
import colors from '../../constants/colors';
import Layout from '../../components/Layout/Layout';
import SpeedSlider from '../../components/SpeedSlider/SpeedSlider'
import SettingsButton from '../../components/Buttons/SettingsButton';
import icons from '../../constants/icons';
import AutoModeButton from '../../components/Buttons/AutoModeButton';
import { getCurrentTimestamp } from 'react-native/Libraries/Utilities/createPerformanceLogger';

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    height: Dimensions.get('window').height * 0.93,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  headerContainer: {
    width: Dimensions.get('window').width,
    paddingHorizontal: Dimensions.get('window').width * 0.07,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
  },
  largeButtonContainer: {
    width: Dimensions.get('window').width,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  autoButtonContainer: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Dimensions.get('window').height * 0.08,
  },
  controllerContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.93 * 0.45,
    marginTop: -10,
    paddingBottom: Dimensions.get('window').height * 0.03,
    flexDirection: "column",
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  forwardBackwardContainer: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  leftRightContainer: {
    width: Dimensions.get('window').width,
    flexDirection: "row",
    justifyContent: 'space-evenly',
  },
  backwardContainer: {
    width: Dimensions.get('window').width,
  },
  text: {
    fontFamily: "playfairDisplay-bold",
    color: colors.SNOW,
    fontSize: 32,
    textAlignVertical: "center",
    marginBottom: 5,
  },  
  speedSlider: {
    
  }
});

export default function Controller({navigation}) {
  return (
    <Layout>
      <View style={styles.container}>
        <View >
          <View style={styles.headerContainer}>
            <Text style={styles.text}>Controller</Text>
            <SettingsButton color={colors.SNOW} size={40} onPress={() => navigation.navigate('Settings')}></SettingsButton>
          </View>
          <View style={styles.largeButtonContainer}>
              <LargeButton title="Controller" color={colors.PRIMARY}></LargeButton>
              <LargeButton title="Map" color={colors.SNOW} onPress={() => navigation.navigate('Map')}></LargeButton>
          </View>
        </View>
        <View style={styles.autoButtonContainer}>
          <View><AutoModeButton icon="power"></AutoModeButton></View>
          <View></View>
        </View>
        <View style={styles.controllerContainer}>
          <View style={styles.forwardBackwardContainer}>
            <RoundButton title="Forward" icon={icons.FORWARD.icon}></RoundButton>
          </View>
          <View></View>
          <View style={styles.leftRightContainer}>
            <RoundButton title="Left" icon={icons.LEFT.icon}></RoundButton>
            <View></View>
            <View></View>
            <RoundButton title="Right" icon={icons.RIGHT.icon}></RoundButton>
          </View>
          <View></View>
          <View style={styles.forwardBackwardContainer}>
            <RoundButton title="Backward" icon={icons.BACKWARD.icon}></RoundButton>
          </View>
        </View>
        <SpeedSlider />
      </View>
    </Layout>
  );
};