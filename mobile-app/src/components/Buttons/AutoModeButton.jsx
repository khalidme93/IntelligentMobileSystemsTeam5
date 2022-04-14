import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Button } from 'react-native';
import colors from '../../constants/colors';
import {Ionicons} from '@expo/vector-icons'

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width * 0.33,
        height: Dimensions.get('window').width * 0.34,
        alignItems: 'center',
      zIndex: -1,
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
    innerCircle: {
        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
        width: Dimensions.get('window').width * 0.16,
        height: Dimensions.get('window').width * 0.16,
        backgroundColor: colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
      margin: 5,
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'montserrat-semiBold',
    }
  });

const AutoModeButton = ({}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <TouchableOpacity disabled={true} style={styles.innerCircle}>
                    <Ionicons name="power" color={colors.SNOW} size={50} style={{marginLeft: 3}}></Ionicons>
                </TouchableOpacity>
            </TouchableOpacity>
            <Text style={styles.text}>Autonomous Mode</Text>
        </View>
    );
}

export default AutoModeButton;