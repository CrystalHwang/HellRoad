import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const CrimeZoneStack = createStackNavigator();

const CrimeZoneStackNavigator = () => {

  return (
    <CrimeZoneStack.Navigator>
      <Text>CrimeZone</Text>
    </CrimeZoneStack.Navigator>
  );
};

export default CrimeZoneStackNavigator;
