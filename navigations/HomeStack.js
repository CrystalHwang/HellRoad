import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';

const HomeStack = createStackNavigator();

const HomeStackNavigator = () => {

  return (
    <HomeStack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: 'pink' } }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen} />
    </HomeStack.Navigator >
  );
};

const styles = StyleSheet.create({

});

export default HomeStackNavigator;
