import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Button, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import CovidNoticeBoard from '../components/CovidNoticeBoard';
import Map from '../components/Map';

import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [isShow, setIsShow] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsShow(true);

      return () => {
        setIsShow(false);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <CovidNoticeBoard />
      {
        isShow
          ?
          <View style={styles.mapContainer}>
            <Map searchMode={false} />
            <Button
              title='안전 경로 찾기'
              color={COLOR.DARK_BLUE}
              onPress={() => navigation.navigate('Search')}>
            </Button>
          </View>
          : null
      }
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT_GREY,
  },
  mapContainer: {
    width: width * 0.8,
    height: height * 0.6
  }
});

export default HomeScreen;
