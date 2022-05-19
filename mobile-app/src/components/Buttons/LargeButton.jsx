import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from "react-native";
import colors from '../../constants/colors';

//Styles for the largebutton
const styles = StyleSheet.create({
  button: {
    width: Dimensions.get('window').width * 0.40,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontFamily: 'montserrat-regular',
    color: colors.PRIMARY_DARK,
  },
});



export default function LargeButton({title, color, onPress = () => null}) {
  let textColor = colors.SNOW;
  if(color === colors.SNOW) {
    textColor = colors.BLACK;
  }

  return (
    <View>
      <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color }]}>
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};