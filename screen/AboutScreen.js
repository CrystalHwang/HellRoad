import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';

import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const AboutScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, marginBottom: 30 }}>안녕하세요, 저는 바닐라코딩 8기 수료를 앞둔 황수정이라고 합니다.</Text>
      <Text style={{ ...styles.text, marginBottom: 30 }}>코로나 바이러스로 인해, '안녕'하다는 말이 당연하지 않게 되었습니다.</Text>
      <Text style={{ ...styles.text, marginBottom: 30, color: COLOR.MAIN_RED }}> HELL路는, 안녕이라는 뜻의 Hello와의 동음이의적 언어유희를 이용하여 만들어진 이름입니다. </Text>
      <Text style={{ ...styles.text, marginBottom: 30 }}>제가 안내해드리는 길을 따라 HELL路는 피하고 안녕(安寧)한 일상 되시길 바랍니다. 감사합니다.</Text>
      <Text> crystal.hwang007@gmail.com </Text>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT_GREY,
  },
  text: {
    width: '90%',
    fontSize: 18
  }
});

export default AboutScreen;
