import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import { icons } from '../../constants';

const HeaderLogo = () => {
  return <Image source={icons.LOGO_4U_White} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: { height: 40, resizeMode: 'contain', width: 40 },
});

export default HeaderLogo;
