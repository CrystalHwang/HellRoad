import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const CovidZoneStack = createStackNavigator();

const CovidZoneStackNavigator = () => {

  return (
    <CovidZoneStack.Navigator>
      <Text>CovidZone</Text>
    </CovidZoneStack.Navigator>
  );
};

export default CovidZoneStackNavigator;
