import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

const styles = StyleSheet.create({
  container: {

  }
});

export default function Controller({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Controller</Text>
      <Text>Controller</Text>
      <Text>Controller</Text>
      <Button title={'dede'} onPress={() => navigation.navigate('Map')}></Button>
    </View>
  );
};