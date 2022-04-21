import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import LargeButton from '../../components/Buttons/LargeButton';
import SettingsButton from '../../components/Buttons/SettingsButton';
import colors from '../../constants/colors';

import Layout from '../../components/Layout/Layout';

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
  text: {
    fontFamily: 'playfairDisplay-bold',
    color: colors.SNOW,
    fontSize: 32,
    textAlignVertical: 'center',
    marginBottom: 5,
  },
});

export default function Map({ navigation, route: { params } }) {
  let { settings } = params

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.text}>Map</Text>
          <SettingsButton color={colors.SNOW} size={40} onPress={() => navigation.navigate('Settings', {
            from: 'Map',
            settings: settings
          })}/>
        </View>
        <View style={styles.largeButtonContainer}>
          <LargeButton title="Controller" color={colors.SNOW} onPress={() => navigation.navigate('Controller', {
            from: 'Map',
            settings: settings
          })}/>
          <LargeButton title="Map" color={colors.PRIMARY}/>
        </View>
      </View>
    </Layout>
  );
};