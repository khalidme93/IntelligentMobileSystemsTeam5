import React, { useEffect, useState } from 'react';
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
import Loading from '../Loading/Loading';

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
    alignItems: 'center',
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
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  forwardContainer: {
    width: Dimensions.get('window').width,
    marginBottom: 25,
    alignItems: 'center',
  },
  backwardContainer: {
    width: Dimensions.get('window').width,
    marginTop: 25,
    alignItems: 'center',
  },
  leftRightContainer: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  text: {
    fontFamily: 'playfairDisplay-bold',
    color: colors.SNOW,
    fontSize: 32,
    textAlignVertical: 'center',
    marginBottom: 5,
  },
});

export default function Controller({ navigation }) {
  const [splash, setSplash] = useState(true);
  const [automaticMode, setAutomaticMode] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 1500);
  }, []);

  useEffect(() => {
    setAutomaticMode(false);
  }, []);

  const onPressAutomode = () => {
    if(!automaticMode) {
      // TODO: Send startDrivingAutonomously-req to backend
    } else if (automaticMode) {
      // TODO: Send stopDrivingAutonomously-req to backend
    }
  }

  const onPressForward = () => {
    // TODO: Send startMovingForward-req to robot
  }

  const onPressLeft = () => {
     // TODO: Send startTurningLeft-req to robot
  }

  const onPressRight = () => {
     // TODO: Send startTurningRight-req to robot
  }

  const onPressBackward = () => {
     // TODO: Send startMovingBackward-req to robot
  }

  const onRelease = () => {
    // TODO: Send stopMoving-req to robot
  }

  return (
    <Layout>
      <Loading loading={splash}/>
      <View style={styles.container}>
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.text}>Controller</Text>
            <SettingsButton color={colors.SNOW} size={40} onPress={() => navigation.navigate('Settings')}></SettingsButton>
          </View>
          <View style={styles.largeButtonContainer}>
            <LargeButton title="Controller" color={colors.PRIMARY}/>
            <LargeButton title="Map" color={colors.SNOW} onPress={() => navigation.navigate('Map')}/>
          </View>
        </View>
        <View style={styles.autoButtonContainer}>
          <AutoModeButton automatic={automaticMode} onPress={() => {
            setAutomaticMode(!automaticMode);
            onPressAutomode();
          }}/>
        </View>
        <View style={styles.controllerContainer}>
          <View style={styles.forwardContainer}>
            <RoundButton title="Forward" icon={icons.FORWARD.icon} onPress={onPressForward} onRelease={onRelease}/>
          </View>
          <View style={styles.leftRightContainer}>
            <RoundButton title="Left" icon={icons.LEFT.icon} style={{marginRight: 50}} onPress={onPressLeft} onRelease={onRelease}/>
            <RoundButton title="Right" icon={icons.RIGHT.icon} style={{marginLeft: 50}} onPress={onPressRight} onRelease={onRelease}/>
          </View>
          <View style={styles.backwardContainer}>
            <RoundButton title="Backward" icon={icons.BACKWARD.icon} onPress={onPressBackward} onRelease={onRelease}/>
          </View>
        </View>
        <SpeedSlider/>
      </View>
    </Layout>
  );
};