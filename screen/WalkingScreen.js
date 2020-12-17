import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, useWindowDimensions, Alert, Button } from 'react-native';

import DangerCircle from '../components/DangerCircle';
import Map from '../components/MenuIcon';
import { COLOR, USER_LOCATION, DESTINATION, MAP_MODE } from '../constants';

const { width, height } = Dimensions.get('window');

const WalkingScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Map
        mode={MAP_MODE.WALKING}


      ></Map>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',

  },
});

export default WalkingScreen;
