import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Text, Dimensions, Alert, Button, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import MapView, { Marker, MarkerAnimated, Polyline } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Input } from 'react-native-elements';

import { COLOR, MESSAGE, BACKGROUND_LOCATION_TASK } from '../constants';
import { GOOGLE_API_KEY } from '@env';


const { width, height } = Dimensions.get('window');

const SearchBar = () => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');

  return (
    <GooglePlacesAutocomplete
      placeholder='출발지'
      minLength={2}
      debounce={150}
      enablePoweredByContainer={true}
      currentLocation={true}
      currentLocationLabel='현재 위치'
      textInputProps={{
        InputComp: TextInput,
        onChangeText: text => setDeparture(text),
        errorStyle: { color: 'red' },
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      GooglePlacesSearchQuery={{
        rankby: 'distance',
      }}
      query={{
        key: GOOGLE_API_KEY,
        language: 'ko',
      }}
      styles={{
        container: {
          width: '100%',
          height: '100%',
        },
        textInputContainer: {
        },
        textInput: {
          width: '100%',
        },
        listView: {
          zIndex: 20,
          backgroundColor: 'red',
        },
        row: {
          zIndex: 4,
          backgroundColor: 'green',
        },
        seperator: {
          color: 'purple',
        }
      }}
    />
  );
};

export default SearchBar;
