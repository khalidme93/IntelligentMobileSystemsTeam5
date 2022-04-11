import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import colors from '../../constants/colors';


const styles = StyleSheet.create({
  button: {
    width: 175,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { //Change font
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