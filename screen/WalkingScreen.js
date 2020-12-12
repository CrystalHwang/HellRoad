import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, useWindowDimensions, Alert, Button } from 'react-native';

import DangerCircle from '../components/DangerCircle';
import { COLOR, USER_LOCATION, DESTINATION } from '../constants';

const { width, height } = Dimensions.get('window');

const WalkingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <DangerCircle />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLOR.MAIN,
  },
});

export default WalkingScreen;
