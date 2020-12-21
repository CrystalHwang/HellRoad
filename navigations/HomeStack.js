import React from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screen/HomeScreen';
import SearchScreen from '../screen/SearchScreen';

import MenuIcon from '../components/MenuIcon';

import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const HomeStack = createStackNavigator();

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const HomeStackNavigator = ({ navigation }) => {

  return (
    <HomeStack.Navigator
      navigationOptions={{ tabBarVisible: false }}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLOR.DARK_GREY,
          height: height * 0.1,
        },
        headerTintColor: COLOR.WHITE,
        headerLeft: () => <MenuIcon navigation={navigation} />,
      }}>
      <HomeStack.Screen
        name="HELL路"
        component={HomeScreen}
        options={{
          headerTintColor: COLOR.WHITE,
        }} />
      <HomeStack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerTintColor: COLOR.WHITE,
        }} />
    </HomeStack.Navigator >
  );
};

export default HomeStackNavigator;
