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

export default function Controller({ navigation, route }) {
  const [splash, setSplash] = useState(true);
  const [automaticMode, setAutomaticMode] = useState(false);
  const [ip] = useState( typeof route.params !== 'undefined' ? route.params.settings.ip : '192.168.1.1');
  const [port] = useState(typeof route.params !== 'undefined' ? route.params.settings.port : '80');
  const [speed, setSpeed] = useState(50)

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 1500);
  }, []);

  useEffect(() => {
    setAutomaticMode(false);
  }, []);

  const onPressAutomode = () => {
    // TODO: if(automode off) Send startDrivingAutonomously-req to
    // else if(automode on) Send stopDrivingAutonomously-req to backend
  }

  const onPressForward = () => {
    fetch('http://127.0.0.1:5000/Move', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speed: speed, 
        direction: 'forward',
      }),
    }).then((response) => {
      console.log(response.status)
    }).catch((error) => {
      console.log(error)
    });
    // TODO: Check that request works when possible
  }

  const onPressLeft = () => {
    fetch('http://127.0.0.1:5000/Move', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speed: speed, 
        direction: 'left',
      }),
    }).then((response) => {
      console.log(response.status)
    }).catch((error) => {
      console.log(error)
    });
    // TODO: Check that request works when possible
  }

  const onPressRight = () => {
    fetch('http://127.0.0.1:5000/Move', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speed: speed, 
        direction: 'right',
      }),
    }).then((response) => {
      console.log(response.status)
    }).catch((error) => {
      console.log(error)
    });
    // TODO: Check that request works when possible
  }

  const onPressBackward = () => {
    fetch('http://127.0.0.1:5000/Move', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speed: speed, 
        direction: 'backward',
      }),
    }).then((response) => {
      console.log(response.status)
    }).catch((error) => {
      console.log(error)
    });
    // TODO: Check that request works when possible
  }

  const onRelease = () => {
    fetch('http://127.0.0.1:5000/StopMoving', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speed: speed, 
        direction: 'backward',
      }),
    }).then((response) => {
      console.log(response.status)
    }).catch((error) => {
      console.log(error)
    });
    // TODO: Check that request works when possible
  }

  const onSlidingComplete = (value) => {
    setSpeed(Math.round(value))
  }

  return (
    <Layout>
      <Loading loading={splash}/>
      <View style={styles.container}>
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.text}>Controller</Text>
            <SettingsButton
              color={colors.SNOW}
              size={40}
              onPress={
                () => navigation.navigate('Settings', {
                  from: 'Controller',
                  settings: {
                    ip: typeof route.params !== 'undefined' ? route.params.settings.ip : ip ,
                    port: typeof route.params !== 'undefined' ? route.params.settings.port : port
                  }
                })}/>
          </View>
          <View style={styles.largeButtonContainer}>
            <LargeButton title="Controller" color={colors.PRIMARY}/>
            <LargeButton
              title="Map"
              color={colors.SNOW}
              onPress={
                () => navigation.navigate('Map', {
                  from: 'Controller',
                  settings: {
                    ip: typeof route.params !== 'undefined' ? route.params.settings.ip : ip ,
                    port: typeof route.params !== 'undefined' ? route.params.settings.port : port
                  }
                })
              }
            />
          </View>
        </View>
        <View style={styles.autoButtonContainer}>
          <AutoModeButton automatic={automaticMode} onPress={() => setAutomaticMode(!automaticMode)}/>
        </View>
        <View style={styles.controllerContainer}>
          <View style={styles.forwardContainer}>
            <RoundButton title="Forward" icon={icons.FORWARD.icon} onPress={onPressForward} onRelease={onRelease}
                         disabled={automaticMode}/>
          </View>
          <View style={styles.leftRightContainer}>
            <RoundButton title="Left" icon={icons.LEFT.icon} style={{ marginRight: 50 }} onPress={onPressLeft}
                         onRelease={onRelease} disabled={automaticMode}/>
            <RoundButton title="Right" icon={icons.RIGHT.icon} style={{ marginLeft: 50 }} onPress={onPressRight}
                         onRelease={onRelease} disabled={automaticMode}/>
          </View>
          <View style={styles.backwardContainer}>
            <RoundButton title="Backward" icon={icons.BACKWARD.icon} onPress={onPressBackward} onRelease={onRelease}
                         disabled={automaticMode}/>
          </View>
        </View>
        <SpeedSlider onSlidingComplete={onSlidingComplete} value={speed}/>
      </View>
    </Layout>
  );
};