import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';

import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const CrimeZoneScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, marginBottom: 30 }}> 이 페이지는 준비 중입니다 :)</Text>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT_GREY,
  },
  text: {
    width: '90%',
    fontSize: 35,
    textAlign: 'center'
  }
});

export default CrimeZoneScreen;
