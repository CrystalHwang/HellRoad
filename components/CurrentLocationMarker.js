import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import { Marker, Circle } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { COLOR } from '../constants';

const CurrentLocationMarker = () => {
  const currentLocation = useSelector(state => state.locationReducer);

  return (
    <>
      <Circle
        key='1'
        center={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        }}
        fillColor={COLOR.CLEAR_BLUE}
        radius={150}
        strokeWidth={1}
        strokeColor={COLOR.LIGHT_GREY} />
      <Marker
        coordinate={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        }}>
        <Icon
          name="street-view"
          style={styles.locationIcon} />
      </Marker>
    </>
  );
};

const styles = StyleSheet.create({
  locationIcon: {
    fontSize: 35,
    color: COLOR.MAIN_BLUE,
  }
});

export default CurrentLocationMarker;

