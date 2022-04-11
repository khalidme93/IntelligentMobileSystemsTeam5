import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RoundButton from './src/src/components/Buttons/RoundButton';
import Icons from './src/src/constants/icons'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <RoundButton title={Icons.FORWARD.title} icon={Icons.FORWARD.icon}/>
      <RoundButton title={Icons.RIGHT.title} icon={Icons.RIGHT.icon}/>
      <RoundButton title={Icons.BACKWARD.title} icon={Icons.BACKWARD.icon}/>
      <RoundButton title={Icons.LEFT.title} icon={Icons.LEFT.icon}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});