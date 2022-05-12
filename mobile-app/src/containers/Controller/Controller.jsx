import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
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
  const [splash, setSplash] = useState(true);
  const [automaticMode, setAutomaticMode] = useState(true);
  const [loadingText, setLoadingText] = useState('Establishing connection')
  const { ip, port } = useAppContext();
  const [speed, setSpeed] = useState(5);

  // const [connection, setConnection] = useState(false)

  // useEffect(() => {
  //   // setLoadingText("Connecting to server")
  //   // getMower((response, error) => {
  //   //   if(response.status == 200) {
  //   //     setSplash(false)
  //   //     // Check whether mower is in automatic mode and set that state
  //   //   } else {
  //   //     setLoadingText("Connecting to mower")

  //   //     checkMowerConnection((response, error) => {
  //   //       if (response.status == 200) {
  //   //         setSplash(false)
  //   //       } else {
  //   //         setLoadingText("Could not connect to mower")
  //   //         setTimeout(() => {
  //   //           setConnection(!connection)
  //   //         }, 3000);
  //   //       }
  //   //     })
  //   //   }
  //   // })


  //   setTimeout(() => {
  //     setSplash(false);
  //   }, 1500);
  // }, [/*connection*/]);

  useEffect(() => {
    const delay = automaticMode ? 5000 : 10000;
    const interval = setInterval(async () => {
        console.log("update mower status every 5 seconds");
        await checkMowerStatus();
    }, delay)
    return () => clearInterval(interval)
  }, []);

  const onPressAutomode = () => {
    if(!automaticMode == false) {
      stopMoving((response, error) => {})
    }

    setAutomaticMode(!automaticMode);
    console.log('http://' + ip + ':' + port + '/AutoMode')
    if (!automaticMode === false) {
      stopMoving((response, error) => {
      })
    }
    fetch('http://' + ip + ':' + port + '/AutoMode', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        active: !automaticMode
      })
    }).then((response) => {
      console.log(response.status)
      //callback(response, null);
    }).catch((error) => {
      alert('Error switching automode')
      //callback([], error);
    });

    
    // TODO: if(automode off) Send startDrivingAutonomously-req to
    // else if(automode on) Send stopDrivingAutonomously-req to backend
  }

  const getMower = (callback) => {
    fetch('https://us-central1-intelligentmobilesystemsteam5.cloudfunctions.net/v1/mower', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      callback(response, null)
    }).catch((error) => {
      callback([], error)
    });
  }

  const checkMowerStatus = async (callback) => {
    await fetch('http://' + ip + ':' + port + '/GetStatus')
    .then(response => {
      if(response.status == 200) {
        splash ? setSplash(false) : null;
        response.json().then(body => {
          if(body) {
            setAutomaticMode(true);
          } else {
            setAutomaticMode(false);
          }
          console.log(body.mode);
        });
      } else {
        setSplash(true);
      }
    })
    .catch(error => {
      setSplash(true);
      setLoadingText("Connecting to mower")
    })
  }

  const moveMower = (direction, callback) => {
    fetch('http://' + ip + ':' + port + '/Move', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        direction: direction,
        speed: speed
      })
    }).then((response) => {
      callback(response, null);
    }).catch((error) => {
      callback([], error);
    });
  }

  const stopMoving = (callback) => {
    fetch('http://' + ip + ':' + port + '/StopMoving', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      callback(response, null);
    }).catch((error) => {
      callback([], error);
    });
  }

  const updateAutoSpeed = (callback) => {
    fetch('http://' + ip + ':' + port + '/SetSpeed', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speed: speed
      })
    }).then((response) => {
      callback(response, null)
    }).catch((error) => {
      callback([], error)
    })
  }
 
  const onPressForward = () => {
    moveMower('left', (response, error) => {
      if (error) {
        alert('An error occured, mower is probably not connected')
      }
    })
  }
  const onPressLeft = () => {
    moveMower('left', (response, error) => {
      if (error) {
        alert('An error occured, mower is probably not connected')
      }
    })
  }

  const onPressRight = () => {
    moveMower('right', (response, error) => {
      if (error) {
        alert('An error occured, mower is probably not connected')
      }
    })
  }

  const onPressBackward = () => {
    moveMower('backward', (response, error) => {
      if (error) {
        alert('An error occured, mower is probably not connected')
      }
    })
  }

  const onRelease = () => {
    stopMoving((response, error) => {
      if (error) {
        alert('An error occured, mower is probably not connected')
      }
    })
  }

  const onSlidingComplete = (value) => {
    setSpeed(Math.round(value))
    if(automaticMode) {
      updateAutoSpeed((response, error) => {
        if(response) {
          console.log("Speed updated")
        } else if (error) {
          console.log("Error")
        }
      })
    }
  }

  return (
    <Layout>
      <Loading loading={splash} loadingText={loadingText}/>
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
              onPress={onPressForward}
              onRelease={onRelease}
              disabled={automaticMode}/>
          </View>
          <View style={styles.leftRightContainer}>
            <RoundButton
              title="Left"
              icon={icons.LEFT.icon}
              style={{ marginRight: 50 }}
              onPress={onPressLeft}
              onRelease={onRelease}
              disabled={automaticMode}/>
            <RoundButton
              title="Right"
              icon={icons.RIGHT.icon}
              style={{ marginLeft: 50 }}
              onPress={onPressRight}
              onRelease={onRelease}
              disabled={automaticMode}/>
          </View>
          <View style={styles.backwardContainer}>
            <RoundButton
              title="Backward"
              icon={icons.BACKWARD.icon}
              onPress={onPressBackward}
              onRelease={onRelease}
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