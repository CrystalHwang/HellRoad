import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screen/HomeScreen';
import SearchScreen from '../screen/SearchScreen';
import WalkingScreen from '../screen/WalkingScreen';

import MenuIcon from '../components/MenuIcon';
import { COLOR } from '../constants';

const HomeStack = createStackNavigator();

const HomeStackNavigator = ({ navigation }) => {

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'pink' },
        headerLeft: () => <MenuIcon navigation={navigation} />
      }}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: COLOR.MAIN },
        }}
      />
      <HomeStack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: COLOR.MAIN }
        }}
      />
      <HomeStack.Screen
        name="Walking"
        component={WalkingScreen}
        options={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: COLOR.MAIN }
        }}
      />
    </HomeStack.Navigator >
  );
};

const styles = StyleSheet.create({

});

export default HomeStackNavigator;
