import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Text, Dimensions, KeyboardAvoidingView } from 'react-native';
import LottieView from 'lottie-react-native';
import COLORS from '../../constants/colors';
import { TextInput } from 'react-native-gesture-handler';
import { useAppContext } from '../../hooks/useAppContext';

//Styling for the loadinscreen
const styles = StyleSheet.create({
  containerWrapper: {
    position: 'absolute',
    backgroundColor: COLORS.PRIMARY_DARK,
    top: 0,
    left: 0,
    width: '100%',
    height: '120%',
    elevation: 18,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  loader: {
    width: 1000,
    height: 1000,
    marginTop: -350,
    marginBottom: -400,
  },
  text: {
    color: COLORS.SNOW,
    fontSize: 32,
    fontFamily: 'playfairDisplay-bold',
    textAlign: 'center',
  },
  loadingText: {
    color: COLORS.SNOW,
    fontSize: 20,
    fontFamily: 'playfairDisplay-medium',
    textAlign: 'center',
  },
  textInput: {
    borderColor: COLORS.SNOW,
    color: COLORS.SNOW,
    fontFamily: 'montserrat-regular',
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.07,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
  },
  inputHeader: {
    fontFamily: 'montserrat-bold',
    color: COLORS.SNOW,
    fontSize: 20,
    textAlignVertical: 'center',
    marginBottom: 5,
    marginTop: 40,
  }
});

const ANIMATION_DURATION = 500;

const LoadingScreen = ({ loading, loadingText, connectionFailed }) => {
  const { ip, setIp } = useAppContext(); //Get the ip and setter function from context
  
  //Loading screen animation setup
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const zIndexAnim = useRef(new Animated.Value(-10000)).current;
  
  useEffect(() => {
    if (loading) {
      Animated.timing(
        opacityAnim,
        {
          toValue: 1,
          duration: 0,
          useNativeDriver: false,
        }
      ).start();
      Animated.timing(
        zIndexAnim,
        {
          toValue: 10000,
          duration: 0,
          useNativeDriver: false,
        }
      ).start();
    } else {
      Animated.timing(
        opacityAnim,
        {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }
      ).start();
      Animated.timing(
        zIndexAnim,
        {
          toValue: -10000,
          delay: ANIMATION_DURATION,
          duration: 0,
          useNativeDriver: false,
        }
      ).start();
    }
  }, [loading]);
  return (
    <Animated.View style={[styles.containerWrapper, { opacity: opacityAnim, zIndex: zIndexAnim }]}>
      <KeyboardAvoidingView behavior="padding" enabled>
        <View style={styles.container}>
          
          <Text style={styles.text}>Intelligenta Mobila System</Text>
          <View style={styles.loader}>
            <LottieView source={require('./components/loadingAnimation.json')} autoPlay loop />
          </View>
          <Text style={styles.loadingText}>{loadingText}</Text>
            {connectionFailed ? //Shows the textbox for entering IP if connection fails
              <>
                <Text style={styles.inputHeader}>Mower IP:</Text>
                <TextInput style={styles.textInput} value={ip} onChangeText={setIp} />
              </>
              :
              null}
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};
export default LoadingScreen;