import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Dimensions, } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';

import covidMockData from '../covidMockData.json';
import { USER_LOCATION } from '../constants';

const { width, height } = Dimensions.get('window');

const DangerCircle = () => {
  return (
    covidMockData.map((data, index) => {
      const splitString = data.latlng.split(',');
      const latlng = splitString.map((string) => {
        string = string.trim();
        return Number(string);
      });

      return (
        <Circle
          key={index}
          center={{
            latitude: latlng[0],
            longitude: latlng[1]
          }}
          fillColor={'rgba(194,24,7,0.5)'}
          radius={100}
          strokeWidth={3}
          strokeColor={'rgb(194,24,7)'}
        />
      );
    })
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: width,
    height: height,
  },
});

export default DangerCircle;
