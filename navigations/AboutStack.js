import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const AboutStack = createStackNavigator();

const AboutStackNavigator = () => {

  return (
    <AboutStack.Navigator>
      <Text>About</Text>
    </AboutStack.Navigator>
  );
};

export default AboutStackNavigator;
