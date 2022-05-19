import React from 'react';
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function SettingsButton({color, size, onPress = () => null}) {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Ionicons name='settings' size={size} color={color}></Ionicons>
      </TouchableOpacity>
    </View>
  );
};