import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, useWindowDimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  // const { width, height, scale } = useWindowDimensions();
  // console.log("WINDOW", width, height, scale);

  return (
    <View style={styles.container}>
      <View style={styles.covidNoticeBoard}>
        <Text> 알림판!!! </Text>
      </View>
      <View>
        <Text> Home Screen Map </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  covidNoticeBoard: {
    width: width * 0.7,
    height: height * 0.05,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'skyblue'
  },
});

export default HomeScreen;
