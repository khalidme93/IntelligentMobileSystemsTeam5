import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons'
import colors from '../../constants/colors';

export default function SettingsButton({color, size, onPress = () => null}) {

  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Ionicons name='settings' size={size} color={color}></Ionicons>
      </TouchableOpacity>
    </View>
  );
};