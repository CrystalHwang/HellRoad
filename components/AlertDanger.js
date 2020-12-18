import React, { useEffect } from 'react';
import { Vibration } from 'react-native';
import { Audio } from 'expo-av';

const AlertDanger = () => {
  const sound = new Audio.Sound();

  useEffect(() => {
    (async () => {
      await sound.loadAsync(require('../assets/AlertDanger.mp3'));
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
      Vibration.vibrate([100, 100, 100, 100, 100, 1000], true);
    })();

    return () => {
      Vibration.cancel();
      (async () => {
        await sound.unloadAsync();
      })();
    };
  }, []);

  return (
    <></>
  );
};

export default AlertDanger;
