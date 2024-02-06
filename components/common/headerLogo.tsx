import * as React from 'react';
import { icons } from '../../constants';
import { Image } from 'react-native';

const HeaderLogo = () => {
  return (
    <Image
      source={icons.LOGO_4U_White}
      style={{ resizeMode: 'contain', height: 40, width: 40 }}
    />
  );
};

export default HeaderLogo;
