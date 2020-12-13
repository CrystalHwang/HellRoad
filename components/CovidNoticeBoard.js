import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import getCovidStatusData from '../utils/scraper';
import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const CovidNoticeBoard = () => {
  const [covidStatusData, setCovidStatusData] = useState([]);
  const [viewSize, setViewSize] = useState({});
  const move = useRef(new Animated.ValueXY({ x: 0, y: height * 0.1 * 4 / 2 - height * 0.1 / 2 })).current;

  const moveY = () => {
    Animated.loop(
      Animated.timing(move, {
        toValue: { x: 0, y: -viewSize.height - height * 0.1 / 2 },
        duration: 8000,
        useNativeDriver: false,
      }), {
      iterations: -1
    }).start();
  };

  useEffect(() => {
    (async () => {
      const data = await getCovidStatusData();
      setCovidStatusData(data);
    })();
  }, []);

  return (
    <View
      style={styles.covidNoticeBoardContainer}
      onLayout={(event) => {
        setViewSize({ ...event.nativeEvent.layout });
      }}>
      {covidStatusData.map((data, index) => {
        return (
          <Animated.View
            key={index}
            style={{
              width: '100%',
              height: height * 0.1,
              borderColor: 'red',
              borderWidth: 1,
              transform: [{ translateX: move.x, }, { translateY: move.y }]
            }}>
            <View style={styles.viewContainer}>
              <Text style={styles.title} onPress={moveY}>{data.title}</Text>
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
    flex: 2,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: COLOR.WHITE
  },
  variationContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    color: COLOR.WHITE
  },
  icon: {
    fontSize: 20,
    textAlign: 'center',
    color: COLOR.WHITE,
  },
  variation: {
    color: COLOR.WHITE
  }
});

export default CovidNoticeBoard;
