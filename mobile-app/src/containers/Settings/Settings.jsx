import React from 'react';
import { View, StyleSheet, TextInput, Text, Dimensions, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors'
import Layout from '../../components/Layout/Layout';
import {Ionicons} from '@expo/vector-icons'

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        height: Dimensions.get('window').height * 0.93,
        // justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerContainer: {
        width: Dimensions.get('window').width,
        paddingHorizontal: Dimensions.get('window').width * 0.07,
        flexDirection: 'row',
        alignItems: "center",
    },
    largeButtonContainer: {
        width: Dimensions.get('window').width,
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    text: {
        fontFamily: "playfairDisplay-bold",
        color: colors.SNOW,
        fontSize: 32,
        textAlignVertical: "center",
        marginBottom: 5,
    },
});

export default function Settings({navigation}) {
  return (
    <Layout>
        <View style={styles.container}>
            <TouchableOpacity style={styles.headerContainer} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={Dimensions.get('window').width * 0.09} color={colors.SNOW}></Ionicons>
                <Text style={styles.text}>Settings</Text>
            </TouchableOpacity>

            <View>
                <Text>Backend-IP:</Text>
                <TextInput></TextInput>
            </View>
        </View>
    </Layout>
  );
};