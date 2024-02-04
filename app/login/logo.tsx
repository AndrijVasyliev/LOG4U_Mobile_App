import * as React from 'react';
import { Image, View } from 'react-native';
import { icons } from '../../constants';

const Logo = () => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Image
        source={icons.LOGO_4U_Red}
        style={{
          alignSelf: 'center',
          resizeMode: 'contain',
          height: 200,
        }}
      />
    </View>
  );
};

export default Logo;
