import React from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import CrimeZoneScreen from '../screen/CrimeZoneScreen';
import MenuIcon from '../components/MenuIcon';

import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const CrimeZoneStack = createStackNavigator();

CrimeZoneStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const CrimeZoneStackNavigator = ({ navigation }) => {
  return (
    <CrimeZoneStack.Navigator
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
      <CrimeZoneStack.Screen
        name="Crime Zome"
        component={CrimeZoneScreen}
        options={{
          headerTintColor: COLOR.WHITE,
        }}
      />
    </CrimeZoneStack.Navigator>
  );
};

export default CrimeZoneStackNavigator;
