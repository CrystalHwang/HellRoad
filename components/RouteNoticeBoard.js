import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const RouteNoticeBoard = ({ handleClickNavigationCancelButton, navigationDuration, navigationDistance }) => {

  return (
    <View style={styles.navigationStautsBar}>
      <Button
        title='안내 취소'
        onPress={handleClickNavigationCancelButton}></Button>
      <View style={styles.navigationStatus}>
        <View style={styles.duration}>
          <Text style={styles.text}>예상 소요시간 약 {navigationDuration}분</Text>
        </View>
        <View style={styles.distance} >
          <Text style={styles.text}>예상 거리 {navigationDistance / 1000} km</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationStautsBar: {
    width: '100%',
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT_GREY,
  },
  navigationCancelButton: {
    width: '50%'
  },
  navigationStatus: {
    width: '70%',
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: COLOR.MAIN_RED,
    borderRadius: 30
  },
  duration: {
    width: '40%',
    height: '90%',
    // borderWidth: 1,
    // borderColor: 'red',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  distance: {
    width: '40%',
    height: '90%',
    // borderWidth: 1,
    // borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  text: {
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    color: COLOR.WHITE,
  }
});

export default RouteNoticeBoard;
