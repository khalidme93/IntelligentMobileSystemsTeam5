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
  },
});



export default function LargeButton({title, color}) {
  const onPress = () => {
    // TODO: Do navigation
  }

  var textColor = colors.SNOW;
  if(color == colors.SNOW) {
    textColor = colors.BLACK;
  }

  return (
    <View>
      <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color }]}>
        <Text style={{ color: textColor }}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};