import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import COLORS from '../../constants/colors';

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
  }
});

const ANIMATION_DURATION = 500;

const LoadingScreen = ({ loading, loadingText }) => {
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
      <View style={styles.container}>
        <Text style={styles.text}>Intelligenta Mobila System</Text>
        <View style={styles.loader}>
          <LottieView source={require('./components/loadingAnimation.json')} autoPlay loop />
        </View>
      <Text style={styles.loadingText}>{loadingText}</Text>
      </View>
    </Animated.View>
  );
};
export default LoadingScreen;