import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Button, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';

import CovidNoticeBoard from '../components/CovidNoticeBoard';
import Map from '../components/Map';

import * as actions from '../actions';
import { COLOR, MAP_MODE } from '../constants';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const isLoadingCovidStatus = useSelector(state => state.loadingReducer.covidStatus);
  const mapMode = useSelector(state => state.mapModeReducer);

  const [isShow, setIsShow] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoadingCovidStatus) return;

    setIsLoading(false);
  }, [isLoadingCovidStatus]);

  useFocusEffect(
    useCallback(() => {
      setIsShow(true);
      dispatch(actions.updateMapMode(MAP_MODE.HOME));

      return () => {
        setIsShow(false);
      };
    }, [])
  );

  const handlePressSafeRouteSearchButton = () => {
    dispatch(actions.updateMapMode(MAP_MODE.SEARCH));
    navigation.navigate('Search');
  };

  return (
    <View style={styles.container}>
      <CovidNoticeBoard />
      {
        !isLoading && isShow
          ? <View style={styles.mapContainer}>
            <Map mode={mapMode} />
            <Button
              title='안전 경로 찾기'
              color={COLOR.DARK_BLUE}
              onPress={handlePressSafeRouteSearchButton}>
            </Button>
          </View>
          : <View>
            <Spinner
              visible={isLoading}
              textContent={'위치 정보를 가져오고 있어요 :)'} />
          </View>
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
