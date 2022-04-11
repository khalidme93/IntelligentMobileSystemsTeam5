import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import colors from '../../constants/colors';
import {AntDesign, Ionicons} from '@expo/vector-icons'

const styles = StyleSheet.create({
  container: {

  },
  button: {
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    width: Dimensions.get('window').width * 0.23,
    height: Dimensions.get('window').width * 0.23,
    backgroundColor: colors.SNOW,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 17,
  },
  textCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    margin: 10,
    fontSize: 16,
  },
  icon: {

  }
});

export default function RoundButton({title, icon}) {

  return (
    <View style={styles.textCenter}>
      <TouchableOpacity style={styles.button}>
        <View>
          <Ionicons name={icon} size='50%' color="black" />
        </View>
      </TouchableOpacity>
      <Text style={styles.textStyle}>{title}</Text>
  </View>
  );
}