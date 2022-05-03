import React from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, ImageBackground } from 'react-native';
import LargeButton from '../../components/Buttons/LargeButton';
import SettingsButton from '../../components/Buttons/SettingsButton';
import MowerMap from '../../components/Map/MowerMap'
import colors from '../../constants/colors';
import Layout from '../../components/Layout/Layout';
import grass from '../../assets/images/grass.jpg';

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
    justifyContent: 'space-evenly',
  },
  text: {
    fontFamily: 'playfairDisplay-bold',
    color: colors.SNOW,
    fontSize: 32,
    textAlignVertical: 'center',
    marginBottom: 5,
  },
  mapContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Dimensions.get('window').height * 0.14,
    backgroundColor: "green"
  },
  ground: {
    backgroundColor: "green",
    color: "blue",
  }
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
        <View style={styles.mapContainer}>
        <ScrollView alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false} 
        >
            <ScrollView horizontal     
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            bounces={false}>
              <ImageBackground source={grass} resizeMode="cover" style={styles.ground}>
                <MowerMap style={styles.ground}/>
              </ImageBackground>
            </ScrollView>
        </ScrollView>
        </View>
      </View>
    </Layout>
  );
};