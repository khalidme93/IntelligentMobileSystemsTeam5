import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import colors from '../../constants/colors';
import {Ionicons} from '@expo/vector-icons'

//Styles for the automodebutton
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

const AutoModeButton = ({ automatic, onPress = () => null}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <TouchableOpacity disabled={true} style={[styles.innerCircle, automatic ? { backgroundColor: colors.RED } : { backgroundColor: colors.PRIMARY}]}>
                  {automatic ?
                    <Ionicons name="stop" color={colors.SNOW} size={50} style={{ marginLeft: 3 }}/>
                  :
                    <Ionicons name="power" color={colors.SNOW} size={50} style={{ marginLeft: 3 }}/>
                  }
                </TouchableOpacity>
            </TouchableOpacity>
          {automatic ?
            <Text style={styles.text}>Autonomous Mode: ON</Text>
            :
            <Text style={styles.text}>Autonomous Mode: OFF</Text>
          }
        </View>
    );
}

export default AutoModeButton;