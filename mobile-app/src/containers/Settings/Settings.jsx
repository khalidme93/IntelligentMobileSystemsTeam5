import React, { useState, createContext, useContext } from 'react';
import { View, StyleSheet, TextInput, Text, Dimensions, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors'
import Layout from '../../components/Layout/Layout';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../hooks/useAppContext';

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
    alignItems: 'center',
  },
  largeButtonContainer: {
    width: Dimensions.get('window').width,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  content: {
    marginTop: Dimensions.get('window').height * 0.18

  },
  headerText: {
    fontFamily: 'playfairDisplay-bold',
    color: colors.SNOW,
    fontSize: 32,
    textAlignVertical: 'center',
    marginBottom: 5,
  },
  text: {
    fontFamily: 'montserrat-bold',
    color: 'black',
    fontSize: 20,
    textAlignVertical: 'center',
    marginBottom: 5,
    marginTop: 20,
  },
  textInput: {
    fontFamily: 'montserrat-regular',
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.07,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
  },

});

export default function Settings({ navigation }) {
  // TODO: Add default IP as standard here
  const { ip, setIp, port, setPort } = useAppContext();

  return (
    <Layout>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.headerContainer}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={Dimensions.get('window').width * 0.09} color={colors.SNOW}/>
          <Text style={styles.headerText}>Settings</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.text}>Robot-IP:</Text>
          <TextInput style={styles.textInput} value={ip} onChangeText={setIp}/>
          <Text style={styles.text}>Backend-Port:</Text>
          <TextInput style={styles.textInput} value={port} onChangeText={setPort}/>
        </View>
      </View>
    </Layout>
  );
};