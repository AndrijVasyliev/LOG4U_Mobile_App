import * as React from 'react';
import { StyleSheet, View } from 'react-native';

const Spacer = () => {
  return <View style={styles.spacer}></View>;
};

const styles = StyleSheet.create({
  spacer: {
    height: 10,
  },
});

export default Spacer;
