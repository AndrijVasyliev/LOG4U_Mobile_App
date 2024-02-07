import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { icons } from '../../constants';

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image source={icons.LOGO_4U_Red} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    alignSelf: 'center',
    height: 200,
    resizeMode: 'contain',
  },
});

export default Logo;
