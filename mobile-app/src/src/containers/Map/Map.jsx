import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

const styles = StyleSheet.create({
  container: {

  }
});

export default function Map() {
  return (
    <View style={styles.container}>
      <Text>Map</Text>
      <Text>Map</Text>
      <Text>Map</Text>
      <Button title={'dede'} onPress={() => navigation.navigate('Controller')}></Button>
    </View>
  );
};