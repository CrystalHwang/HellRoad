import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { createDrawerNavigator, DrawerActions } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import HomeStack from './navigations/HomeStack';
import CovidZoneStack from './navigations/CovidZoneStack';
import CrimeZoneStack from './navigations/CrimeZoneStack';
import AboutStack from './navigations/AboutStack';

const Drawer = createDrawerNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
      // drawerContent={(props) => <DrawerContainer {...props} />}
      >
        <Drawer.Screen
          name="Home"
          component={HomeStack} />
        <Drawer.Screen name="COVID-19 Zone" component={CovidZoneStack} />
        <Drawer.Screen name="Crime Zone" component={CrimeZoneStack} />
        <Drawer.Screen name="About" component={AboutStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  homeStackNavigator: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;
