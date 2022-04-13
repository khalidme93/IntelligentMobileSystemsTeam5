import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import NativeI18nManager from 'react-native/Libraries/ReactNative/NativeI18nManager';
import LargeButton from '../../components/Buttons/LargeButton';
import colors from '../../constants/colors';
import Layout from '../../components/Layout/Layout';
import SpeedSlider from '../../components/SpeedSlider/SpeedSlider'
import SettingsButton from '../../components/Buttons/SettingsButton';

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    height: Dimensions.get('window').height * 0.93,
    justifyContent: 'space-between',
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
            <SettingsButton color={colors.SNOW} size={40} onPress={() => {alert("Settings")}}></SettingsButton>
          </View>
          <View style={styles.largeButtonContainer}>
              <LargeButton title="Controller" color={colors.PRIMARY}></LargeButton>
              <LargeButton title="Map" color={colors.SNOW} onPress={() => navigation.navigate('Map')}></LargeButton>
          </View>
        </View>
        <SpeedSlider />
      </View>
    </Layout>
  );
};