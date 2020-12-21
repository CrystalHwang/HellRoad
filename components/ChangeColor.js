import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';

import { COLOR } from '../constants';

const ChangeColor = () => {
  const fadeAnimation = useRef(new Animated.Value(0.3)).current;

  const loop = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnimation, {
          toValue: 0.6,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 0.3,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1,
      }).start();
  };


  useEffect(() => {
    loop();
  }, []);

  return <Animated.View style={[styles.container, { opacity: fadeAnimation }]} />;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: COLOR.DARK_RED,
  }
});

export default ChangeColor;
