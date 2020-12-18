import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import * as actions from '../actions';
import getCovidStatusData from '../utils/scraper';
import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const CovidNoticeBoard = () => {
  const isLoadingCovidStatus = useSelector(state => state.loadingReducer.covidStatus);
  const covidStatusData = useSelector(state => state.covidDataReducer);
  const dispatch = useDispatch();

  const [viewSize, setViewSize] = useState({});
  const [isDone, setIsDone] = useState(false);

  const move = useRef(new Animated.ValueXY({ x: 0, y: height * 0.15 })).current;

  const moveY = () => {
    Animated.loop(
      Animated.timing(move, {
        toValue: { x: 0, y: - height * 0.15 },
        duration: 8000,
        useNativeDriver: false,
      }), {
      iterations: -1
    }).start();
  };

  useEffect(() => {
    if (!isLoadingCovidStatus) return;
    if (covidStatusData.length) return;

    (async () => {
      const data = await getCovidStatusData();

      dispatch(actions.updateCovidStatusData(data));
      dispatch(actions.updateIsLoadingCovidStatus(false));

    })();
  }, [isLoadingCovidStatus, covidStatusData]);

  useEffect(() => {
    if (isLoadingCovidStatus) return;
    if (!covidStatusData) return;


    moveY();
  }, [isLoadingCovidStatus, covidStatusData]);

  return (
    <View
      style={styles.covidNoticeBoardContainer}
      onLayout={(event) => setViewSize({ ...event.nativeEvent.layout })}>
      {covidStatusData?.map((data, index) => {
        return (
          <Animated.View
            key={index}
            style={{
              width: '100%',
              height: height * 0.1,
              transform: [{ translateX: move.x, }, { translateY: move.y }]
            }}>
            <View style={styles.viewContainer}>
              <Text style={styles.title}>{data.title}</Text>
              <Text style={styles.total}>{data.total}</Text>
              <View style={styles.variationContainer}>
                <Icon style={styles.icon} name='caret-up' />
                <Text style={styles.variation}>{data.variation}</Text>
              </View>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  covidNoticeBoardContainer: {
    width: width * 0.8,
    height: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.DARK_BLUE,
    overflow: 'hidden',
    elevation: 10,
    borderRadius: 15,
  },
  viewContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: COLOR.WHITE,
  },
  total: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: COLOR.WHITE,
  },
  variationContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: COLOR.WHITE,
  },
  icon: {
    fontSize: 20,
    textAlign: 'center',
    color: COLOR.WHITE,
    marginRight: 10,
  },
  variation: {
    fontSize: 20,
    color: COLOR.WHITE,
  }
});

export default CovidNoticeBoard;
