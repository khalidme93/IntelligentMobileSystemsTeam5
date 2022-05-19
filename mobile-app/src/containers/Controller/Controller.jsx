import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import LargeButton from '../../components/Buttons/LargeButton';
import RoundButton from '../../components/Buttons/RoundButton';
import colors from '../../constants/colors';
import Layout from '../../components/Layout/Layout';
import SpeedSlider from '../../components/SpeedSlider/SpeedSlider'
import SettingsButton from '../../components/Buttons/SettingsButton';
import icons from '../../constants/icons';
import AutoModeButton from '../../components/Buttons/AutoModeButton';
import Loading from '../Loading/Loading';
import { useAppContext } from '../../hooks/useAppContext';
import { useApi } from '../../hooks/useApi';
import { useFocusEffect } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    height: Dimensions.get('window').height * 0.93,
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
    marginTop: Dimensions.get('window').height * 0.12,
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
  textInput: {
    fontFamily: 'montserrat-regular',
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.07,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
  },
});

export default function Controller({ navigation }) {
  const [splash, setSplash] = useState(false);
  const [automaticMode, setAutomaticMode] = useState(true);
  const [loadingText, setLoadingText] = useState('Connecting to mower')
  const { ip, port } = useAppContext();
  const { request } = useApi();
  const [speed, setSpeed] = useState(5);
  const [connectionFailed, setConnectionFailed] = useState(false);

  useFocusEffect(() => {
    const delay = 5000; //Interval of 5 seconds
    const interval = setInterval(async () => {
      console.log('update mower status every 5 seconds');
      await mowerStatus();
    }, delay)
    return () => clearInterval(interval);
  });
  
  const onPressAutomode = async () => {
    !automaticMode === false ? await stopMower() : null;
    try {
      const response = await request('POST', 'AutoMode', { body: JSON.stringify({ active: !automaticMode }) });
      const res = await mowerStatus();
      console.log(res)
      setAutomaticMode(res.mode === 1)
    } catch (e) {
      console.error(e);
    }
  }

  const mowerStatus = async () => {
    try {
      const response = await request('GET', 'GetStatus');
      setConnectionFailed(false)
      splash ? setSplash(false) : null;
      if (response.mode === 1) {
        setAutomaticMode(true);
      } else {
        setAutomaticMode(false);
      }
      return response;
    } catch (e) {
      console.error(e);
      setSplash(true);
      setConnectionFailed(true);
      setLoadingText('Connecting to mower')
    }
  }

  const stopMower = async () => {
    try {
      const response = await request('POST', 'StopMoving');
      console.log(response);
    } catch (e) {
      console.error(e);
      alert('An error occured, mower is probably not connected')
    }
  }

  const moveMowerTo = async direction => {
    try {
      const response = await request('POST', 'Move', {
        body: JSON.stringify({ direction: direction, speed: speed })
      });
      console.log({ response: response });
    } catch (e) {
      console.error(e);
      alert('An error occured, mower is probably not connected')
    }
  }

  const onSlidingComplete = async (value) => {
    setSpeed(Math.round(value))
    if (automaticMode) {
      try {
        const response = await request('POST', 'SetSpeed', { body: JSON.stringify({ speed: speed }) });
        console.log(response);
      } catch (e) {
        console.error(e);
        alert('An error occured, mower is probably not connected')
      }
    }
  }

  return (
    <Layout>
      <Loading loading={splash} loadingText={loadingText} connectionFailed={connectionFailed}/>
      <View style={styles.container}>
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.text}>Controller</Text>
            <SettingsButton
              color={colors.SNOW}
              size={40}
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
          <View style={styles.largeButtonContainer}>
            <LargeButton title="Controller" color={colors.PRIMARY}/>
            <LargeButton
              title="Map"
              color={colors.SNOW}
              onPress={() => navigation.navigate('Map')}
            />
          </View>
        </View>
        <View style={styles.autoButtonContainer}>
          <AutoModeButton automatic={automaticMode} onPress={() => {
            onPressAutomode((response, error) => {
              console.log(response)
              console.log(error)
            });
          }}/>
        </View>
        <View style={styles.controllerContainer}>
          <View style={styles.forwardContainer}>
            <RoundButton
              title="Forward"
              icon={icons.FORWARD.icon}
              onPress={() => moveMowerTo('forward')}
              onRelease={stopMower}
              disabled={automaticMode}/>
          </View>
          <View style={styles.leftRightContainer}>
            <RoundButton
              title="Left"
              icon={icons.LEFT.icon}
              style={{ marginRight: 50 }}
              onPress={() => moveMowerTo('left')}
              onRelease={stopMower}
              disabled={automaticMode}/>
            <RoundButton
              title="Right"
              icon={icons.RIGHT.icon}
              style={{ marginLeft: 50 }}
              onPress={() => moveMowerTo('right')}
              onRelease={stopMower}
              disabled={automaticMode}/>
          </View>
          <View style={styles.backwardContainer}>
            <RoundButton
              title="Backward"
              icon={icons.BACKWARD.icon}
              onPress={() => moveMowerTo('backward')}
              onRelease={stopMower}
              disabled={automaticMode}/>
          </View>
        </View>
        <View style={{ marginTop: 25 }}>
          <SpeedSlider onSlidingComplete={onSlidingComplete} value={speed}/>
        </View>
      </View>
    </Layout>
  );
};