import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import AboutScreen from '../screen/AboutScreen';
import MenuIcon from '../components/MenuIcon';

import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const AboutStack = createStackNavigator();

AboutStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const AboutStackNavigator = ({ navigation }) => {

  return (
    <AboutStack.Navigator
      navigationOptions={{
        tabBarVisible: false
      }}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLOR.DARK_GREY,
          height: height * 0.1,
        },
        headerTintColor: COLOR.WHITE,
        headerLeft: () => <MenuIcon navigation={navigation} />,
      }}>
      <AboutStack.Screen
        name="Crystal Hwang"
        component={AboutScreen}
        options={{
          headerTintColor: COLOR.WHITE
        }} />
    </AboutStack.Navigator>
  );
};

export default AboutStackNavigator;
