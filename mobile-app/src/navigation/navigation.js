import { NavigationContainer } from '@react-navigation/native'
import Controller from '../containers/Controller/Controller';
import React, { useMemo } from 'react';
import Map from '../containers/Map/Map';
import Loading from '../containers/Loading/Loading';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from '../containers/Settings/Settings';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const noop = useMemo(() => ({ header: () => null }), []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Controller"
          component={Controller}
          options={noop}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={noop}
        />
        <Stack.Screen
          name="Loading"
          component={Loading}
          options={noop}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={noop}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};