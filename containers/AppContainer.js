import 'react-native-gesture-handler';
//import { StatusBar } from 'expo-status-bar';

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Dimensions, StatusBar, AppState } from 'react-native';
import { createDrawerNavigator, DrawerActions } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import { AppLoading } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import HomeStack from '../navigations/HomeStack';
import CovidZoneStack from '../navigations/CovidZoneStack';
import CrimeZoneStack from '../navigations/CrimeZoneStack';
import AboutStack from '../navigations/AboutStack';

import SideBarMenu from '../components/SideBarMenu';

import { GRANTED, MESSAGE, BACKGROUND_LOCATION_TASK, COLOR } from '../constants';
import * as actions from '../actions';

const { width, height } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

const getPermission = async () => {
  const { status } = await Permissions.askAsync(
    Permissions.LOCATION
  );

  if (status !== GRANTED) {
    return alert(MESSAGE.PERMISSION_DENIED);
  }
};

const AppContainer = () => {
  const [isLoading, setIsLoading] = useState(true);

  const currentLocation = useSelector(state => state.locationReducer);
  const dispatch = useDispatch();

  TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
    if (error) {
      return alert(error.message);
    }

    const { latitude, longitude } = data.locations[0].coords;
    console.log("Appstate", AppState.currentState);
    console.log("LOCATION?!!", latitude, longitude);
    dispatch(actions.updateLocation({ 'latitude': latitude, 'longitude': longitude }));
  });

  useEffect(() => {
    StatusBar.setHidden(true);

    (async () => {
      const traceLocation = await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 100,
        distanceInterval: 0.1,
        howsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'Hell路 에서',
          notificationBody: '당신의 걸음을 기록하고 있어요 🏃🏻🚶🏻‍🏃',
          notificationColor: COLOR.MAIN_RED
        }
      });
    })();

    return async () => await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }, []);


  if (isLoading) {
    return (
      <AppLoading
        startAsync={getPermission}
        onFinish={() => setIsLoading(false)}
      />
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerStyle={styles.navigator}
        drawerContent={SideBarMenu} >
        <Drawer.Screen name="Home" component={HomeStack} />
        <Drawer.Screen name="COVID-19 Zone" component={CovidZoneStack} />
        <Drawer.Screen name="Crime Zone" component={CrimeZoneStack} />
        <Drawer.Screen name="About" component={AboutStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  navigator: {
    width: width * 0.8
  }
});

export default AppContainer;
