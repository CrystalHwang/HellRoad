import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, useWindowDimensions, Alert, Button } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';

import covidMockData from '../covidMockData.json';
import { USER_LOCATION } from '../constants';

const { width, height } = Dimensions.get('window');

const DangerCircle = () => {
  return (
    <View>
      <MapView
        style={styles.map}
        maxZoomLevel={20}
        initialRegion={{
          latitude: USER_LOCATION.LATITUDE,
          longitude: USER_LOCATION.LONGITUDE,
          latitudeDelta: 0,
          longitudeDelta: 0.009
        }}
      >
        {covidMockData.map((data, index) => {
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
        })}
      </MapView>
    </View>
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
